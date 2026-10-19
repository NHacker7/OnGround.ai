import React, { useState } from 'react';
import {
  Headphones,
  Mic,
  MicOff,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  TrendingUp,
  Volume2,
  Shield,
  Clock,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useCalling } from '../context/CallingContext';
import { useApp } from '../context/AppContext';

export const PracticeCall: React.FC = () => {
  const { startCall } = useCalling();
  const { userProfile } = useApp();

  const [selectedScenario, setSelectedScenario] = useState('ortho-quote');
  const [isRecordingPractice, setIsRecordingPractice] = useState(false);
  const [practiceStep, setPracticeStep] = useState<'idle' | 'in-progress' | 'feedback'>('idle');
  const [practiceScore, setPracticeScore] = useState<number | null>(null);

  const scenarios = [
    {
      id: 'ortho-quote',
      title: 'Ortho GRID ₹8,490 Quote & 10-Yr Warranty Pitch',
      persona: 'Mukunda (Prospective Buyer)',
      difficulty: 'Intermediate',
      objection: 'Wants proof of Bajaj Finserv No-Cost EMI and zero-partner disturbance.',
      keyScript:
        '"Good morning, Mukunda! This is Arvind from The Sleep Company. I noticed you were exploring our patented Ortho GRID mattress — I have your custom ₹8,490 quote and 10-year warranty certificate ready."',
    },
    {
      id: 'billing-dispute',
      title: 'Billing Dispute Resolution & Courtesy Credit',
      persona: 'Priya Iyer (SmartGRID Luxe Order)',
      difficulty: 'Advanced',
      objection: 'Website did not deduct the ₹1,200 promotional coupon at checkout.',
      keyScript:
        '"Hello Priya, this is Arvind from The Sleep Company following up on your 4:30 PM callback. First, I apologize for the checkout voucher glitch — I have already credited ₹1,200 to your invoice."',
    },
    {
      id: 'competitive-objection',
      title: 'Competitor Defense: Memory Foam vs Patented SmartGRID',
      persona: 'Raghav M. (Koramangala Resident)',
      difficulty: 'Intermediate',
      objection: 'Claims traditional memory foam is cheaper and feels softer.',
      keyScript:
        '"I completely understand why memory foam seems tempting, Raghav. However, standard memory foam traps body heat and sags within 2 years. Our patented SmartGRID stays 4° cooler and adapts to your spine."',
    },
  ];

  const activeScenario = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];

  const handleStartSimulatedCall = () => {
    startCall(
      {
        id: 'practice-mukunda',
        name: activeScenario.persona,
        company: 'The Sleep Company Practice Studio',
        phone: '+91 98450 00000',
      },
      'voice-ai'
    );
  };

  const handleSimulateReview = () => {
    setIsRecordingPractice(true);
    setPracticeStep('in-progress');
    setTimeout(() => {
      setIsRecordingPractice(false);
      setPracticeStep('feedback');
      setPracticeScore(94);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-forest text-white border border-forest-border shadow-soft relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sage to-forest-light border border-emerald-400/30 text-white shadow-md">
              <Headphones className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Practise a Call Studio
                </h1>
                <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  AI Roleplay
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-xl leading-relaxed">
                Rehearse your greeting scripts, objection rebuttals, and pricing talk tracks with AvaniBot
                before calling actual customers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartSimulatedCall}
            className="px-5 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Launch Live AI Voice Roleplay</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector & Practice Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Scenarios */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-charcoal-muted px-1">
            Choose Practice Scenario
          </h2>

          {scenarios.map((sc) => {
            const isSelected = sc.id === selectedScenario;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(sc.id);
                  setPracticeStep('idle');
                  setPracticeScore(null);
                }}
                className={`w-full text-left p-4 rounded-2xl border transition-all shadow-2xs ${
                  isSelected
                    ? 'bg-white border-purple-600 ring-2 ring-purple-600/20 shadow-soft'
                    : 'bg-white hover:bg-ivory border-ivory-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal">{sc.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ivory border border-ivory-border text-charcoal-muted">
                    {sc.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-muted mt-1">Persona: {sc.persona}</p>
              </button>
            );
          })}
        </div>

        {/* Right: Active Script & Rehearsal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-ivory-border shadow-soft space-y-5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                RECOMMENDED SCRIPT ADHERENCE
              </span>
              <h3 className="text-lg font-bold text-charcoal tracking-tight mt-0.5">
                {activeScenario.title}
              </h3>
              <p className="text-xs text-charcoal-muted mt-1">
                Customer Objection: <em>"{activeScenario.objection}"</em>
              </p>
            </div>

            {/* Script Box */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-charcoal text-xs leading-relaxed space-y-2">
              <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                🎯 Target Greeting Script ({userProfile.name}):
              </span>
              <p className="font-medium italic text-charcoal/90">{activeScenario.keyScript}</p>
            </div>

            {/* Interaction Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSimulateReview}
                disabled={isRecordingPractice}
                className="px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-hover active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                {isRecordingPractice ? (
                  <>
                    <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />
                    <span>Listening to your greeting...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-300" />
                    <span>Record & Test Script Adherence</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleStartSimulatedCall}
                className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-purple-200" />
                <span>Simulate Call with AI Customer</span>
              </button>
            </div>

            {/* Scoring & Feedback */}
            {practiceStep === 'feedback' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-2 animate-in slide-in-from-top-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold">Script Adherence Score: {practiceScore}%</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    EXCELLENT
                  </span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed">
                  Great delivery! You naturally acknowledged the 10-year warranty, quoted the exact ₹8,490 price point, and maintained a warm, confident tone. Ready for Mukunda's live callback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
