import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { intentsApi } from '../api/intents';
import { decisionsApi } from '../api/decisions';
import { authApi } from '../api/auth';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import { Target, ArrowLeft, Plus, MessageSquare, Zap, ArrowRight, CheckCircle, Info, Lock } from 'lucide-react';

/**
 * IntentView - Re-imagined as a formal Brief.
 * 
 * Logic:
 * - Read-only once a Decision exists.
 * - Formal logic: Title, Assumption, Success Signal.
 * UI: White surface.
 */
const IntentView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [intent, setIntent] = useState(null);
    const [decisions, setDecisions] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Decision Creation State
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [chosenOption, setChosenOption] = useState('');
    const [rationale, setRationale] = useState('');
    const [rejectedAlternatives, setRejectedAlternatives] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_BASE_URL = 'http://localhost:3000';
                const intentRes = await fetch(`${API_BASE_URL}/api/intents/${id}`, { credentials: 'include' });
                if (!intentRes.ok) throw new Error('Intent context not found');
                const intentData = await intentRes.json();

                const [decisionsData, userData] = await Promise.all([
                    decisionsApi.getDecisions(id),
                    authApi.getCurrentUser()
                ]);

                setIntent(intentData);
                setDecisions(decisionsData || []);
                setUser(userData?.user);
            } catch (err) {
                setError('Failed to synchronize decision loop.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateDecision = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newDecision = await decisionsApi.createDecision(
                id,
                title,
                chosenOption,
                rationale,
                rejectedAlternatives
            );
            setDecisions([...decisions, newDecision]);

            // Refresh intent to update read-only state if count changes
            const API_BASE_URL = 'http://localhost:3000';
            const intentRes = await fetch(`${API_BASE_URL}/api/intents/${id}`, { credentials: 'include' });
            const updatedIntent = await intentRes.json();
            setIntent(updatedIntent);

            setTitle('');
            setChosenOption('');
            setRationale('');
            setRejectedAlternatives('');
            setShowForm(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const isReadOnly = intent?._count?.decisions > 0;

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-slate-900">
                <div className="w-10 h-10 border-2 border-t-secondary border-slate-100 rounded-full animate-spin"></div>
                <span className="text-slate-400 text-sm font-medium animate-pulse">Consulting Brief...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-8 bg-danger/5 border border-danger/20 rounded-xl text-danger flex items-center gap-3">
            <span className="font-medium">{error}</span>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-full -m-6 p-6 md:p-10 bg-white">

            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between gap-8 mb-12">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ml-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                    <ArrowLeft className="w-4 h-4" /> Back to Containers
                </Button>
                <div className="flex items-center gap-4">
                    {isReadOnly ? (
                        <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-2">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-[#0E1116]">Intent Finalized</span>
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-secondary/5 rounded-full border border-secondary/20 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                            <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">Active Hypothesis</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* LEFT: Intent Brief Sidebar */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-secondary" />
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">Directive Brief</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{intent?.title}</h1>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-10 shadow-sm relative overflow-hidden">
                            {isReadOnly && (
                                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                    <Lock className="w-32 h-32 text-slate-900" />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Info className="w-4 h-4" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest">Initial Assumption</label>
                                </div>
                                <p className="text-lg text-slate-700 leading-relaxed font-serif italic pl-4 border-l-2 border-slate-200">
                                    "{intent?.assumption}"
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <label className="text-[10px] font-bold uppercase tracking-widest">Success Signal</label>
                                </div>
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl">
                                    <p className="text-sm text-slate-900 font-medium leading-relaxed">
                                        {intent?.successSignal}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {isReadOnly && (
                            <div className="p-6 bg-slate-900 rounded-[32px] text-white">
                                <div className="flex gap-4">
                                    <Lock className="w-5 h-5 text-secondary flex-shrink-0" />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Brief Locked</h4>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            This intent has entered the execution phase. To maintain traceability architectural integrity, the reasoning cannot be modified after decisions are recorded.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Decision Stream */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">

                    {/* Guidance Section */}
                    {decisions.length === 0 ? (
                        <div className="p-8 bg-secondary/5 border-2 border-dashed border-secondary/20 rounded-[40px] text-center animate-in zoom-in-95 duration-500">
                            <Zap className="w-12 h-12 text-secondary mx-auto mb-4 animate-pulse" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Bridge the Gap</h3>
                            <p className="text-sm text-slate-600 max-w-sm mx-auto mb-8 leading-relaxed">
                                We have a directive and a measurable goal. Now, we must record the <strong className="text-secondary">specific strategy</strong> that will bridge this hypothesis to reality.
                            </p>
                            {user?.role === 'MANAGER' && !showForm && (
                                <Button onClick={() => setShowForm(true)} className="bg-secondary text-white px-10 py-6 rounded-2xl font-bold shadow-lg shadow-secondary/10 hover:scale-105 transition-all">
                                    Record a Decision
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="p-10 bg-[#f8fafc] rounded-[40px] border border-slate-100 flex items-center justify-between">
                            <div className="flex gap-6 items-center">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <CheckCircle className="w-6 h-6 text-success" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">Next Step: Execution</h4>
                                    <p className="text-xs text-slate-500">Agreed strategies found. Proceed to Task assignment within the Decisions.</p>
                                </div>
                            </div>
                            {user?.role === 'MANAGER' && !showForm && (
                                <Button variant="ghost" onClick={() => setShowForm(true)} className="text-secondary hover:bg-secondary/5 font-bold text-xs uppercase tracking-widest px-6 py-6 rounded-2xl border border-secondary/20">
                                    Append Decision
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Decision list */}
                    <div className="space-y-6 px-2">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <MessageSquare className="w-5 h-5 text-slate-400" />
                            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em]">Strategy Record ({decisions.length})</h2>
                        </div>

                        {/* Decision Form */}
                        {showForm && (
                            <div className="animate-in slide-in-from-top-4 duration-300">
                                <Card className="border-2 border-slate-100 shadow-2xl rounded-[32px] overflow-hidden">
                                    <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                                        <CardTitle className="text-xl font-bold text-slate-900 text-[#0E1116]">Record Strategic Commitment</CardTitle>
                                        <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900">
                                            <Plus className="w-6 h-6 rotate-45" />
                                        </button>
                                    </CardHeader>
                                    <CardContent className="p-8">
                                        <form onSubmit={handleCreateDecision} className="space-y-8 text-[#0E1116]">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Strategic Label (Title)</label>
                                                <Input
                                                    className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-2xl px-6"
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="e.g. Regions-based PostgreSQL Sharding"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Chosen Option (The Path Taken)</label>
                                                <textarea
                                                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                    value={chosenOption}
                                                    onChange={(e) => setChosenOption(e.target.value)}
                                                    required
                                                    placeholder="Describe the specific technological or procedural path chosen..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rationale (Why this is optimal?)</label>
                                                    <textarea
                                                        className="w-full h-40 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                        value={rationale}
                                                        onChange={(e) => setRationale(e.target.value)}
                                                        required
                                                        placeholder="Explain how this specific path fulfills the Intent's success signal..."
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rejected Alternatives (What was discarded?)</label>
                                                    <textarea
                                                        className="w-full h-40 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                        value={rejectedAlternatives}
                                                        onChange={(e) => setRejectedAlternatives(e.target.value)}
                                                        required
                                                        placeholder="What other options were considered and why were they rejected?"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-6 border-t border-slate-100">
                                                <Button type="submit" disabled={submitting} className="bg-slate-900 text-white hover:bg-slate-800 px-10 h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/10">
                                                    {submitting ? 'Recording...' : 'Finalize Strategy'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            {decisions.map((decision) => (
                                <Link key={decision.id} to={`/decisions/${decision.id}`} className="block group">
                                    <Card className="border-2 border-slate-100 group-hover:border-secondary/30 group-hover:shadow-xl group-hover:shadow-secondary/5 transition-all duration-300 rounded-[32px] overflow-hidden">
                                        <CardContent className="p-10 flex items-center justify-between gap-10">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary/20 transition-colors">
                                                        <Zap className="w-4 h-4 text-secondary" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Finalized Strategy</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-secondary transition-colors tracking-tight">
                                                    {decision.title}
                                                </h3>
                                                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                                                    {decision.rationale}
                                                </p>
                                                <div className="pt-4 flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span className="text-success flex items-center gap-1.5">
                                                        <CheckCircle className="w-3.5 h-3.5" /> Traceable Commitment
                                                    </span>
                                                    <span>&bull;</span>
                                                    <span>{new Date(decision.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="hidden lg:flex flex-col items-end gap-1">
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Tasks</span>
                                                    <span className="text-lg font-mono font-bold text-slate-900">0</span>
                                                </div>
                                                <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntentView;
