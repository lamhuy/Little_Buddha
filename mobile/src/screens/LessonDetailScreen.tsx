import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { EducationalModule } from '../models/types';
import { AudioPlayer } from '../components/AudioPlayer';
import { FirebaseImage } from '../components/FirebaseImage';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const LessonDetailScreen = ({ route }: any) => {
  const { id } = route.params;
  const { jwt } = useAuth();
  const [lesson, setLesson] = useState<EducationalModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  const hasSummary = (lesson.summaryPoints && lesson.summaryPoints.length > 0) || (lesson.discussionQuestions && lesson.discussionQuestions.length > 0);
  const totalPages = (lesson.pages?.length || 0) + (hasSummary ? 1 : 0);
  const isSummaryPage = hasSummary && currentPage === (lesson.pages?.length || 0);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} testID="lesson-scroll-view">
        <Text style={styles.title} testID="lesson-title">{lesson.title}</Text>
        
        {!isSummaryPage && lesson.pages && lesson.pages[currentPage] && (
          <View>
            {lesson.pages[currentPage].imageRef ? (
              <FirebaseImage key={lesson.pages[currentPage].imageRef} imageRef={lesson.pages[currentPage].imageRef!} />
            ) : null}
            {lesson.pages[currentPage].audioRef ? (
              <AudioPlayer 
                key={lesson.pages[currentPage].audioRef} 
                audioRef={lesson.pages[currentPage].audioRef} 
                title={`Page ${currentPage + 1}`} 
              />
            ) : null}
            <View style={styles.section}>
              <Text style={styles.bodyText} testID="lesson-content">{lesson.pages[currentPage].text}</Text>
            </View>
          </View>
        )}

        {isSummaryPage && (
          <View>
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
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={[styles.button, currentPage === 0 && styles.buttonDisabled]} 
          onPress={handlePrev} 
          disabled={currentPage === 0}
        >
          <Text style={[styles.buttonText, currentPage === 0 && styles.buttonTextDisabled]}>Previous</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageIndicator}>Page {currentPage + 1} of {totalPages}</Text>
        
        <TouchableOpacity 
          style={[styles.button, currentPage === totalPages - 1 && styles.buttonDisabled]} 
          onPress={handleNext} 
          disabled={currentPage === totalPages - 1}
        >
          <Text style={[styles.buttonText, currentPage === totalPages - 1 && styles.buttonTextDisabled]}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 18,
    lineHeight: 28,
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
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EAECEE',
  },
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#EAECEE',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextDisabled: {
    color: '#95A5A6',
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7F8C8D',
  }
});
