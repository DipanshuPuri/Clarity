import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Circle, Lock, Unlock } from 'lucide-react';

const ReleaseChecklistPanel = ({ releaseId, mockChecklists }) => {
    const { user } = useAuth();
    const token = user?.token;
    const [checklists, setChecklists] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'FOUNDER';

    const fetchChecklists = async () => {
        try {
            if (token && !releaseId?.startsWith('rel-')) {
                const res = await axios.get(`/api/releases/${releaseId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const fetched = res.data.checklists || [];
                if (fetched.length > 0) {
                    setChecklists(fetched);
                } else if (mockChecklists) {
                    setChecklists(mockChecklists);
                }
            } else if (mockChecklists) {
                setChecklists(mockChecklists);
            }
        } catch (e) {
            console.error("Failed to fetch checklists", e);
            if (mockChecklists) setChecklists(mockChecklists);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (releaseId) fetchChecklists();
    }, [releaseId, token]);

    const toggleChecklist = async (checklistId, currentState) => {
        if (!isAdmin) return;

        // Optimistic UI update
        setChecklists(prev => prev.map(c => c.id === checklistId ? { ...c, completionState: !currentState } : c));

        try {
            if (token && !releaseId?.startsWith('rel-')) {
                await axios.patch(`/api/releases/${releaseId}/checklists/${checklistId}/toggle`,
                    { completionState: !currentState },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (e) {
            console.error("Toggle error", e);
            // Revert on fail
            setChecklists(prev => prev.map(c => c.id === checklistId ? { ...c, completionState: currentState } : c));
        }
    };

    if (loading) return <div className="text-[10px] font-bold text-slate-400 p-4 uppercase tracking-widest text-center">Loading verification gates...</div>;

    if (checklists.length === 0) return (
        <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No verification gates configured.</p>
        </div>
    );

    return (
        <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Verification Gates</span>
                <span className="text-[9px] text-slate-400 font-bold">{checklists.filter(c => c.completionState).length}/{checklists.length} Complete</span>
            </h4>
            <div className="space-y-2">
                {checklists.map(item => (
                    <div
                        key={item.id}
                        onClick={() => toggleChecklist(item.id, item.completionState)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all group ${isAdmin ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : 'cursor-not-allowed opacity-80'} ${item.completionState ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-3">
                            {item.completionState ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                                <Circle className="w-4 h-4 text-slate-300 shrink-0 group-hover:text-slate-400 transition-colors" />
                            )}
                            <span className={`text-[11px] font-bold leading-tight ${item.completionState ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                {item.title}
                            </span>
                        </div>
                        <div className="shrink-0 pl-2">
                            {isAdmin ? (
                                item.completionState ? <Lock className="w-3 h-3 text-emerald-400/50 group-hover:text-amber-500 transition-colors" /> : <Unlock className="w-3 h-3 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            ) : (
                                <Lock className="w-3 h-3 text-slate-300" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReleaseChecklistPanel;
