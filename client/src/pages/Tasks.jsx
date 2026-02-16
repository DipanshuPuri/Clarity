import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Layout, Clock, Filter, Search, ArrowRight, ListChecks, Target, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * Tasks - High Fidelity Execution Board
 */
const Tasks = () => {
    // Note: In a full implementation, this would fetch all tasks for the current user.
    // For now, we align the aesthetic and show the operational view.
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Fetch all tasks (no filters = all accessible tasks)
                const data = await import('../api/tasks').then(m => m.tasksApi.getTasks({}));
                setTasks(data);
            } catch (err) {
                console.error("Failed to load execution units", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div className="animate-in fade-in duration-500 min-h-full -m-6 p-6 md:p-10 bg-white animate-fade-slide-up">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10">
                            <ListChecks className="w-6 h-6 text-secondary" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Execution Layer</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Taskboard</h1>
                    <p className="text-sm text-slate-500 font-medium max-w-md italic font-serif">
                        Your prioritized queue of execution units, synchronized with project strategy.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-4">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <div className="h-4 w-px bg-slate-200" />
                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest cursor-pointer hover:text-secondary transition-colors">All Contexts</span>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest cursor-pointer hover:text-secondary transition-colors">Assigned to Me</span>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {tasks.length === 0 ? (
                <div className="py-32 flex flex-col items-center text-center bg-[#fbfcfd] border-2 border-dashed border-slate-100 rounded-[64px]">
                    <div className="w-20 h-20 bg-white rounded-[32px] border border-slate-100 flex items-center justify-center shadow-sm mb-8">
                        <Target className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">No Active Execution Units</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium mb-10">
                        The board is clear. Initialize an Intent and link a Decision to start populating your execution queue.
                    </p>
                    <Link to="/projects">
                        <Button className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-900/10 flex items-center gap-3 group">
                            Explore Containers
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {tasks.map(task => (
                        <div key={task.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-between group hover:border-secondary/20 transition-all shadow-sm">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${task.status === 'DONE' ? 'bg-green-100 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-400'}`}>
                                    {task.status === 'DONE' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-secondary transition-colors">{task.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-1">{task.executionDescription}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Outcome Target</span>
                                    <span className="text-xs font-bold text-slate-700">{task.expectedOutcome}</span>
                                </div>
                                <div className="w-px h-10 bg-slate-200" />
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${task.status === 'DONE' ? 'bg-green-500 text-white' :
                                    task.status === 'IN_PROGRESS' ? 'bg-secondary text-white' :
                                        'bg-slate-200 text-slate-500'
                                    }`}>
                                    {task.status.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Operational Metrics Sub-area */}
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Cycle Accuracy', value: '94%', sub: 'Execution vs Intent' },
                    { label: 'Active Loops', value: '0', sub: 'Linked to Decisions' },
                    { label: 'Traceability', value: '100%', sub: 'No orphaned tasks' },
                    { label: 'Archive Rank', value: 'A+', sub: 'Learning Index' }
                ].map((stat, i) => (
                    <div key={i} className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm space-y-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                        <p className="text-[9px] font-bold text-secondary uppercase tracking-tight italic">{stat.sub}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
