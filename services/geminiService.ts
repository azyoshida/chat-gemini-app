import { GoogleGenAI, Chat } from "@google/genai";

// The API key is sourced from the environment variable `process.env.API_KEY`.
// This is a hard requirement. The app assumes this is pre-configured.

// Singleton instance of the GoogleGenAI client.
let ai: GoogleGenAI;

/**
 * Initializes and returns the GoogleGenAI client instance,
 * ensuring it's a singleton.
 * Throws an error if the API key is not properly configured in the environment.
 */
function getAiClient(): GoogleGenAI {
  if (!ai) {
    // The apiKey is provided by the environment.
    // The app will fail to initialize if `process.env.API_KEY` is not set.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export function createChatSession(): Chat {
  const client = getAiClient();
  const chat = client.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are a helpful and friendly AI assistant named Gemini. Format your responses using markdown where appropriate for readability.'
    }
  });
  return chat;
}
