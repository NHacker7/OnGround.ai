import React, { useState, useMemo } from 'react';
import {
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { Lead } from '../types';

export const CallsToMake: React.FC = () => {
  const { leads, openLeadModal } = useApp();
  const { startCall } = useCalling();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [expandedLeadIds, setExpandedLeadIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleRowExpand = (id: string) => {
    setExpandedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery);

      const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [leads, searchQuery, priorityFilter]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-150">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-charcoal tracking-tight">Calls to make</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {leads.length} Ranked Leads
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Ranked by purchase intent, ICP qualification, and closing SLA window.
          </p>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search leads, phone numbers, or products..."
            className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-charcoal placeholder-stone-400 focus:outline-hidden focus:bg-white focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] font-bold text-stone-400">Priority:</span>
          {['All', 'Urgent', 'High'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPriorityFilter(p);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                priorityFilter === p
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Table Container */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/70 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-2.5 px-3 w-8 text-center" />
                <th className="py-2.5 px-3">Lead</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Scores</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">SLA</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {paginatedLeads.map((lead) => {
                const isExpanded = expandedLeadIds.has(lead.id);

                return (
                  <React.Fragment key={lead.id}>
                    <tr className="hover:bg-stone-50/60 transition-colors group">
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleRowExpand(lead.id)}
                          className="p-1 rounded text-stone-400 hover:text-charcoal"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>

                      <td className="py-2.5 px-3">
                        <div
                          onClick={() => openLeadModal(lead.id)}
                          className="cursor-pointer group-hover:text-emerald-700"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-charcoal group-hover:text-emerald-700">
                              {lead.name}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                                lead.priority === 'Urgent'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {lead.interestedProduct || lead.company}
                          </p>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">
                        {lead.phone}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold">
                          <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-700">
                            ICP {lead.icpScore}%
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800">
                            Intent {lead.intentScore}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 font-bold text-charcoal">
                        ₹{lead.potentialValue.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 text-[11px] text-stone-500 font-mono">
                        {lead.slaTimeLeft || lead.nextActionDeadline}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              startCall(
                                {
                                  id: lead.id,
                                  name: lead.name,
                                  company: lead.company,
                                  phone: lead.phone,
                                },
                                'voice-ai'
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3 text-purple-200" />
                            <span>AI Call</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              startCall(
                                {
                                  id: lead.id,
                                  name: lead.name,
                                  company: lead.company,
                                  phone: lead.phone,
                                },
                                'human-agent'
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-2xs transition-all flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Row */}
                    {isExpanded && (
                      <tr className="bg-stone-50/50">
                        <td colSpan={7} className="p-3 text-[11px] space-y-2">
                          <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-1">
                            <span className="font-bold text-stone-700 block">Lead Notes & Context:</span>
                            <p className="text-stone-600">{lead.notes}</p>
                          </div>
                          {lead.buyingSignals.length > 0 && (
                            <div className="p-2.5 rounded-xl bg-white border border-stone-200 space-y-1">
                              <span className="font-bold text-stone-700 block">Recent Buying Signals:</span>
                              <div className="space-y-1">
                                {lead.buyingSignals.map((s) => (
                                  <p key={s.id} className="text-stone-600">
                                    • <strong>{s.title}:</strong> {s.description}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1 rounded border border-stone-200 disabled:opacity-30 hover:bg-stone-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold px-2">{currentPage} / {totalPages}</span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 rounded border border-stone-200 disabled:opacity-30 hover:bg-stone-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
