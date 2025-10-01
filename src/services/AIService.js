// /src/services/AIService.js (Corrected Logic)

export const aiService = {
  async proofread(text) {
    console.log("AIService: proofread function called.");
    if (!('Proofreader' in self)) {
      console.error("Proofreader API not supported.");
      return text;
    }

    try {
      console.log("AIService: Checking Proofreader availability...");
      const availability = await Proofreader.availability();
      console.log("AIService: Proofreader availability is:", availability);

      // THE FIX: Only stop if it's truly "unavailable"
      if (availability === 'unavailable') {
        console.error("Proofreader model is unavailable on this device.");
        return text;
      }

      console.log("AIService: Creating Proofreader session (may trigger download)...");
      const proofreader = await Proofreader.create();
      console.log("AIService: Proofreader session created. Starting proofread...");
      
      const result = await proofreader.proofread(text);
      console.log("AIService: Proofreading complete.");
      
      return result.corrected;
    } catch (error) {
      console.error("Proofreading failed:", error);
      return text;
    }
  },

  async rewrite(text, { tone, length }) {
    console.log("AIService: rewrite function called.");
    if (!('Rewriter' in self)) {
      console.error("Rewriter API not supported.");
      return text;
    }
    try {
      console.log("AIService: Checking Rewriter availability...");
      const availability = await Rewriter.availability();
      console.log("AIService: Rewriter availability is:", availability);

      // THE FIX: Only stop if it's truly "unavailable"
      if (availability === 'unavailable') {
        console.error("Rewriter model is unavailable on this device.");
        return text;
      }

      console.log("AIService: Creating Rewriter session (may trigger download)...");
      const rewriter = await Rewriter.create({ tone, length });
      console.log("AIService: Rewriter session created. Starting rewrite...");

      const result = await rewriter.rewrite(text);
      console.log("AIService: Rewriting complete.");
      
      return result;
    } catch (error) {
      console.error("Rewriting failed:", error);
      return text;
    }
  },

  // (We'll update the translate function as well for consistency)
  async translate(text, targetLanguage) {
    console.log("AIService: translate function called.");
    if (!('Translator' in self)) {
      console.error("Translator API not supported.");
      return text;
    }
    try {
      const sourceLanguage = 'en';
      const availability = await Translator.availability({ sourceLanguage, targetLanguage });

      // THE FIX: Only stop if it's truly "unavailable"
      if (availability === 'unavailable') {
          console.error(`Translator for ${sourceLanguage} -> ${targetLanguage} is not available.`);
          return text;
      }

      const translator = await Translator.create({ sourceLanguage, targetLanguage });
      const result = await translator.translate(text);
      return result;

    } catch (error) {
      console.error("Translation failed:", error);
      return text;
    }
  },
};