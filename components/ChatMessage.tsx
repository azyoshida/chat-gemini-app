import React, { useState } from 'react';
import { Sender, type Message } from '../types';
import { UserIcon, GeminiIcon, CopyIcon, CheckIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);

const parseMarkdown = (text: string) => {
    let html = text;

    // Process in order of complexity to avoid conflicts
    // Code blocks first
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
        const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<pre class="bg-black/30 p-3 rounded-md my-2 text-sm"><code class="language-${lang}">${escapedCode}</code></pre>`;
    });

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italics
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-600/50 rounded px-1.5 py-0.5 text-sm font-mono">$1</code>');
    
    return html;
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied || !message.text) return;

    navigator.clipboard.writeText(message.text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const isUser = message.sender === Sender.USER;
  const isGeminiLoading = message.sender === Sender.GEMINI && !message.text;

  const containerClasses = `flex items-start gap-3 my-4 animate-fade-in ${isUser ? 'justify-end' : ''}`;
  const bubbleClasses = `relative group max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl shadow-lg ${
    isUser
      ? 'bg-violet-600 text-white rounded-br-none'
      : 'bg-slate-700 text-slate-200 rounded-bl-none'
  }`;
  const textClasses = "whitespace-pre-wrap prose prose-invert prose-sm max-w-none prose-p:my-2 first:prose-p:mt-0 last:prose-p:mb-0 prose-strong:text-white";

  const Icon = isUser ? UserIcon : GeminiIcon;

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 shadow-sm">
            <Icon className="w-5 h-5 text-violet-400" />
        </div>
      )}
      <div className={bubbleClasses}>
        {isGeminiLoading ? (
            <TypingIndicator />
        ) : (
            <div className={textClasses} dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }} />
        )}
        
        {!isUser && !isGeminiLoading && message.text && (
            <div className="absolute top-0 right-0 mt-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={handleCopy}
                    className="relative p-1.5 bg-slate-800/70 border border-slate-600/50 hover:bg-slate-600 rounded-lg text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    aria-label={isCopied ? "Copied to clipboard" : "Copy message"}
                    >
                    {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    
                    <span className={`absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-slate-900 border border-slate-700 rounded-md shadow-lg transition-all duration-200 ${isCopied ? 'opacity-100' : 'opacity-0 scale-90'} pointer-events-none`}>
                        Copied!
                    </span>
                </button>
            </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 shadow-sm">
             <Icon className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
};
