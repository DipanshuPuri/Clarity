import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ShieldAlert, Server, ArrowRight, X, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DeployReleaseModal = ({ isOpen, onClose, release }) => {
    const { user } = useAuth();
    const token = user?.token;
    const [environment, setEnvironment] = useState('Production');
    const [confirmText, setConfirmText] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'FOUNDER';
    const [renderState, setRenderState] = useState(isOpen ? 'open' : 'closed');

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setConfirmText('');
            setError(null);
            setSuccess(false);
            setIsDeploying(false);
            setRenderState('open');
        } else if (renderState === 'open') {
            setRenderState('closing');
            setTimeout(() => setRenderState('closed'), 300);
        }
    }, [isOpen, renderState]);

    // Escape key handler
    useEffect(() => {
        if (renderState === 'closed') return;
        const handleKey = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [renderState, onClose]);

    if (renderState === 'closed' || !release) return null;

    const isClosing = renderState === 'closing';

    // Always require typing "Confirm" for deployment safety
    const confirmTarget = 'Confirm';
    const isConfirmed = confirmText.toLowerCase() === confirmTarget.toLowerCase();

    // Environment descriptions for clarity
    const envDescriptions = {
        Production: 'Live environment — changes visible to all end users',
        Staging: 'Pre-production replica — final validation before live',
        Sandbox: 'Isolated testing — no impact on real data'
    };

    const handleDeploy = async () => {
        if (!isConfirmed) return;
        setIsDeploying(true);
        setError(null);
        try {
            if (token && !release.id.startsWith('rel-')) {
                await axios.post(`/api/releases/${release.id}/deploy`,
                    { environment },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            // Mock success for demo releases
            setSuccess(true);
            setTimeout(() => onClose(), 1500);
        } catch (e) {
            setError(e.response?.data?.error || 'Deployment initiated successfully (demo mode).');
            // For mock data, treat as success
            if (release.id.startsWith('rel-')) {
                setSuccess(true);
                setTimeout(() => onClose(), 1500);
            }
        } finally {
            setIsDeploying(false);
        }
    };

    return ReactDOM.createPortal(
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
            onClick={onClose}
        >
            <div
                className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${isClosing ? 'animate-slide-down-out' : 'animate-slide-up'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <Server className="w-4 h-4 text-emerald-600" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Execute Deployment</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {success && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                            <Server className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-emerald-600">Deployment sequence initiated successfully. Transitioning to STABILIZATION.</p>
                        </div>
                    )}

                    {error && !success && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-red-600">{error}</p>
                        </div>
                    )}

                    {!isAdmin && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3 mb-4">
                            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-amber-700">Deployments require ADMIN authorization. You cannot execute this action.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                Deployment Target
                                <span className="text-slate-300 font-normal normal-case tracking-normal text-[9px]">— where this release will be deployed</span>
                            </label>
                            <select
                                value={environment}
                                onChange={(e) => setEnvironment(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer"
                            >
                                <option value="Production">Production Core</option>
                                <option value="Staging">Staging Replica</option>
                                <option value="Sandbox">Sandbox Testing</option>
                            </select>
                            <div className="flex items-center gap-2 mt-1">
                                <Info className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] text-slate-400 font-medium">{envDescriptions[environment]}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 rounded-xl space-y-3">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                Deployment Payload
                                <span className="text-emerald-400">{release.tickets?.filter(t => t.status.toLowerCase() === 'done').length || 0} Shipped</span>
                            </h4>
                            <div className="text-xs font-bold text-slate-300">
                                Initiating deployment will transition release to <span className="text-amber-400">STABILIZATION</span> for 72 hours. Analytics telemetry will be locked to the current Immutable Snapshot.
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 pt-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Type "<span className="text-secondary">{confirmTarget}</span>" to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder={confirmTarget}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            />
                            {confirmText.length > 0 && !isConfirmed && (
                                <span className="text-[10px] text-slate-400 font-medium mt-1">Type "Confirm" to proceed</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-200 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleDeploy}
                        disabled={!isConfirmed || isDeploying || !isAdmin || success}
                        className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isDeploying ? 'Executing...' : success ? 'Deployed' : 'Deploy Release'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeployReleaseModal;
