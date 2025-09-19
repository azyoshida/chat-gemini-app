import { GoogleGenAI, Chat } from "@google/genai";

// ====================================================================
// 重要: "YOUR_API_KEY_HERE" をあなたの実際のGemini APIキーに置き換えてください。
// https://aistudio.google.com/app/apikey から取得できます。
// ====================================================================
const apiKey = "YOUR_API_KEY_HERE";


if (apiKey === "YOUR_API_KEY_HERE") {
  // このエラーは、APIキーが設定されていないことを示します。
  // アプリケーションを動作させるには、上記のapiKey変数を設定してください。
  throw new Error("APIキーが設定されていません。services/geminiService.tsファイルで 'YOUR_API_KEY_HERE' を実際のAPIキーに置き換えてください。");
}

const ai = new GoogleGenAI({ apiKey });

export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: 'You are a helpful and friendly AI assistant named Gemini. Format your responses using markdown where appropriate for readability.'
    }
  });
  return chat;
}