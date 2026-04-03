import React, { useState, useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { storage } from '../services/firebaseConfig';

export const FirebaseImage = ({ imageRef }: { imageRef: string }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    if (imageRef) {
      storage().ref(imageRef).getDownloadURL()
        .then((downloadUrl) => {
          if (active) {
            setUrl(downloadUrl);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { active = false; };
  }, [imageRef]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator color="#D4AF37" />
      </View>
    );
  }

  if (!url) return null;

  return (
    <Image 
      source={{ uri: url }} 
      style={styles.container} 
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 15,
  },
  loadingContainer: {
    backgroundColor: '#F7F6F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAECEE',
  }
});
