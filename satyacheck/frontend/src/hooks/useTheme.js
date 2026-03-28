import { useState, useCallback, useEffect } from 'react';

const THEMES = ['tiranga', 'raat', 'mayur', 'gulab', 'neel'];

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('satyacheck_theme');
    return saved || 'tiranga';
  });

  const [eyeProtection, setEyeProtection] = useState(() => {
    return localStorage.getItem('satyacheck_eye') === 'true';
  });

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    if (eyeProtection) {
      document.body.style.filter = 'sepia(0.3) contrast(1.1)';
    } else {
      document.body.style.filter = '';
    }
  }, [theme, eyeProtection]);

  const changeTheme = useCallback((newTheme) => {
    if (THEMES.includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('satyacheck_theme', newTheme);
    }
  }, []);

  const toggleEyeProtection = useCallback(() => {
    setEyeProtection(prev => {
      const newValue = !prev;
      localStorage.setItem('satyacheck_eye', String(newValue));
      return newValue;
    });
  }, []);

  return {
    theme,
    changeTheme,
    eyeProtection,
    toggleEyeProtection,
    themes: THEMES,
  };
}