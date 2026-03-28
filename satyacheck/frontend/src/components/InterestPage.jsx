import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const INTERESTS = [
  { id: 'politics', name: 'Politics', nameHi: 'राजनीति', icon: 'fa-landmark' },
  { id: 'sports', name: 'Sports', nameHi: 'खेल', icon: 'fa-futbol' },
  { id: 'technology', name: 'Technology', nameHi: 'तकनीक', icon: 'fa-microchip' },
  { id: 'business', name: 'Business', nameHi: 'व्यापार', icon: 'fa-chart-line' },
  { id: 'health', name: 'Health', nameHi: 'स्वास्थ्य', icon: 'fa-heart-pulse' },
  { id: 'entertainment', name: 'Entertainment', nameHi: 'मनोरंजन', icon: 'fa-film' },
  { id: 'science', name: 'Science', nameHi: 'विज्ञान', icon: 'fa-flask' },
  { id: 'environment', name: 'Environment', nameHi: 'पर्यावरण', icon: 'fa-leaf' },
  { id: 'world', name: 'World News', nameHi: 'विश्व समाचार', icon: 'fa-globe-americas' },
  { id: 'crime', name: 'Crime', nameHi: 'अपराध', icon: 'fa-gavel' },
  { id: 'religion', name: 'Religion', nameHi: 'धर्म', icon: 'fa-om' },
  { id: 'education', name: 'Education', nameHi: 'शिक्षा', icon: 'fa-graduation-cap' },
];

export default function InterestPage({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [isHindi, setIsHindi] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('satyacheck_interests');
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  const toggleInterest = (id) => {
    const newSelected = selected.includes(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    setSelected(newSelected);
  };

  const handleStart = () => {
    localStorage.setItem('satyacheck_interests', JSON.stringify(selected));
    onComplete(selected);
  };

  return (
    <div className="onboarding-container">
      <motion.div 
        className="onboarding-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="onboarding-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isHindi ? 'आपको कौन से विषय रुचिकर हैं?' : 'What news topics interest you?'}
        </motion.h1>
        
        <motion.p 
          className="onboarding-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isHindi ? 'सत्य जानने के लिए अपनी रुचियाँ चुनें' : 'Select your interests to get started'}
        </motion.p>

        <button
          onClick={() => setIsHindi(!isHindi)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '2px solid var(--border)',
            background: 'var(--card)',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {isHindi ? 'EN' : 'हिं'}
        </button>

        <div className="interest-grid">
          {INTERESTS.map((interest, index) => (
            <motion.div
              key={interest.id}
              className={`interest-card ${selected.includes(interest.id) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className={`fas ${interest.icon}`}></i>
              <span>{isHindi ? interest.nameHi : interest.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="start-btn"
          onClick={handleStart}
          disabled={selected.length === 0}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: selected.length > 0 ? 1.05 : 1 }}
        >
          {isHindi ? 'सत्यचेक शुरू करें →' : 'Start SatyaCheck →'}
        </motion.button>
      </motion.div>
    </div>
  );
}