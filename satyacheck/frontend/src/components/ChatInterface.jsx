import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import MCQHelper from './MCQHelper';
import AutoSuggest from './AutoSuggest';
import SpeechButton from './SpeechButton';
import VerdictCard from './VerdictCard';
import LoadingSpinner from './LoadingSpinner';

export default function ChatInterface({
  onDetect,
  interests = [],
  isLoading = false,
  currentResult = null,
  reporterState = 'idle',
  onReplay,
  onShare,
}) {
  const [inputValue, setInputValue] = useState('');
  const [showMCQ, setShowMCQ] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentResult, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onDetect(inputValue.trim());
      setShowMCQ(false);
      setShowSuggestions(false);
    }
  };

  const handleMCQSelect = (label) => {
    const fullQuery = `${label}: ${inputValue}`;
    setInputValue(fullQuery);
    setShowMCQ(false);
    onDetect(fullQuery);
  };

  const handleSuggestionSelect = (suggestion) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSpeechResult = (transcript) => {
    setInputValue(transcript);
    setShowMCQ(true);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {!currentResult && !isLoading && (
          <motion.div
            className="welcome-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center',
              padding: '40px',
              background: 'var(--card)',
              borderRadius: '20px',
              border: '2px dashed var(--primary)',
              marginBottom: '10px',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-main)', color: 'var(--accent)', marginBottom: '10px' }}>
              नमस्ते! Welcome to SatyaCheck! 🕵️
            </h2>
            <p style={{ color: 'var(--text)', opacity: 0.8 }}>
              Paste any news, claim, or WhatsApp forward below and I'll verify it in seconds.
            </p>
          </motion.div>
        )}

        {isLoading && <LoadingSpinner text="Verifying... | सत्यापन हो रहा है..." />}

        {currentResult && !isLoading && (
          <VerdictCard
            data={currentResult}
            onReplay={onReplay}
            onShare={onShare}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <AutoSuggest
            value={inputValue}
            onSelect={handleSuggestionSelect}
          />
        </div>

        {showMCQ && (
          <MCQHelper onSelect={handleMCQSelect} />
        )}

        <form className="input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Paste news or type a claim to verify..."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />

          <SpeechButton onResult={handleSpeechResult} disabled={isLoading} />

          <motion.button
            type="submit"
            className="send-btn"
            disabled={!inputValue.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-paper-plane"></i>
          </motion.button>
        </form>

        {inputValue.trim().length > 0 && !isLoading && !showMCQ && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <button
              onClick={() => setShowMCQ(true)}
              style={{
                padding: '8px 20px',
                border: '2px solid var(--primary)',
                borderRadius: '20px',
                background: 'transparent',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Need help refining your query? Click here →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}