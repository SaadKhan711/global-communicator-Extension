// src/components/Toolbar.jsx
import React, { useState } from 'react';

const toolbarStyle = { /* ...same as before... */ };
const buttonStyle = { /* ...same as before... */ };

// It now receives a new prop: onActionClick
export const Toolbar = ({ onActionClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClick = async (type, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the function passed down from the parent (content.jsx)
      await onActionClick(type, options);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div style={toolbarStyle}>
        <span style={{ color: 'red', marginRight: '10px' }}>Error: {error}</span>
      </div>
    );
  }
  
  if (isLoading) {
    return <div style={toolbarStyle}>Working...</div>;
  }

  return (
    <div style={toolbarStyle}>
      <button style={buttonStyle} onClick={() => handleClick("PROOFREAD")}>Proofread</button>
      <button style={buttonStyle} onClick={() => handleClick("REWRITE", { tone: 'more-formal' })}>Make Formal</button>
      <button style={buttonStyle} onClick={() => handleClick("TRANSLATE", { targetLanguage: 'es' })}>Translate (es)</button>
    </div>
  );
};