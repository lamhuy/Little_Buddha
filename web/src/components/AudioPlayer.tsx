import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';

interface AudioPlayerProps {
  audioRefPath: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioRefPath }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchUrl = async () => {
      try {
        if (audioRefPath) {
          const downloadUrl = await getDownloadURL(ref(storage, audioRefPath));
          if (active) setUrl(downloadUrl);
        }
      } catch (err: any) {
        if (active) setError(err.message);
      }
    };
    fetchUrl();
    return () => { active = false; };
  }, [audioRefPath]);

  if (error) {
    return <p style={{ color: 'red' }}>Error loading audio: {error}</p>;
  }

  if (!url) {
    return <p>Loading audio...</p>;
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
      <audio controls src={url} style={{ width: '100%', outline: 'none' }}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
