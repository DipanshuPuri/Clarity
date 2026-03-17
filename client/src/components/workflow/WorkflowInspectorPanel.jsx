import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users';
import {
    AlignLeft, Users, ArrowRight, MessageSquare, Play, Zap, Save,
    ShieldAlert, Send, Clock, History, Eye, Settings2,
    FileText, BookOpen, UserCheck, BookMarked, GitBranch, Edit3,
    Plus, Trash2, Check, X, Palette, AlertTriangle, Search,
    CheckCircle2, PlayCircle, XCircle, CircleDashed
} from 'lucide-react';

/* ─────────────────────────────────────────────
   SHARED: Discussion Thread component
───────────────────────────────────────────── */
const DiscussionThread = ({ target, title = "Discussion" }) => {
    const { user: authUser } = useAuth();
    const [comment, setComment] = useState("");
    const textareaRef = React.useRef(null);
    if (!target) return null;
    if (!target.discussions) target.discussions = [];
    const [comments, setComments] = React.useState(target.discussions);

    React.useEffect(() => {
        if (!target.discussions) target.discussions = [];
        setComments(target.discussions);
    }, [target]);

    const handleInput = (e) => {
        const t = e.target;
        t.style.height = 'auto';
        t.style.height = `${Math.min(t.scrollHeight, 120)}px`;
        setComment(t.value);
    };

    const handleAddComment = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now(),
            author: authUser ? `${authUser.firstName || ''} ${authUser.lastName || ''}`.trim() || authUser.email : "Current User",
            avatar: authUser?.profilePicture || `https://randomuser.me/api/portraits/lego/1.jpg`,
            content: comment,
            timestamp: new Date().toISOString()
        };
        const updated = [...comments, newComment];
        setComments(updated);
        target.discussions = updated;
        setComment('');
        if (textareaRef.current) {
            textareaRef.current.style.height = '42px'; // Reset height
        }
    };

    return (
        <div className="flex flex-col border-t border-slate-100 bg-slate-50/50">
            <div className="p-3 space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-3 h-3 text-secondary" />
                    <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest">{title}</span>
                </div>
                <div className="space-y-2.5">
                    {comments.length === 0 ? (
                        <div className="bg-white rounded-lg p-3 text-center border border-slate-100 border-dashed shadow-sm">
                            <span className="text-[10px] text-slate-400 font-medium">No discussion yet. Start the conversation.</span>
                        </div>
                    ) : (
                        comments.map((c, i) => {
                            const displayAuthor = c.author || c.user || 'Unknown';
                            const displayContent = c.content || c.text || '';
                            const isCurrentUser = displayAuthor === (authUser?.firstName ? `${authUser.firstName} ${authUser.lastName}`.trim() : authUser?.email);
                            return (
                                <div key={i} className={`flex gap-2 group ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 border border-white shadow-sm shrink-0">
                                        {displayAuthor.charAt(0)}
                                    </div>
                                    <div className={`flex-1 min-w-0 flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-baseline gap-1.5 mb-0.5 px-0.5">
                                            <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest truncate">{isCurrentUser ? 'You' : displayAuthor}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                                                {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className={`text-xs leading-relaxed font-medium p-2.5 rounded-2xl shadow-sm border ${isCurrentUser
                                            ? 'bg-slate-900 border-slate-800 text-white rounded-tr-sm'
                                            : 'bg-white border-slate-100 text-slate-700 rounded-tl-sm'
                                            }`}>
                                            {displayContent}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div className="p-3 pt-1 border-t border-slate-100 bg-white">
                <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100/50 rounded-2xl p-1.5 transition-all shadow-sm">
                    <textarea
                        ref={textareaRef}
                        className="flex-1 min-h-[42px] max-h-[120px] bg-transparent p-2 text-[11px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none custom-scrollbar"
                        placeholder="Type a message..."
                        value={comment}
                        onChange={handleInput}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={!comment.trim()}
                        className="w-8 h-8 shrink-0 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-md shadow-slate-900/10 mb-0.5 mr-0.5"
                    >
                        <Send className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PAYLOAD MODE PANEL
   Shows operational understanding of a node/edge.
───────────────────────────────────────────── */
const PayloadPanel = ({ activeWorkflow, selectedNodeId, selectedEdgeId }) => {
    const { updateEventStatus, updateWorkflowStatus } = useWorkflow();
    const [activeTab, setActiveTab] = useState('payload');

    const status = activeWorkflow?.statuses?.find(s => s.id === selectedNodeId);
    const transition = activeWorkflow?.transitions?.find(t => t.id === selectedEdgeId);
    const target = status || transition;
    const targetLabel = status?.name || transition?.label || null;

    if (!target) {
        return (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {/* Workflow overview in payload mode */}
                <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Workflow Overview</label>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight mb-1">{activeWorkflow?.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-normal">
                            {activeWorkflow?.description || 'Operational workflow definition.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Events</span>
                        <span className="text-lg font-bold text-slate-900">{activeWorkflow?.statuses?.length || 0}</span>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Connections</span>
                        <span className="text-lg font-bold text-slate-900">{activeWorkflow?.transitions?.length || 0}</span>
                    </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <Eye className="w-4 h-4 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-[10px] text-slate-500 font-bold px-4">Click any node or connection to inspect its details.</p>
                </div>

                {/* Workflow Level Status (Visible to Owners) */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Workflow Status (Owners Only)</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateWorkflowStatus(activeWorkflow?.id, 'complete')}
                            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${activeWorkflow?.progressStatus === 'complete' ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200'}`}
                        >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Complete
                        </button>
                        <button
                            onClick={() => updateWorkflowStatus(activeWorkflow?.id, 'ongoing')}
                            className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${activeWorkflow?.progressStatus === 'ongoing' ? 'bg-amber-500 text-white shadow-md' : 'bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 hover:border-amber-200'}`}
                        >
                            <PlayCircle className="w-3.5 h-3.5" /> Mark Ongoing
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tabConfig = [
        { id: 'payload', label: 'Overview', icon: BookMarked },
        { id: 'history', label: 'History', icon: History },
        { id: 'people', label: 'People', icon: UserCheck },
        { id: 'discuss', label: 'Notes', icon: MessageSquare },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Element header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex-shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status?.color || '#94a3b8' }} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {status ? 'Event' : 'Connection'}
                    </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">{targetLabel}</h3>
                {status?.category && (
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{status.category}</span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 flex-shrink-0">
                {tabConfig.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 flex flex-col items-center gap-0.5 border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-slate-800 text-slate-900'
                            : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto min-h-0">

                {/* PAYLOAD TAB */}
                {activeTab === 'payload' && (
                    <div className="p-4 space-y-4 animate-fade-in custom-scrollbar">
                        {/* Header Context for edges */}
                        {transition && (
                            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <div className="flex-1 text-center">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">From</span>
                                    <span className="text-[11px] font-bold text-slate-700">{activeWorkflow.statuses?.find(s => s.id === transition.fromStatusId)?.name || '—'}</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                                <div className="flex-1 text-center">
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">To</span>
                                    <span className="text-[11px] font-bold text-slate-700">{activeWorkflow.statuses?.find(s => s.id === transition.toStatusId)?.name || '—'}</span>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                <BookOpen className="w-3 h-3" /> Event Description
                            </label>
                            <div className="bg-white border border-slate-100 rounded-xl p-3 text-[11px] text-slate-600 leading-normal font-medium shadow-sm">
                                {status?.description || transition?.description || (
                                    <span className="text-slate-400 italic">No description documented for this {status ? 'event' : 'connection'}.</span>
                                )}
                            </div>
                        </div>

                        {/* Execution Notes */}
                        <div>
                            <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                <FileText className="w-3 h-3" /> Execution Notes
                            </label>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                                {(status?.executionNotes || transition?.rules || []).length === 0 ? (
                                    <div className="bg-white border border-slate-100 border-dashed rounded-lg p-2 text-[10px] text-slate-400 italic text-center">
                                        No execution notes recorded.
                                    </div>
                                ) : (
                                    (status?.executionNotes || transition?.rules || []).map((note, i) => (
                                        <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg p-2.5 flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                                            <span className="text-[10px] text-orange-900 font-medium leading-snug">{note}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Automation Actions */}
                        {transition?.automation?.length > 0 && (
                            <div>
                                <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                    <Zap className="w-3 h-3" /> Automations
                                </label>
                                <div className="space-y-1.5">
                                    {transition.automation.map((action, i) => (
                                        <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg p-2 flex gap-2">
                                            <div className="w-1.5 h-1.5 rounded-[3px] bg-blue-500 mt-0.5 shrink-0" />
                                            <span className="text-[10px] text-blue-900 font-bold leading-tight">{action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Event Current Status */}
                        {status && (
                            <div className="pt-2 border-t border-slate-100">
                                <label className="flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    <span>Event Execution Status</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <button
                                        onClick={() => updateEventStatus(activeWorkflow.id, status.id, 'complete')}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${status.progressStatus === 'complete' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100'}`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                                    </button>
                                    <button
                                        onClick={() => updateEventStatus(activeWorkflow.id, status.id, 'ongoing')}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${status.progressStatus === 'ongoing' ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-600 border border-slate-100'}`}
                                    >
                                        <PlayCircle className="w-3.5 h-3.5" /> In Progress
                                    </button>
                                    <button
                                        onClick={() => updateEventStatus(activeWorkflow.id, status.id, 'skipped')}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${status.progressStatus === 'skipped' ? 'bg-slate-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 border border-slate-100'}`}
                                    >
                                        <XCircle className="w-3.5 h-3.5" /> Skipped
                                    </button>
                                    <button
                                        onClick={() => updateEventStatus(activeWorkflow.id, status.id, null)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors ${!status.progressStatus ? 'bg-blue-500 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100'}`}
                                    >
                                        <CircleDashed className="w-3.5 h-3.5" /> Pending
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Path Logic for Nodes */}
                        {status && (
                            <div className="pt-2 border-t border-slate-100 space-y-3">
                                <div>
                                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                                        <ArrowRight className="w-3 h-3" /> Incoming logic
                                    </h5>
                                    {(activeWorkflow.transitions?.filter(t => t.toStatusId === status.id) || []).length === 0 ? <span className="text-[10px] text-slate-400 block px-2">Start Node</span> : (
                                        (activeWorkflow.transitions?.filter(t => t.toStatusId === status.id) || []).map(t => (
                                            <div key={t.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-0.5 mb-2 shadow-sm">
                                                <div className="text-[11px] font-bold text-slate-700">{t.label}</div>
                                                <div className="text-[9px] text-slate-400">From: <span className="font-bold">{activeWorkflow.statuses?.find(s => s.id === t.fromStatusId)?.name}</span></div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div>
                                    <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                                        <ArrowRight className="w-3 h-3" /> Outgoing logic
                                    </h5>
                                    {(activeWorkflow.transitions?.filter(t => t.fromStatusId === status.id) || []).length === 0 ? <span className="text-[10px] text-slate-400 block px-2">End Node</span> : (
                                        (activeWorkflow.transitions?.filter(t => t.fromStatusId === status.id) || []).map(t => (
                                            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-3 space-y-0.5 shadow-sm mb-2">
                                                <div className="text-[11px] font-bold text-slate-900">{t.label}</div>
                                                <div className="text-[9px] text-slate-400">To: <span className="font-bold">{activeWorkflow.statuses?.find(s => s.id === t.toStatusId)?.name}</span></div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === 'history' && (
                    <div className="p-4 animate-fade-in custom-scrollbar">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Change History</label>
                        {(!(target?.history) || target?.history?.length === 0) ? (
                            <div className="text-[10px] text-slate-400 italic text-center py-4">No history available for this component.</div>
                        ) : (
                            <div className="space-y-4 border-l-2 border-slate-100 ml-2 pl-3 pb-2 max-h-64 overflow-y-auto custom-scrollbar">
                                {target.history.map((item, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-slate-200 ring-4 ring-white" />
                                        <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-900 mb-0.5">{item.author}</div>
                                        <div className="text-[10px] text-slate-500 leading-snug">{item.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PEOPLE TAB */}
                {activeTab === 'people' && (
                    <div className="p-5 space-y-4 animate-fade-in">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Assigned People</label>
                        {(status?.owners || []).length === 0 ? (
                            <div className="text-xs text-slate-400 italic text-center py-6">No owners assigned.</div>
                        ) : (
                            <div className="space-y-2">
                                {(status?.owners || []).map((owner, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-700 uppercase">
                                            {owner.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-900">{owner}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">Event Owner</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* DISCUSS TAB */}
                {activeTab === 'discuss' && (
                    <DiscussionThread target={target} title={`${targetLabel} Discussion`} />
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MODAL: Validation Alert
───────────────────────────────────────────── */
const ValidationModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
    return createPortal(
        <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[10000] animate-in fade-in duration-300" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[10001] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 pb-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mb-3">Validation Failed</h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                        {message}
                    </p>
                </div>
                <div className="p-6 bg-slate-50 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-white border border-slate-200 py-3.5 rounded-2xl text-[11px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-slate-900 py-3.5 rounded-2xl text-[11px] font-bold text-white uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/20"
                    >
                        Confirm / Fix
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};

/* ─────────────────────────────────────────────
   MODAL: Owner Selection
───────────────────────────────────────────── */
const OwnerSelectionModal = ({ isOpen, onClose, onSelect }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            usersApi.getUsers()
                .then(data => setUsers(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredUsers = users.filter(u => 
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return createPortal(
        <>
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[10000] animate-in fade-in duration-300" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[10001] flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Assign Owner</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select organization member</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"><X className="w-5 h-5" /></button>
                    </div>
                    
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search employees by name or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-secondary transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="w-8 h-8 border-4 border-slate-100 border-t-secondary rounded-full animate-spin" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fetching Roster...</span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xs font-bold text-slate-400 uppercase">No employees found matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {filteredUsers.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => { onSelect(`${u.firstName} ${u.lastName}`); onClose(); }}
                                    className="flex items-center gap-4 p-3.5 bg-white border border-slate-100 rounded-2xl hover:border-secondary hover:shadow-lg hover:shadow-secondary/5 transition-all text-left group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                                        {u.profilePicture ? <img src={u.profilePicture} alt="" className="w-full h-full object-cover" /> : u.firstName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-bold text-slate-900 group-hover:text-secondary transition-colors">{u.firstName} {u.lastName}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{u.role || 'Member'}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-secondary group-hover:text-white group-hover:border-secondary transition-all">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-white border border-slate-200 py-3 rounded-xl text-[10px] font-bold text-slate-600 uppercase tracking-widest"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};

/* ─────────────────────────────────────────────
   CONFIGURE MODE PANEL
   Shows structural editing controls.
───────────────────────────────────────────── */
const ConfigurePanel = ({ activeWorkflow, selectedNodeId, selectedEdgeId }) => {
    const { addEvent, addConnection, addNote, deleteSelected, hasUnsavedChanges, saveActiveWorkflow, updateEvent, updateConnection } = useWorkflow();
    const [purposeText, setPurposeText] = useState('');
    const [nameText, setNameText] = useState('');
    const [descText, setDescText] = useState('');
    const [connLabel, setConnLabel] = useState('');

    const [isAddConnModalOpen, setIsAddConnModalOpen] = useState(false);
    const [newConnFrom, setNewConnFrom] = useState('');
    const [newConnTo, setNewConnTo] = useState('');

    // Custom Modal states
    const [validationError, setValidationError] = useState(null);
    const [isValidationOpen, setIsValidationOpen] = useState(false);
    const [isOwnerSelectionOpen, setIsOwnerSelectionOpen] = useState(false);

    const status = activeWorkflow?.statuses?.find(s => s.id === selectedNodeId);
    const transition = activeWorkflow?.transitions?.find(t => t.id === selectedEdgeId);
    const events = (activeWorkflow?.statuses || []).filter(s => s.category !== 'NOTE');

    const handleSave = () => {
        // First, sync any local state that hasn't been blurred yet
        if (status) {
            updateEvent(status.id, { name: nameText, description: descText });
        }
        if (transition) {
            updateConnection(transition.id, { label: connLabel });
        }

        // Validation Checks (after potential sync)
        const statuses = activeWorkflow?.statuses || [];
        const transitions = activeWorkflow?.transitions || [];

        for (const node of statuses) {
            const nodeType = node.category === 'NOTE' ? 'Text box' : 'Event';
            // Use local values if this is the currently selected node to ensure we validate the freshest data
            const nameToValidate = (status && node.id === status.id) ? nameText : node.name;
            const descToValidate = (status && node.id === status.id) ? descText : node.description;

            if (!nameToValidate || !nameToValidate.trim()) {
                setValidationError(`A ${nodeType.toLowerCase()} is missing a name.`);
                setIsValidationOpen(true);
                return;
            }
            if (!descToValidate || !descToValidate.trim()) {
                setValidationError(`${nodeType} "${nameToValidate}" must contain a description.`);
                setIsValidationOpen(true);
                return;
            }
            if (!node.owners || node.owners.length === 0) {
                setValidationError(`${nodeType} "${nameToValidate}" must have at least one assigned owner.`);
                setIsValidationOpen(true);
                return;
            }
        }

        for (const edge of transitions) {
            // Use local value if this is the currently selected connection
            const labelToValidate = (transition && edge.id === transition.id) ? connLabel : edge.label;

            if (!edge.fromStatusId || !edge.toStatusId) {
                setValidationError(`A connection is missing a starting or ending endpoint.`);
                setIsValidationOpen(true);
                return;
            }
            if (!labelToValidate || !labelToValidate.trim()) {
                setValidationError(`A connection between endpoints is missing its connection text/label.`);
                setIsValidationOpen(true);
                return;
            }
        }

        // Proceed to save
        saveActiveWorkflow();
    };

    React.useEffect(() => {
        if (status) {
            setPurposeText(status.description || '');
            setNameText(status.name || '');
            setDescText(status.description || '');
        }
    }, [status?.id]);

    React.useEffect(() => {
        if (transition) {
            setConnLabel(transition.label || '');
        }
    }, [transition?.id]);

    if (!activeWorkflow) return null;

    if (transition) {
        const fromStatus = activeWorkflow.statuses?.find(s => s.id === transition.fromStatusId);
        const toStatus = activeWorkflow.statuses?.find(s => s.id === transition.toStatusId);
        return (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar animate-fade-in">
                <div className="space-y-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-secondary" />
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Connection</h3>
                    </div>
                </div>

                {/* Editable Connection Name */}
                <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <Edit3 className="w-3 h-3" /> Connection Name
                    </label>
                    <input
                        type="text"
                        value={connLabel}
                        onChange={(e) => setConnLabel(e.target.value)}
                        onBlur={() => updateConnection(transition.id, { label: connLabel })}
                        onKeyDown={(e) => { if (e.key === 'Enter') { updateConnection(transition.id, { label: connLabel }); e.target.blur(); } }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all"
                        placeholder="Connection label..."
                    />
                </div>

                {/* From Event Dropdown */}
                <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <ArrowRight className="w-3 h-3" /> From Event
                    </label>
                    <select
                        value={transition.fromStatusId}
                        onChange={(e) => updateConnection(transition.id, { fromStatusId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-secondary transition-all appearance-none cursor-pointer"
                    >
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                    </select>
                </div>

                {/* To Event Dropdown */}
                <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        <ArrowRight className="w-3 h-3 rotate-90" /> To Event
                    </label>
                    <select
                        value={transition.toStatusId}
                        onChange={(e) => updateConnection(transition.id, { toStatusId: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-secondary transition-all appearance-none cursor-pointer"
                    >
                        {events.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.name}</option>
                        ))}
                    </select>
                </div>

                {/* Connection Owners */}
                <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <Users className="w-3 h-3" /> Owners
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {(transition.owners || []).map((owner, i) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 group">
                                {owner}
                                <button 
                                    onClick={() => updateConnection(transition.id, { owners: transition.owners.filter(o => o !== owner) })}
                                    className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsOwnerSelectionOpen(true)}
                            className="flex items-center gap-1 bg-slate-50 border border-dashed border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-400 hover:border-secondary/30 hover:text-secondary transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Add Owner
                        </button>
                    </div>
                </div>

                {/* Change History Snapshot for Edge Edit Mode */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Connection Edit Log</label>
                    {(!activeWorkflow?.history || activeWorkflow.history.length === 0) ? (
                        <div className="text-[10px] text-slate-400 italic">No history available.</div>
                    ) : (
                        <div className="space-y-3 border-l-2 border-slate-100 ml-2 pl-3 pb-1 max-h-32 overflow-y-auto custom-scrollbar">
                            {activeWorkflow.history.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-[#fbfcfd]" />
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-900 mb-0.5">{item.author}</div>
                                    <div className="text-[9px] text-slate-500 leading-snug">{item.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4 pb-2">
                    <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 hover:border-red-200 transition-colors text-[10px] font-bold uppercase tracking-widest">
                        <Trash2 className="w-3.5 h-3.5" /> Delete Connection
                    </button>
                </div>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center shadow-sm">
                    <p className="text-[10px] text-slate-500 font-medium px-2">Click any event to edit its structure, owners, or rules.</p>
                </div>

                {/* Edit Controls */}
                <div className="space-y-2 mt-4">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Structural Editing</label>
                    <button onClick={addEvent} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:border-secondary hover:text-secondary group transition-all text-[11px] font-bold uppercase tracking-widest">
                        <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-secondary" /> Add Event
                    </button>
                    {!isAddConnModalOpen ? (
                        <button
                            onClick={() => {
                                if (events.length < 2) {
                                    setValidationError("Need at least 2 events to connect.");
                                    setIsValidationOpen(true);
                                    return;
                                }
                                setNewConnFrom(events[0].id);
                                setNewConnTo(events[1]?.id || events[0].id);
                                setIsAddConnModalOpen(true);
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:border-secondary hover:text-secondary group transition-all text-[11px] font-bold uppercase tracking-widest"
                        >
                            <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-secondary" /> Add Connection
                        </button>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-inner my-2 animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">New Connection</span>
                                <button onClick={() => setIsAddConnModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-3.5 h-3.5" /></button>
                            </div>
                            <div className="space-y-2 mb-3">
                                <div>
                                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">From</label>
                                    <select value={newConnFrom} onChange={e => setNewConnFrom(e.target.value)} className="w-full text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-secondary transition-colors cursor-pointer appearance-none">
                                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-1">To</label>
                                    <select value={newConnTo} onChange={e => setNewConnTo(e.target.value)} className="w-full text-[10px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-secondary transition-colors cursor-pointer appearance-none">
                                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={() => { addConnection(newConnFrom, newConnTo); setIsAddConnModalOpen(false); }} className="w-full py-2 bg-secondary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all shadow-sm">
                                Create Connection
                            </button>
                        </div>
                    )}
                    <button onClick={addNote} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:border-secondary hover:text-secondary group transition-all text-[11px] font-bold uppercase tracking-widest mt-1">
                        <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-secondary" /> Add Text Box
                    </button>
                </div>

                {/* Delete + Save Flow — below structural editing */}
                <div className="space-y-2 mt-2 border-t border-slate-100 pt-4">
                    <button
                        onClick={deleteSelected}
                        disabled={!(selectedNodeId || selectedEdgeId)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${(selectedNodeId || selectedEdgeId)
                            ? 'text-red-500 bg-red-50 border border-red-200 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 shadow-sm'
                            : 'text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed'
                            }`}
                        title={(selectedNodeId || selectedEdgeId) ? "Delete selected item" : "Select an item to delete"}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasUnsavedChanges && !(status && (nameText !== status.name || descText !== status.description)) && !(transition && connLabel !== transition.label)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                            (hasUnsavedChanges || (status && (nameText !== status.name || descText !== status.description)) || (transition && connLabel !== transition.label))
                            ? 'text-white bg-secondary hover:shadow-lg hover:shadow-secondary/20 shadow-md ring-2 ring-secondary/30 ring-offset-2'
                            : 'text-slate-400 bg-slate-100 border border-slate-200 cursor-not-allowed'
                            }`}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {(hasUnsavedChanges || (status && (nameText !== status.name || descText !== status.description)) || (transition && connLabel !== transition.label)) ? 'Save Changes' : 'Save Flow'}
                    </button>
                </div>

                {/* Global Workflow Edit History Snapshot */}
                <div className="pt-2 border-t border-slate-100 space-y-3 mt-4">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Workflow Change Log</label>
                    {(!activeWorkflow.history || activeWorkflow.history.length === 0) ? (
                        <div className="text-[10px] text-slate-400 italic">No history available.</div>
                    ) : (
                        <div className="space-y-3 border-l-2 border-slate-100 ml-2 pl-3 pb-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {activeWorkflow.history.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-[#fbfcfd]" />
                                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                        {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-900 mb-0.5">{item.author}</div>
                                    <div className="text-[9px] text-slate-500 leading-snug">{item.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const COLOR_PRESETS = [
        '#cbd5e1', '#94a3b8', '#3b82f6', '#6366f1', '#8b5cf6',
        '#a855f7', '#ec4899', '#ef4444', '#f97316', '#eab308',
        '#22c55e', '#14b8a6', '#0ea5e9', '#0d9488'
    ];

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar animate-fade-in">
            {/* Editable Node header */}
            <div className="space-y-3 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                            <Edit3 className="w-3 h-3" /> Event Name
                        </label>
                        <input
                            type="text"
                            value={nameText}
                            onChange={(e) => setNameText(e.target.value)}
                            onBlur={() => updateEvent(status.id, { name: nameText })}
                            className="w-full text-sm font-bold text-slate-900 uppercase tracking-tight bg-white border border-slate-200 rounded-xl px-3 py-2 focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all"
                        />
                    </div>
                    <div className="px-2 py-0.5 rounded-md text-[8px] font-bold uppercase text-white shadow-sm ml-2 mt-6" style={{ backgroundColor: status.color || '#cbd5e1' }}>
                        {status.category}
                    </div>
                </div>

                {/* Color Picker */}
                <div>
                    <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        <Palette className="w-3 h-3" /> Event Color
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {COLOR_PRESETS.map(c => (
                            <button
                                key={c}
                                onClick={() => updateEvent(status.id, { color: c })}
                                className={`w-6 h-6 rounded-lg border-2 transition-all hover:scale-110 ${status.color === c ? 'border-slate-900 ring-2 ring-secondary/30 scale-110' : 'border-transparent hover:border-slate-300'}`}
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Description (editable) */}
            <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <AlignLeft className="w-3 h-3" /> Event Description
                </label>
                <textarea
                    value={descText}
                    onChange={(e) => setDescText(e.target.value)}
                    onBlur={() => updateEvent(status.id, { description: descText })}
                    placeholder="Describe this event's purpose..."
                    className="w-full h-20 text-[11px] text-slate-700 bg-white border border-slate-200 rounded-xl p-2.5 focus:border-secondary focus:ring-1 focus:ring-secondary/50 transition-all resize-none"
                />
            </div>

            {/* Owners */}
            <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    <Users className="w-3 h-3" /> Owners
                </label>
                <div className="flex flex-wrap gap-2">
                    {(status.owners || []).map((owner, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 group">
                            {owner}
                            <button 
                                onClick={() => updateEvent(status.id, { owners: status.owners.filter(o => o !== owner) })}
                                className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => setIsOwnerSelectionOpen(true)}
                        className="flex items-center gap-1 bg-slate-50 border border-dashed border-slate-200 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-400 hover:border-secondary/30 hover:text-secondary transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Add Owner
                    </button>
                </div>
            </div>

            {/* In-app Modals */}
            <ValidationModal 
                isOpen={isValidationOpen} 
                onClose={() => setIsValidationOpen(false)} 
                message={validationError} 
            />

            <OwnerSelectionModal 
                isOpen={isOwnerSelectionOpen} 
                onClose={() => setIsOwnerSelectionOpen(false)} 
                onSelect={(newOwner) => {
                   if (status) {
                       const currentOwners = status.owners || [];
                       if (!currentOwners.includes(newOwner)) {
                           updateEvent(status.id, { owners: [...currentOwners, newOwner] });
                       }
                   } else if (transition) {
                       const currentOwners = transition.owners || [];
                       if (!currentOwners.includes(newOwner)) {
                           updateConnection(transition.id, { owners: [...currentOwners, newOwner] });
                       }
                   }
                }}
            />

            {/* Change History Snapshot for Node Edit Mode */}
            <div className="pt-2 border-t border-slate-100 space-y-3 mt-4">
                <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Event Edit Log</label>
                {(!activeWorkflow?.history || activeWorkflow.history.length === 0) ? (
                    <div className="text-[10px] text-slate-400 italic">No edit log available.</div>
                ) : (
                    <div className="space-y-3 border-l-2 border-slate-100 ml-2 pl-3 pb-1 max-h-40 overflow-y-auto custom-scrollbar">
                        {activeWorkflow.history.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[17px] top-0.5 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-[#fbfcfd]" />
                                <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <div className="text-[9px] font-bold text-slate-900 mb-0.5">{item.author}</div>
                                <div className="text-[9px] text-slate-500 leading-snug">{item.description}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-4 pb-2">
                <button onClick={deleteSelected} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 hover:border-red-200 transition-colors text-[10px] font-bold uppercase tracking-widest">
                    <Trash2 className="w-3.5 h-3.5" /> Delete Event
                </button>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   ROOT: WorkflowInspectorPanel — routes to correct sub-panel
───────────────────────────────────────────── */
const WorkflowInspectorPanel = () => {
    const { activeWorkflow, selectedNodeId, selectedEdgeId, payloadMode } = useWorkflow();

    if (!activeWorkflow) return null;

    return (
        <div className={`flex flex-col h-full w-full transition-colors duration-300 ${payloadMode ? 'bg-slate-50/10' : 'bg-[#fbfcfd]'
            }`}>
            {payloadMode
                ? <PayloadPanel activeWorkflow={activeWorkflow} selectedNodeId={selectedNodeId} selectedEdgeId={selectedEdgeId} />
                : <ConfigurePanel activeWorkflow={activeWorkflow} selectedNodeId={selectedNodeId} selectedEdgeId={selectedEdgeId} />
            }
        </div>
    );
};

export default WorkflowInspectorPanel;
