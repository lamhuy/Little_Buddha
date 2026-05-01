import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, Href } from 'expo-router';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: '#FDFBF7' }]}>
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/little_buddha_hero.png')} 
            style={styles.heroImage} 
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Welcome to <Text style={styles.titleAccent}>Little Buddha</Text>
          </Text>

          <Text style={styles.subtitle}>
            Discover age-appropriate Buddhist stories, teachings, and wisdom through
            beautifully crafted lessons for young minds.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/select-age')}
          activeOpacity={0.8}
        >
          <View style={[styles.buttonGradient, { backgroundColor: '#D4AF37' }]}>
            <Text style={styles.buttonText}>Get Started →</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: width * 0.8,
    height: width * 0.8,
    maxHeight: 400,
    marginBottom: 40,
    borderRadius: 200,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 4,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  titleAccent: {
    color: '#D4AF37',
  },
  subtitle: {
    fontSize: 16,
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    borderRadius: 16,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
