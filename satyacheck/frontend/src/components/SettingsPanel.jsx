import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇮🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇮🇳' },
];

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5];
const SIZE_OPTIONS = ['Small', 'Medium', 'Large'];

export default function SettingsPanel({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  eyeProtection,
  onEyeProtectionChange,
  reporterType,
  onReporterChange,
  textSize,
  onTextSizeChange,
  speechSpeed,
  onSpeechSpeedChange,
  onClearChat,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="settings-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="settings-panel open"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="settings-header">
              <h2 className="settings-title">⚙️ Settings</h2>
              <button className="settings-close" onClick={onClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="settings-section">
              <p className="settings-label">🌐 Language</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LANGUAGES.map((lang) => (
                  <motion.button
                    key={lang.code}
                    className={`reporter-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => onLanguageChange(lang.code)}
                    whileHover={{ x: 5 }}
                    style={{ textAlign: 'left' }}
                  >
                    <span style={{ marginRight: '10px' }}>{lang.flag}</span>
                    {lang.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <ThemeSwitcher currentTheme={theme} onSelect={onThemeChange} />

            <div className="settings-section">
              <p className="settings-label">🧑 Reporter Character</p>
              <div className="reporter-options">
                <motion.button
                  className={`reporter-option ${reporterType === 'female' ? 'active' : ''}`}
                  onClick={() => onReporterChange('female')}
                  whileHover={{ scale: 1.02 }}
                >
                  👩 Female
                </motion.button>
                <motion.button
                  className={`reporter-option ${reporterType === 'male' ? 'active' : ''}`}
                  onClick={() => onReporterChange('male')}
                  whileHover={{ scale: 1.02 }}
                >
                  👨 Male
                </motion.button>
                <motion.button
                  className={`reporter-option ${reporterType === 'hidden' ? 'active' : ''}`}
                  onClick={() => onReporterChange('hidden')}
                  whileHover={{ scale: 1.02 }}
                >
                  🙈 Hidden
                </motion.button>
              </div>
            </div>

            <div className="settings-section">
              <p className="settings-label">🔤 Text Size</p>
              <div className="size-options">
                {SIZE_OPTIONS.map((size) => (
                  <motion.button
                    key={size}
                    className={`size-btn ${textSize === size.toLowerCase() ? 'active' : ''}`}
                    onClick={() => onTextSizeChange(size.toLowerCase())}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <p className="settings-label">🔊 Speech Speed</p>
              <div className="speed-options">
                {SPEED_OPTIONS.map((speed) => (
                  <motion.button
                    key={speed}
                    className={`speed-btn ${speechSpeed === speed ? 'active' : ''}`}
                    onClick={() => onSpeechSpeedChange(speed)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {speed}x
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <div className="toggle-switch">
                <span>👁 Eye Protection Mode</span>
                <div
                  className={`toggle-slider ${eyeProtection ? 'active' : ''}`}
                  onClick={() => onEyeProtectionChange(!eyeProtection)}
                />
              </div>
            </div>

            <div className="settings-section">
              <button className="clear-chat-btn" onClick={onClearChat}>
                <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
                Clear Chat History
              </button>
            </div>

            <div className="about-box">
              <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>ℹ️ About SatyaCheck AI</h3>
              <p>
                SatyaCheck AI is an independent fact-checking tool powered by AI.
                Always verify important news from official sources.
                We do not store your queries.
              </p>
              <p style={{ marginTop: '15px', fontSize: '0.85rem', opacity: 0.7 }}>
                Made with ❤️ in India | भारत में बनाया गया
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}