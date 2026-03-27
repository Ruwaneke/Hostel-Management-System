import React, { useState, useEffect, useRef } from "react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Hostel AI Guide. I can help you find available rooms or answer questions about our rules and facilities. How can I help?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5025/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: userMsg, 
            history: messages.slice(-6) 
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { text: "I'm having trouble connecting to the server. Please check if the backend is running.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if(window.confirm("Clear conversation history?")) {
        setMessages([{ text: "Conversation cleared. How can I help you now?", sender: "ai" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95"
          aria-label="Open chat"
        >
          <span className="absolute -inset-1 rounded-full bg-blue-500 opacity-30 animate-ping-slow" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7 z-10 stroke-white">
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6M21 12c0 4.418-4.03 8-9 8a9.62 9.62 0 01-4-.84L3 20l1.06-3.94A8.5 8.5 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[380px] rounded-3xl shadow-2xl border border-slate-200 flex flex-col h-[550px] overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 px-5 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-md border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path d="M12 2a2 2 0 00-2 2v1H8a2 2 0 00-2 2v2H4v6h2v2a2 2 0 002 2h6a2 2 0 002-2v-2h2v-6h-2V7a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zM9 9h6v2H9V9zm0 4h6v2H9v-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-extrabold text-sm tracking-wide">Hostel AI Guide</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    <span className="text-blue-100 text-[10px] uppercase font-bold tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={clearChat} title="Clear Chat" className="text-blue-200 hover:text-white transition-colors p-1">
                    🧹
                </button>
                <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white transition-colors p-1 text-lg font-bold">
                    ✕
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 p-5 overflow-y-auto bg-slate-50 space-y-6 custom-scrollbar"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`relative max-w-[85%] p-4 text-sm font-medium leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm" 
                    : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm shadow-sm"
                }`}>
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                  <div className={`absolute bottom-[-18px] text-[9px] text-slate-400 font-bold uppercase tracking-wider ${msg.sender === "user" ? "right-0" : "left-0"}`}>
                    {msg.sender === "user" ? "You" : "AI Assistant"}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={sendMessage} className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-2xl p-1.5 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all flex items-center justify-center shadow-sm"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
                </button>
            </form>
            <p className="text-center text-[9px] text-slate-400 mt-3 font-bold uppercase tracking-widest">
                Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </div>
  );
}