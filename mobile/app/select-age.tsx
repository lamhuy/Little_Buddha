import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface AgeGroup {
  tier: string;
  label: string;
  ageRange: string;
  emoji: string;
  description: string;
  color: string;
  gradient: [string, string];
}

const ageGroups: AgeGroup[] = [
  {
    tier: '0-7',
    label: 'Little Explorers',
    ageRange: 'Ages 0–7',
    emoji: '🌱',
    description:
      'Simple moral stories and gentle tales that introduce kindness, compassion, and the wonders of nature through the eyes of young adventurers.',
    color: '#4ade80',
    gradient: ['#d5f5e3', '#a3e4d7'],
  },
  {
    tier: '8-12',
    label: 'Young Learners',
    ageRange: 'Ages 8–12',
    emoji: '📖',
    description:
      'Engaging stories about Buddhist history, basic principles, and the life of the Buddha — building understanding and curiosity.',
    color: '#60a5fa',
    gradient: ['#d6eaf8', '#aed6f1'],
  },
  {
    tier: '13-18',
    label: 'Wise Seekers',
    ageRange: 'Ages 13+',
    emoji: '🧘',
    description:
      'Core teachings like the Four Noble Truths and the Eightfold Path — exploring deeper philosophy and mindful living.',
    color: '#a78bfa',
    gradient: ['#e8daef', '#d2b4de'],
  },
];

export default function AgeGroupScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Select Your Age Group</Text>
          <Text style={styles.subtitle}>
            Choose an age group to discover lessons crafted just for you.
          </Text>
        </View>

        <View style={styles.grid}>
          {ageGroups.map((group) => (
            <TouchableOpacity 
              key={group.tier} 
              activeOpacity={0.9}
              onPress={() => router.push(`/lessons/${group.tier}` as Href)}
            >
              <View style={[styles.card, { backgroundColor: group.gradient[0] }]}>
                <View style={[styles.emojiContainer, { backgroundColor: group.color + '40' }]}>
                  <Text style={styles.emoji}>{group.emoji}</Text>
                </View>
                
                <Text style={styles.cardLabel}>{group.label}</Text>
                <Text style={styles.cardRange}>{group.ageRange}</Text>
                <Text style={styles.cardDesc}>{group.description}</Text>
                
                <View style={styles.ctaContainer}>
                  <Text style={[styles.ctaText, { color: group.color.replace('40', '') }]}>
                    Explore Lessons
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={group.color} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  titleContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  grid: {
    gap: 20,
  },
  card: {
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 30,
  },
  cardLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardRange: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(44, 62, 80, 0.6)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 15,
    color: '#34495E',
    lineHeight: 22,
    marginBottom: 20,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
});
