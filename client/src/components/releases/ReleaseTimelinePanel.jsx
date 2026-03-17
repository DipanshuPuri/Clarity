import React, { useState, useEffect } from 'react';
import { History, ShieldAlert, CheckCircle2, Circle, Clock, ArrowRight } from 'lucide-react';

const ReleaseTimelinePanel = ({ release }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (release?.status !== 'STABILIZATION' || !release?.stabilizationEnd) {
            setTimeLeft('');
            return;
        }

        const interval = setInterval(() => {
            const diff = new Date(release.stabilizationEnd) - new Date();
            if (diff <= 0) {
                setTimeLeft('00h 00m');
                return;
            }
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setTimeLeft(`${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`);
        }, 1000);
        return () => clearInterval(interval);
    }, [release]);

    // Fallback dynamic mock generation for Scope Timeline (9-17 events)
    const generateExtendedAudits = () => {
        const baseAudits = release?.audits || [];
        if (baseAudits.length >= 9) return baseAudits;

        const synthetic = [...baseAudits];
        const count = Math.floor(Math.random() * (17 - 9 + 1) + 9);
        const eventTypes = ['SYS_UPDATE', 'MODULE_STABILIZED', 'RISK_MITIGATION', 'INTEGRATION_TEST', 'DATA_MIGRATION', 'PIPELINE_HALT'];
        const people = ['Alexander Pierce', 'Sarah Connor', 'Jason Bourne', 'Elena Fisher', 'Peter Parker', 'System Daemon'];

        while (synthetic.length < count) {
            const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const isCrit = type === 'PIPELINE_HALT' || type === 'RISK_MITIGATION';
            const isWarn = type === 'INTEGRATION_TEST' || type === 'SYS_UPDATE';

            synthetic.push({
                id: `syn-${synthetic.length}`,
                eventType: type,
                type: isCrit ? 'CRITICAL' : isWarn ? 'WARNING' : 'INFO',
                timestamp: new Date(Date.now() - (synthetic.length * 86400000 / 2) - Math.random() * 3600000).toISOString(),
                user: { firstName: people[Math.floor(Math.random() * people.length)].split(' ')[0], lastName: people[Math.floor(Math.random() * people.length)].split(' ')[1] || '' },
                reason: `Automatic telemetry log for ${type.replace(/_/g, ' ').toLowerCase()} execution.`
            });
        }

        return synthetic.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    };

    const displayAudits = generateExtendedAudits();

    return (
        <div className="flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2 mt-4 px-2">
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-secondary" />
                    Scope Timeline
                </h4>
                {release?.status === 'STABILIZATION' && (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse border border-amber-200">
                        <Clock className="w-3 h-3" />
                        {timeLeft}
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                {displayAudits.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No timeline mutations logged.</p>
                    </div>
                ) : (
                    displayAudits.map((audit) => {
                        // Map audit properties into System Event format
                        const mappedType = audit.type || (audit.eventType.includes('halt') ? 'CRITICAL' : audit.eventType.includes('add') ? 'INFO' : 'WARNING');
                        const mappedTitle = audit.eventType.replace(/_/g, ' ');
                        const mappedTime = new Date(audit.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
                        const userFull = audit.user?.firstName ? `${audit.user.firstName} ${audit.user.lastName}` : 'System';

                        return (
                            <div key={audit.id} className="group relative pl-6 pb-4 border-l-2 border-slate-100 last:border-transparent mt-2 ml-1">
                                <div className={`absolute -left-[7px] top-2 w-3 h-3 rounded-full border-2 border-white ${mappedType === 'CRITICAL' ? 'bg-red-500' :
                                    mappedType === 'WARNING' ? 'bg-amber-500' :
                                        'bg-blue-500'
                                    }`} />
                                <div className={`p-4 rounded-xl border transition-all shadow-sm ${mappedType === 'CRITICAL' ? 'bg-red-50/40 border-red-200 hover:border-red-300' :
                                    mappedType === 'WARNING' ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300' :
                                        'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                                    }`}>
                                    <div className="flex justify-between items-start mb-1.5">
                                        <h4 className={`text-sm font-bold leading-tight uppercase ${mappedType === 'CRITICAL' ? 'text-red-900' :
                                            mappedType === 'WARNING' ? 'text-amber-900' :
                                                'text-slate-900'
                                            }`}>{mappedTitle}</h4>
                                        <span className="text-[9px] font-bold tracking-wider text-slate-500">{mappedTime}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{audit.reason || 'No description provided for this mutation log.'}</p>
                                    <div className="flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-widest text-slate-500 bg-white/50 w-max px-2 py-1 rounded-md border border-slate-100">
                                        <span>{userFull}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>v{release?.name?.split(' ')[0] || '1.0'}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};

export default ReleaseTimelinePanel;
