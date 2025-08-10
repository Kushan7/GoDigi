'use client'; // This line is important in the new App Router

import { useState } from 'react';

export default function HomePage() {
  const [digipin, setDigipin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNavigate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!digipin) {
      setError('Please enter a DIGIPIN.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digipin }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not get coordinates.');
      }
      
      const { lat, lon } = data;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=LAT,LONG`;
      window.location.href = mapsUrl;

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>GoDIGI.in</h1>
        <p>Navigate Instantly</p>
      </header>
      <form onSubmit={handleNavigate}>
        <input
          type="text"
          value={digipin}
          onChange={(e) => setDigipin(e.target.value.toUpperCase())}
          placeholder="Paste DIGIPIN here..."
          aria-label="DIGIPIN Input"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : '--> Navigate'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}