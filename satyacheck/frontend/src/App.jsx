import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import './i18n';
import './index.css';

import Logo from './components/Logo';
import InterestPage from './components/InterestPage';
import ChatInterface from './components/ChatInterface';
import NewsReporter from './components/NewsReporter';
import SettingsPanel from './components/SettingsPanel';

import useTheme from './hooks/useTheme';
import useLanguage from './hooks/useLanguage';
import useReporter from './hooks/useReporter';
import useSpeech from './hooks/useSpeech';

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const { t, i18n } = useTranslation();
  const [isOnboarded, setIsOnboarded] = useState(() => {
    const saved = localStorage.getItem('satyacheck_interests');
    return saved && JSON.parse(saved).length > 0;
  });
  const [interests, setInterests] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(() => {
    return parseFloat(localStorage.getItem('satyacheck_speed')) || 1;
  });
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('satyacheck_textsize') || 'medium';
  });
  const [toast, setToast] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const { theme, changeTheme, eyeProtection, toggleEyeProtection } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { state: reporterState, setState: setReporterState, type: reporterType, setType: setReporterType, hidden: reporterHidden } = useReporter();
  const { speak } = useSpeech({
    lang: language,
    speed: speechSpeed,
  });

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    document.body.style.fontSize = textSize === 'small' ? '14px' : textSize === 'large' ? '18px' : '16px';
  }, [textSize]);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleOnboardingComplete = useCallback((selectedInterests) => {
    setInterests(selectedInterests);
    setIsOnboarded(true);
  }, []);

  const handleLogoClick = useCallback(() => {
    setCurrentResult(null);
  }, []);

  const handleDetect = useCallback(async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setReporterState('loading');
    setCurrentResult(null);

    setChatMessages(prev => [...prev, { role: 'user', text: query }]);

    try {
      const response = await axios.post(`${API_URL}/detect`, {
        query,
        language,
        region: 'india',
      }, {
        timeout: 10000,
      });

      const data = response.data;
      setCurrentResult(data);

      setChatMessages(prev => [...prev, { role: 'ai', text: data.summary || data.explanation }]);

      const newState = data.verdict === 'TRUE' ? 'real' : data.verdict === 'FALSE' ? 'fake' : 'idle';
      setReporterState(newState);

      if (data.summary) {
        speak(data.summary);
      }

      setTimeout(() => setReporterState('idle'), 4000);

    } catch (error) {
      console.error('Detection error:', error);
      setReporterState('idle');

      const errorResult = {
        verdict: 'UNVERIFIED',
        confidence: 0,
        explanation: 'Unable to verify at this time. Please try again later.',
        summary: 'Verification failed. Please check your connection.',
        sources: [],
        correct_facts: [],
        false_claims: [],
      };
      setCurrentResult(errorResult);
      showToast('Connection error. Using offline mode.');
    } finally {
      setIsLoading(false);
    }
  }, [language, setReporterState, speak, showToast]);

  const handleReplay = useCallback(() => {
    if (currentResult?.summary) {
      speak(currentResult.summary);
    }
  }, [currentResult, speak]);

  const handleShare = useCallback(() => {
    if (!currentResult) return;
    const text = `SatyaCheck Verification 🔍\n\nVerdict: ${currentResult.verdict}\nConfidence: ${currentResult.confidence}%\n\n${currentResult.summary || currentResult.explanation}\n\nSources: ${currentResult.sources?.map(s => s.name).join(', ') || 'Multiple sources'}\n\nCheck at: SatyaCheck AI`;
    navigator.clipboard.writeText(text);
    showToast('Result copied to clipboard!');
  }, [currentResult, showToast]);

  const handleClearChat = useCallback(() => {
    setCurrentResult(null);
    setChatMessages([]);
    setSettingsOpen(false);
    showToast('Chat history cleared!');
  }, [showToast]);

  const handleSpeechSpeedChange = useCallback((speed) => {
    setSpeechSpeed(speed);
    localStorage.setItem('satyacheck_speed', speed);
  }, []);

  const handleTextSizeChange = useCallback((size) => {
    setTextSize(size);
    localStorage.setItem('satyacheck_textsize', size);
  }, []);

  const handleEyeProtectionToggle = useCallback(() => {
    toggleEyeProtection();
    showToast(eyeProtection ? 'Eye Protection OFF' : 'Eye Protection ON');
  }, [toggleEyeProtection, eyeProtection, showToast]);

  const handleThemeChange = useCallback(() => {
    const themes = ['tiranga', 'raat', 'mayur', 'gulab', 'neel'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    changeTheme(nextTheme);
    showToast(`Theme: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`);
  }, [theme, changeTheme, showToast]);

  if (!isOnboarded) {
    return <InterestPage onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="app-container">
      <div className="mandala-bg" />

      <header className="header">
        <Logo size="normal" onClick={handleLogoClick} />

        <div className="header-controls">
          <select
            className="lang-select"
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="en">🇮🇳 English</option>
            <option value="hi">🇮🇳 हिन्दी</option>
            <option value="ta">🇮🇳 தமிழ்</option>
            <option value="bn">🇮🇳 বাংলা</option>
            <option value="te">🇮🇳 తెలుగు</option>
            <option value="mr">🇮🇳 मराठी</option>
            <option value="ur">🇮🇳 اردو</option>
          </select>

          <button
            className={`icon-btn ${eyeProtection ? 'active' : ''}`}
            onClick={handleEyeProtectionToggle}
            title="Eye Protection"
          >
            <i className="fas fa-eye"></i>
          </button>

          <button
            className="icon-btn"
            onClick={handleThemeChange}
            title="Change Theme"
          >
            <i className="fas fa-palette"></i>
          </button>

          <button
            className="icon-btn"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </header>

      <main className="main-content">
        <ChatInterface
          interests={interests}
          onDetect={handleDetect}
          isLoading={isLoading}
          currentResult={currentResult}
          reporterState={reporterState}
          onReplay={handleReplay}
          onShare={handleShare}
        />
      </main>

      <NewsReporter
        state={reporterState}
        type={reporterType}
        hidden={reporterHidden}
      />

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        onThemeChange={changeTheme}
        language={language}
        onLanguageChange={changeLanguage}
        eyeProtection={eyeProtection}
        onEyeProtectionChange={toggleEyeProtection}
        reporterType={reporterType}
        onReporterChange={setReporterType}
        textSize={textSize}
        onTextSizeChange={handleTextSizeChange}
        speechSpeed={speechSpeed}
        onSpeechSpeedChange={handleSpeechSpeedChange}
        onClearChat={handleClearChat}
      />

      <motion.div
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>{t('footer')}</p>
        <p style={{ marginTop: '5px', fontSize: '0.8rem' }}>
          Made with ❤️ in India | भारत में बनाया गया
        </p>
      </motion.div>

      {toast && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}