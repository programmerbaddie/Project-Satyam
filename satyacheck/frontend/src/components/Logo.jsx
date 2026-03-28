import { motion } from 'framer-motion';

export default function Logo({ size = 'normal', onClick }) {
  const dimensions = size === 'small' ? { wrapper: 40, icon: 25 } : { wrapper: 45, icon: 30 };

  return (
    <motion.div 
      className="header-logo"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <svg 
        width={dimensions.wrapper} 
        height={dimensions.wrapper} 
        viewBox="0 0 100 100"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#138808" />
            <stop offset="100%" stopColor="#000080" />
          </linearGradient>
        </defs>
        
        <circle cx="50" cy="50" r="45" fill="url(#logoGrad)" />
        
        <g transform="translate(50, 50)">
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="-32"
              x2="0"
              y2="-38"
              stroke="white"
              strokeWidth="1.5"
              transform={`rotate(${i * 15})`}
            />
          ))}
          <circle cx="0" cy="0" r="28" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="0" cy="0" r="5" fill="white" />
        </g>
        
        <rect x="30" y="60" width="40" height="25" rx="3" fill="white" opacity="0.9" />
        <line x1="35" y1="68" x2="65" y2="68" stroke="#FF9933" strokeWidth="2" />
        <line x1="35" y1="75" x2="55" y2="75" stroke="#138808" strokeWidth="2" />
      </svg>

      <div>
        <div className="header-title">SatyaCheck</div>
        <div className="header-subtitle">सत्यचेक</div>
      </div>
    </motion.div>
  );
}