import { useState, useCallback, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', dir: 'ltr' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', dir: 'ltr' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', native: 'اردو', dir: 'rtl' },
];

export default function useLanguage() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('satyacheck_lang');
    return saved || 'en';
  });

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = currentLang.dir;
    localStorage.setItem('satyacheck_lang', language);
  }, [language, currentLang.dir]);

  const changeLanguage = useCallback((code) => {
    if (LANGUAGES.find(l => l.code === code)) {
      setLanguage(code);
    }
  }, []);

  return {
    language,
    changeLanguage,
    currentLang,
    languages: LANGUAGES,
  };
}