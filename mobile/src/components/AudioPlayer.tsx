import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { storage } from '../services/firebaseConfig';

export const AudioPlayer = ({ audioRef, title }: { audioRef: string; title: string }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return sound
      ? () => { sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const togglePlayback = async () => {
    if (loading) return;
    
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        setLoading(true);
        
        // Resolve Firebase Cloud Storage Reference to a secure download URL
        const url = await storage().ref(audioRef).getDownloadURL();

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: url },
          { shouldPlay: true }
        );
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            newSound.setPositionAsync(0);
          }
        });
        setSound(newSound);
        setIsPlaying(true);
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      setError('Unable to stream audio');
    }
  };

  return (
    <View style={styles.container} testID="audio-player-container">
      <Text style={styles.title}>Listen to the Story</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={togglePlayback}
          testID="btn-play-pause"
        >
          {loading ? (
             <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.urlText} numberOfLines={1}>{title} Narration</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#ECECEC'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 15,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  urlText: {
    flex: 1,
    color: '#7F8C8D',
    fontSize: 14,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginBottom: 5,
  }
});
