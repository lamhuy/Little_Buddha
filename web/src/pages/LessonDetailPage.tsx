import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson } from '../services/lessonService';
import { AudioPlayer } from '../components/AudioPlayer';
import type { EducationalModule } from '../types';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<EducationalModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      if (id) {
        const data = await getLesson(id);
        setLesson(data);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '2rem 1.5rem' }}><p>Loading...</p></div>;
  if (!lesson) return <div className="container" style={{ padding: '2rem 1.5rem' }}><p>Lesson not found.</p><Link to="/">Back to Home</Link></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: 500 }}>&larr; Back to Home</Link>
      <div className="card">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: '1.2' }}>{lesson.title}</h1>
        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1.1rem' }}>
          {lesson.textContent}
        </div>
        
        {lesson.audioRef && <AudioPlayer audioRefPath={lesson.audioRef} />}
        
        {lesson.summaryPoints && lesson.summaryPoints.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Key Takeaways</h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {lesson.summaryPoints.map((pt, i) => <li key={i} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>{pt}</li>)}
            </ul>
          </div>
        )}

        {lesson.discussionQuestions && lesson.discussionQuestions.length > 0 && (
          <div style={{ marginTop: '2.5rem' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Discussion Questions</h3>
            <ul style={{ paddingLeft: '1.5rem' }}>
              {lesson.discussionQuestions.map((q, i) => <li key={i} style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>{q}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
