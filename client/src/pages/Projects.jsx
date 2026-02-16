import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { authApi } from '../api/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Folder, LayoutGrid, Search, Info, CheckCircle, Target, ArrowRight } from 'lucide-react';

/**
 * Projects Page - Re-imagined for Clarity
 * 
 * Re-framed as Context Containers.
 * UI: White content surface, professional clarity.
 */
const Projects = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [problemStatement, setProblemStatement] = useState('');
    const [successDefinition, setSuccessDefinition] = useState('');
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, projectsData] = await Promise.all([
                    authApi.getCurrentUser(),
                    projectsApi.getProjects()
                ]);

                if (userData && userData.user) {
                    setUser(userData.user);
                }
                setProjects(projectsData || []);
            } catch (err) {
                console.error('Projects fetch error:', err);
                setError('Unable to synchronize project containers.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const newProject = await projectsApi.createProject(name, problemStatement, successDefinition);
            setProjects([...projects, newProject]);
            setName('');
            setProblemStatement('');
            setSuccessDefinition('');
            setShowForm(false);
        } catch (err) {
            alert(err.message || 'Failed to initialize context container');
        } finally {
            setCreating(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="flex flex-col items-center gap-4 text-white">
                <div className="w-10 h-10 border-2 border-t-secondary border-white/10 rounded-full animate-spin"></div>
                <span className="text-muted text-sm font-medium animate-pulse">Syncing Containers...</span>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10 min-h-full -m-6 p-6 md:p-10 bg-white">

            {/* Context Definition Section */}
            <div className="max-w-4xl">
                <div className="flex items-center gap-2 text-secondary mb-4">
                    <LayoutGrid className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Platform Foundation</span>
                </div>
                <h1 className="text-5xl font-extrabold tracking-tighter text-[#0E1116] mb-6">Workspace Containers</h1>

                <div className="p-8 bg-[#f8fafc] rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex gap-3 text-slate-600">
                        <Info className="w-5 h-5 flex-shrink-0 text-secondary" />
                        <p className="text-sm leading-relaxed">
                            <strong className="text-slate-900">What is a Clarity Project?</strong> In Clarity, a project is not a drawer for tasks. It is a <span className="font-bold text-slate-900 italic">bounded problem space</span>. It exists to provide the necessary context, reasoning, and constraints for everything that happens inside it.
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between gap-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-slate-400"
                            placeholder="Filter active containers..."
                            disabled
                        />
                    </div>
                </div>

                {user?.role === 'MANAGER' && !showForm && (
                    <Button onClick={() => setShowForm(true)} className="gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/10 px-8 py-6 rounded-2xl transition-all hover:scale-105 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Initialize Container
                    </Button>
                )}
            </div>

            {/* Creation Surface */}
            {showForm && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <Card className="border-2 border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between p-8">
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-900">Initialize Problem Space</CardTitle>
                                <p className="text-slate-500 text-xs mt-1">Define the context before execution begins.</p>
                            </div>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleCreateProject} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Project Identifier (Name)</label>
                                        <Input
                                            className="bg-slate-50 border-slate-200 text-slate-900 focus:border-secondary focus:ring-secondary/20 h-12"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            placeholder="e.g. Infrastructure Modernization"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Problem Statement (Why?)</label>
                                            <textarea
                                                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                value={problemStatement}
                                                onChange={(e) => setProblemStatement(e.target.value)}
                                                required
                                                placeholder="What specific problem are we solving here?"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Success Definition (How?)</label>
                                            <textarea
                                                className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                                                value={successDefinition}
                                                onChange={(e) => setSuccessDefinition(e.target.value)}
                                                required
                                                placeholder="What does a successful outcome look like?"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-6 border-t border-slate-100">
                                    <Button type="submit" disabled={creating} className="bg-secondary text-white px-10 h-12 rounded-xl text-xs font-bold uppercase tracking-widest shadow-glow-secondary/20">
                                        {creating ? 'Initializing...' : 'Confirm Initialization'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Containers Grid */}
            <div className="pt-4">
                {projects.length === 0 ? (
                    <div className="text-center py-32 bg-[#f8fafc] rounded-[40px] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                            <Folder className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Workspace Empty</h3>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-10 leading-relaxed">
                            {user?.role === 'MANAGER'
                                ? 'Deploy your first bounded problem space. Defining the context is the first step toward traceable work.'
                                : 'You do not have access to any active context containers yet. Consult your workspace manager.'}
                        </p>
                        {user?.role === 'MANAGER' && (
                            <Button onClick={() => setShowForm(true)} className="bg-secondary text-white px-8 py-4 rounded-xl shadow-lg shadow-secondary/10">Initialize First Project</Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map(project => (
                            <Link key={project.id} to={`/projects/${project.id}`} className="block group">
                                <Card className="h-full border-2 border-slate-100 group-hover:border-secondary/30 group-hover:shadow-2xl group-hover:shadow-secondary/5 transition-all duration-500 rounded-[32px] overflow-hidden">
                                    <CardContent className="p-8 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-secondary/10 rounded-2xl group-hover:bg-secondary/20 transition-colors">
                                                    <Target className="w-5 h-5 text-secondary" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Container</span>
                                                    <span className="text-[10px] font-bold text-slate-900">ID: {project.id.substring(0, 6)}</span>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 flex items-center gap-2 bg-slate-50 rounded-full border border-slate-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 group-hover:text-secondary transition-colors mb-4 tracking-tight">{project.name}</h3>

                                        <div className="space-y-4 flex-1">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Problem Statement</span>
                                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                                    {project.problemStatement}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Success Metric</span>
                                                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed flex items-center gap-2 italic">
                                                    <CheckCircle className="w-3 h-3 text-secondary flex-shrink-0" />
                                                    {project.successDefinition}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                {project._count?.intents || 0} Primary Intents
                                            </span>
                                            <div className="flex items-center gap-2 text-secondary text-xs font-bold group-hover:translate-x-1 transition-transform">
                                                <span>ENTER</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Platform Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-16 mt-16 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <img src="/clarity-logo-dark.svg" alt="Clarity" className="h-5 opacity-20 grayscale" onError={(e) => e.target.style.display = 'none'} />
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Institutional Context Layer</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-not-allowed">Protocol</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-not-allowed">Compliance</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-not-allowed">Privacy</span>
                </div>
            </div>

        </div>
    );
};

export default Projects;
