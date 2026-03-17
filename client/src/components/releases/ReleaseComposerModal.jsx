import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Search, Plus, X, Layers, Activity, FolderGit2, CheckCircle2, ChevronRight, XCircle, Rocket } from 'lucide-react';

import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Mock data for when API returns empty
const MOCK_PROJECTS = [
    { 
        id: 'mp1', name: 'Project Titan', status: 'ONGOING', 
        tickets: [
            { id: 'mt1', title: 'Implement user authentication flow', status: 'In Progress', priority: 'Critical' },
            { id: 'mt3', title: 'API rate limiting middleware', status: 'In Review', priority: 'High' },
            { id: 'mt7', title: 'Security audit remediation', status: 'To Do', priority: 'Critical' }
        ]
    },
    { 
        id: 'mp2', name: 'Cloud Migration Phoenix', status: 'ONGOING',
        tickets: [
            { id: 'mt2', title: 'Database migration v2 schema', status: 'To Do', priority: 'High' },
            { id: 'mt6', title: 'CI/CD pipeline optimization', status: 'To Do', priority: 'Medium' }
        ]
    },
    { 
        id: 'mp3', name: 'Project Nova', status: 'ONGOING',
        tickets: [
            { id: 'mt4', title: 'Dashboard analytics widget', status: 'Done', priority: 'Medium' },
            { id: 'mt8', title: 'Performance benchmarking suite', status: 'Done', priority: 'Medium' }
        ]
    },
    { 
        id: 'mp4', name: 'Project Echo', status: 'UPCOMING',
        tickets: [
            { id: 'mt5', title: 'Push notification service integration', status: 'In Progress', priority: 'High' }
        ]
    },
    { id: 'mp5', name: 'Employee Wellbeing Tracking', status: 'LIVE', tickets: [] },
    { id: 'mp6', name: 'Neural Network Expansion', status: 'ONGOING', tickets: [] },
];

/**
 * ReleaseComposerModal - Dual Pane Selector for Shipping Scope
 */

const ReleaseComposerModal = ({ isOpen, onClose, release }) => {
    const { user } = useAuth();

    // Live Datasets
    const [availableProjects, setAvailableProjects] = useState([]);
    // Staging Arrays (Right Pane)
    const [stagedProjects, setStagedProjects] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [renderState, setRenderState] = useState(isOpen ? 'open' : 'closed');

    useEffect(() => {
        if (isOpen) setRenderState('open');
        else if (renderState === 'open') {
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

    const fetchData = async () => {
        try {
            const projectsRes = await axios.get('/api/projects', { withCredentials: true });
            
            // Filter out projects already in this specific release if applicable
            const existingProjectIds = release?.projects?.map(p => p.id) || [];
            const projects = (projectsRes.data || []).filter(p => !existingProjectIds.includes(p.id));

            setAvailableProjects(projects.length > 0 ? projects : MOCK_PROJECTS.filter(p => !existingProjectIds.includes(p.id)));

        } catch (err) {
            console.error("Failed fetching pools for composer:", err);
            const existingProjectIds = release?.projects?.map(p => p.id) || [];
            setAvailableProjects(MOCK_PROJECTS.filter(p => !existingProjectIds.includes(p.id)));
        }
    };

    // Effect to load available pools when opened
    useEffect(() => {
        if (renderState === 'closed') return;
        fetchData();
        setStagedProjects([]);
    }, [renderState, release?.id]);

    if (renderState === 'closed') return null;

    const isClosing = renderState === 'closing';

    // Filters
    const filteredProjects = availableProjects.filter(p =>
        !stagedProjects.find(sp => sp.id === p.id) &&
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handlers
    const handleCommitProject = (project) => {
        setStagedProjects(prev => {
            if (prev.find(p => p.id === project.id)) return prev.filter(p => p.id !== project.id);
            return [...prev, project];
        });
    };



    const handleCommitScope = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        let hasError = false;

        try {
            // For each staged project (Commit Entire Project)
            for (const sp of stagedProjects) {
                try {
                    // Skip mock projects to prevent backend errors (IDs starting with 'mp')
                    if (String(sp.id).startsWith('mp')) {
                        console.warn("Skipping mock project commit:", sp.name);
                        continue;
                    }
                    await axios.post('/api/releases', { 
                        name: sp.name, 
                        description: `Branch for entire project: ${sp.name}`,
                        projectId: sp.id 
                    }, { withCredentials: true });
                } catch (e) {
                    console.error("Failed to commit project:", sp.name, e);
                    alert(`Failed to commit project "${sp.name}": ${e.response?.data?.error || e.message}`);
                    hasError = true;
                }
            }

            // Only close if no errors occurred
            if (!hasError) {
                onClose();
            }
        } catch (error) {
            console.error("Critical failure during commit scope:", error);
            alert("A critical error occurred during commitment. Please check console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return ReactDOM.createPortal(
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
            onClick={onClose}
        >
            <div
                className={`w-full max-w-6xl h-[85vh] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-slate-200/60 relative ${isClosing ? 'animate-slide-down-out' : 'animate-slide-up'}`}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Initialize Branch</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            Orchestrating deployment scope & resource allocation
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Architecture */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT PANE: Exploration Area */}
                    <div className="w-3/5 border-r border-slate-100 flex flex-col bg-white">

                        <div className="p-6 border-b border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                    Select Projects to Initialize
                                </h3>
                            </div>

                            <div className="relative">
                                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search projects by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                                />
                            </div>
                        </div>

                        {/* List Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <div className="grid grid-cols-1 gap-3">
                                    {filteredProjects.map(project => {
                                        const isStaged = stagedProjects.find(sp => sp.id === project.id);
                                        return (
                                            <div 
                                                key={project.id} 
                                                onClick={() => handleCommitProject(project)}
                                                className={`flex items-center justify-between p-5 border rounded-[24px] hover:bg-slate-50 transition-all group cursor-pointer ${isStaged ? 'border-secondary bg-slate-50' : 'border-slate-100'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/5 transition-colors ${isStaged ? 'bg-secondary' : 'bg-slate-900'}`}>
                                                        <FolderGit2 className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-extrabold text-slate-900 leading-tight">{project.name}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Status</span>
                                                            <span className="w-1 h-1 rounded-full bg-secondary" />
                                                            <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">{project.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isStaged ? 'bg-secondary border-secondary' : 'border-slate-200'}`}>
                                                    {isStaged ? <CheckCircle2 className="w-4 h-4 text-white" /> : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-secondary group-hover:translate-x-1" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            
                            {filteredProjects.length === 0 && (
                                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-20">No matching projects found.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANE: Verification Area */}
                    <div className="w-2/5 flex flex-col bg-slate-900 text-white relative shadow-inset-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-bl-[150px] pointer-events-none" />

                        <div className="p-8 border-b border-white/10 relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Active Scope</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Staged for Deployment</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                <span className="text-sm font-bold text-secondary">{stagedProjects.length}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-8 space-y-8 relative z-10">
                            {stagedProjects.map(project => (
                                <div key={project.id} className="group relative bg-white/5 border border-indigo-500/30 p-4 rounded-2xl hover:border-indigo-500/50 transition-all">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-indigo-500/20">
                                            <FolderGit2 className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Project Branch</h4>
                                            <p className="text-sm font-bold text-white truncate">{project.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded uppercase tracking-tighter">Full Scope Initialization</span>
                                    </div>
                                    <button onClick={() => handleCommitProject(project)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {stagedProjects.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4 pt-10">
                                    <Layers className="w-8 h-8 text-slate-500" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Scope is currently empty.<br />Select projects in the left pane.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-white/10 relative z-10 bg-slate-900 border-x border-slate-900">
                            <button
                                onClick={handleCommitScope}
                                disabled={isSubmitting || stagedProjects.length === 0}
                                className="w-full h-14 bg-secondary text-white rounded-[20px] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 group"
                            >
                                {isSubmitting ? (
                                    <Activity className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                )}
                                {isSubmitting ? 'Finalizing Architecture...' : 'Initialize & Commit Branch'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default ReleaseComposerModal;
