import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Activity, ShieldAlert, X, Zap } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Default simulation data for mock releases
const MOCK_SIMULATION = {
    simulatedReadinessScore: 67,
    remainingCriticalWork: 3,
    predictedDelay: 48,
    simulatedRisks: [
        { type: 'INCOMPLETE_CHECKLIST', message: '2 verification gates remain incomplete and will carry into frozen state.' },
        { type: 'MISSING_OWNER', message: 'QA Owner is unassigned — quality gate verification cannot proceed without a designated reviewer.' },
        { type: 'BLOCKED_CRITICAL', message: '1 critical ticket is still in progress and may not complete before freeze window.' }
    ]
};

const ReleaseImpactPreviewModal = ({ isOpen, onClose, release, onConfirmFreeze }) => {
    const { user } = useAuth();
    const token = user?.token;
    const [simulation, setSimulation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renderState, setRenderState] = useState(isOpen ? 'open' : 'closed');

    useEffect(() => {
        if (isOpen) setRenderState('open');
        else if (renderState === 'open') {
            setRenderState('closing');
            setTimeout(() => setRenderState('closed'), 300);
        }
    }, [isOpen, renderState]);

    useEffect(() => {
        if (renderState === 'closed') return;
        const handleKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [renderState, onClose]);

    useEffect(() => {
        if (renderState === 'closed' || !release) return;
        setLoading(true);
        const simulate = async () => {
            try {
                if (token && !release.id?.startsWith('rel-')) {
                    const res = await axios.get(`/api/releases/${release.id}/simulate`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setSimulation(res.data);
                } else {
                    throw new Error('Mock mode');
                }
            } catch (e) {
                // Fallback to mock simulation
                setSimulation({
                    ...MOCK_SIMULATION,
                    simulatedReadinessScore: Math.min(100, release.readinessScore + 25)
                });
            } finally {
                setLoading(false);
            }
        };
        simulate();
    }, [renderState, release, token]);

    if (renderState === 'closed' || !release) return null;

    const isClosing = renderState === 'closing';

    return ReactDOM.createPortal(
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}>
            <div className={`bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${isClosing ? 'animate-slide-down-out' : 'animate-slide-up'}`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                            <Activity className="w-4 h-4 text-amber-500" />
                        </div>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500">Impact Simulation</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-slate-400 hover:text-white" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-xs font-bold text-slate-500">
                        Warning: Initiating <span className="text-amber-500 uppercase tracking-widest mx-1">Code Freeze</span> will restrict subsequent additions or removals from the release scope. Below is the computational diagnostic if frozen immediately.
                    </p>

                    {loading ? (
                        <div className="h-40 flex flex-col items-center justify-center gap-3">
                            <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-amber-500 animate-spin" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Running impact telemetry...</p>
                        </div>
                    ) : simulation ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Readiness Predict</span>
                                    <div className="mt-2 text-3xl font-bold text-slate-900">{simulation.simulatedReadinessScore}%</div>
                                </div>
                                <div className="p-4 rounded-xl border border-red-100 bg-red-50/50 flex flex-col items-center text-center">
                                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Critical Backlog</span>
                                    <div className="mt-2 text-3xl font-bold text-red-500">{simulation.remainingCriticalWork}</div>
                                </div>
                                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex flex-col items-center text-center">
                                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Predicted Delay</span>
                                    <div className="mt-2 text-3xl font-bold text-amber-600">+{simulation.predictedDelay}h</div>
                                </div>
                            </div>

                            {simulation.simulatedRisks && simulation.simulatedRisks.length > 0 && (
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Projected Risks</h4>
                                    <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                                        {simulation.simulatedRisks.map((risk, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                                <ShieldAlert className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                                <div>
                                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{risk.type.replace(/_/g, ' ')}</span>
                                                    <p className="text-xs font-bold text-slate-500 mt-0.5">{risk.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-red-500">Failed to load simulation data.</p>
                    )}
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirmFreeze();
                            onClose();
                        }}
                        disabled={loading}
                        className="px-5 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                        <Zap className="w-4 h-4 fill-white" />
                        Execute Force Freeze
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReleaseImpactPreviewModal;
