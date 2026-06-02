
import React from 'react';

interface ChatBubbleProps {
  message: string;
  isBot?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isBot = true }) => {
  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-6 animate-fade-in`}>
      <div 
        className={`max-w-[90%] p-5 rounded-3xl shadow-sm text-lg md:text-xl font-medium leading-relaxed ${
          isBot 
            ? 'bg-white text-[#4e342e] rounded-tl-none border border-[#4e342e]/10' 
            : 'bg-[#4e342e] text-[#f3e5d8] rounded-tr-none shadow-md'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
