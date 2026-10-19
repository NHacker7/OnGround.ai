import React from 'react';
import { Phone, Shield } from 'lucide-react';
import { useCalling } from '../../context/CallingContext';
import { useApp } from '../../context/AppContext';

export const FloatingCallBar: React.FC = () => {
  const { isCallActive, startCall } = useCalling();
  const { selectedLead, openLeadModal, leads } = useApp();

  if (isCallActive) return null;

  const targetLead = selectedLead || leads[0];

  const handleInAppCall = () => {
    if (!targetLead) return;
    startCall(
      {
        id: targetLead.id,
        name: targetLead.name,
        company: targetLead.company,
        phone: targetLead.phone,
      },
      'voice-ai'
    );
  };

  const handlePhoneCall = () => {
    if (!targetLead) return;
    startCall(
      {
        id: targetLead.id,
        name: targetLead.name,
        company: targetLead.company,
        phone: targetLead.phone,
      },
      'human-agent'
    );
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-2 py-1 bg-white/95 backdrop-blur-md rounded-full border border-stone-200 shadow-lg text-charcoal animate-in slide-in-from-bottom-2 duration-200">
      {/* DEMO Tag */}
      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 shadow-2xs">
        DEMO
      </span>

      {/* In-app Call Button */}
      <button
        type="button"
        onClick={handleInAppCall}
        className="px-2.5 py-1 rounded-full hover:bg-stone-100 text-charcoal text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        title={`In-app AI Voice Call to ${targetLead?.name || 'Customer'}`}
      >
        <Phone className="w-3.5 h-3.5 text-stone-600" />
        <span>In-app call</span>
      </button>

      {/* Phone Call Button */}
      <button
        type="button"
        onClick={handlePhoneCall}
        className="px-2.5 py-1 rounded-full hover:bg-stone-100 text-charcoal text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
        title={`Phone Call to ${targetLead?.name || 'Customer'}`}
      >
        <Phone className="w-3.5 h-3.5 text-stone-600" />
        <span>Phone call</span>
      </button>

      {/* Leads Modal Trigger */}
      <button
        type="button"
        onClick={() => openLeadModal(targetLead?.id || 'lead-1')}
        className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 border border-purple-200"
        title="Open Leads Modal"
      >
        <span>Leads ({leads.length || 5})</span>
      </button>

      {/* Shield Icon */}
      <div className="pr-1.5 pl-0.5 text-emerald-600" title="Secure Audio Gateway">
        <Shield className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
