import React, { useState, useEffect, useRef } from "react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Hostel AI Guide. I can help you find available rooms or answer questions about our facilities. How can I help you today?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference for auto-scrolling
  const scrollRef = useRef(null);

  // Auto-scroll to bottom whenever messages change
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
        // Sending history (last 6 messages) so AI has memory
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
          className="bg-indigo-600 text-white w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center text-3xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <span className="animate-bounce-short">💬</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[380px] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col h-[550px] overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* Professional Header */}
          <div className="bg-indigo-600 px-5 py-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-md">
                🤖
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Hostel AI Guide</h3>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-indigo-100 text-[10px] uppercase font-bold tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={clearChat} title="Clear Chat" className="text-indigo-200 hover:text-white transition-colors p-1">
                    🧹
                </button>
                <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors p-1 text-lg">
                    ✕
                </button>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 p-5 overflow-y-auto bg-[#F8FAFC] space-y-6 scroll-smooth"
          >
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`relative max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user" 
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100" 
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                }`}>
                  <span className="whitespace-pre-wrap">{msg.text}</span>
                  <div className={`absolute bottom-[-18px] text-[10px] text-slate-400 font-medium ${msg.sender === "user" ? "right-0" : "left-0"}`}>
                    {msg.sender === "user" ? "You" : "Assistant"}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={sendMessage} className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-2xl p-1 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-slate-700"
                disabled={isLoading}
                />
                <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-40 transition-all flex items-center justify-center shadow-md shadow-indigo-200"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
                </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                Powered by Gemini AI • Hostel Management System
            </p>
          </div>
        </div>
      )}
    </div>
  );
}