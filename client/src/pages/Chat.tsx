import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', { message: input });
      setMessages((msgs) => [...msgs, { sender: 'ai', text: res.data.reply }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
    }
    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[80vh] card p-6">
      <h1 className="text-2xl font-bold text-white mb-4">AI Chatbot</h1>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex space-x-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Ask me anything about DSA..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat; 