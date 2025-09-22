// This service now acts as a client to our Google Apps Script proxy.
// It no longer uses the @google/genai SDK directly in the browser.

/**
 * The URL of the deployed Google Apps Script web app.
 * 
 * IMPORTANT: Replace this with your own deployed script URL.
 * To get this URL:
 * 1. Open your Google Apps Script project.
 * 2. Click "Deploy" > "Manage deployments".
 * 3. Select your active deployment and copy the "Web app" URL.
 */
const GAS_PROXY_URL = "https://script.google.com/macros/s/AKfycbwD9oFg6W8u6RQ1Wpes9chs0MyUMNK593hHNDKgstfhYsXDicMzTtm82P9RMNvftra7/exec"; // <-- REPLACE WITH YOUR URL

/**
 * A simplified, client-side representation of the chat session.
 * We are not using the official Chat object from the SDK anymore.
 */
export interface ClientChatSession {
  model: string;
  history: { role: 'user' | 'model'; parts: { text: string }[] }[];
  sendMessage: (message: string) => Promise<string>;
}

/**
 * Creates a new chat session object that interacts with our GAS proxy.
 * @param model The Gemini model to use (e.g., 'gemini-2.5-flash').
 * @returns A ClientChatSession object.
 */
export function createChatSession(model: string): ClientChatSession {
  
  if (GAS_PROXY_URL.includes("AKfycbwD9oFg6W8u6RQ1Wpes9chs0MyUMNK593hHNDKgstfhYsXDicMzTtm82P9RMNvftra7")) {
    throw new Error("Please replace 'YOUR_DEPLOYMENT_ID' in `services/geminiService.ts` with your actual Google Apps Script deployment URL.");
  }

  const session: ClientChatSession = {
    model: model,
    history: [],
    
    /**
     * Sends a message to the Gemini model via the GAS proxy.
     * This is a non-streaming implementation.
     * @param message The user's message.
     * @returns A promise that resolves with the model's complete text response.
     */
    async sendMessage(message: string): Promise<string> {
      // Add the user message to the history
      this.history.push({ role: 'user', parts: [{ text: message }] });

      const payload = {
        model: this.model,
        // The Gemini API expects the full conversation history.
        contents: this.history, 
      };

      const response = await fetch(GAS_PROXY_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // GAS requirement for doPost with JSON
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: "An unknown error occurred on the server." } }));
        throw new Error(errorData.error.message || `Request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();

      // Extract the text content from the Gemini API response structure
      const modelResponseText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (typeof modelResponseText !== 'string') {
        // This could happen if the model returns no content or a safety block
        console.error("Unexpected response structure:", responseData);
        throw new Error("Received an invalid or empty response from the model.");
      }

      // Add the model's response to our history for the next turn
      this.history.push({ role: 'model', parts: [{ text: modelResponseText }] });

      return modelResponseText;
    },
  };

  return session;
}
