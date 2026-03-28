import { useState, useEffect, useRef, useCallback } from 'react';

export default function useReporter() {
  const [position, setPosition] = useState({ x: 200, y: 300 });
  const [reporterState, setReporterState] = useState('idle');
  const [reporterType, setReporterType] = useState(() => {
    return localStorage.getItem('satyacheck_reporter') || 'female';
  });
  const [isHidden, setIsHidden] = useState(reporterType === 'hidden');
  const targetPosition = useRef({ x: 200, y: 300 });
  const rafRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('satyacheck_reporter', reporterType);
    setIsHidden(reporterType === 'hidden');
  }, [reporterType]);

  useEffect(() => {
    if (isHidden) return;

    const handleMouseMove = (e) => {
      targetPosition.current = {
        x: Math.max(0, Math.min(window.innerWidth - 160, e.clientX - 80)),
        y: Math.max(0, Math.min(window.innerHeight - 280, e.clientY - 140)),
      };
    };

    const animate = () => {
      setPosition(prev => ({
        x: prev.x + (targetPosition.current.x - prev.x) * 0.12,
        y: prev.y + (targetPosition.current.y - prev.y) * 0.12,
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHidden]);

  const changeType = useCallback((type) => {
    setReporterType(type);
  }, []);

  const setState = useCallback((state) => {
    if (!isHidden) {
      setReporterState(state);
    }
  }, [isHidden]);

  return {
    position,
    state: reporterState,
    setState,
    type: reporterType,
    setType: changeType,
    hidden: isHidden,
  };
}