import React, { useState, useEffect } from 'react';
import { FiPenTool, FiGlobe } from 'react-icons/fi';

// --- Styles ---
const toolbarStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(12px) saturate(180%)',
  WebkitBackdropFilter: 'blur(12px) saturate(180%)',
  border: '1px solid rgba(209, 213, 219, 0.3)',
  borderRadius: '12px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  zIndex: '9999',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: '14px',
  transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
};

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  border: 'none',
  padding: '6px 12px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  color: '#111',
  transition: 'transform 150ms ease, background-color 150ms ease',
};

const buttonHoverStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  transform: 'scale(1.05)',
};

const selectStyle = {
  border: 'none',
  borderRadius: '8px',
  padding: '6px',
  fontSize: '14px',
  fontWeight: '500',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  color: '#111',
  cursor: 'pointer',
};
// --- End Styles ---


export const Toolbar = ({ onActionClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [targetLang, setTargetLang] = useState('es');
  const [visible, setVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = async (type, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      await onActionClick(type, options);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const animatedToolbarStyle = {
    ...toolbarStyle,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(10px)',
  };

  if (error) {
    return (
      <div style={animatedToolbarStyle}>
        <span style={{ color: 'red', marginRight: '10px' }}>Error: {error}</span>
      </div>
    );
  }
  
  if (isLoading) {
    return <div style={animatedToolbarStyle}>Working...</div>;
  }

  return (
    <div style={animatedToolbarStyle}>
      <button 
        style={hoveredButton === 'formal' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onMouseEnter={() => setHoveredButton('formal')}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={() => handleClick("REWRITE", { tone: 'more-formal' })}
      >
        <FiPenTool /> Make Formal
      </button>
      
      <select 
        style={selectStyle} 
        value={targetLang} 
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="ja">Japanese</option>
        <option value="hi">Hindi</option>
      </select>

      <button 
        style={hoveredButton === 'translate' ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onMouseEnter={() => setHoveredButton('translate')}
        onMouseLeave={() => setHoveredButton(null)}
        onClick={() => handleClick("TRANSLATE", { targetLanguage: targetLang })}
      >
        <FiGlobe /> Translate
      </button>
    </div>
  );
};