import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLessonsForAgeTier } from '../services/lessonService';
import { LessonCard } from '../components/LessonCard';
import type { EducationalModule } from '../types';

const tierLabels: Record<string, string> = {
  '0-7': 'Little Explorers (Ages 0–7)',
  '8-12': 'Young Learners (Ages 8–12)',
  '13-18': 'Wise Seekers (Ages 13+)',
};

export const LessonsPage: React.FC = () => {
  const { tier } = useParams<{ tier: string }>();
  const [lessons, setLessons] = useState<EducationalModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (tier && ['0-7', '8-12', '13-18'].includes(tier)) {
        const fetched = await getLessonsForAgeTier(tier as '0-7' | '8-12' | '13-18');
        setLessons(fetched);
      }
      setLoading(false);
    };
    fetchLessons();
  }, [tier]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <p>Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="lessons-page animate-fade-in">
      <Link to="/select-age" className="lessons-back" id="back-to-age-groups">
        ← Back to Age Groups
      </Link>

      <header className="lessons-header">
        <h1>{tierLabels[tier || ''] || 'Lessons'}</h1>
      </header>

      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
        {lessons.length === 0 && (
          <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No lessons found for this age group yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
