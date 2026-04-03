import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { lessonService } from '../api/lessonService';
import { useAuth } from '../context/AuthContext';
import { EducationalModule } from '../models/types';

export const LessonList = ({ onSelectLesson }: { onSelectLesson: (id: string) => void }) => {
  const { birthYear } = useAuth();
  const [lessons, setLessons] = useState<EducationalModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      // Calculate age tier to request
      const currentYear = new Date().getFullYear();
      const age = birthYear ? currentYear - birthYear : 0;
      let targetTier = '0-7';
      if (age > 7 && age <= 12) targetTier = '8-12';
      else if (age > 12) targetTier = '13-18';

      const result = await lessonService.getLessons(targetTier);
      if (result.success && result.data) {
        setLessons(result.data);
      } else {
        setError(result.error || 'Failed to load content');
      }
      setLoading(false);
    };

    fetchLessons();
  }, [birthYear]);

  if (loading) return <ActivityIndicator size="large" color="#D4AF37" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container} testID="lesson-list-container">
      {lessons.length === 0 ? (
        <Text style={styles.emptyText}>No lessons available right now.</Text>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item.id!}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => onSelectLesson(item.id!)}
              testID={`lesson-item-${index}`}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSnippet} numberOfLines={2}>{item.textContent}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#D4AF37',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  cardSnippet: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
  },
  emptyText: {
    color: '#95A5A6',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});
