import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Bot, User } from 'lucide-react';

export default function ConversationTranscript({ conversation }) {
  const containerRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.message-item');
    if (items) {
      gsap.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.3, ease: 'power2.out' });
    }
  }, [conversation.length]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div ref={containerRef} className="bg-[#111B17] border border-[#68756E]/20 rounded-xl p-5 flex flex-col h-full max-h-[400px] overflow-y-auto">
      {conversation.map((msg, idx) => (
        <div key={idx} className="message-item mb-4 last:mb-0">
          <div className="flex items-center gap-2 mb-1">
            {msg.role === 'assistant' ? (
              <Bot size={14} className="text-[#C5A46D]" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#315C4B] flex items-center justify-center text-[11px] font-semibold text-[#F4F1E8]">RM</div>
            )}
            <span className="text-[12px] font-semibold text-[#F4F1E8]">
              {msg.role === 'assistant' ? 'WHITE COLLAR AI' : 'RAHUL MEHTA'}
            </span>
            <span className="text-[11px] text-[#68756E]">{formatTime(msg.timestamp)}</span>
          </div>
          <p className="text-[13px] text-[#A9B3AD] pl-8">{msg.content}</p>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
