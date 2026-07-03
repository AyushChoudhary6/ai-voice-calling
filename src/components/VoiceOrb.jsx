import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function VoiceOrb({ state, interimTranscript }) {
  const orbRef = useRef(null);
  const outerRef = useRef(null);
  const middleRef = useRef(null);
  const coreRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (tlRef.current) tlRef.current.kill();
    const tl = gsap.timeline({ repeat: -1 });
    tlRef.current = tl;

    switch (state) {
      case 'AI_SPEAKING':
        tl.to(coreRef.current, { scale: 1.15, duration: 0.8, ease: 'sine.inOut' })
          .to(coreRef.current, { scale: 1, duration: 0.8, ease: 'sine.inOut' });
        break;
      case 'LISTENING':
        tl.to(outerRef.current, { scale: 1.3, opacity: 0.5, duration: 0.5, ease: 'sine.inOut' })
          .to(middleRef.current, { scale: 1.2, opacity: 0.7, duration: 0.5, ease: 'sine.inOut' }, '-=0.4')
          .to(outerRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'sine.inOut' })
          .to(middleRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'sine.inOut' }, '-=0.4');
        break;
      case 'PROCESSING':
      case 'ANALYZING':
        tl.to(outerRef.current, { rotation: 360, duration: 3, ease: 'none' });
        break;
      case 'IDLE':
      default:
        tl.to(coreRef.current, { scale: 1.05, duration: 2, ease: 'sine.inOut' })
          .to(coreRef.current, { scale: 1, duration: 2, ease: 'sine.inOut' });
        break;
    }
  }, [state]);

  const getStatusText = () => {
    switch (state) {
      case 'AI_SPEAKING':
        return 'AI SPEAKING';
      case 'LISTENING':
        return 'LISTENING TO CUSTOMER';
      case 'PROCESSING':
        return 'UNDERSTANDING RESPONSE';
      case 'ANALYZING':
        return 'ANALYZING CONVERSATION';
      case 'COMPLETED':
        return 'VOICE SESSION COMPLETE';
      default:
        return 'READY TO START';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div ref={orbRef} className="relative w-48 h-48 flex items-center justify-center">
        <div ref={outerRef} className="absolute w-full h-full rounded-full border border-[#C5A46D]/30" />
        <div ref={middleRef} className="absolute w-36 h-36 rounded-full border border-[#527A68]/40" />
        <div ref={coreRef} className="w-28 h-28 rounded-full bg-[#16221D] border border-[#315C4B] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#315C4B]/60" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-[#C5A46D] font-medium tracking-[0.2em] uppercase mb-2">{getStatusText()}</p>
        {state === 'LISTENING' && interimTranscript && (
          <p className="text-[13px] text-[#A9B3AD] italic max-w-xs">{interimTranscript}...</p>
        )}
      </div>
    </div>
  );
}
