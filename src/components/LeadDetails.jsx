import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Phone, Building2, MapPin, Clock, Tag, User,
  CheckCircle2, Sparkles, Target, Calendar, Home,
  DollarSign, Navigation, ArrowRight, Shield,
  Zap, Brain, Radio, MessageSquare
} from 'lucide-react';
import gsap from 'gsap';
import { conversationMessages, buildTranscriptString } from '../data/conversation';
import { analyzeTranscript } from '../services/api';
import { calculateLeadScore } from '../utils/calculateLeadScore';

// ─── Call Phases ───
const PHASE = {
  DETAILS: 'details',
  INITIALIZING: 'initializing',
  CONNECTING: 'connecting',
  CONVERSATION: 'conversation',
  CALL_ENDED: 'call_ended',
  ANALYZING: 'analyzing',
  RESULTS: 'results',
  ASSIGNING: 'assigning',
  ASSIGNED: 'assigned',
};

// ─── Waveform mini component ───
function Waveform({ active, bars = 5 }) {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`w-[2px] bg-champagne/60 rounded-full transition-all ${active ? 'waveform-bar' : ''}`}
          style={{
            height: active ? undefined : '4px',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Score Ring ───
function ScoreRing({ score, size = 140, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ringRef = useRef(null);

  useEffect(() => {
    if (!ringRef.current) return;
    const offset = circumference - (score / 100) * circumference;
    gsap.fromTo(
      ringRef.current,
      { strokeDashoffset: circumference },
      { strokeDashoffset: offset, duration: 1.5, ease: 'power2.out', delay: 0.3 }
    );
  }, [score, circumference]);

  return (
    <svg width={size} height={size} className="score-ring">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(197,164,109,0.1)"
        strokeWidth={strokeWidth}
      />
      <circle
        ref={ringRef}
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={score >= 80 ? '#D4845A' : score >= 50 ? '#C5A46D' : '#68756E'}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LeadDetails({ lead, onClose }) {
  const [phase, setPhase] = useState(PHASE.DETAILS);
  const [initEvents, setInitEvents] = useState([]);
  const [callTimer, setCallTimer] = useState(0);
  const [messages, setMessages] = useState([]);
  const [speakingStatus, setSpeakingStatus] = useState('');
  const [qualProgress, setQualProgress] = useState(0);
  const [qualFields, setQualFields] = useState([]);
  const [analysisStages, setAnalysisStages] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('');
  const [scoreData, setScoreData] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showScoreReasons, setShowScoreReasons] = useState(false);
  const [showExtracted, setShowExtracted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [assignStep, setAssignStep] = useState(0);

  const panelRef = useRef(null);
  const conversationRef = useRef(null);
  const timerRef = useRef(null);

  // GSAP panel entrance
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, []);

  // Call timer
  useEffect(() => {
    if (phase === PHASE.CONVERSATION) {
      timerRef.current = setInterval(() => setCallTimer((t) => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // ─── Start Call ───
  const startCall = useCallback(async () => {
    setPhase(PHASE.INITIALIZING);

    const events = [
      'Lead context loaded',
      'Vapi voice session initialized',
      'OpenAI reasoning layer connected',
      'Qualification workflow ready',
    ];
    for (let i = 0; i < events.length; i++) {
      await delay(500);
      setInitEvents((prev) => [...prev, events[i]]);
    }

    await delay(600);
    setPhase(PHASE.CONNECTING);

    await delay(1500);
    setPhase(PHASE.CONVERSATION);
    setCallTimer(0);

    // Play conversation
    const qualFieldNames = ['Purpose', 'Budget', 'Location', 'Configuration', 'Timeline', 'Site Visit'];
    let fieldIndex = 0;

    for (let i = 0; i < conversationMessages.length; i++) {
      const msg = conversationMessages[i];
      setSpeakingStatus(msg.role === 'ai' ? 'AI SPEAKING' : 'CUSTOMER SPEAKING');
      await delay(msg.role === 'ai' ? 1100 : 900);
      setMessages((prev) => [...prev, msg]);

      // Update qualification progress
      if (msg.role === 'customer' && fieldIndex < qualFieldNames.length) {
        const progress = Math.min(100, Math.round(((fieldIndex + 1) / qualFieldNames.length) * 100));
        setQualProgress(progress);
        setQualFields((prev) => [...prev, qualFieldNames[fieldIndex]]);
        fieldIndex++;
      }
    }

    setSpeakingStatus('');
    await delay(800);

    // Call ended
    setPhase(PHASE.CALL_ENDED);
    await delay(1500);

    // Analyzing
    setPhase(PHASE.ANALYZING);
    const stages = [
      'Finalizing transcript',
      'Understanding customer intent',
      'Extracting qualification signals',
      'Generating sales summary',
      'Calculating lead momentum',
    ];
    for (let i = 0; i < stages.length; i++) {
      await delay(600);
      setAnalysisStages((prev) => [...prev, stages[i]]);
    }

    // Real API call
    const transcript = buildTranscriptString(conversationMessages);
    const response = await analyzeTranscript(transcript);
    const analysis = response.analysis;
    setAnalysisResult(analysis);
    setAnalysisMode(response.analysisMode || 'demo-fallback');

    // Calculate score
    const score = calculateLeadScore(analysis);
    setScoreData(score);

    await delay(800);
    setPhase(PHASE.RESULTS);

    // Animate score number
    const obj = { val: 0 };
    gsap.to(obj, {
      val: score.totalScore,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.4,
      onUpdate() {
        setAnimatedScore(Math.round(this.targets()[0].val));
      },
    });

    // Reveal sections sequentially
    await delay(2000);
    setShowScoreReasons(true);
    await delay(800);
    setShowExtracted(true);
    await delay(600);
    setShowSummary(true);
    await delay(400);
    setShowAction(true);
  }, []);

  // ─── Assign Consultant ───
  const assignConsultant = useCallback(async () => {
    setPhase(PHASE.ASSIGNING);
    const steps = ['Updating CRM', 'Assigning consultant', 'Triggering sales notification', 'Preparing AI call brief'];
    for (let i = 0; i < steps.length; i++) {
      await delay(700);
      setAssignStep(i + 1);
    }
    await delay(600);
    setPhase(PHASE.ASSIGNED);
  }, []);

  // Auto-scroll conversation
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── RENDER ───
  return (
    <div
      ref={panelRef}
      className="fixed inset-0 lg:static lg:w-[440px] xl:w-[480px] flex-shrink-0 bg-bg-secondary border-l border-border overflow-y-auto z-30"
    >
      {/* Close button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-bg-secondary z-10">
        <span className="text-[9px] tracking-[0.2em] text-text-muted uppercase">
          Lead Intelligence
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
        >
          <X size={16} className="text-text-muted" />
        </button>
      </div>

      <div className="px-6 py-5">
        {/* ─── PHASE: DETAILS ─── */}
        {phase === PHASE.DETAILS && (
          <div className="animate-fade-in">
            {/* Lead header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-luxury-green/20 border border-border flex items-center justify-center text-[15px] font-semibold text-success">
                {lead.initials}
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-text-primary">
                  {lead.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-text-muted">{lead.source}</span>
                  <span className="text-text-muted">·</span>
                  <span className="badge-new text-[10px] px-2 py-0.5 rounded font-medium">
                    NEW LEAD
                  </span>
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Building2, label: 'Project Interest', value: lead.property },
                { icon: MapPin, label: 'Location', value: lead.location },
                { icon: Tag, label: 'Source', value: lead.source },
                { icon: Clock, label: 'Enquiry Received', value: lead.createdAt },
                { icon: Phone, label: 'Phone', value: lead.phone },
              ].map((item) => (
                <div key={item.label} className="last:col-span-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <item.icon size={12} className="text-text-muted" />
                    <span className="text-[9px] tracking-[0.12em] text-text-muted uppercase">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[13px] text-text-primary font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Qualification status */}
            <div className="bg-bg-card border border-border rounded-xl p-4 mb-6">
              <div className="text-[9px] tracking-[0.15em] text-text-muted uppercase mb-3">
                AI Qualification Status
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-warning pulse-dot" />
                <span className="text-[12px] text-warning font-medium">
                  Awaiting Qualification
                </span>
              </div>

              {lead.canSimulate ? (
                <>
                  <button
                    onClick={startCall}
                    className="w-full flex items-center justify-center gap-2 bg-champagne hover:bg-soft-gold text-bg-main font-semibold text-[13px] py-3 rounded-xl transition-all btn-hover cursor-pointer"
                  >
                    <Phone size={15} />
                    START AI QUALIFICATION
                  </button>
                  <p className="text-[9px] text-text-muted text-center mt-2.5 italic">
                    Simulates Vapi voice orchestration
                  </p>
                  <p className="text-[9px] text-text-muted text-center mt-1">
                    OpenAI will analyze the finalized conversation transcript.
                  </p>
                </>
              ) : (
                <p className="text-[11px] text-text-muted text-center py-3">
                  Call simulation available for Rahul Mehta only in this prototype.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ─── PHASE: INITIALIZING ─── */}
        {phase === PHASE.INITIALIZING && (
          <div className="animate-fade-in flex flex-col items-center py-8">
            <div className="voice-orb w-20 h-20 rounded-full bg-bg-elevated border border-champagne/20 flex items-center justify-center mb-6 relative">
              <div className="voice-orb-ring absolute inset-0 rounded-full border border-champagne/10" />
              <Brain size={24} className="text-champagne" />
            </div>
            <div className="text-[10px] tracking-[0.2em] text-champagne uppercase mb-6">
              Initializing Voice Agent
            </div>
            <div className="w-full space-y-3">
              {initEvents.map((event, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                  <span className="text-[12px] text-text-secondary">{event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PHASE: CONNECTING ─── */}
        {phase === PHASE.CONNECTING && (
          <div className="animate-fade-in flex flex-col items-center py-12">
            <div className="text-[10px] tracking-[0.2em] text-champagne uppercase mb-4">
              Calling {lead.name}
            </div>
            <Waveform active bars={7} />
            <div className="text-[12px] text-text-muted mt-4">Connecting...</div>
          </div>
        )}

        {/* ─── PHASE: CONVERSATION ─── */}
        {phase === PHASE.CONVERSATION && (
          <div className="animate-fade-in">
            {/* Call status bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success pulse-dot" />
                <span className="text-[10px] tracking-[0.15em] text-success uppercase font-medium">
                  Call Connected
                </span>
              </div>
              <span className="text-[13px] text-champagne font-mono font-semibold">
                {formatTime(callTimer)}
              </span>
            </div>

            {/* Speaking status */}
            <div className="flex items-center justify-between bg-bg-card border border-border rounded-lg px-4 py-2.5 mb-4">
              <div className="flex items-center gap-2">
                <Waveform active={!!speakingStatus} bars={4} />
                <span className="text-[10px] tracking-[0.12em] text-text-secondary uppercase">
                  {speakingStatus || 'PROCESSING'}
                </span>
              </div>
              <span className="text-[10px] text-text-muted">
                {messages.length} / {conversationMessages.length} turns
              </span>
            </div>

            {/* Conversation messages */}
            <div
              ref={conversationRef}
              className="space-y-4 max-h-[340px] overflow-y-auto pr-1 mb-4"
            >
              {messages.map((msg, i) => (
                <div key={i} className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-1.5">
                    {msg.role === 'ai' ? (
                      <>
                        <div className="w-5 h-5 rounded bg-luxury-green/30 flex items-center justify-center">
                          <Brain size={10} className="text-champagne" />
                        </div>
                        <span className="text-[9px] tracking-[0.12em] text-champagne uppercase font-medium">
                          White Collar AI
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 rounded bg-bg-elevated flex items-center justify-center text-[8px] font-semibold text-text-secondary border border-border">
                          {lead.initials}
                        </div>
                        <span className="text-[9px] tracking-[0.12em] text-text-secondary uppercase font-medium">
                          {lead.name}
                        </span>
                      </>
                    )}
                  </div>
                  <p className={`text-[12px] leading-relaxed pl-7 ${
                    msg.role === 'ai' ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Live session stats */}
            <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="text-[9px] tracking-[0.15em] text-text-muted uppercase mb-2">
                Live AI Session
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted">Vapi Orchestration</span>
                <span className="text-[10px] text-success font-medium">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted">OpenAI Brain</span>
                <span className="text-[10px] text-success font-medium">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-text-muted">Conversation Context</span>
                <span className="text-[10px] text-text-secondary font-medium">
                  {messages.length} TURNS
                </span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-text-muted">Qualification Progress</span>
                  <span className="text-[10px] text-champagne font-medium">{qualProgress}%</span>
                </div>
                <div className="w-full h-1 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-champagne rounded-full transition-all duration-500"
                    style={{ width: `${qualProgress}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {qualFields.map((f) => (
                    <span key={f} className="text-[9px] text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                      {f} ✓
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PHASE: CALL ENDED ─── */}
        {phase === PHASE.CALL_ENDED && (
          <div className="animate-fade-in flex flex-col items-center py-10">
            <CheckCircle2 size={32} className="text-success mb-4" />
            <div className="text-[10px] tracking-[0.2em] text-success uppercase mb-4">
              Call Completed
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-[9px] text-text-muted uppercase mb-1">Duration</div>
                <div className="text-[15px] text-text-primary font-semibold font-mono">
                  {formatTime(callTimer)}
                </div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-[9px] text-text-muted uppercase mb-1">Qualification</div>
                <div className="text-[15px] text-success font-semibold">Complete</div>
              </div>
            </div>
          </div>
        )}

        {/* ─── PHASE: ANALYZING ─── */}
        {phase === PHASE.ANALYZING && (
          <div className="animate-fade-in flex flex-col items-center py-8">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full border border-champagne/20 voice-orb-ring" />
              <div className="absolute inset-2 rounded-full border border-champagne/10 voice-orb-ring" style={{ animationDirection: 'reverse' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={20} className="text-champagne" />
              </div>
            </div>
            <div className="text-[10px] tracking-[0.2em] text-champagne uppercase mb-6">
              Analyzing Conversation
            </div>
            <div className="w-full space-y-3">
              {analysisStages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                  <span className="text-[12px] text-text-secondary">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── PHASE: RESULTS ─── */}
        {phase === PHASE.RESULTS && (
          <div className="animate-fade-in">
            {/* Analysis mode badge */}
            <div className="flex items-center justify-center mb-6">
              <span className={`text-[9px] tracking-[0.12em] px-3 py-1 rounded-full font-medium uppercase ${
                analysisMode === 'openai'
                  ? 'bg-success/10 text-success border border-success/20'
                  : 'bg-warning/10 text-warning border border-warning/20'
              }`}>
                {analysisMode === 'openai' ? 'OpenAI Analysis Complete' : 'Demo Analysis Mode'}
              </span>
            </div>

            {/* Score ring */}
            <div className="flex flex-col items-center mb-8">
              <div className={`relative ${animatedScore >= 80 ? 'warm-glow' : ''} rounded-full`}>
                <ScoreRing score={scoreData?.totalScore || 0} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-[32px] font-bold text-text-primary leading-none">
                    {animatedScore}
                  </div>
                  <div className="text-[9px] text-text-muted mt-1">/100</div>
                </div>
              </div>
              <div className="text-[10px] tracking-[0.15em] text-text-muted uppercase mt-4 mb-1">
                Lead Momentum Score
              </div>
              {scoreData && (
                <span className={`text-[12px] font-semibold px-3 py-0.5 rounded-full ${
                  scoreData.status === 'Hot'
                    ? 'badge-hot'
                    : scoreData.status === 'Warm'
                    ? 'badge-warm'
                    : 'badge-cold'
                }`}>
                  {scoreData.status.toUpperCase()} LEAD
                </span>
              )}
            </div>

            {/* Score Reasons */}
            {showScoreReasons && scoreData && (
              <div className="mb-6 animate-fade-in">
                <div className="text-[9px] tracking-[0.15em] text-text-muted uppercase mb-3">
                  Why This Lead Is {scoreData.status}
                </div>
                <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                  {scoreData.scoreReasons.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0 animate-fade-in"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div>
                        <div className="text-[11px] text-text-secondary font-medium">
                          {r.label}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          {r.value}
                        </div>
                      </div>
                      <span className="text-[12px] text-champagne font-semibold">
                        +{r.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Requirements */}
            {showExtracted && analysisResult && (
              <div className="mb-6 animate-fade-in">
                <div className="text-[9px] tracking-[0.15em] text-text-muted uppercase mb-3">
                  AI Extracted Requirements
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Target, label: 'Purpose', value: analysisResult.buyingPurpose },
                    { icon: DollarSign, label: 'Budget', value: analysisResult.budgetDisplay },
                    { icon: Navigation, label: 'Preferred Location', value: analysisResult.preferredLocation },
                    { icon: Home, label: 'Configuration', value: analysisResult.configuration },
                    { icon: Clock, label: 'Purchase Timeline', value: analysisResult.purchaseTimeline },
                    { icon: Calendar, label: 'Site Visit', value: analysisResult.siteVisitInterest ? 'Interested' : 'Not Yet' },
                    { icon: Clock, label: 'Preferred Time', value: analysisResult.preferredVisitTime || '—' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="bg-bg-card border border-border rounded-xl p-3 card-hover last:odd:col-span-2"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <item.icon size={11} className="text-text-muted" />
                        <span className="text-[8px] tracking-[0.12em] text-text-muted uppercase">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[12px] text-text-primary font-semibold uppercase">
                        {item.value || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call Summary */}
            {showSummary && analysisResult && (
              <div className="mb-6 animate-fade-in">
                <div className="bg-bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={13} className="text-champagne" />
                    <span className="text-[9px] tracking-[0.15em] text-champagne uppercase font-medium">
                      {analysisMode === 'openai' ? 'OpenAI Call Intelligence' : 'AI Call Intelligence'}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    {analysisResult.callSummary}
                  </p>
                  <div className="text-[9px] text-text-muted mt-3 italic">
                    Generated from call transcript
                  </div>
                </div>
              </div>
            )}

            {/* Recommended Action */}
            {showAction && analysisResult && (
              <div className="animate-fade-in">
                <div className="text-[9px] tracking-[0.15em] text-text-muted uppercase mb-3">
                  Next Best Action
                </div>
                <div className="bg-bg-card border border-hot/20 rounded-xl p-5 mb-4">
                  <span className="text-[9px] tracking-[0.12em] text-hot uppercase font-semibold">
                    High Priority
                  </span>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2 text-[12px] text-text-primary">
                      <ArrowRight size={12} className="text-champagne" />
                      Assign Senior Property Consultant
                    </li>
                    <li className="flex items-center gap-2 text-[12px] text-text-primary">
                      <ArrowRight size={12} className="text-champagne" />
                      Confirm Saturday Site Visit
                    </li>
                    <li className="flex items-center gap-2 text-[12px] text-text-primary">
                      <ArrowRight size={12} className="text-champagne" />
                      Follow up within 15 minutes
                    </li>
                  </ul>
                </div>
                <button
                  onClick={assignConsultant}
                  className="w-full flex items-center justify-center gap-2 bg-champagne hover:bg-soft-gold text-bg-main font-semibold text-[13px] py-3 rounded-xl transition-all btn-hover cursor-pointer"
                >
                  <User size={15} />
                  ASSIGN TO CONSULTANT
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── PHASE: ASSIGNING ─── */}
        {phase === PHASE.ASSIGNING && (
          <div className="animate-fade-in">
            <div className="bg-bg-card border border-border rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-luxury-green/20 border border-border flex items-center justify-center text-[12px] font-semibold text-champagne">
                  AS
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-text-primary">
                    Amit Sharma
                  </div>
                  <div className="text-[11px] text-text-muted">
                    Senior Property Consultant
                  </div>
                  <div className="text-[10px] text-text-muted">
                    Luxury Residential — Gurgaon
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {['Updating CRM', 'Assigning consultant', 'Triggering sales notification', 'Preparing AI call brief'].map(
                  (step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {assignStep > i ? (
                        <CheckCircle2 size={14} className="text-success" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-border" />
                      )}
                      <span
                        className={`text-[12px] ${
                          assignStep > i ? 'text-text-primary' : 'text-text-muted'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── PHASE: ASSIGNED ─── */}
        {phase === PHASE.ASSIGNED && (
          <div className="animate-fade-in flex flex-col items-center py-8">
            <div className="w-14 h-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 size={24} className="text-success" />
            </div>
            <div className="text-[10px] tracking-[0.2em] text-success uppercase mb-3">
              Lead Assigned
            </div>
            <p className="text-[13px] text-text-primary text-center font-medium mb-6">
              Amit Sharma has been assigned to {lead.name}.
            </p>
            <div className="space-y-2 w-full">
              {['CRM Updated', 'Sales Notification Triggered', 'AI Call Brief Ready'].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-4 py-2.5"
                  >
                    <CheckCircle2 size={13} className="text-success" />
                    <span className="text-[11px] text-text-secondary">{item}</span>
                  </div>
                )
              )}
            </div>
            <p className="text-[9px] text-text-muted text-center mt-6 italic max-w-xs">
              CRM and sales workflow actions are simulated in this interactive prototype.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Delay helper
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
