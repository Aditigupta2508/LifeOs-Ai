'use client';

import React, { useState } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setErrorMessage(null);
    setIsLoading(true);

    // Update UI immediately with the user's message
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);

    try {
      // Line 22 Fix: Using relative endpoint path to completely prevent 'Failed to Fetch'
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json().catch(() => null);

      // Handle server status errors (400, 500, etc.) cleanly without crashing
      if (!response.ok) {
        throw new Error(data?.error || `Server returned error status: ${response.status}`);
      }

      if (data && data.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: data.reply }]);
      } else {
        throw new Error("Received an empty or unexpected payload response format.");
      }

    } catch (err: any) {
      console.error("Frontend Handling Catch:", err);
      setErrorMessage(err.message || "An unexpected error occurred while communicating with the assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 justify-between bg-neutral-900 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 pb-2 mb-4">
        <h1 className="text-xl font-bold">LifeOS Assistant</h1>
      </header>

      {/* Chat Display Logs */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-2 custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-sm text-neutral-400 animate-pulse">Assistant is thinking...</div>}
        {errorMessage && <div className="text-sm text-red-400 bg-red-950/40 border border-red-900/50 p-3 rounded-lg">{errorMessage}</div>}
      </div>

      {/* Input Formulation Form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 text-white font-medium rounded-lg text-sm transition-colors"
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}