import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toolbar } from './components/Toolbar';

let toolbarRoot = null;
let toolbarContainer = null;
let currentSelection = null;

const removeToolbar = () => {
  if (toolbarRoot) toolbarRoot.unmount();
  if (toolbarContainer) toolbarContainer.remove();
  toolbarRoot = null;
  toolbarContainer = null;
  currentSelection = null;
};

const handleAction = (type, options = {}) => {
  return new Promise((resolve, reject) => {
    const text = currentSelection.toString();
    const timeoutDuration = (type === 'REWRITE' || type === 'PROOFREAD') ? 120000 : 30000;
    const timeout = setTimeout(() => {
      reject(new Error("AI model timed out."));
    }, timeoutDuration);

    chrome.runtime.sendMessage({ type, text, options }, (response) => {
      clearTimeout(timeout); 
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      if (response && response.data) {
        const range = currentSelection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(response.data));
        resolve();
      } else {
        reject(new Error(response?.error || "An unknown error occurred."));
      }
      removeToolbar();
    });
  });
};


document.addEventListener('mouseup', () => {
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.toString().trim() && !toolbarContainer) {
      currentSelection = selection;
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      toolbarContainer = document.createElement('div');
      document.body.appendChild(toolbarContainer);
      
      toolbarContainer.style.position = 'absolute';
      toolbarContainer.style.top = `${window.scrollY + rect.top - 40}px`;
      toolbarContainer.style.left = `${window.scrollX + rect.left}px`;
      
      toolbarRoot = createRoot(toolbarContainer);
      toolbarRoot.render(<Toolbar onActionClick={handleAction} />);
    }
  }, 10);
});

document.addEventListener('mousedown', (event) => {
  if (toolbarContainer && !toolbarContainer.contains(event.target)) {
    removeToolbar();
  }
});