// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [digipin, setDigipin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNavigate = async (e) => {
    e.preventDefault();
    if (!digipin || digipin.length !== 12) {
      setError('Please enter a valid 12-character DIGIPIN.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Step 1: Call our own backend, which will then call the official API.
      const response = await fetch('/api/navigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digipin }),
      });

      if (!response.ok) {
        throw new Error('Could not fetch coordinates. Please check the DIGIPIN.');
      }

      const data = await response.json();
      const { lat, lon } = data.coordinates;

      // Step 2: Construct the Google Maps URL and redirect the user.
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=LAT,LONG`;
      window.location.href = mapsUrl;

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>GoDIGI.in</h1>
        <p>Navigate Instantly</p>
      </header>
      <main>
        <form onSubmit={handleNavigate}>
          <input
            type="text"
            value={digipin}
            onChange={(e) => setDigipin(e.target.value.toUpperCase())}
            placeholder="Paste DIGIPIN here..."
            aria-label="DIGIPIN Input"
            maxLength="12"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : '--> Navigate'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  );
}

export default App;