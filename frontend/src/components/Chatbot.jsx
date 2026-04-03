import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi! Ask me about rooms, laundry, or pricing 😊' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    
    // Add user message
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true); // Show typing animation

    try {
<<<<<<< HEAD
      const res = await axios.post('http://localhost:5000/api/chatbot/query', { message: input });
      const botMsg = { 
        sender: 'bot', 
        text: res.data.reply, 
        suggestions: res.data.suggestions 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! Error connecting to server.' }]);
=======
      const res = await axios.post('http://localhost:5025/api/chatbot/query', { message: text });
      
      // Simulate a slight human delay for a premium feel
      setTimeout(() => {
        const botMsg = {
          sender: 'bot',
          text: res.data.reply || 'Sorry, I could not answer that.',
          suggestions: res.data.suggestions || []
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 600);

    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Oops, server unavailable. Try later.' }]);
>>>>>>> e1726312aaa1d24fbc262fce9c43a46301170b26
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      
      {/* 💎 UPDATED: PROFESSIONAL FLOATING ACTION BUTTON 💎 */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="relative group w-16 h-16 bg-gradient-to-tr from-brand-navy to-blue-600 text-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-95 z-50"
      >
        {/* Subtle continuous glow ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full border-[1.5px] border-blue-400 animate-ping opacity-40" />
        )}
        
        {/* Icon Container with Rotation/Scale Animation */}
        <div className="relative w-7 h-7">
          
          {/* Chat Bubble Icon (Visible when closed) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={1.8} stroke="currentColor" 
            className={`absolute inset-0 w-7 h-7 transition-all duration-300 transform origin-center ${
              isOpen ? 'opacity-0 scale-50 -rotate-90' : 'opacity-100 scale-100 rotate-0'
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>

          {/* Close 'X' Icon (Visible when open) */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" viewBox="0 0 24 24" 
            strokeWidth={2.5} stroke="currentColor" 
            className={`absolute inset-0 w-7 h-7 transition-all duration-300 transform origin-center ${
              isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-slate-50 rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-300 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-navy to-blue-900 p-5 text-white flex items-center justify-between shadow-md relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl border border-white/20">🤖</div>
              <div>
                <div className="text-sm font-black tracking-wide">Hostel Assistant</div>
                <div className="text-[10px] text-blue-200 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Online
                </div>
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${m.sender === 'user' ? 'bg-brand-navy text-white rounded-tr-sm' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-sm'}`}>
                  
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>

                  {/* Suggestion Links (Rooms) */}
                  {m.suggestions?.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2">
                      {m.suggestions.map((s, idx) => (
                        <button
                          key={`${s.id || idx}`}
                          onClick={() => { setIsOpen(false); navigate(s.link); }}
                          className="w-full text-left bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-md flex items-center justify-between"
                        >
                          <span>{s.text}</span>
                          <span>→</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-3 relative z-10">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Ask about rooms or laundry..."
              className="flex-1 bg-slate-100 border-none rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-navy/30 transition-all text-slate-700 font-medium"
              disabled={isTyping}
            />
            <button 
              onClick={handleSend} 
              disabled={isTyping || !input.trim()}
              className="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}