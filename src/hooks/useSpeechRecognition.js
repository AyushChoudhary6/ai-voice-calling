import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const shouldRestartRef = useRef(false);

  useEffect(() => {
    // Check for SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      console.log('[SpeechRecognition] Supported');
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US'; // Try en-US instead of en-IN which is more widely supported
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        console.log('[SpeechRecognition] Started');
        setIsListening(true);
        setError(null);
      };
      
      recognition.onend = () => {
        console.log('[SpeechRecognition] Ended, shouldRestart:', shouldRestartRef.current);
        setIsListening(false);
        if (shouldRestartRef.current) {
          console.log('[SpeechRecognition] Auto-restarting...');
          shouldRestartRef.current = false;
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('[SpeechRecognition] Auto-restart failed:', e);
            }
          }, 500);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('[SpeechRecognition] Error:', event.error);
        setError(event.error);
        setIsListening(false);
        
        if (event.error === 'network' || event.error === 'no-speech') {
          shouldRestartRef.current = true;
        }
      };
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptText;
          } else {
            interim += transcriptText;
          }
        }
        
        console.log('[SpeechRecognition] Interim:', interim);
        console.log('[SpeechRecognition] Final:', final);
        
        setInterimTranscript(interim);
        if (final) {
          setTranscript(final);
        }
      };
      
      recognitionRef.current = recognition;
    } else {
      console.warn('[SpeechRecognition] Not supported');
      setIsSupported(false);
    }

    // Cleanup
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startListening = useCallback(() => {
    console.log('[SpeechRecognition] startListening called');
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    shouldRestartRef.current = true;
    
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('[SpeechRecognition] Failed to start:', e);
        // If start() fails because it's already running, stop then start again
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (e2) {
              console.error('[SpeechRecognition] Retry failed:', e2);
            }
          }, 200);
        } catch (e2) {
          console.error('[SpeechRecognition] Retry also failed:', e2);
        }
      }
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    console.log('[SpeechRecognition] stopListening called');
    shouldRestartRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('[SpeechRecognition] Failed to stop:', e);
      }
    }
  }, []);

  const resetTranscript = useCallback(() => {
    console.log('[SpeechRecognition] resetTranscript called');
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    error,
  };
};
