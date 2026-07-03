import { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import VoiceOrb from './VoiceOrb';
import ConversationTranscript from './ConversationTranscript';
import QualificationProgress from './QualificationProgress';
import AIAnalysis from './AIAnalysis';
import { calculateLeadScore } from '../utils/calculateLeadScore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function VoiceQualification() {
  const [sessionState, setSessionState] = useState('IDLE');
  const [conversation, setConversation] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [analysisMode, setAnalysisMode] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(true); // Show text input by default!
  const [error, setError] = useState(null);
  
  const processedTranscriptRef = useRef('');
  
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, stopSpeaking, isSpeaking } = useSpeechSynthesis();

  // Handle transcript changes
  useEffect(() => {
    console.log('[Frontend] Transcript updated:', transcript);
    console.log('[Frontend] Processed ref current:', processedTranscriptRef.current);
    console.log('[Frontend] Session state:', sessionState);
    
    if (transcript && transcript.trim() && transcript !== processedTranscriptRef.current && sessionState === 'LISTENING') {
      console.log('[Frontend] Processing new transcript!');
      processedTranscriptRef.current = transcript;
      handleUserInput(transcript);
    }
  }, [transcript, sessionState]);

  const startQualification = async () => {
    setError(null);
    setInitializing(true);
    setSessionState('INITIALIZING');
    await new Promise(r => setTimeout(r, 2000));
    setInitializing(false);
    
    const initialMessage = {
      role: 'assistant',
      content: "Hi Rahul! This is White Collar Realty's AI property assistant. You recently enquired about Westin Residences. Is this a good time for a quick conversation?",
      timestamp: Date.now()
    };
    setConversation([initialMessage]);
    setSessionState('AI_SPEAKING');
    stopListening();
    
    speak(initialMessage.content, () => {
      setTimeout(() => {
        setSessionState('LISTENING');
        startListening();
      }, 300);
    });
  };

  const handleUserInput = async (inputText) => {
    console.log('[Frontend] handleUserInput called with:', inputText);
    
    if (!inputText.trim()) return;
    setError(null);
    setSessionState('PROCESSING');
    stopListening();
    resetTranscript();
    
    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now()
    };
    
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    console.log('[Frontend] Updated conversation:', newConversation);
    
    // Call voice agent endpoint
    try {
      console.log('[Frontend] Calling /api/voice-agent');
      const res = await fetch(`${API_BASE}/voice-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: newConversation }),
      });
      
      console.log('[Frontend] Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to get AI response');
      }
      
      const data = await res.json();
      console.log('[Frontend] API response data:', data);
      
      if (data.success) {
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: Date.now()
        };
        const updatedConversation = [...newConversation, aiMessage];
        setConversation(updatedConversation);
        console.log('[Frontend] Added AI message to conversation');
        
        // Check if we should end conversation
        const shouldEnd = data.response.toLowerCase().includes('thank you') || 
                          data.response.toLowerCase().includes('soon to confirm') ||
                          updatedConversation.length >= 12;
        
        setSessionState('AI_SPEAKING');
        console.log('[Frontend] About to speak AI response');
        speak(data.response, () => {
          console.log('[Frontend] AI finished speaking');
          if (shouldEnd) {
            console.log('[Frontend] Ending qualification');
            endQualification(updatedConversation);
          } else {
            setTimeout(() => {
              console.log('[Frontend] Starting to listen again');
              setSessionState('LISTENING');
              startListening();
            }, 300);
          }
        });
      }
    } catch (err) {
      console.error('Voice agent error:', err);
      setError(err.message || 'Failed to communicate with AI');
      setSessionState('ERROR');
    }
  };

  const endQualification = async (finalConversation) => {
    setSessionState('ANALYZING');
    stopSpeaking();
    stopListening();
    try {
      const res = await fetch(`${API_BASE}/analyze-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation: finalConversation }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to analyze conversation');
      }
      
      const data = await res.json();
      
      if (data.success) {
        setAnalysis(data.analysis);
        setAnalysisMode(data.mode);
        const scoreResult = calculateLeadScore(data.analysis);
        const scoreReasons = Object.entries(scoreResult.scoreReasons || {}).map(([key, value]) => ({
          label: value.label || key,
          points: value.points || value
        }));
        setScoreData({ ...scoreResult, scoreReasons: scoreReasons.length ? scoreReasons : [
          { label: 'Purchase timeline', points: 25 },
          { label: 'Budget clarity', points: 20 },
          { label: 'Property configuration', points: 15 },
          { label: 'Site visit interest', points: 15 },
        ] });
        setSessionState('RESULT');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to analyze conversation');
      setSessionState('ERROR');
    }
  };

  const handleManualInputSubmit = (e) => {
    e.preventDefault();
    console.log('[Frontend] Manual input submitted:', textInput);
    if (textInput.trim()) {
      handleUserInput(textInput);
      setTextInput('');
    }
  };

  const handleRetry = () => {
    setError(null);
    if (analysis) {
      setSessionState('RESULT');
    } else if (conversation.length > 0) {
      setSessionState('IDLE');
    }
  };

  return (
    <div className="min-h-screen bg-[#080D0B] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-4 mb-8 pb-6 border-b border-[#68756E]/20">
          <div className="w-12 h-12 rounded-xl bg-[#16221D] border border-[#315C4B] flex items-center justify-center">
            <svg width="24" height="20" viewBox="0 0 20 16" fill="none">
              <path
                d="M2 2L6 14L10 4L14 14L18 2"
                stroke="#C5A46D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-serif text-[#F4F1E8]">WHITE COLLAR AI</h1>
            <p className="text-[13px] text-[#68756E] tracking-[0.2em] uppercase">Voice Intelligence Operations</p>
          </div>
        </header>

        {sessionState === 'IDLE' && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <VoiceOrb state={sessionState} />
            <div className="text-center max-w-lg">
              <h2 className="text-3xl font-serif text-[#F4F1E8] mb-3">Start AI Qualification</h2>
              <p className="text-[#A9B3AD] mb-6">Automate your lead qualification with open-source AI voice intelligence</p>
              {!isSupported && (
                <div className="mb-6 p-4 bg-[#111B17] border border-[#C5A46D]/30 rounded-lg">
                  <p className="text-sm text-[#C5A46D]">Voice recognition is not fully supported. Use text input below.</p>
                  <button
                    className="mt-3 text-sm text-[#527A68] underline"
                    onClick={() => setShowTextInput(true)}
                  >Show text input</button>
                </div>
              )}
              <button
                onClick={startQualification}
                className="px-8 py-3 rounded-lg bg-[#C5A46D] text-[#080D0B] font-semibold hover:bg-[#E0C28D] transition"
              >
                START AI QUALIFICATION
              </button>
            </div>
          </div>
        )}

        {sessionState === 'INITIALIZING' && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <VoiceOrb state={sessionState} />
            <QualificationProgress initializing={initializing} />
          </div>
        )}

        {(sessionState === 'AI_SPEAKING' || sessionState === 'LISTENING' || sessionState === 'PROCESSING') && (
          <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div>
              <VoiceOrb state={sessionState} interimTranscript={interimTranscript} />
              <div className="mt-6 space-y-4">
                {sessionState === 'AI_SPEAKING' && conversation.length > 0 && (
                  <button
                    onClick={() => speak(conversation[conversation.length - 1].content)}
                    className="w-full py-3 rounded-lg bg-[#527A68] text-[#F4F1E8] font-semibold hover:bg-[#315C4B] transition"
                  >
                    🔊 Play Last AI Response
                  </button>
                )}

                {sessionState === 'LISTENING' && interimTranscript && (
                  <button
                    onClick={() => {
                      console.log('[Frontend] Sending interim:', interimTranscript);
                      handleUserInput(interimTranscript);
                    }}
                    className="w-full py-2 rounded-lg bg-[#111B17] border border-[#C5A46D]/30 text-[#E0C28D] font-semibold hover:border-[#C5A46D] transition"
                  >
                    ✉️ Send Interim Text: {interimTranscript}
                  </button>
                )}
                {sessionState === 'LISTENING' || sessionState === 'IDLE' ? (
                  <button
                    onClick={sessionState === 'LISTENING' ? stopListening : startListening}
                    className="w-full py-3 rounded-lg bg-[#C5A46D] text-[#080D0B] font-semibold hover:bg-[#E0C28D] transition flex items-center justify-center gap-2"
                  >
                    {sessionState === 'LISTENING' ? 'Stop Listening' : '🎤 Start Listening'}
                  </button>
                ) : null}

                {sessionState === 'IDLE' && (
                  <button
                    onClick={() => speak('Hello, this is a test of the speech system!')}
                    className="w-full py-2 rounded-lg bg-[#111B17] border border-[#68756E]/20 text-[#A9B3AD] hover:border-[#C5A46D]/30 transition"
                  >
                    Test Speech Synthesis
                  </button>
                )}

                <button
                  onClick={() => setShowTextInput(!showTextInput)}
                  className="text-sm text-[#C5A46D] underline"
                >
                  {showTextInput ? 'Hide text input' : 'Use text input instead'}
                </button>
                {showTextInput && (
                  <form onSubmit={handleManualInputSubmit} className="mt-4 space-y-3">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-lg bg-[#111B17] border border-[#68756E]/20 text-[#F4F1E8] focus:outline-none focus:border-[#C5A46D]/30"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-[#C5A46D]/10 text-[#C5A46D] font-semibold hover:bg-[#C5A46D]/20 transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}

                {error && (
                  <div className="p-3 rounded-lg border border-[#C5A46D]/30 bg-[#111B17]">
                    <p className="text-sm text-[#C5A46D]">Error: {error}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <ConversationTranscript conversation={conversation} />
            </div>
          </div>
        )}

        {sessionState === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <VoiceOrb state={sessionState} />
            <p className="text-[#A9B3AD]">Analyzing conversation...</p>
          </div>
        )}

        {sessionState === 'RESULT' && analysis && scoreData && (
          <AIAnalysis analysis={analysis} scoreData={scoreData} mode={analysisMode} />
        )}

        {sessionState === 'ERROR' && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="bg-[#111B17] border border-[#C5A46D]/30 rounded-xl p-8 max-w-md text-center">
              <h3 className="text-xl font-semibold text-[#C5A46D] mb-2">AI Service Unavailable</h3>
              <p className="text-[#A9B3AD] mb-6">{error || 'An error occurred'}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 rounded-lg bg-[#C5A46D] text-[#080D0B] font-semibold hover:bg-[#E0C28D] transition"
              >
                RETRY
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
