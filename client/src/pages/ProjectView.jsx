import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { intentsApi } from '../api/intents';
import { authApi } from '../api/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Target, Hash, ArrowRight, MessageSquare, ShieldCheck, ArrowLeft } from 'lucide-react';

/**
 * ProjectView - The Intent Layer
 * 
 * Purpose: First layer of hierarchy. Users must define 'Why' before 'What'.
 */
const ProjectView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [intents, setIntents] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Intent Creation State
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [assumption, setAssumption] = useState('');
    const [successSignal, setSuccessSignal] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projData, intentsData, userData] = await Promise.all([
                    projectsApi.getProjectById(id),
                    intentsApi.getIntents(id),
                    authApi.getCurrentUser()
                ]);
                setProject(projData);
                setIntents(intentsData || []);
                setUser(userData?.user);
            } catch (err) {
                setError('Failed to synchronize context data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateIntent = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newIntent = await intentsApi.createIntent(id, title, assumption, successSignal);
            setIntents([...intents, newIntent]);
            setTitle('');
            setAssumption('');
            setSuccessSignal('');
            setShowForm(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-t-secondary border-border rounded-full animate-spin"></div>
                <span className="text-muted text-sm font-medium animate-pulse">Syncing Context...</span>
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

            {/* Header Area */}
            <div className="flex items-center justify-between gap-8 mb-12">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 -ml-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                    <ArrowLeft className="w-4 h-4" /> Back to Containers
                </Button>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-secondary" />
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Context Secured</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* LEFT: Context Definition Sidebar */}
                <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-10">
                    <div className="space-y-6">
                        <div>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2 block">Problem Space</span>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{project?.name}</h1>
                        </div>

                        <div className="space-y-6 p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-inner">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Problem Statement</label>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "{project?.problemStatement}"
                                </p>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Success Definition</label>
                                <p className="text-sm text-slate-900 font-medium leading-relaxed flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-secondary shadow-glow-secondary/20 flex-shrink-0" />
                                    {project?.successDefinition}
                                </p>
                            </div>
                        </div>

                        {user?.role === 'MANAGER' && !showForm && (
                            <Button onClick={() => setShowForm(true)} className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-2xl py-6 font-bold shadow-lg shadow-secondary/10 gap-2">
                                <Plus className="w-5 h-5" />
                                Initialize Intent
                            </Button>
                        )}
                    </div>
                </div>

                {/* RIGHT: Intent Evolution Content */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Pedagogy Note */}
                    <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl">
                        <div className="flex gap-4">
                            <Target className="w-5 h-5 text-secondary flex-shrink-0" />
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                <strong className="text-slate-900">The Intent Layer:</strong> Before any strategy is finalized or task assigned, the <span className="font-bold text-slate-900 uppercase">Why</span> must be defined. Intents transform general project context into specific execution drivers.
                            </p>
                        </div>
                    </div>

                    {/* Intent Creation Form */}
                    {showForm && (
                        <div className="animate-in zoom-in-95 duration-200">
                            <Card className="border-2 border-slate-100 shadow-xl rounded-3xl">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-slate-900">Define Transformation Intent</CardTitle>
                                    <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900">
                                        <Plus className="w-5 h-5 rotate-45" />
                                    </button>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleCreateIntent} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intent Directive (High-level Title)</label>
                                            <Input
                                                className="bg-slate-50 border-slate-200 text-slate-900 h-12 rounded-xl"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="e.g. Optimize data ingestion for latency"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary Assumption (What we believe?)</label>
                                                <textarea
                                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                    value={assumption}
                                                    onChange={(e) => setAssumption(e.target.value)}
                                                    required
                                                    placeholder="What specific belief is driving this intent?"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Success Signal (Validation?)</label>
                                                <textarea
                                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                    value={successSignal}
                                                    onChange={(e) => setSuccessSignal(e.target.value)}
                                                    required
                                                    placeholder="What specific marker will validate this assumption?"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4 border-t border-slate-50">
                                            <Button type="submit" disabled={submitting} className="bg-slate-900 text-white hover:bg-slate-800 px-8 rounded-xl font-bold uppercase text-[10px] tracking-widest">
                                                {submitting ? 'Confirming...' : 'Confirm Intent'}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <MessageSquare className="w-5 h-5 text-slate-400" />
                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-[0.2em]">Evolving Intents</h2>
                        </div>

                        {intents.length === 0 ? (
                            <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
                                <Target className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-slate-900 font-bold mb-2">No Active Intents</h3>
                                <p className="text-slate-400 text-xs max-w-xs mx-auto mb-8">This container is waiting for its first directive. Managers can initialize an Intent to start the traceability loop.</p>
                                {user?.role === 'MANAGER' && (
                                    <Button onClick={() => setShowForm(true)} variant="secondary" className="bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/10">Initialize First Intent</Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {intents.map((intent) => (
                                    <Link key={intent.id} to={`/intents/${intent.id}`} className="block group">
                                        <Card className="border-2 border-slate-100 group-hover:border-secondary/30 group-hover:shadow-xl group-hover:shadow-secondary/5 transition-all duration-300 rounded-[24px] overflow-hidden">
                                            <CardContent className="p-8 flex items-center justify-between gap-8">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Directive</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-secondary transition-colors leading-tight">
                                                        {intent.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 italic">
                                                        "Assumption: {intent.assumption}"
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-secondary group-hover:translate-x-2 transition-all flex-shrink-0" />
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectView;
