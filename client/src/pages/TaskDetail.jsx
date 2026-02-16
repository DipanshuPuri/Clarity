import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, Target, Zap, Activity, ClipboardCheck, Info, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * TaskDetail - The Minimalist Execution Unit
 * 
 * Logic:
 * - Cannot be marked DONE without an Outcome.
 * - Minimalist UI, white surface.
 * - Hierarchy: Decision (Strategy) -> Task (Execution)
 */
const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [decision, setDecision] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Outcome Form State
    const [showOutcomeForm, setShowOutcomeForm] = useState(false);
    const [outcomeNotes, setOutcomeNotes] = useState('');
    const [outcomeLearning, setOutcomeLearning] = useState('');
    const [outcomeResult, setOutcomeResult] = useState('SUCCESS');
    const [submitting, setSubmitting] = useState(false);

    const API_BASE_URL = 'http://localhost:3000';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const taskRes = await fetch(`${API_BASE_URL}/api/tasks/${id}`, { credentials: 'include' });
                if (!taskRes.ok) throw new Error('Execution context not found');
                const taskData = await taskRes.json();
                setTask(taskData);

                if (taskData.decisionId) {
                    const decisionRes = await fetch(`${API_BASE_URL}/api/decisions/${taskData.decisionId}`, { credentials: 'include' });
                    if (decisionRes.ok) {
                        setDecision(await decisionRes.json());
                    }
                }
            } catch (err) {
                setError('Failed to synchronize execution context.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCloseLoop = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // 1. Create Outcome
            const outcomeRes = await fetch(`${API_BASE_URL}/api/outcomes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    taskId: task.id,
                    result: outcomeResult,
                    notes: outcomeNotes,
                    learning: outcomeLearning
                })
            });

            if (!outcomeRes.ok) {
                const err = await outcomeRes.json();
                throw new Error(err.error || 'Outcome recording failed');
            }

            // Refresh local state (Task status is updated by server transaction)
            const finalRes = await fetch(`${API_BASE_URL}/api/tasks/${id}`, { credentials: 'include' });
            setTask(await finalRes.json());
            setShowOutcomeForm(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-slate-900">
                <div className="w-10 h-10 border-2 border-t-secondary border-slate-100 rounded-full animate-spin"></div>
                <span className="text-slate-400 text-sm font-medium animate-pulse">Syncing Execution Context...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-danger/5 border border-danger/20 rounded-xl text-danger flex items-center gap-3">
            <span className="font-medium">{error}</span>
        </div>
    );

    const isDone = task?.status === 'DONE';

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full -m-6 p-6 md:p-10 bg-white">

            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between gap-8 mb-12">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ml-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                    <ArrowLeft className="w-4 h-4" /> Back to Strategy
                </Button>
                <div className="flex items-center gap-4">
                    {isDone ? (
                        <div className="px-3 py-1 bg-green-50 rounded-full border border-green-100 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Execution Verified</span>
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-2">
                            <Activity className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">In Progress</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">

                {/* Task Brief */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-5 h-5 text-secondary" />
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">Execution Unit</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{task?.title}</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">The Action (How?)</label>
                            <p className="text-sm text-slate-900 leading-relaxed font-medium">
                                {task?.executionDescription}
                            </p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-6">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">The Target (Expected Outcome)</label>
                            <p className="text-sm text-slate-900 leading-relaxed font-medium">
                                {task?.expectedOutcome}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Parent Context Link */}
                <Link to={`/decisions/${decision?.id}`} className="block group">
                    <div className="p-6 bg-[#f8fafc] rounded-3xl border border-slate-100 flex items-center justify-between group-hover:border-secondary/20 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <Zap className="w-5 h-5 text-slate-300 group-hover:text-secondary transition-colors" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Derived from Strategy</p>
                                <h4 className="text-sm font-bold text-slate-900 group-hover:text-secondary transition-colors">{decision?.title}</h4>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                    </div>
                </Link>

                {/* Outcome / Feedback Loop */}
                <div className="pt-8 border-t border-slate-100">
                    {!isDone ? (
                        !showOutcomeForm ? (
                            <div className="p-10 bg-slate-900 rounded-[40px] text-white flex flex-col items-center text-center space-y-6">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                                    <ClipboardCheck className="w-8 h-8 text-secondary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Ready to close the context loop?</h3>
                                    <p className="text-sm text-slate-400 max-w-sm mx-auto">Tasks cannot be marked as DONE until an Outcome reality is recorded for traceability.</p>
                                </div>
                                <Button onClick={() => setShowOutcomeForm(true)} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-extrabold uppercase text-xs tracking-widest hover:bg-slate-100 transition-all shadow-xl shadow-slate-900/50">
                                    Record Outcome & Finish
                                </Button>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-top-4 duration-300 p-10 bg-slate-50 rounded-[40px] border border-slate-100 shadow-sm">
                                <form onSubmit={handleCloseLoop} className="space-y-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-900">Closing Execution Loop</h3>
                                        <button onClick={() => setShowOutcomeForm(false)} className="text-slate-400 hover:text-slate-900 font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reality Assessment</label>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setOutcomeResult('SUCCESS')}
                                                className={`flex-1 py-5 rounded-2xl border-2 font-bold uppercase text-[px] tracking-widest transition-all ${outcomeResult === 'SUCCESS' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-white border-slate-100 text-slate-400'}`}
                                            >Success</button>
                                            <button
                                                type="button"
                                                onClick={() => setOutcomeResult('PARTIAL')}
                                                className={`flex-1 py-5 rounded-2xl border-2 font-bold uppercase text-[9px] tracking-widest transition-all ${outcomeResult === 'PARTIAL' ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white border-slate-100 text-slate-400'}`}
                                            >Partial</button>
                                            <button
                                                type="button"
                                                onClick={() => setOutcomeResult('FAILED')}
                                                className={`flex-1 py-5 rounded-2xl border-2 font-bold uppercase text-[9px] tracking-widest transition-all ${outcomeResult === 'FAILED' ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white border-slate-100 text-slate-400'}`}
                                            >Failure</button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Reality (What happened?)</label>
                                            <textarea
                                                className="w-full h-48 bg-white border border-slate-200 rounded-[32px] p-8 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all resize-none"
                                                value={outcomeNotes}
                                                onChange={(e) => setOutcomeNotes(e.target.value)}
                                                placeholder="Compare result with expected outcome..."
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Learning (What would we change?)</label>
                                            <textarea
                                                className="w-full h-48 bg-white border border-slate-200 rounded-[32px] p-8 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-secondary/5 transition-all resize-none"
                                                value={outcomeLearning}
                                                onChange={(e) => setOutcomeLearning(e.target.value)}
                                                placeholder="What did this execution teach us for future intents?"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={submitting} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10">
                                            {submitting ? 'Finalizing...' : 'Submit Reflection & Close Loop'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )
                    ) : (
                        <div className="space-y-8">
                            <div className="flex items-center gap-4 text-slate-900">
                                <ShieldCheck className="w-8 h-8 text-secondary" />
                                <div className="space-y-0.5">
                                    <h4 className="text-xl font-bold tracking-tight">Post-Mortem Reflection</h4>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Learning Loop Closed & Immutable</p>
                                </div>
                            </div>

                            <div className="p-10 bg-[#fbfcfd] rounded-[48px] border border-slate-100 shadow-sm space-y-12">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${task?.outcome?.result === 'SUCCESS' ? 'bg-green-50 border-green-100 text-green-600' :
                                            task?.outcome?.result === 'PARTIAL' ? 'bg-yellow-50 border-yellow-100 text-yellow-600' :
                                                'bg-red-50 border-red-100 text-red-600'
                                        }`}>
                                        {task?.outcome?.result}
                                    </span>
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Verified Archive</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">The Reality</label>
                                        <p className="text-md text-slate-800 leading-relaxed font-serif italic">
                                            "{task?.outcome?.notes}"
                                        </p>
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">The Learning</label>
                                        <p className="text-md text-slate-800 leading-relaxed font-serif italic">
                                            "{task?.outcome?.learning}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
