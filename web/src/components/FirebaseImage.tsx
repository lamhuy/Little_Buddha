import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';

interface FirebaseImageProps {
  imageRefPath: string;
  alt: string;
}

export const FirebaseImage: React.FC<FirebaseImageProps> = ({ imageRefPath, alt }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    if (imageRefPath) {
      getDownloadURL(ref(storage, imageRefPath))
        .then(downloadUrl => {
          if (active) {
            setUrl(downloadUrl);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error(err);
          if (active) {
            setError('Failed to load image');
            setLoading(false);
          }
        });
    } else {
        setLoading(false);
    }
    return () => { active = false; };
  }, [imageRefPath]);

  if (loading) {
    return (
      <div style={{ height: 300, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.2rem', animation: 'pulse 1.5s infinite' }}>
        Loading illustration...
      </div>
    );
  }

  if (error || !url) {
      return null;
  }
  
  return <img src={url} alt={alt} className="animate-fade-in" style={{ width: '100%', borderRadius: 12, display: 'block', marginBottom: '2rem', objectFit: 'cover', maxHeight: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />;
}
