import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLessonsForAgeTier } from '../../src/services/lessonService';
import type { EducationalModule } from '../../src/models/types';

const tierLabels: Record<string, string> = {
  '0-7': 'Little Explorers (Ages 0–7)',
  '8-12': 'Young Learners (Ages 8–12)',
  '13-18': 'Wise Seekers (Ages 13+)',
};

export default function LessonsScreen() {
  const { tier } = useLocalSearchParams<{ tier: string }>();
  const router = useRouter();
  const [lessons, setLessons] = useState<EducationalModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (tier && ['0-7', '8-12', '13-18'].includes(tier)) {
        try {
          const fetched = await getLessonsForAgeTier(tier as '0-7' | '8-12' | '13-18');
          setLessons(fetched);
        } catch (error) {
          console.error("Error fetching lessons:", error);
        }
      }
      setLoading(false);
    };
    fetchLessons();
  }, [tier]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/select-age' as any)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          <Text style={styles.backText}>Back to Age Groups</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{tierLabels[tier || ''] || 'Lessons'}</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#D4AF37" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.grid}>
            {lessons.map((lesson) => (
              <TouchableOpacity 
                key={lesson.id} 
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => router.push(`/lesson/${lesson.id}` as any)}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{lesson.title}</Text>
                  {lesson.pages && lesson.pages.length > 0 && (
                    <Text style={styles.cardDesc} numberOfLines={2}>
                      {lesson.pages[0].text}
                    </Text>
                  )}
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardAction}>Start Lesson</Text>
                    <Ionicons name="arrow-forward" size={16} color="#D4AF37" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {lessons.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No lessons found for this age group yet. Check back soon!</Text>
              </View>
            )}
          </View>
        )}
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
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: '#7F8C8D',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D4AF37',
    marginRight: 4,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
});
