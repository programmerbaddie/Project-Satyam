import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPEECH_TIPS = [
  'Fact check karo! 🔍',
  'Sach jaano! 📰',
  'Verify before sharing! ✅',
  'Fake news mat failao! ❌',
  'Sources check karo! 🧐',
  'Sach hi shakti hai! 💪',
];

export default function NewsReporter({ state = 'idle', type = 'female', hidden = false }) {
  const [position, setPosition] = useState({ x: 100, y: 300 });
  const [tipIndex, setTipIndex] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const rafId = useRef(null);

  useEffect(() => {
    if (hidden) return;

    const handleMouseMove = (e) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      setPosition(prev => {
        const targetX = lastMouse.current.x - 80;
        const targetY = lastMouse.current.y - 140;
        const clampedX = Math.max(0, Math.min(window.innerWidth - 160, targetX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - 280, targetY));
        
        return {
          x: prev.x + (clampedX - prev.x) * 0.15,
          y: prev.y + (clampedY - prev.y) * 0.15,
        };
      });
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [hidden]);

  useEffect(() => {
    if (hidden) return;
    const interval = setInterval(() => {
      setShowTip(true);
      setTimeout(() => setShowTip(false), 3000);
      setTipIndex(prev => (prev + 1) % SPEECH_TIPS.length);
    }, 8000);

    setTimeout(() => setShowTip(true), 1000);

    return () => clearInterval(interval);
  }, [hidden]);

  if (hidden) return null;

  const stateClass = `reporter-${state}`;

  return (
    <div
      className="reporter-container"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="speech-bubble"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {SPEECH_TIPS[tipIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        className={`reporter-svg ${stateClass}`}
        viewBox="0 0 160 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="reporter-body">
          {type === 'female' ? (
            <>
              <ellipse cx="80" cy="250" rx="35" ry="10" fill="rgba(0,0,0,0.1)" />
              
              <path
                d="M50 120 Q40 180 50 240 Q60 260 80 260 Q100 260 110 240 Q120 180 110 120 Q100 100 80 100 Q60 100 50 120Z"
                fill="url(#sareeGrad)"
              />
              
              <path
                d="M55 125 Q48 180 55 235 Q62 250 80 250 Q98 250 105 235 Q112 180 105 125 Q95 108 80 108 Q65 108 55 125Z"
                fill="none"
                stroke="#FFD700"
                strokeWidth="1.5"
                opacity="0.5"
              />
              
              <ellipse cx="80" cy="85" rx="22" ry="28" fill="#FFCC80" />
              
              <ellipse cx="80" cy="55" rx="20" ry="18" fill="#1a1a1a" />
              
              <circle cx="80" cy="78" r="3" fill="#FF0000" />
              
              <circle cx="72" cy="82" r="2.5" fill="#1a1a1a" />
              <circle cx="88" cy="82" r="2.5" fill="#1a1a1a" />
              
              <path
                d="M75 92 Q80 95 85 92"
                stroke="#8B4513"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                className="mouth"
              />

              <g className="mic-arm" transform="translate(105, 130)">
                <rect x="0" y="20" width="8" height="35" rx="4" fill="#FFCC80" />
                <rect x="2" y="50" width="4" height="40" fill="#333" />
                <ellipse cx="4" cy="50" rx="10" ry="14" fill="#555" />
                <ellipse cx="4" cy="50" rx="7" ry="10" fill="#333" />
              </g>
            </>
          ) : (
            <>
              <ellipse cx="80" cy="250" rx="35" ry="10" fill="rgba(0,0,0,0.1)" />
              
              <path
                d="M55 120 L50 250 L110 250 L105 120 Q95 100 80 100 Q65 100 55 120Z"
                fill="url(#kurtaGrad)"
              />
              
              <ellipse cx="80" cy="85" rx="20" ry="25" fill="#D2A679" />
              
              <rect x="60" y="55" width="40" height="8" rx="2" fill="#1a1a1a" />
              
              <circle cx="72" cy="82" r="2.5" fill="#1a1a1a" />
              <circle cx="88" cy="82" r="2.5" fill="#1a1a1a" />
              
              <path
                d="M75 95 Q80 98 85 95"
                stroke="#8B4513"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              
              <g className="mic-arm" transform="translate(105, 130)">
                <rect x="0" y="20" width="8" height="35" rx="4" fill="#D2A679" />
                <rect x="2" y="50" width="4" height="40" fill="#333" />
                <ellipse cx="4" cy="50" rx="10" ry="14" fill="#555" />
                <ellipse cx="4" cy="50" rx="7" ry="10" fill="#333" />
              </g>
            </>
          )}
        </g>

        <defs>
          <linearGradient id="sareeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E63" />
            <stop offset="100%" stopColor="#C2185B" />
          </linearGradient>
          <linearGradient id="kurtaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1565C0" />
            <stop offset="100%" stopColor="#0D47A1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}