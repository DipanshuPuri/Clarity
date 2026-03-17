import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MessageSquare, Clock, User, Hash, ChevronDown, Send, Lock, ArrowRightCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TicketDrawer = ({ ticket, isOpen, onClose, onComment, onEdit, onDelete, onUpdateStatus, canEdit, onAcceptHandoff }) => {
    const { user: authUser, token } = useAuth();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(ticket?.comments || []);
    const [isAccepting, setIsAccepting] = useState(false);

    if (!ticket) return null;

    const handleAddComment = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now(),
            user: authUser ? `${authUser.firstName} ${authUser.lastName}` : "Anonymous Agent",
            avatar: authUser?.profilePicture || `https://randomuser.me/api/portraits/lego/1.jpg`,
            text: comment,
            timestamp: new Date().toISOString()
        };
        setComments([...comments, newComment]);
        setComment('');

        if (onComment) {
            onComment(ticket, newComment);
        }
    };

    const isDone = ticket.status === 'Done';
    const pendingHandoff = ticket.handoffs?.find(h => !h.acceptedAt);
    const canAcceptHandoff = pendingHandoff && (authUser?.role === pendingHandoff.toRole || authUser?.department === pendingHandoff.toRole || authUser?.role === 'ADMIN');

    const handleAcceptDelivery = async () => {
        setIsAccepting(true);
        try {
            await axios.post(`/api/tickets/${ticket.id}/handoff/accept`, {}, { headers: { Authorization: `Bearer ${token}` } });
            if (onAcceptHandoff) onAcceptHandoff(ticket.id); // Parent callback to refetch
        } catch (e) {
            console.error("Failed to accept delivery", e);
        } finally {
            setIsAccepting(false);
        }
    };

    const drawerContent = (
        <>
            {/* Backdrop: Full screen blur */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Side Panel: Wider & Space-efficient */}
            <div className={`fixed right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-2xl z-[101] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-slate-100 flex flex-col`}>
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <Hash className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">{ticket.id}</span>
                            <h3 className="text-xl font-bold text-slate-900 leading-none">Operational Workspace</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {canEdit && (
                            <>
                                <Button
                                    onClick={() => onUpdateStatus(ticket.id, isDone ? 'To Do' : 'Done')}
                                    className={`h-9 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isDone ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-secondary text-white shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95'}`}
                                >
                                    {isDone ? 'Mark as Incomplete' : 'Mark as Complete'}
                                </Button>
                                <Button
                                    onClick={() => onEdit(ticket)}
                                    variant="secondary"
                                    className="h-9 px-4 bg-white border border-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    Edit Settings
                                </Button>
                                <Button
                                    onClick={() => onDelete(ticket.id)}
                                    className="h-9 px-4 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    Delete
                                </Button>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Title & Description */}
                    <div className="space-y-4">
                        <h2 className={`text-3xl font-bold text-slate-900 tracking-tight leading-tight ${isDone ? 'line-through opacity-50' : ''}`}>{ticket.title}</h2>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block flex items-center justify-between">
                                Strategic Directive
                                {pendingHandoff && canAcceptHandoff && (
                                    <button
                                        onClick={handleAcceptDelivery}
                                        disabled={isAccepting}
                                        className="h-8 px-4 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-amber-100 transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <ArrowRightCircle className="w-3.5 h-3.5" />
                                        {isAccepting ? 'Accepting...' : 'Accept Delivery in Workflow'}
                                    </button>
                                )}
                            </span>
                            <div className="p-5 bg-slate-50/30 border border-slate-100 rounded-2xl text-[13px] text-slate-600 leading-relaxed font-medium">
                                {ticket.description}
                            </div>

                            {/* Release Membership Badges */}
                            {ticket.releases && ticket.releases.length > 0 && (
                                <div className="pt-4 flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Memberships:</span>
                                    {ticket.releases.map(release => (
                                        <button
                                            key={release.id}
                                            onClick={() => { onClose(); navigate('/app/releases'); }}
                                            className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 hover:border-indigo-200 transition-colors shadow-sm"
                                        >
                                            {release.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Flow</span>
                                {!canEdit && <Lock className="w-3 h-3 text-slate-300" />}
                            </div>
                            <button
                                disabled={!canEdit}
                                className={`w-full h-11 px-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between transition-all ${canEdit ? 'hover:border-secondary/20 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                            >
                                <span className="text-xs font-bold text-slate-900">{ticket.status}</span>
                                {canEdit && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority Index</span>
                                {!canEdit && <Lock className="w-3 h-3 text-slate-300" />}
                            </div>
                            <button
                                disabled={!canEdit}
                                className={`w-full h-11 px-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between transition-all ${canEdit ? 'hover:border-secondary/20 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                            >
                                <span className="text-xs font-bold text-slate-900">{ticket.priority}</span>
                                {canEdit && <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                            </button>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initialization</span>
                            <div className="h-11 px-4 border border-transparent rounded-xl flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-300" />
                                <span className="text-xs font-bold text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* People Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">Execution Unit</span>
                            <div className="flex items-center gap-3 p-3 bg-slate-50/30 border border-slate-100 rounded-xl">
                                {ticket.assignee ? (
                                    <>
                                        {ticket.assignee.profilePicture ? (
                                            <img src={ticket.assignee.profilePicture} className="w-8 h-8 rounded-lg" alt="" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {ticket.assignee.firstName?.[0] || ticket.assignee.email?.[0] || '?'}
                                            </div>
                                        )}
                                        <p className="text-[12px] font-bold text-slate-900">
                                            {ticket.assignee.firstName ? `${ticket.assignee.firstName} ${ticket.assignee.lastName || ''}` : ticket.assignee.email}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">?</div>
                                        <p className="text-[12px] font-bold text-slate-400 italic">Unassigned</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none block">Originating Agent</span>
                            <div className="flex items-center gap-3 p-3 bg-slate-50/30 border border-slate-100 rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                    {ticket.createdBy === "CURRENT_USER" ? (authUser?.firstName[0] || "C") : "S"}
                                </div>
                                <p className="text-[12px] font-bold text-slate-900">
                                    {ticket.createdBy === "CURRENT_USER" ? "Identity Match (You)" : "Strategic Bureau"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Discussion Area */}
                    <div className="space-y-6 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-secondary" />
                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Bureau Discussion</span>
                        </div>

                        <div className="space-y-6 pb-24">
                            {comments.map((c, i) => (
                                <div key={i} className="flex gap-4 group">
                                    {c.avatar ? (
                                        <img src={c.avatar} className="w-8 h-8 rounded-lg border border-slate-100 shadow-sm" alt="" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-100 uppercase tracking-tighter shadow-sm">{c.user[0]}</div>
                                    )}
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">{c.user}</span>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-[12px] text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl rounded-tl-none border border-slate-100 group-hover:bg-white transition-colors">
                                            {c.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Input Area: Space Efficient */}
                <div className="p-6 bg-slate-50/30 border-t border-slate-100">
                    <div className="relative">
                        <textarea
                            className="w-full h-20 bg-white border border-slate-100 rounded-2xl p-4 pr-12 text-[12px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-secondary/30 transition-all resize-none shadow-sm"
                            placeholder="Add strategic insight..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            onClick={handleAddComment}
                            className="absolute right-4 bottom-4 w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(drawerContent, document.getElementById('modal-root'));
};

export default TicketDrawer;
