import React from 'react';
import { Sender, type Message } from '../types';
import { UserIcon, GeminiIcon } from './Icons';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.sender === Sender.USER;

  const containerClasses = `flex items-start gap-3 my-4 animate-fade-in ${isUser ? 'justify-end' : ''}`;
  const bubbleClasses = `max-w-lg lg:max-w-2xl px-4 py-3 rounded-2xl ${
    isUser
      ? 'bg-violet-600 text-white rounded-br-none'
      : 'bg-slate-700 text-slate-200 rounded-bl-none'
  }`;
  const textClasses = "whitespace-pre-wrap prose prose-invert prose-sm leading-relaxed";

  const Icon = isUser ? UserIcon : GeminiIcon;

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <Icon className="w-5 h-5 text-violet-400" />
        </div>
      )}
      <div className={bubbleClasses}>
        {isLoading && !message.text ? (
            <TypingIndicator />
        ) : (
            <div className={textClasses} dangerouslySetInnerHTML={{ __html: message.text.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>').replace(/`([^`]+)`/g, '<code>$1</code>') }} />
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
             <Icon className="w-5 h-5 text-slate-300" />
        </div>
      )}
    </div>
  );
};
