import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { createChatSession } from './services/geminiService';
import { Sender, type Message } from './types';
import { GeminiIcon, ClearIcon } from './components/Icons';

const INITIAL_MESSAGE: Message = {
    id: crypto.randomUUID(),
    sender: Sender.GEMINI,
    text: "Hello! I'm Gemini. How can I help you today?",
};

function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const chatSession = createChatSession();
      setChat(chatSession);
    } catch (e: any) {
      setError(e.message || "Failed to initialize Gemini Chat. Please check your API key.");
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!chat) {
      setError("Chat session is not initialized. Please check your API key and refresh.");
      return;
    }
    if (isLoading || !userInput.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: Sender.USER,
      text: userInput,
    };

    const geminiMessageId = crypto.randomUUID();
    const geminiMessagePlaceholder: Message = {
        id: geminiMessageId,
        sender: Sender.GEMINI,
        text: '',
    };
    
    setMessages(prev => [...prev, userMessage, geminiMessagePlaceholder]);
    
    try {
      const stream = await chat.sendMessageStream({ message: userInput });

      let accumulatedText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        accumulatedText += chunkText;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === geminiMessageId ? { ...msg, text: accumulatedText } : msg
          )
        );
      }
    } catch (e: any) {
      const errorMessage = e.message || "An error occurred while fetching the response.";
      setError(errorMessage);
      setMessages(prev => prev.filter(msg => msg.id !== geminiMessageId && msg.id !== userMessage.id)); 
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history? This action cannot be undone.")) {
      try {
        setIsLoading(true);
        setError(null);
        setMessages([INITIAL_MESSAGE]);
        const newChatSession = createChatSession();
        setChat(newChatSession);
      } catch (e: any) {
        setError(e.message || "Failed to restart chat session.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 border-b border-slate-700 shadow-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GeminiIcon className="w-8 h-8 text-violet-400" />
            <h1 className="text-xl font-bold text-slate-100">Gemini Chat</h1>
          </div>
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            aria-label="Clear chat history"
            disabled={isLoading || messages.length <= 1}
          >
            <ClearIcon className="w-4 h-4" />
            <span>Clear Chat</span>
          </button>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </main>

      <footer className="p-4 bg-slate-800/70 border-t border-slate-700 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          {error && <p className="text-red-400 text-sm mb-2 text-center">{error}</p>}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          <p className="text-xs text-slate-500 mt-2 text-center">
            This is a web application for demonstration purposes. Your conversations may be reviewed.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
