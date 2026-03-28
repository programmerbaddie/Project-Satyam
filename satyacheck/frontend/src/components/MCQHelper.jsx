import { motion } from 'framer-motion';
import { useState } from 'react';

const MCQ_OPTIONS = [
  { id: 'A', label: 'Verify a specific news headline', labelHi: 'विशेष समाचार हेडलाइन सत्यापित करें', icon: 'fa-newspaper' },
  { id: 'B', label: 'Check if a WhatsApp forward is real', labelHi: 'व्हाट्सएप फॉरवर्ड सत्य है या नहीं', icon: 'fa-share' },
  { id: 'C', label: 'Fact-check a political claim', labelHi: 'राजनीतिक दावे की सत्यापन करें', icon: 'fa-landmark' },
  { id: 'D', label: 'Verify a viral social media post', labelHi: 'वायरल सोशल मीडिया पोस्ट सत्यापित करें', icon: 'fa-share-alt' },
  { id: 'E', label: 'Check regional/state-level news', labelHi: 'क्षेत्रीय/राज्य स्तरीय समाचार जांचें', icon: 'fa-map-marker-alt' },
];

export default function MCQHelper({ onSelect, isHindi = false }) {
  const [isHindiLocal, setIsHindiLocal] = useState(isHindi);

  return (
    <motion.div
      className="mcq-cards"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '8px' }}>
        <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem' }}>
          {isHindiLocal ? 'आप क्या जानना चाहते हैं?' : 'What are you trying to check?'}
        </span>
        <button
          onClick={() => setIsHindiLocal(!isHindiLocal)}
          style={{
            marginLeft: '10px',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            background: 'var(--card)',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
        >
          {isHindiLocal ? 'EN' : 'हिं'}
        </button>
      </div>

      {MCQ_OPTIONS.map((option, index) => (
        <motion.button
          key={option.id}
          className="mcq-card"
          onClick={() => onSelect(option.label, option.id)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mcq-label">{option.id}</span>
          <span style={{ flex: 1, textAlign: 'left', fontSize: '0.9rem' }}>
            {isHindiLocal ? option.labelHi : option.label}
          </span>
          <i className={`fas ${option.icon}`} style={{ opacity: 0.6 }}></i>
        </motion.button>
      ))}
    </motion.div>
  );
}