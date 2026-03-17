import React from 'react';
import { Activity, MessageSquare, RefreshCw, UserPlus, Zap } from 'lucide-react';

const ActivityIcon = ({ type }) => {
    switch (type) {
        case 'status_change': return <RefreshCw className="w-3 h-3 text-blue-500" />;
        case 'comment': return <MessageSquare className="w-3 h-3 text-secondary" />;
        case 'project_update': return <Zap className="w-3 h-3 text-amber-500" />;
        default: return <Activity className="w-3 h-3 text-slate-400" />;
    }
};

const ActivityTimeline = ({ activities }) => {
    return (
        <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-6 animate-fade-in h-full">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                <Activity className="w-4 h-4 text-secondary" />
                <h3 className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.2em]">Operational Timeline</h3>
            </div>

            <div className="relative space-y-6 pl-6">
                {/* Vertical Line */}
                <div className="absolute left-[9px] top-2 bottom-4 w-px bg-slate-100" />

                {activities.map((act, i) => (
                    <div key={i} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-md bg-white border border-slate-100 flex items-center justify-center shadow-sm z-10 group-hover:border-secondary/30 transition-colors">
                            <ActivityIcon type={act.type} />
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">
                                    {act.user.split(' ')[0]}
                                </span>
                                <span className="text-[8px] font-medium text-slate-300 uppercase whitespace-nowrap">
                                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-tight">
                                {act.content}
                            </p>
                            {act.ticketId && (
                                <div className="inline-flex items-center px-1 py-0.5 bg-slate-50 border border-slate-100 rounded text-[7px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {act.ticketId}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {activities.length === 0 && (
                    <div className="py-10 text-center">
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No activities recorded.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityTimeline;
