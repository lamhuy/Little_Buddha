import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/little_buddha_hero.png';

export const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
              opacity: 0.15 + Math.random() * 0.25,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
            }}
          />
        ))}
      </div>

      <div className="welcome-content animate-fade-in">
        <div className="welcome-hero-image">
          <img
            src={heroImage}
            alt="A little Buddhist monk meditating peacefully under a Bodhi tree by a lotus pond, with farmland and oxen in the distance"
          />
        </div>

        <h1 className="welcome-title">
          Welcome to <span className="welcome-title-accent">Little Buddha</span>
        </h1>

        <p className="welcome-subtitle">
          Discover age-appropriate Buddhist stories, teachings, and wisdom through
          beautifully crafted lessons for young minds.
        </p>

        <Link to="/select-age" className="welcome-cta" id="get-started-link">
          Get Started
          <span className="cta-arrow">→</span>
        </Link>
      </div>
    </div>
  );
};
