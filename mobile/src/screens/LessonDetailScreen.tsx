import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { EducationalModule } from '../models/types';
import { AudioPlayer } from '../components/AudioPlayer';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const LessonDetailScreen = ({ route }: any) => {
  const { id } = route.params;
  const { jwt } = useAuth();
  const [lesson, setLesson] = useState<EducationalModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/lessons/${id}`, {
          headers: { 'Authorization': `Bearer ${jwt}` }
        });
        const json = await response.json();
        if (response.ok) {
          setLesson(json.data);
        } else {
          setError(json.error || 'Failed to open lesson');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchLessonDetail();
  }, [id, jwt]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D4AF37" /></View>;
  if (error || !lesson) return <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>;

  return (
    <ScrollView style={styles.container} testID="lesson-scroll-view">
      <View style={styles.contentContainer} testID="lesson-detail-screen">
        <Text style={styles.title} testID="lesson-title">{lesson.title}</Text>
        
        {lesson.audioRef && (
          <AudioPlayer audioRef={lesson.audioRef} title={lesson.title} />
        )}

        <View style={styles.section}>
          <Text style={styles.bodyText} testID="lesson-content">{lesson.textContent}</Text>
        </View>

        {lesson.summaryPoints && lesson.summaryPoints.length > 0 && (
          <View style={styles.section} testID="lesson-summary">
            <Text style={styles.sectionHeader}>Key Takeaways</Text>
            {lesson.summaryPoints.map((point, index) => (
              <Text key={index} style={styles.bulletPoint}>• {point}</Text>
            ))}
          </View>
        )}

        {lesson.discussionQuestions && lesson.discussionQuestions.length > 0 && (
          <View style={styles.section} testID="lesson-questions">
            <Text style={styles.sectionHeader}>Discussion Questions</Text>
            {lesson.discussionQuestions.map((q, index) => (
              <Text key={index} style={styles.questionText}>{index + 1}. {q}</Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F6F0',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4AF37',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495E',
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495E',
    marginBottom: 8,
    paddingLeft: 10,
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: '#F8F9F9',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
  }
});
