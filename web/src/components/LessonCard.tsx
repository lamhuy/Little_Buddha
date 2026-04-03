import React from 'react';
import { Link } from 'react-router-dom';
import type { EducationalModule } from '../types';

interface LessonCardProps {
  lesson: EducationalModule;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson }) => {
  return (
    <div className="card">
      <h3 style={{ marginBottom: '0.5rem' }}>{lesson.title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
        {lesson.pages?.[0]?.text?.substring(0, 100) || ''}...
      </p>
      <Link to={`/lesson/${lesson.id}`} className="btn btn-secondary">
        View Lesson
      </Link>
    </div>
  );
};
