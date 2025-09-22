import React, { useState, useEffect, useRef } from 'react';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { createChatSession, type ClientChatSession } from './services/geminiService';
import { Sender, type Message } from './types';
import { GeminiIcon, ClearIcon } from './components/Icons';

const INITIAL_MESSAGE: Message = {
    id: crypto.randomUUID(),
    sender: Sender.GEMINI,
    text: "Hello! I'm Gemini. How can I help you today?",
};

const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  // Note: 'gemini-1.5-pro' might have different availability or pricing.
  // Using 'gemini-2.5-flash' is recommended for general use cases.
  // { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }, 
];

function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chat, setChat] = useState<ClientChatSession | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(AVAILABLE_MODELS[0].id);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);
      setMessages([INITIAL_MESSAGE]);
      const chatSession = createChatSession(selectedModel);
      setChat(chatSession);
    } catch (e: any) {
      setError(e.message || "Failed to initialize Gemini Chat. Please check your configuration.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    if (!chat) {
      setError("Chat session is not initialized. Please refresh the page.");
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
    
    // Add user message and a temporary loading message for Gemini
    const geminiMessageId = crypto.randomUUID();
    setMessages(prev => [
        ...prev, 
        userMessage, 
        { id: geminiMessageId, sender: Sender.GEMINI, text: '' }
    ]);
    
    try {
      // Call the new non-streaming sendMessage method
      const geminiResponseText = await chat.sendMessage(userInput);
      
      // Update the placeholder with the final response
      setMessages(prev =>
        prev.map(msg =>
          msg.id === geminiMessageId ? { ...msg, text: geminiResponseText } : msg
        )
      );

    } catch (e: any) {
      const errorMessage = e.message || "An error occurred while fetching the response.";
      setError(errorMessage);
      // Remove the user message and the Gemini placeholder on error
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
        // Re-create the chat session to clear its history on the client
        const newChatSession = createChatSession(selectedModel);
        setChat(newChatSession);
      } catch (e: any) {
        setError(e.message || "Failed to restart chat session.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModelChange = (newModelId: string) => {
    if (isLoading || newModelId === selectedModel) return;

    if (messages.length > 1) {
      const userConfirmed = window.confirm(
        "Changing the model will clear the current chat history. Do you want to continue?"
      );
      if (userConfirmed) {
        setSelectedModel(newModelId);
      }
    } else {
      setSelectedModel(newModelId);
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
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                id="model-selector"
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                disabled={isLoading}
                className="appearance-none w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                aria-label="Select a Gemini model"
              >
                {AVAILABLE_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
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
        </div>
      </footer>
    </div>
  );
}

export default App;
