import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SpeechButton({ onResult, disabled = false }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    } else {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
    }
  }, []);

  const startListening = () => {
    if (!recognitionRef.current || disabled) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onResult) onResult(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) {
    return (
      <button
        className="mic-btn"
        disabled
        title="Speech not supported in this browser"
        style={{ opacity: 0.5, cursor: 'not-allowed' }}
      >
        <i className="fas fa-microphone-slash"></i>
      </button>
    );
  }

  return (
    <motion.button
      className={`mic-btn ${isListening ? 'recording' : ''}`}
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      title={isListening ? 'सुन रहा हूँ... | Listening...' : 'Click to speak'}
    >
      <i className={`fas fa-microphone${isListening ? '' : ''}`}></i>
      
      {isListening && (
        <motion.span
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '15px',
            border: '3px solid #dc3545',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}