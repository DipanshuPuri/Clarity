import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useWorkflow } from '../context/WorkflowContext';
import {
    AlertCircle, ChevronDown, Plus, LayoutGrid,
    Eye, Settings2, ArrowLeft, Check, Trash2, GitBranch
} from 'lucide-react';
import WorkflowCanvas from '../components/workflow/WorkflowCanvas';
import WorkflowInspectorPanel from '../components/workflow/WorkflowInspectorPanel';
import CreateWorkflowModal from '../components/workflow/CreateWorkflowModal';
import { projectsApi } from '../api/projects';

/**
 * DropdownMenu
 * Renders a floating menu anchored to a trigger ref, using fixed positioning
 * to escape overflow:hidden containers. Closes on outside click.
 */
const DropdownMenu = ({ triggerRef, isOpen, onClose, children }) => {
    const menuRef = useRef(null);
    const [pos, setPos] = useState({ top: 0, left: 0, minWidth: 0 });

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPos({
                top: rect.bottom + 6,
                left: rect.left,
                minWidth: Math.max(rect.width, 200),
            });
        }
    }, [isOpen, triggerRef]);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e) => {
            if (
                menuRef.current && !menuRef.current.contains(e.target) &&
                triggerRef.current && !triggerRef.current.contains(e.target)
            ) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) return null;

    return (
        <div
            ref={menuRef}
            style={{
                position: 'fixed',
                top: pos.top,
                left: pos.left,
                minWidth: pos.minWidth,
                zIndex: 9999,
            }}
            className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden animate-fade-in"
        >
            {children}
        </div>
    );
};

/**
 * WorkflowPage
 * Primary container for the Workflow module with functional dropdowns.
 */
const WorkflowPage = () => {
    const {
        workflows,
        activeWorkflow,
        setActiveWorkflow,
        createWorkflow,
        deleteWorkflowById,
        payloadMode,
        setPayloadMode,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        saveActiveWorkflow,
        discardChanges,
        deleteSelected,
        selectedNodeId,
        selectedEdgeId,
        isLoading, error
    } = useWorkflow();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const projectId = searchParams.get('projectId');

    // All projects for the project dropdown
    const [allProjects, setAllProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);

    // Dropdown open states
    const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
    const [workflowDropdownOpen, setWorkflowDropdownOpen] = useState(false);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ open: false, workflow: null });

    // Refs for anchor positioning
    const projectTriggerRef = useRef(null);
    const workflowTriggerRef = useRef(null);

    // Fetch all projects once for the project selector
    useEffect(() => {
        projectsApi.getProjects()
            .then(projects => setAllProjects(projects || []))
            .catch(() => setAllProjects([]));
    }, []);

    // Fetch and set selected project details whenever projectId changes
    useEffect(() => {
        if (!projectId) {
            setCurrentProject(null);
            return;
        }
        projectsApi.getProjectById(projectId)
            .then(p => setCurrentProject(p))
            .catch(() => setCurrentProject(null));
    }, [projectId]);

    // Switch to a different project — updates URL param which triggers context reload
    const handleSelectProject = useCallback((project) => {
        setProjectDropdownOpen(false);
        if (hasUnsavedChanges) {
            setPendingNavigation({ type: 'PROJECT', payload: project });
            return;
        }
        navigate(`/app/workflow?projectId=${project.id}`);
    }, [navigate, hasUnsavedChanges]);

    // Switch active workflow in canvas
    const handleSelectWorkflow = useCallback((wf) => {
        setWorkflowDropdownOpen(false);
        if (hasUnsavedChanges) {
            setPendingNavigation({ type: 'WORKFLOW', payload: wf });
            return;
        }
        setActiveWorkflow(wf);
    }, [setActiveWorkflow, hasUnsavedChanges]);

    const handleModeToggle = (toPayload) => {
        if (toPayload && hasUnsavedChanges) {
            setPendingNavigation({ type: 'MODE', payload: toPayload });
        } else {
            setPayloadMode(toPayload);
        }
    };

    const handleConfirmDiscard = async () => {
        setHasUnsavedChanges(false);
        const navTarget = pendingNavigation;
        setPendingNavigation(null);

        const targetWfId = navTarget?.type === 'WORKFLOW' ? navTarget.payload.id : null;
        await discardChanges(targetWfId);

        if (!navTarget) return;

        if (navTarget.type === 'PROJECT') {
            navigate(`/app/workflow?projectId=${navTarget.payload.id}`);
        } else if (navTarget.type === 'MODE') {
            setPayloadMode(navTarget.payload);
        } else if (navTarget.type === 'BACK') {
            navigate(`/app/projects/${projectId}`);
        }
    };

    const handleCreateWorkflow = (newWorkflowData) => {
        createWorkflow(newWorkflowData);
    };

    // Derived state
    const hasProject = !!projectId;
    const hasWorkflow = !!activeWorkflow;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-2 border-slate-200 border-t-secondary rounded-full animate-spin" />
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest animate-pulse">
                    Initializing Logic Core...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center gap-4">
                <AlertCircle className="w-6 h-6" />
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-tight">Core Initialization Failed</h3>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* PAGE TITLE */}
            <div className="flex items-center gap-6">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase flex items-center gap-3"><GitBranch className="w-8 h-8 text-secondary" />Workflows</h1>
                <div className="hidden lg:flex items-center gap-2 pt-1">
                    <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">Logic Architecture</span>
                </div>
            </div>

            <div className="flex flex-col h-[calc(100vh-12rem)] bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm animate-fade-in">

                {/* 1. HEADER — single line, left-justified, consistent style across modes */}
                <header className="h-16 border-b border-slate-100 flex items-center px-6 bg-[#fbfcfd] flex-shrink-0 gap-3" style={{ zIndex: 50 }}>

                    {/* Back arrow (only when came from a project) */}
                    {projectId && (
                        <button
                            onClick={() => {
                                if (hasUnsavedChanges) {
                                    setPendingNavigation({ type: 'BACK' });
                                } else {
                                    navigate(`/app/projects/${projectId}`);
                                }
                            }}
                            className="flex items-center text-slate-400 hover:text-slate-900 transition-colors mr-1"
                            title="Back to project"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                    )}

                    {/* ── PROJECT DROPDOWN ── */}
                    <div className="relative">
                        <div className="flex flex-col items-start gap-0.5">
                            <button
                                ref={projectTriggerRef}
                                onClick={() => {
                                    setWorkflowDropdownOpen(false);
                                    setProjectDropdownOpen(prev => !prev);
                                }}
                                className="flex items-center gap-2 group min-w-0"
                            >
                                <span
                                    className="text-xs font-bold text-slate-900 uppercase tracking-widest group-hover:text-secondary transition-colors truncate max-w-[200px]"
                                    title={currentProject?.name || ''}
                                >
                                    {currentProject?.name || (projectId ? 'Loading…' : 'Select Project')}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 transition-all ${projectDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <button
                                onClick={() => {
                                    if (hasUnsavedChanges) {
                                        setPendingNavigation({ type: 'BACK' });
                                    } else {
                                        navigate('/app/projects');
                                    }
                                }}
                                className="text-[9px] font-bold text-slate-400 hover:text-secondary uppercase tracking-widest transition-colors"
                            >
                                See all projects
                            </button>
                        </div>

                        <DropdownMenu
                            triggerRef={projectTriggerRef}
                            isOpen={projectDropdownOpen}
                            onClose={() => setProjectDropdownOpen(false)}
                        >
                            <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-3 py-2">
                                    Projects
                                </p>
                                {allProjects.length === 0 ? (
                                    <div className="px-3 py-4 text-xs text-slate-400 italic text-center">No projects found.</div>
                                ) : (
                                    allProjects.map(project => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleSelectProject(project)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors
                                                ${project.id === projectId
                                                    ? 'bg-secondary/10 text-secondary'
                                                    : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                        >
                                            <span className="text-xs font-bold truncate">{project.name}</span>
                                            {project.id === projectId && <Check className="w-3.5 h-3.5 shrink-0" />}
                                        </button>
                                    ))
                                )}
                            </div>
                        </DropdownMenu>
                    </div>

                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />

                    {/* ── WORKFLOW DROPDOWN (only when project is selected) ── */}
                    {hasProject ? (
                        <div className="relative">
                            <button
                                ref={workflowTriggerRef}
                                onClick={() => {
                                    setProjectDropdownOpen(false);
                                    setWorkflowDropdownOpen(prev => !prev);
                                }}
                                className="flex items-center gap-2 group min-w-0"
                            >
                                <span
                                    className="text-xs font-bold text-slate-500 uppercase tracking-tight group-hover:text-slate-900 transition-colors truncate max-w-[200px]"
                                    title={hasWorkflow ? activeWorkflow.name : 'Select Workflow'}
                                >
                                    {hasWorkflow ? activeWorkflow.name : 'Select Workflow'}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 transition-all ${workflowDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <DropdownMenu
                                triggerRef={workflowTriggerRef}
                                isOpen={workflowDropdownOpen}
                                onClose={() => setWorkflowDropdownOpen(false)}
                            >
                                <div className="p-2 max-h-72 overflow-y-auto custom-scrollbar">
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest px-3 py-2">
                                        Workflows
                                    </p>
                                    {workflows.length === 0 ? (
                                        <div className="px-3 py-4 text-xs text-slate-400 italic text-center">No workflows for this project.</div>
                                    ) : (
                                        workflows.map(wf => (
                                            <div key={wf.id} className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors relative group
                                                ${wf.id === activeWorkflow?.id
                                                    ? 'bg-secondary/10 text-secondary'
                                                    : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                            >
                                                <button
                                                    className="flex-1 text-left"
                                                    onClick={() => handleSelectWorkflow(wf)}
                                                >
                                                    <span className="text-xs font-bold block">{wf.name}</span>
                                                    {wf.description && (
                                                        <span className="text-[10px] text-slate-400 line-clamp-1">{wf.description}</span>
                                                    )}
                                                </button>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {/* Delete button always visible on hover, regardless of mode */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setWorkflowDropdownOpen(false);
                                                            setDeleteConfirm({ open: true, workflow: wf });
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Workflow"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    {wf.id === activeWorkflow?.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <span className="text-xs font-medium text-slate-300 uppercase tracking-tight">Select a Project</span>
                    )}

                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />

                    {/* Create & Clone — always visible, left-justified inline */}
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Create Workflow
                    </button>

                    {/* Payload-only indicator removed as per requirements */}

                    {/* Spacer to push toggle right */}
                    <div className="flex-1" />

                    {/* PAYLOAD / CONFIGURE Toggle (Anchored Right) */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                        <button
                            onClick={() => handleModeToggle(true)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${payloadMode
                                ? 'bg-secondary text-white shadow-sm shadow-secondary/20'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            Overview
                        </button>
                        <button
                            onClick={() => handleModeToggle(false)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${!payloadMode
                                ? 'bg-secondary text-white shadow-sm shadow-secondary/20'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Settings2 className="w-3.5 h-3.5" />
                            Configure
                        </button>
                    </div>

                </header>

                {/* Mode Indicator Strip */}
                <div className={`h-0.5 w-full flex-shrink-0 ${payloadMode ? 'bg-gradient-to-r from-secondary to-secondary/70' : 'bg-gradient-to-r from-slate-700 to-slate-500'
                    }`} />

                {/* 2. TWO-COLUMN BODY */}
                <div className="flex flex-1 min-h-0 relative">

                    {/* CENTER: Workflow Canvas — always mounted, hidden via CSS when nothing selected */}
                    <main className="flex-1 relative bg-white overflow-hidden flex flex-col">
                        {/* Canvas: always rendered to avoid remounting, hidden via CSS when no project/workflow is selected */}
                        <div className={`absolute inset-0 transition-opacity duration-300 ${(hasProject && hasWorkflow) ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                            <WorkflowCanvas workflow={activeWorkflow || { statuses: [], transitions: [] }} payloadMode={payloadMode} />
                        </div>

                        {/* Selection guard overlays — shown on top when project or workflow not selected */}
                        {(!hasProject || !hasWorkflow) && (
                            <div className="relative z-10 text-center max-w-sm px-6 m-auto">
                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <LayoutGrid className="w-6 h-6 text-slate-300" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                    {!hasProject ? 'Select a Project' : 'Select a Workflow'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                    {!hasProject
                                        ? 'Choose a project from the dropdown to view its workflows.'
                                        : workflows.length > 0
                                            ? 'Pick a workflow from the dropdown to explore its lifecycle grid.'
                                            : 'No workflows found for this project. Create one to get started.'}
                                </p>
                            </div>
                        )}
                    </main>

                    {/* RIGHT: Workflow Inspector Panel */}
                    <aside className="w-[320px] border-l border-slate-100 bg-[#fbfcfd] flex flex-col flex-shrink-0" style={{ zIndex: 10 }}>
                        <WorkflowInspectorPanel />
                    </aside>

                </div>

                {/* Modals */}
                <CreateWorkflowModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateWorkflow}
                />

                {/* Unsaved Changes Modal — rendered via portal */}
                {pendingNavigation && ReactDOM.createPortal(
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center animate-fade-in px-4">
                        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-slide-up">
                            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6">
                                <AlertCircle className="w-8 h-8 text-orange-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">Unsaved Changes</h2>
                            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                                Are you sure you want to switch modes or close the workflow? Your changes have not been saved.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={handleConfirmDiscard}
                                    className="flex-1 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                >
                                    Close Without Saving
                                </button>
                                <button
                                    onClick={() => setPendingNavigation(null)}
                                    className="flex-1 px-4 py-3 bg-slate-900 text-white hover:bg-slate-800 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                >
                                    Continue Editing
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Delete Workflow Confirmation Modal — rendered via portal for proper blur */}
                {deleteConfirm.open && ReactDOM.createPortal(
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center animate-fade-in px-4">
                        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-slide-up">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">Delete Workflow</h2>
                            <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-slate-700">"{deleteConfirm.workflow?.name}"</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => {
                                        deleteWorkflowById(deleteConfirm.workflow?.id);
                                        setDeleteConfirm({ open: false, workflow: null });
                                    }}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white hover:bg-red-600 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-red-500/20"
                                >
                                    Delete Permanently
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm({ open: false, workflow: null })}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div >
    );
};

export default WorkflowPage;
