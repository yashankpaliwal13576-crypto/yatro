
import React, { useState, useRef, useEffect } from 'react';
import { getAI, speakText } from '../lib/gemini';
import { GenerateContentResponse } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; thinking?: string }[]>([
    { role: 'ai', text: 'Namaste! I am Yatro, your personal travel assistant. How can I help you plan your dream trip today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleInsight = (e: any) => {
      const context = e.detail;
      setIsOpen(true);
      if (context) {
        handleSend(context);
      }
    };
    window.addEventListener('trigger-ai-insight', handleInsight);
    return () => window.removeEventListener('trigger-ai-insight', handleInsight);
  }, []);

  const handleSend = async (forcedMsg?: string) => {
    const userMsg = forcedMsg || input;
    if (!userMsg.trim() || isLoading) return;
    
    if (!forcedMsg) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    // Initialize an empty AI message for streaming
    setMessages(prev => [...prev, { role: 'ai', text: '' }]);

    try {
      const ai = getAI();
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview', // Switched to Flash for high-speed response
        config: {
          systemInstruction: 'You are Yatro, a travel expert for Yatrojana. Help users plan budget-friendly, authentic trips in India. Be concise, friendly, and professional.',
        }
      });

      const resultStream = await chat.sendMessageStream({ message: userMsg });
      
      let fullText = '';
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        const partText = c.text || '';
        fullText += partText;
        
        // Update the last message in state with the cumulative text
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'ai', text: fullText };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'ai', text: 'I am having trouble connecting right now. Please try again later.' };
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-inter">
      {isOpen ? (
        <div className="glass-card w-80 md:w-96 h-[500px] rounded-3xl flex flex-col shadow-2xl border-purple-500/30 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-purple-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✨</div>
              <span className="font-bold text-white">Yatro Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 p-1 rounded">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  {m.text || (isLoading && i === messages.length - 1 ? '...' : '')}
                </div>
                {m.role === 'ai' && m.text && (
                  <button 
                    onClick={() => speakText(m.text)}
                    className="mt-1 text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    🔊 Listen
                  </button>
                )}
              </div>
            ))}
            {isLoading && !messages[messages.length - 1].text && (
              <div className="flex items-center gap-2 text-purple-400 text-xs animate-pulse italic">
                <span>Yatro is typing...</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Yatro anything..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={() => handleSend()}
                className="bg-purple-600 p-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] hover:scale-110 transition-transform cursor-pointer"
        >
          <span className="text-2xl">✨</span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
