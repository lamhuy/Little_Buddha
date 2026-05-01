import React from 'react';
import { Link } from 'react-router-dom';

interface AgeGroup {
  tier: string;
  label: string;
  ageRange: string;
  emoji: string;
  description: string;
  color: string;
  gradient: string;
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
    gradient: 'linear-gradient(135deg, #d5f5e3 0%, #a3e4d7 100%)',
  },
  {
    tier: '8-12',
    label: 'Young Learners',
    ageRange: 'Ages 8–12',
    emoji: '📖',
    description:
      'Engaging stories about Buddhist history, basic principles, and the life of the Buddha — building understanding and curiosity.',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #d6eaf8 0%, #aed6f1 100%)',
  },
  {
    tier: '13-18',
    label: 'Wise Seekers',
    ageRange: 'Ages 13+',
    emoji: '🧘',
    description:
      'Core teachings like the Four Noble Truths and the Eightfold Path — exploring deeper philosophy and mindful living.',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #e8daef 0%, #d2b4de 100%)',
  },
];

export const AgeGroupPage: React.FC = () => {
  return (
    <div className="age-group-page animate-fade-in">
      <Link to="/" className="age-group-back" id="back-to-welcome">
        ← Back
      </Link>

      <div className="age-group-header">
        <h1 className="age-group-title">Select Your Age Group</h1>
        <p className="age-group-subtitle">
          Choose an age group to discover lessons crafted just for you.
        </p>
      </div>

      <div className="age-group-grid">
        {ageGroups.map((group) => (
          <Link
            to={`/lessons/${group.tier}`}
            key={group.tier}
            className="age-group-card"
            id={`age-group-${group.tier}`}
            style={
              {
                '--card-accent': group.color,
                '--card-gradient': group.gradient,
              } as React.CSSProperties
            }
          >
            <div className="age-group-card-emoji">{group.emoji}</div>
            <h2 className="age-group-card-label">{group.label}</h2>
            <span className="age-group-card-range">{group.ageRange}</span>
            <p className="age-group-card-desc">{group.description}</p>
            <span className="age-group-card-cta">
              Explore Lessons <span>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
