import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! Ask me about rooms or laundry prices! 😊' }]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5025/api/chatbot/query', { message: input });
      const botMsg = { 
        sender: 'bot', 
        text: res.data.reply, 
        suggestions: res.data.suggestions 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! Error connecting to server.' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-16 h-16 bg-brand-navy text-white rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform">
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-brand-navy p-4 text-white font-black flex items-center gap-2">
             <span>🤖</span> Hostel Assistant
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === 'user' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                  <p className="whitespace-pre-line">{m.text}</p>
                  
                  {/* Action Buttons for Rooms */}
                  {m.suggestions && (
                    <div className="mt-3 space-y-2">
                      {m.suggestions.map(s => (
                        <button key={s.id} onClick={() => navigate(s.link)} className="w-full text-left bg-blue-50 text-blue-700 p-2 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                          🔗 {s.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type here..." className="flex-1 p-2 bg-slate-100 rounded-xl outline-none text-sm" />
            <button onClick={handleSend} className="bg-brand-navy text-white px-4 py-2 rounded-xl font-bold text-sm">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}