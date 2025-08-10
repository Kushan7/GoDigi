import React, { useState } from 'react';
import './App.css';

function App() {
  const [digipin, setDigipin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNavigate = async (e) => {
    e.preventDefault();
    // A simple validation for DIGIPIN format
    if (!digipin || !/^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}$/.test(digipin)) {
      setError('Please enter a valid DIGIPIN (e.g., 25L-M24-72C2).');
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

      if (!response.ok) {
        throw new Error('Could not get coordinates. Please check the DIGIPIN.');
      }

      const data = await response.json();
      const { lat, lon } = data;

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