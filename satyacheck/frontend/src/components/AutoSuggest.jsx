import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SUGGESTIONS = [
  'Is it true that ',
  'Fact check: ',
  'Is this WhatsApp forward real? ',
  'Verify this news about ',
  'Check if this is fake: ',
];

export default function AutoSuggest({ value, onSelect, suggestions = [] }) {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (suggestions.length > 0) {
      setItems(suggestions);
    } else {
      setItems(DEFAULT_SUGGESTIONS);
    }
  }, [suggestions]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (value.trim().length > 2) {
      debounceRef.current = setTimeout(() => {
        setShow(true);
      }, 300);
    } else {
      setShow(false);
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  const handleSelect = (suggestion) => {
    onSelect(suggestion);
    setShow(false);
  };

  const filteredItems = items.filter(s => 
    s.toLowerCase().includes(value.toLowerCase()) || 
    value.length < 3
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="autocomplete-dropdown"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          {filteredItems.slice(0, 5).map((item, index) => (
            <motion.div
              key={index}
              className="autocomplete-item"
              onClick={() => handleSelect(item)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}