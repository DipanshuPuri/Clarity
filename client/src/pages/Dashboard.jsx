import React, { useState, useEffect } from 'react';
import { authApi } from '../api/auth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Shield, Zap, Target, Activity, Layout, Info } from 'lucide-react';

/**
 * Dashboard - Redesigned for Clarity (White Surface)
 */
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await authApi.getCurrentUser();
                if (data && data.user) {
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-t-secondary border-slate-100 rounded-full animate-spin"></div>
                    <span className="text-slate-400 text-sm font-medium animate-pulse">Initializing Workspace...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-slide-up">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-4xl font-serif text-secondary uppercase tracking-tighter select-none">Clarity</span>
                        <div className="h-px w-12 bg-slate-100 mx-2" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Context Center</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Welcome, <span className="text-secondary">{user?.firstName || user?.email?.split('@')[0] || 'Member'}</span>
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* Session Context Section */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 space-y-8 shadow-sm">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Session Guard</label>
                                <Shield className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Identity</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{user?.firstName} {user?.lastName}</p>
                                    <p className="text-[10px] font-medium text-slate-400 truncate">{user?.organization}</p>
                                </div>
                                <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">Authorization</p>
                                        <p className="text-sm font-bold text-secondary uppercase tracking-widest">{user?.role}</p>
                                    </div>
                                    <div className="px-3 py-1 bg-secondary/5 rounded-full border border-secondary/10">
                                        <span className="text-[8px] font-extrabold text-secondary uppercase">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-8 flex flex-col justify-between shadow-2xl shadow-slate-900/10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-secondary" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Proactive Insight</span>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight leading-snug">The traceability chain is only as strong as your last reflection.</h3>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Remember: Outcomes aren't just endpoints; they are the start of your next Intent.
                            </p>
                        </div>

                    </div>

                    {/* Quick Access Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { label: 'Containers', icon: Layout, link: '/projects', color: 'text-slate-400' },
                            { label: 'Hypotheses', icon: Target, link: '#', color: 'text-slate-400' },
                            { label: 'Execution', icon: Activity, link: '/tasks', color: 'text-slate-400' }
                        ].map((action, i) => (
                            <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-secondary/20 transition-all group cursor-pointer shadow-sm">
                                <action.icon className={`w-6 h-6 ${action.color} mb-3 group-hover:text-secondary transition-colors`} />
                                <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{action.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Guidance Sidebar */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <div className="p-10 bg-[#fbfcfd] border border-slate-100 rounded-[48px] space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Info className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Intelligence Guide</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Best Practices</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-6 items-start">
                                <div className="text-2xl font-serif text-slate-200">01</div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Intent First</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Never initialize a task without a parent Intent. If you can't state the "Why", the "How" doesn't matter.</p>
                                </div>
                            </div>
                            <div className="h-px bg-slate-100" />
                            <div className="flex gap-6 items-start">
                                <div className="text-2xl font-serif text-slate-200">02</div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Outcome Honesty</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Record failed outcomes with the same rigor as successes. Clarity values reality over progress reports.</p>
                                </div>
                            </div>
                            <div className="h-px bg-slate-100" />
                            <div className="flex gap-6 items-start">
                                <div className="text-2xl font-serif text-slate-200">03</div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Traceable Decisions</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Capture rejected alternatives. Knowing why we didn't take a path is often as valuable as why we did.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};

export default Dashboard;
