import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { createChatSession } from './services/geminiService';
import { Sender, type Message } from './types';
import { GeminiIcon } from './components/Icons';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
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
      setError("Chat session is not initialized.");
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

      for await (const chunk of stream) {
        const chunkText = chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === geminiMessageId ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      }
    } catch (e: any) {
      const errorMessage = e.message || "An error occurred while fetching the response.";
      setError(errorMessage);
      setMessages(prev => prev.slice(0, -1)); // Remove placeholder
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 border-b border-slate-700 shadow-lg bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center space-x-3">
          <GeminiIcon className="w-8 h-8 text-violet-400" />
          <h1 className="text-xl font-bold text-slate-100">Gemini Chat</h1>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && messages[messages.length - 1]?.sender === Sender.GEMINI && (
             <ChatMessage key="loading" message={{ id: 'loading', sender: Sender.GEMINI, text: ''}} isLoading={true} />
          )}
        </div>
      </main>

      <footer className="p-4 bg-slate-800/70 border-t border-slate-700">
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
