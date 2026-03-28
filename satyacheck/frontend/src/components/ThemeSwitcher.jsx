import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
  { id: 'tiranga', name: 'Tiranga', colors: ['#FF9933', '#FFFFFF', '#138808'] },
  { id: 'raat', name: 'Raat', colors: ['#FF9933', '#0A0A0A', '#30D158'] },
  { id: 'mayur', name: 'Mayur', colors: ['#FFD700', '#003D36', '#00E5CC'] },
  { id: 'gulab', name: 'Gulab', colors: ['#D63384', '#FFF0F5', '#FF85A1'] },
  { id: 'neel', name: 'Neel', colors: ['#1D4ED8', '#EFF6FF', '#0EA5E9'] },
];

export default function ThemeSwitcher({ currentTheme, onSelect }) {
  return (
    <div className="settings-section">
      <p className="settings-label">🎨 Theme</p>
      <div className="theme-swatches">
        {THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            className={`theme-swatch ${currentTheme === theme.id ? 'active' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${theme.colors[0]} 33%, ${theme.colors[1]} 33%, ${theme.colors[1]} 66%, ${theme.colors[2]} 66%)`,
            }}
            onClick={() => onSelect(theme.id)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            title={theme.name}
          />
        ))}
      </div>
    </div>
  );
}