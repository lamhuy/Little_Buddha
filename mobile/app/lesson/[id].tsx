import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getLesson } from '../../src/services/lessonService';
import type { EducationalModule } from '../../src/models/types';
import { AudioPlayer } from '../../src/components/AudioPlayer';
import { FirebaseImage } from '../../src/components/FirebaseImage';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const [lesson, setLesson] = useState<EducationalModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        if (id) {
          const data = await getLesson(id);
          if (data) {
            setLesson(data);
          } else {
            setError('Lesson not found');
          }
        }
      } catch (err) {
        setError('Network error loading lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLessonDetail();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#D4AF37" />
      </SafeAreaView>
    );
  }

  if (error || !lesson) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.push('/select-age')} style={{ marginTop: 20 }}>
          <Text style={{ color: '#2C3E50', fontWeight: 'bold' }}>Back to Age Groups</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasSummary = (lesson.summaryPoints && lesson.summaryPoints.length > 0) || (lesson.discussionQuestions && lesson.discussionQuestions.length > 0);
  const totalPages = (lesson.pages?.length || 0) + (hasSummary ? 1 : 0);
  const isSummaryPage = hasSummary && currentPage === (lesson.pages?.length || 0);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push(`/lessons/${lesson.targetAgeTier}` as any)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
          <Text style={styles.backText}>Back to Lessons</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{lesson.title}</Text>
        
        {!isSummaryPage && lesson.pages && lesson.pages[currentPage] && (
          <View>
            {lesson.pages[currentPage].imageRef ? (
              <FirebaseImage key={`img-${currentPage}`} imageRef={lesson.pages[currentPage].imageRef!} />
            ) : null}
            
            {/* Audio placed beneath image and above text to mirror web */}
            {lesson.pages[currentPage].audioRef ? (
              <AudioPlayer 
                key={`aud-${currentPage}`} 
                audioRef={lesson.pages[currentPage].audioRef} 
                title={`Page ${currentPage + 1}`} 
              />
            ) : null}

            <View style={styles.section}>
              <Text style={styles.bodyText}>{lesson.pages[currentPage].text}</Text>
            </View>
          </View>
        )}

        {isSummaryPage && (
          <View>
            {lesson.summaryPoints && lesson.summaryPoints.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionHeader}>Key Takeaways</Text>
                {lesson.summaryPoints.map((point, index) => (
                  <Text key={index} style={styles.bulletPoint}>• {point}</Text>
                ))}
              </View>
            )}

            {lesson.discussionQuestions && lesson.discussionQuestions.length > 0 && (
              <View style={styles.section}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C3E50',
    marginBottom: 20,
    lineHeight: 34,
  },
  section: {
    marginTop: 15,
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#D4AF37',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 18,
    lineHeight: 30,
    color: '#34495E',
  },
  bulletPoint: {
    fontSize: 17,
    lineHeight: 26,
    color: '#34495E',
    marginBottom: 12,
    paddingLeft: 5,
  },
  questionText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 12,
    backgroundColor: '#F8F9F9',
    padding: 16,
    borderRadius: 12,
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
    borderTopColor: '#F2F2F2',
  },
  button: {
    backgroundColor: '#D4AF37',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
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
    fontWeight: '600',
    color: '#7F8C8D',
  }
});
