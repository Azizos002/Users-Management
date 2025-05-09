// src/components/DarkModeToggle.js
import React, { useEffect, useState } from 'react';
import './DarkModeToggle.css';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDark(savedTheme === 'dark');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button
      className={`theme-toggle ${dark ? 'dark' : 'light'}`}
      onClick={() => setDark(!dark)}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="toggle-icon">{dark ? '🌞' : '🌙'}</span>
      <span className="toggle-text">{dark ? 'Light' : 'Dark'}</span>
    </button>
  );
}



