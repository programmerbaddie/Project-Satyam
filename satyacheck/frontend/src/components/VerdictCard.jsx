import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VerdictCard({ data, onReplay, onShare }) {
  const [expandedSections, setExpandedSections] = useState({});
  const [showCopied, setShowCopied] = useState(false);

  if (!data) return null;

  const {
    verdict = 'UNVERIFIED',
    confidence = 0,
    explanation = '',
    correct_facts = [],
    false_claims = [],
    sources = [],
    region = 'India',
    regional_context = '',
    summary = '',
    share_warning = ''
  } = data;

  const verdictClass = verdict.toLowerCase();
  const confidenceLevel = confidence >= 70 ? 'high' : confidence >= 40 ? 'medium' : 'low';

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleShare = () => {
    const text = `SatyaCheck Verification 🔍\n\nVerdict: ${verdict}\nConfidence: ${confidence}%\n\n${summary}\n\nSources: ${sources.map(s => s.name).join(', ')}\n\nCheck at: SatyaCheck AI`;
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
    if (onShare) onShare();
  };

  const getStampText = () => {
    switch (verdict) {
      case 'TRUE': return '✓ VERIFIED';
      case 'FALSE': return 'FAKE';
      case 'MISLEADING': return '⚠ MISLEADING';
      default: return '? UNVERIFIED';
    }
  };

  return (
    <motion.div
      className={`verdict-card verdict-${verdictClass}`}
      initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="verdict-stamp"
        initial={{ scale: 3, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: verdict === 'FALSE' ? 15 : 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        {getStampText()}
      </motion.div>

      <div className="confidence-meter">
        <div className="confidence-label">
          <span>Confidence Level</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{confidence}%</span>
        </div>
        <div className="confidence-bar">
          <motion.div
            className={`confidence-fill ${confidenceLevel}`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <motion.p
        style={{ marginTop: '15px', lineHeight: 1.7, fontSize: '1rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {explanation}
      </motion.p>

      {share_warning && (
        <motion.div
          style={{
            marginTop: '15px',
            padding: '12px 16px',
            background: 'rgba(220, 53, 69, 0.1)',
            border: '2px solid #dc3545',
            borderRadius: '12px',
            color: '#dc3545',
            fontWeight: 600,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {share_warning}
        </motion.div>
      )}

      <div className="verdict-section">
        {correct_facts.length > 0 && (
          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleSection('correct')}>
              <span>✅ Correct Facts</span>
              <i className={`fas fa-chevron-${expandedSections.correct ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.correct && (
              <ul style={{ padding: '14px 18px', margin: 0, listStyle: 'none' }}>
                {correct_facts.map((fact, i) => (
                  <li key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                    <span>✓</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {false_claims.length > 0 && (
          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleSection('false')}>
              <span>❌ False Claims</span>
              <i className={`fas fa-chevron-${expandedSections.false ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.false && (
              <ul style={{ padding: '14px 18px', margin: 0, listStyle: 'none' }}>
                {false_claims.map((claim, i) => (
                  <li key={i} style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
                    <span>✗</span>
                    <span>{claim}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="accordion-item">
          <div className="accordion-header" onClick={() => toggleSection('sources')}>
            <span>🔗 Sources to Verify</span>
            <i className={`fas fa-chevron-${expandedSections.sources ? 'up' : 'down'}`}></i>
          </div>
          {expandedSections.sources && (
            <ul className="sources-list" style={{ padding: '14px 18px', margin: 0 }}>
              {sources.map((source, i) => (
                <li key={i}>
                  <i className="fas fa-external-link-alt" style={{ fontSize: '0.8rem' }}></i>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {regional_context && (
          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleSection('region')}>
              <span>🗺 Region & Context</span>
              <i className={`fas fa-chevron-${expandedSections.region ? 'up' : 'down'}`}></i>
            </div>
            {expandedSections.region && (
              <div style={{ padding: '14px 18px' }}>
                <p><strong>Region:</strong> {region}</p>
                <p style={{ marginTop: '8px' }}>{regional_context}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <motion.div
        style={{ display: 'flex', gap: '12px', marginTop: '20px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {onReplay && (
          <button
            onClick={onReplay}
            style={{
              flex: 1,
              padding: '12px 20px',
              border: '2px solid var(--primary)',
              borderRadius: '12px',
              background: 'transparent',
              color: 'var(--primary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--primary)';
            }}
          >
            <i className="fas fa-volume-up"></i> Replay Audio
          </button>
        )}

        <button
          onClick={handleShare}
          style={{
            flex: 1,
            padding: '12px 20px',
            border: '2px solid var(--secondary)',
            borderRadius: '12px',
            background: showCopied ? 'var(--secondary)' : 'transparent',
            color: showCopied ? 'white' : 'var(--secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s',
          }}
        >
          <i className={`fas ${showCopied ? 'fa-check' : 'fa-share'}`}></i>
          {showCopied ? 'Copied!' : 'Share Result'}
        </button>
      </motion.div>
    </motion.div>
  );
}