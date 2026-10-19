import React, { useState, useMemo } from 'react';
import {
  Phone,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Building,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCalling } from '../context/CallingContext';
import { Badge } from '../components/common/Badge';
import { ScoreMeter } from '../components/common/ScoreMeter';
import { Lead } from '../types';

export const CallsToMake: React.FC = () => {
  const { leads, openLeadModal } = useApp();
  const { startCall } = useCalling();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'value' | 'icp' | 'name'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
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

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Filter & Sort
  const processedLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesSearch =
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery) ||
          lead.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'priority') {
          const pOrder: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          comp = (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        } else if (sortBy === 'value') {
          comp = b.potentialValue - a.potentialValue;
        } else if (sortBy === 'icp') {
          comp = b.icpScore - a.icpScore;
        } else if (sortBy === 'name') {
          comp = a.name.localeCompare(b.name);
        }
        return sortOrder === 'desc' ? comp : -comp;
      });
  }, [leads, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedLeads.length / itemsPerPage) || 1;
  const paginatedLeads = processedLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal tracking-tight">Calls to Make</h1>
            <Badge variant="sage" size="sm">
              {leads.length} Prioritized Leads
            </Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-1">
            Real-time pipeline ordered by buying intent, ICP fit, and urgency.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-ivory-border shadow-2xs text-xs">
          <span className="font-semibold text-charcoal-muted">Pipeline Value:</span>
          <span className="font-extrabold text-charcoal">
            {formatCurrency(leads.reduce((sum, l) => sum + l.potentialValue, 0))}
          </span>
        </div>
      </div>

      {/* Search, Filter, Sort Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-ivory-border shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by customer name, company, phone, or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-ivory-subtle border border-ivory-border rounded-xl text-xs font-medium text-charcoal placeholder-charcoal-muted/70 focus:outline-none focus:border-sage"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-ivory-subtle border border-ivory-border text-xs font-semibold text-charcoal focus:outline-none focus:border-sage"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-Up">Follow-Up</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-ivory-subtle border border-ivory-border text-xs font-semibold text-charcoal focus:outline-none focus:border-sage"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-ivory-subtle border border-ivory-border text-xs font-semibold text-charcoal focus:outline-none focus:border-sage"
          >
            <option value="priority">Sort: Priority</option>
            <option value="value">Sort: Deal Value</option>
            <option value="icp">Sort: ICP Score</option>
            <option value="name">Sort: Name</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className="p-2 rounded-xl bg-ivory-subtle border border-ivory-border text-charcoal hover:bg-ivory transition-colors"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="bg-white rounded-3xl border border-ivory-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory-subtle border-b border-ivory-border text-[11px] font-bold uppercase tracking-wider text-charcoal-muted">
                <th className="py-3.5 px-4 w-12 text-center">Expand</th>
                <th className="py-3.5 px-4">Lead & Organization</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Scores (ICP / Intent)</th>
                <th className="py-3.5 px-4">Deal Value</th>
                <th className="py-3.5 px-4">Next Deadline</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-border text-xs">
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => {
                  const isExpanded = expandedLeadIds.has(lead.id);

                  return (
                    <React.Fragment key={lead.id}>
                      <tr className="hover:bg-ivory/60 transition-colors group">
                        {/* Expand toggle */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleRowExpand(lead.id)}
                            className="p-1 rounded-md text-charcoal-muted hover:text-charcoal hover:bg-ivory-border/50"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Name & Title */}
                        <td className="py-3.5 px-4">
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => openLeadModal(lead.id)}
                          >
                            <img
                              src={lead.avatar}
                              alt={lead.name}
                              className="w-9 h-9 rounded-xl object-cover border border-sage-light"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-charcoal group-hover:text-sage transition-colors">
                                  {lead.name}
                                </span>
                                <Badge
                                  variant={lead.priority === 'Urgent' ? 'urgent' : 'gold'}
                                  size="sm"
                                >
                                  {lead.priority}
                                </Badge>
                              </div>
                              <p className="text-[11px] text-charcoal-muted">
                                {lead.title} • {lead.company}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3.5 px-4 font-mono font-medium text-sage-text">
                          {lead.phone}
                        </td>

                        {/* Scores */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-sage-light text-sage-text font-bold text-[11px] border border-sage-border">
                              ICP {lead.icpScore}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-gold-light text-gold-text font-bold text-[11px] border border-gold-border">
                              Intent {lead.intentScore}
                            </span>
                          </div>
                        </td>

                        {/* Value */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-charcoal text-sm">
                            {formatCurrency(lead.potentialValue)}
                          </span>
                        </td>

                        {/* Next action deadline */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal-muted">
                          {lead.nextActionDeadline}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <Badge variant="sage" size="sm">
                            {lead.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openLeadModal(lead.id)}
                              className="p-2 rounded-xl bg-white border border-ivory-border text-charcoal-muted hover:text-charcoal hover:bg-ivory shadow-2xs transition-colors"
                              title="Inspect Full Lead File"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                startCall({
                                  id: lead.id,
                                  name: lead.name,
                                  company: lead.company,
                                  phone: lead.phone,
                                })
                              }
                              className="px-3.5 py-1.5 rounded-xl bg-sage hover:bg-sage-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
                            >
                              <Phone className="w-3.5 h-3.5 fill-white" />
                              <span>Call</span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Accordion Row */}
                      {isExpanded && (
                        <tr className="bg-ivory-subtle/70">
                          <td colSpan={8} className="p-4 border-t border-b border-ivory-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Notes */}
                              <div className="bg-white p-3 rounded-xl border border-ivory-border">
                                <span className="font-bold text-charcoal text-[11px] uppercase tracking-wider block mb-1">
                                  Current Deal Context & Notes
                                </span>
                                <p className="text-charcoal-muted leading-relaxed">{lead.notes}</p>
                              </div>

                              {/* Buying Signals preview */}
                              <div className="bg-white p-3 rounded-xl border border-ivory-border">
                                <span className="font-bold text-charcoal text-[11px] uppercase tracking-wider block mb-1">
                                  Latest Buying Signal
                                </span>
                                {lead.buyingSignals[0] && (
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <Zap className="w-3.5 h-3.5 text-gold-text" />
                                      <span className="font-bold text-charcoal">
                                        {lead.buyingSignals[0].title}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-charcoal-muted mt-1">
                                      {lead.buyingSignals[0].description}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Quick CTA */}
                              <div className="bg-white p-3 rounded-xl border border-ivory-border flex flex-col justify-between">
                                <div>
                                  <span className="font-bold text-charcoal text-[11px] uppercase tracking-wider block mb-1">
                                    Last Contact
                                  </span>
                                  <p className="text-charcoal-muted">{lead.lastContact}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => openLeadModal(lead.id)}
                                  className="mt-2 text-xs font-bold text-sage hover:underline flex items-center gap-1"
                                >
                                  <span>View contact history & timeline →</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                    No leads found matching your search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-ivory-subtle border-t border-ivory-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-charcoal-muted font-medium">
            Showing{' '}
            <span className="font-bold text-charcoal">
              {Math.min(processedLeads.length, (currentPage - 1) * itemsPerPage + 1)}
            </span>{' '}
            to{' '}
            <span className="font-bold text-charcoal">
              {Math.min(processedLeads.length, currentPage * itemsPerPage)}
            </span>{' '}
            of <span className="font-bold text-charcoal">{processedLeads.length}</span> leads
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-ivory-border bg-white text-charcoal hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 font-bold text-charcoal">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-ivory-border bg-white text-charcoal hover:bg-ivory disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
