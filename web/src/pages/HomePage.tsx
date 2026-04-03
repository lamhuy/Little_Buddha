import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLessonsForAgeTier } from '../services/lessonService';
import { LessonCard } from '../components/LessonCard';
import { logout } from '../services/authService';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import type { EducationalModule, UserProfile } from '../types';

export const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lessons, setLessons] = useState<EducationalModule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndLessons = async () => {
      if (!currentUser) return;
      
      const pDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
      if (pDoc.exists()) {
        const userProfile = pDoc.data() as UserProfile;
        setProfile(userProfile);
        
        const age = new Date().getFullYear() - userProfile.birth_year;
        let tier: '0-7' | '8-12' | '13-18' = '13-18';
        if (age <= 7) tier = '0-7';
        else if (age <= 12) tier = '8-12';

        const fetchedLessons = await getLessonsForAgeTier(tier);
        setLessons(fetchedLessons);
      }
      setLoading(false);
    };

    fetchUserAndLessons();
  }, [currentUser]);

  if (loading) {
    return <div className="container" style={{ padding: '2rem 1.5rem' }}><p>Loading...</p></div>;
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1>Welcome, {profile?.name || 'User'}</h1>
        <button className="btn btn-secondary" onClick={logout}>Sign Out</button>
      </header>
      
      <section>
        <h2>Your Lessons</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {lessons.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
          {lessons.length === 0 && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <p>No lessons found for your age tier yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
