import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLesson } from '../services/lessonService';
import { AudioPlayer } from '../components/AudioPlayer';
import { FirebaseImage } from '../components/FirebaseImage';
import type { EducationalModule } from '../types';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<EducationalModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

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

  const hasSummary = (lesson.summaryPoints && lesson.summaryPoints.length > 0) || (lesson.discussionQuestions && lesson.discussionQuestions.length > 0);
  const totalPages = (lesson.pages?.length || 0) + (hasSummary ? 1 : 0);
  const isSummaryPage = hasSummary && currentPage === (lesson.pages?.length || 0);

  const handlePrev = () => setCurrentPage((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', fontWeight: 500 }}>&larr; Back to Home</Link>
      
      <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: '1.2' }}>{lesson.title}</h1>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {!isSummaryPage && lesson.pages && lesson.pages[currentPage] && (
              <div className="animate-fade-in" key={currentPage}>
                {lesson.pages[currentPage].imageRef && (
                  <FirebaseImage imageRefPath={lesson.pages[currentPage].imageRef!} alt={`Illustration for ${lesson.title} - Page ${currentPage + 1}`} />
                )}
                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1.5rem', marginBottom: '2rem' }}>
                  {lesson.pages[currentPage].text}
                </div>
                {lesson.pages[currentPage].audioRef && (
                  <AudioPlayer audioRefPath={lesson.pages[currentPage].audioRef} />
                )}
              </div>
            )}

            {isSummaryPage && (
              <div className="animate-fade-in" key="summary">
                {lesson.summaryPoints && lesson.summaryPoints.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary)' }}>Key Takeaways</h3>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      {lesson.summaryPoints.map((pt, i) => <li key={i} style={{ marginBottom: '0.8rem', lineHeight: '1.6', fontSize: '1.2rem' }}>{pt}</li>)}
                    </ul>
                  </div>
                )}

                {lesson.discussionQuestions && lesson.discussionQuestions.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--primary)' }}>Discussion Questions</h3>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      {lesson.discussionQuestions.map((q, i) => <li key={i} style={{ marginBottom: '0.8rem', lineHeight: '1.6', fontSize: '1.2rem' }}>{q}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '2px solid #EEE' }}>
          <button 
            onClick={handlePrev} 
            disabled={currentPage === 0}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', borderRadius: '8px', border: 'none', backgroundColor: currentPage === 0 ? '#EEE' : 'var(--primary)', color: currentPage === 0 ? '#999' : 'var(--background)', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
          >
            &larr; Previous
          </button>
          <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#666' }}>
              Page {currentPage + 1} of {totalPages}
          </span>
          <button 
            onClick={handleNext} 
            disabled={currentPage === totalPages - 1}
            style={{ padding: '0.75rem 1.5rem', fontSize: '1.1rem', borderRadius: '8px', border: 'none', backgroundColor: currentPage === totalPages - 1 ? '#EEE' : 'var(--primary)', color: currentPage === totalPages - 1 ? '#999' : 'var(--background)', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
