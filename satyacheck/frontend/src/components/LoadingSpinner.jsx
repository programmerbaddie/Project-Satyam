import { motion } from 'framer-motion';

export default function LoadingSpinner({ text }) {
  return (
    <motion.div
      className="loading-spinner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="lotus-spinner">🪷</div>
      <motion.p
        className="loading-text"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text || 'Verifying... | सत्यापन हो रहा है...'}
      </motion.p>
    </motion.div>
  );
}