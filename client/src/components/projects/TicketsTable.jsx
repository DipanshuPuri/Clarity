import React from 'react';
import { ChevronRight, Clock, AlertCircle } from 'lucide-react';

const TicketStatusBadge = ({ status }) => {
    const styles = {
        'To Do': 'bg-slate-50 text-slate-400 border-slate-100',
        'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
        'Done': 'bg-green-50 text-green-600 border-green-100'
    };

    return (
        <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border whitespace-nowrap inline-block ${styles[status]}`}>
            {status}
        </span>
    );
};

const PriorityIndicator = ({ priority }) => {
    const colors = {
        'Critical': 'bg-red-500',
        'High': 'bg-orange-500',
        'Medium': 'bg-blue-500',
        'Low': 'bg-slate-300'
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colors[priority]} ${priority === 'Critical' ? 'animate-pulse' : ''}`} />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{priority}</span>
        </div>
    );
};

const TicketsTable = ({ tickets, onTicketClick }) => {
    const [sortConfig, setSortConfig] = React.useState({ key: 'createdAt', direction: 'desc' });

    const sortedTickets = [...tickets].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested assignee name
        if (sortConfig.key === 'assignee') {
            const nameA = a.assignee ? (a.assignee.firstName || a.assignee.email) : '';
            const nameB = b.assignee ? (b.assignee.firstName || b.assignee.email) : '';
            aValue = nameA;
            bValue = nameB;
        }

        // Handle Priority (Tactical Scale)
        if (sortConfig.key === 'priority') {
            const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
            aValue = priorityWeight[a.priority] || 0;
            bValue = priorityWeight[b.priority] || 0;
        }

        // Handle dates
        if (sortConfig.key === 'createdAt') {
            aValue = new Date(aValue).getTime();
            bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const Header = ({ label, sortKey, align = 'left' }) => (
        <th
            onClick={() => requestSort(sortKey)}
            className={`px-6 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap cursor-pointer hover:text-slate-900 transition-colors group ${align === 'center' ? 'text-center' : ''}`}
        >
            <div className={`flex items-center gap-2 ${align === 'center' ? 'justify-center' : ''}`}>
                {label}
                <div className={`flex flex-col opacity-0 group-hover:opacity-100 transition-opacity ${sortConfig.key === sortKey ? 'opacity-100' : ''}`}>
                    <ChevronRight className={`w-2 h-2 -rotate-90 transition-colors ${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-secondary' : 'text-slate-300'}`} />
                    <ChevronRight className={`w-2 h-2 rotate-90 transition-colors ${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-secondary' : 'text-slate-300'}`} />
                </div>
            </div>
        </th>
    );

    return (
        <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm animate-fade-slide-up">
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.3em]">Operational Tickets</h3>
                <div className="flex items-center gap-4">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Tactical Sort: {sortConfig.key.toUpperCase()} ({sortConfig.direction})
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/30 border-b border-slate-50">
                            <Header label="Ticket ID" sortKey="id" />
                            <Header label="Operational Title" sortKey="title" />
                            <Header label="Assignee" sortKey="assignee" align="center" />
                            <Header label="Status" sortKey="status" />
                            <Header label="Priority" sortKey="priority" />
                            <Header label="Initialized" sortKey="createdAt" />
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedTickets.length > 0 ? (
                            sortedTickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    onClick={() => onTicketClick(ticket)}
                                    className={`group hover:bg-slate-50/50 cursor-pointer transition-all duration-300 relative ${ticket.status === 'Done' ? 'opacity-60 grayscale-[0.3]' : ''}`}
                                >
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <span className="text-[10px] font-bold text-slate-900 tracking-tight group-hover:text-secondary transition-colors">
                                            {ticket.id.slice(0, 8)}...
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex flex-col gap-0.5">
                                            <p className={`text-[13px] font-bold text-slate-900 truncate max-w-[280px] ${ticket.status === 'Done' ? 'line-through text-slate-400' : ''}`}>
                                                {ticket.title}
                                            </p>
                                            {ticket.handoffs?.length > 0 && !ticket.handoffs[0].acceptedAt && (
                                                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis w-max bg-amber-50 px-1.5 py-0.5 border border-amber-500/20 rounded">
                                                    Awaiting {ticket.handoffs[0].toRole} Acceptance
                                                </span>
                                            )}
                                            {ticket.releases?.length > 0 && (
                                                <div className="flex gap-1 mt-0.5">
                                                    {ticket.releases.map(r => (
                                                        <span key={r.id} className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis w-max bg-indigo-50 px-1.5 py-0.5 border border-indigo-500/20 rounded">
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            {ticket.assignee ? (
                                                <>
                                                    {ticket.assignee.profilePicture ? (
                                                        <img src={ticket.assignee.profilePicture} className="w-5 h-5 rounded-md opacity-80" alt="" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                            {ticket.assignee.firstName?.[0] || ticket.assignee.email?.[0] || '?'}
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                                        {ticket.assignee.firstName || ticket.assignee.email?.split('@')[0] || 'Unknown'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">Unassigned</span>
                                            )}
                                            {ticket.handoffs?.length > 0 && !ticket.handoffs[0].acceptedAt && (
                                                <div className="absolute top-1 right-2 animate-pulse bg-amber-500 rounded-full w-1.5 h-1.5" title="Awaiting Acceptance" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <TicketStatusBadge status={ticket.status} />
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <PriorityIndicator priority={ticket.priority} />
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span className="text-[9px] font-semibold">
                                                {new Date(ticket.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-200 group-hover:text-secondary transition-all" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-8 py-20 text-center">
                                    <div className="space-y-4">
                                        <AlertCircle className="w-10 h-10 text-slate-100 mx-auto" />
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">No tickets initialized for this container.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketsTable;
