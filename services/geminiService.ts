// --------------------------------------------------------------------------
// Google Apps Script (GAS) Proxy Configuration
// --------------------------------------------------------------------------
// This application uses a Google Apps Script project as a secure proxy to 
// communicate with the Gemini API. This avoids exposing your API key in the
// client-side code.
//
// Please follow these steps carefully to set up your proxy:
//
// 1. **Get a Gemini API Key:**
//    - Visit https://makersuite.google.com/ and create your API key.
//
// 2. **Create a Google Apps Script Project:**
//    - Go to https://script.google.com/ and start a new project.
//
// 3. **Set the API Key in Script Properties:**
//    - In your new script project, click the "Project Settings" (gear) icon.
//    - Scroll down to "Script Properties" and click "Add script property".
//    - For "Property", enter `API_KEY`.
//    - For "Value", paste your Gemini API key.
//    - Click "Save script properties".
//
// 4. **Paste the Proxy Code:**
//    - Go back to the "Editor" (code icon).
//    - Delete any existing code in the `Code.gs` file.
//    - Copy and paste the entire `doPost` function from the block below into `Code.gs`.
/*
function doPost(e) {
  const API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    const requestBody = JSON.parse(e.postData.contents);
    
    const geminiRequestOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(requestBody)
    };

    const response = UrlFetchApp.fetch(API_URL, geminiRequestOptions);
    const responseBody = JSON.parse(response.getContentText());

    // Extract the text from Gemini's response
    const geminiText = responseBody.candidates[0].content.parts[0].text;

    const output = JSON.stringify({ text: geminiText });

    return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    const errorResponse = JSON.stringify({ 
      error: { 
        message: error.message,
        details: error.stack
      } 
    });
    return ContentService.createTextOutput(errorResponse)
      .setMimeType(ContentService.MimeType.JSON);
  }
}
*/
//
// 5. **Deploy as a Web App:**
//    - Click the "Deploy" button and select "New deployment".
//    - For "Select type", choose "Web app" (click the gear icon).
//    - In the configuration:
//      - Description: (Optional) "Gemini Chat Proxy"
//      - Execute as: "Me"
//      - Who has access: "Anyone"
//    - Click "Deploy".
//
// 6. **Authorize and Get URL:**
//    - Google will ask for authorization. Grant the necessary permissions.
//    - After deploying, a "Web app" URL will be provided. Copy this URL.
//
// 7. **Set the URL Below:**
//    - Paste the copied Web app URL into the `GAS_PROXY_URL` constant below.
// --------------------------------------------------------------------------

const GAS_PROXY_URL = 'https://script.google.com/macros/s/AKfycbwD9oFg6W8u6RQ1Wpes9chs0MyUMNK593hHNDKgstfhYsXDicMzTtm82P9RMNvftra7/exec';

// Type definition for the content structure expected by the Gemini API via our proxy.
interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Defines the structure of our client-side chat session object.
export interface ClientChatSession {
  model: string;
  history: GeminiContent[];
  sendMessage: (message: string) => Promise<string>;
}

/**
 * Creates a new client-side chat session object that communicates with the GAS proxy.
 * @param model The Gemini model to use (e.g., 'gemini-2.5-flash').
 * @returns A ClientChatSession object for managing the conversation.
 */
export function createChatSession(model: string): ClientChatSession {
  if (GAS_PROXY_URL === 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
    throw new Error(
      "Google Apps Script proxy URL is not configured. Please follow the setup instructions in `services/geminiService.ts`."
    );
  }

  const session: ClientChatSession = {
    model: model, // Note: The provided GAS script uses 'gemini-pro'. Modify if needed.
    history: [],

    async sendMessage(message: string): Promise<string> {
      // Add the new user message to the history for the current request
      const currentHistory = [...this.history, { role: 'user', parts: [{ text: message }] }];

      const response = await fetch(GAS_PROXY_URL, {
        method: 'POST',
        headers: {
          // The 'Content-Type' header is not strictly needed for GAS's UrlFetchApp,
          // but it's good practice. We send as plain text and parse it in the script.
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          // The GAS proxy expects the contents in this specific format
          contents: currentHistory,
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("GAS Proxy Error:", errorDetails);
        throw new Error(`Request failed: ${response.statusText} (Status: ${response.status})`);
      }

      const data = await response.json();

      if (data.error) {
        console.error("Error from Gemini API via proxy:", data.error);
        throw new Error(`API Error: ${data.error.message}`);
      }

      const geminiText = data.text;
      if (typeof geminiText !== 'string') {
        throw new Error('Invalid response format received from the proxy.');
      }
      
      // Update the session history with both the user's message and Gemini's response
      this.history.push({ role: 'user', parts: [{ text: message }] });
      this.history.push({ role: 'model', parts: [{ text: geminiText }] });

      return geminiText;
    },
  };

  return session;
}