// src/background.js
import { aiService } from './services/AIService.js';

/**
 * A helper function to process large text in chunks.
 * @param {string} text The full text to process.
 * @param {Function} actionFn The AI service function to call for each chunk.
 * @param {object} options The options for the AI function.
 * @returns {Promise<string>} The fully processed text.
 */
async function processInChunks(text, actionFn, options) {
  // Split the text into paragraphs
  const chunks = text.split(/\n\s*\n/);
  const processedChunks = [];

  for (const chunk of chunks) {
    if (chunk.trim().length > 0) {
      // Call the AI function (e.g., aiService.rewrite) on each chunk
      const processedChunk = await actionFn(chunk, options);
      processedChunks.push(processedChunk);
    }
  }

  // Join the processed paragraphs back together
  return processedChunks.join('\n\n');
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "PROOFREAD":
      aiService.proofread(request.text)
        .then(data => sendResponse({ data }))
        .catch(error => sendResponse({ error: error.message }));
      break;
    
    case "REWRITE":
      // Now we use our new chunking helper for the rewrite action
      processInChunks(request.text, (chunk, opts) => aiService.rewrite(chunk, opts), request.options)
        .then(data => sendResponse({ data }))
        .catch(error => sendResponse({ error: error.message }));
      break;

    case "TRANSLATE":
      // Translation is fast, so we don't need to chunk it for now
      aiService.translate(request.text, request.options.targetLanguage)
        .then(data => sendResponse({ data }))
        .catch(error => sendResponse({ error: error.message }));
      break;
    
    default:
      sendResponse({ error: `Unknown request type: ${request.type}` });
      break;
  }
  return true; 
});     