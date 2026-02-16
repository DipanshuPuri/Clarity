import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { decisionsApi } from '../api/decisions';
import { tasksApi } from '../api/tasks';
import { authApi } from '../api/auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Zap, ArrowLeft, Plus, Layout, ArrowRight, Activity, ClipboardList, Info, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';

/**
 * DecisionView - Re-imagined as an Internal Design Note.
 * 
 * Logic:
 * - Immutable once a Task exists.
 * - Formal structure: Chosen Option, Rationale, Rejected Alternatives.
 * UI: White surface.
 */
const DecisionView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [decision, setDecision] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Task Creation State
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [executionDescription, setExecutionDescription] = useState('');
    const [outcome, setOutcome] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const API_BASE_URL = 'http://localhost:3000';
                const decisionRes = await fetch(`${API_BASE_URL}/api/decisions/${id}`, { credentials: 'include' });
                if (!decisionRes.ok) throw new Error('Decision strategy not found');
                const decisionData = await decisionRes.json();

                const [tasksData, userData] = await Promise.all([
                    tasksApi.getTasks(id),
                    authApi.getCurrentUser()
                ]);

                setDecision(decisionData);
                setTasks(tasksData || []);
                setUser(userData?.user);
            } catch (err) {
                setError('Failed to synchronize execution strategy.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newTask = await tasksApi.createTask(id, title, executionDescription, outcome);
            setTasks([...tasks, newTask]);

            // Refresh decision state to update locks
            const API_BASE_URL = 'http://localhost:3000';
            const decisionRes = await fetch(`${API_BASE_URL}/api/decisions/${id}`, { credentials: 'include' });
            const updatedDecision = await decisionRes.json();
            setDecision(updatedDecision);

            setTitle('');
            setExecutionDescription('');
            setOutcome('');
            setShowForm(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const isLocked = decision?._count?.tasks > 0;

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-slate-900">
                <div className="w-10 h-10 border-2 border-t-secondary border-slate-100 rounded-full animate-spin"></div>
                <span className="text-slate-400 text-sm font-medium animate-pulse">Consulting Strategic Note...</span>
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
                    <ArrowLeft className="w-4 h-4" /> Back to Intent
                </Button>
                <div className="flex items-center gap-4">
                    {isLocked ? (
                        <div className="px-3 py-1 bg-slate-50 rounded-full border border-slate-100 flex items-center gap-2">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Locked for Traceability</span>
                        </div>
                    ) : (
                        <div className="px-3 py-1 bg-yellow-50 rounded-full border border-yellow-100 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-600" />
                            <span className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest">Mutable Strategy</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* LEFT: Design Note Sidebar */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Zap className="w-5 h-5 text-secondary" />
                                <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] block">Strategic Commitment</span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">{decision?.title}</h1>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-10 shadow-sm relative">
                            {isLocked && (
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <Lock className="w-48 h-48 text-slate-900" />
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">The Chosen Path</label>
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                    <p className="text-sm font-mono text-slate-900 leading-relaxed">
                                        {decision?.chosenOption}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rationale (Why?)</label>
                                <p className="text-md text-slate-700 leading-relaxed italic pl-4 border-l-2 border-slate-200">
                                    "{decision?.rationale}"
                                </p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rejected Alternatives</label>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    {decision?.rejectedAlternatives}
                                </p>
                            </div>
                        </div>

                        {!isLocked && (
                            <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-3xl">
                                <div className="flex gap-4">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-bold text-yellow-900 uppercase tracking-widest">Integrity Warning</h4>
                                        <p className="text-[11px] text-yellow-700 leading-relaxed">
                                            Initializing a Task against this decision will **permanently lock** its contents. This ensures that execution stays true to the finalized strategy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Task Execution Queue */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-10">

                    {/* Guidance / Queue Header */}
                    <div className="p-10 bg-[#f8fafc] rounded-[40px] border border-slate-100 flex items-center justify-between">
                        <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <ClipboardList className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900">Execution Queue ({tasks.length})</h4>
                                <p className="text-xs text-slate-500">Granular units of work derived from this commitment.</p>
                            </div>
                        </div>
                        {user?.role === 'MANAGER' && !showForm && (
                            <Button onClick={() => setShowForm(true)} className="bg-secondary text-white px-8 py-4 rounded-xl shadow-lg shadow-secondary/10 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                                <Plus className="w-4 h-4" /> Initialize Task
                            </Button>
                        )}
                    </div>

                    {/* Task Form */}
                    {showForm && (
                        <div className="animate-in slide-in-from-top-4 duration-300 px-2">
                            <Card className="border-2 border-slate-100 shadow-2xl rounded-[32px] overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 p-8 flex flex-row items-center justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl font-bold text-slate-900">Initialize Execution Unit</CardTitle>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Bridging Strategy to Action</p>
                                    </div>
                                    <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900">
                                        <Plus className="w-6 h-6 rotate-45" />
                                    </button>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={handleCreateTask} className="space-y-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Task Identifier</label>
                                            <Input
                                                className="bg-slate-50 border-slate-200 text-slate-900 h-14 rounded-2xl px-6"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                required
                                                placeholder="e.g. Implement shard distribution logic"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Description (Specific How?)</label>
                                                <textarea
                                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                    value={executionDescription}
                                                    onChange={(e) => setExecutionDescription(e.target.value)}
                                                    placeholder="What specific actions are required for this unit?"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Definition of Done</label>
                                                <textarea
                                                    className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                    value={outcome}
                                                    onChange={(e) => setOutcome(e.target.value)}
                                                    placeholder="How will we validate this task's success?"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-6 border-t border-slate-100">
                                            <Button type="submit" disabled={submitting} className="bg-slate-900 text-white hover:bg-slate-800 px-10 h-14 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-slate-900/10 gap-2">
                                                {submitting ? 'Initializing...' : 'Confirm Execution Unit'}
                                                {!submitting && <ArrowRight className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Tasks List */}
                    <div className="space-y-6 px-2">
                        {tasks.length === 0 ? (
                            <div className="py-24 border-2 border-dashed border-slate-100 rounded-[40px] text-center bg-slate-50/50">
                                <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Queue Empty</h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {tasks.map((task) => (
                                    <Link key={task.id} to={`/tasks/${task.id}`} className="block group">
                                        <Card className="border-2 border-slate-100 group-hover:border-secondary transition-all duration-300 rounded-[32px] overflow-hidden">
                                            <CardContent className="p-8 flex items-center justify-between">
                                                <div className="flex items-center gap-8">
                                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-secondary/5 group-hover:border-secondary/20 transition-colors">
                                                        <Activity className="w-6 h-6 text-slate-300 group-hover:text-secondary transition-colors" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-secondary transition-colors tracking-tight">{task.title}</h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${task.status === 'DONE' ? 'bg-success/10 text-success' : 'bg-slate-100 text-slate-400'
                                                                }`}>
                                                                {task.status}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1">
                                                                <ShieldCheck className="w-3 h-3" /> Traceable
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ArrowRight className="w-6 h-6 text-slate-200 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
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

export default DecisionView;
