import React, { useState } from 'react';
import { OptimizationSummary } from '../types/types';

interface AiAssistantProps {
  summary: OptimizationSummary | null;
}

function getAiResponse(message: string, summary: OptimizationSummary | null): string {
  const text = message.toLowerCase();
  if (!summary) {
    return 'Please run an optimization first so I can analyze the results.';
  }
  if (text.includes('summary') || text.includes('stats')) {
    return `Total sheets: ${summary.totalSheets}, produced: ${summary.totalProduced}, waste: ${summary.wastePercentage.toFixed(1)}%.`;
  }
  if (text.includes('reduce') && text.includes('waste')) {
    return summary.wastePercentage < 5
      ? 'Great job! Your waste is already quite low.'
      : 'Consider trying different UPS values or adjusting plate count to reduce waste.';
  }
  return "I'm here to answer questions about your optimization results. Try asking about the summary or how to reduce waste.";
}

const AiAssistant: React.FC<AiAssistantProps> = ({ summary }) => {
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'ai'; text: string }>>([
    { from: 'ai', text: "Hello! I'm your optimization assistant. Ask me about your results!" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const response = getAiResponse(text, summary);
    setMessages(prev => [...prev, { from: 'user', text }, { from: 'ai', text: response }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="max-h-60 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-md shadow-sm w-fit fade-in-up ${
              msg.from === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
          placeholder="Ask me about your results..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
