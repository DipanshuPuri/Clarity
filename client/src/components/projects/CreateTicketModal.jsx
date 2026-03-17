import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Hash, Calendar, Users, Target, Info, MessageSquare } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users';

const CreateTicketModal = ({ isOpen, onClose, onCreate, onUpdate, ticket, isEditing = false }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        priority: 'Medium',
        description: '',
        assigneeId: ''
    });
    const [orgUsers, setOrgUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await usersApi.getUsers();
                setOrgUsers(users);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && isEditing && ticket) {
            setFormData({
                title: ticket.title || '',
                priority: ticket.priority || 'Medium',
                description: ticket.description || '',
                assigneeId: ticket.assigneeId || ''
            });
        } else if (isOpen && !isEditing) {
            setFormData({
                title: '',
                priority: 'Medium',
                description: '',
                assigneeId: ''
            });
        }
    }, [isOpen, isEditing, ticket]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Mock assignee logic (since we use names in select list but need user linkage if possible)
        // For now, we keep the name logic or basic ID if we had it.
        // The endpoint expects assigneeId if possible.
        // If we only have name, we might just send name if backend supports it or ignore.
        // The current backend ticketController expects `assigneeId`.
        // The Select option values are names.
        // This is a mismatch. I should fetch users or just use the mock names and maybe not set assigneeId (or set it to a known ID if I fetched users).
        // Given I seeded users, I should ideally pick from them.
        // But for "Maintenance", I'll stick to the existing behavior and maybe just send the name if I can, OR just accept that assignee might not link correctly without a real user select.
        // Let's just pass what we have.

        const payload = {
            ...formData,
            // We map generic names to avatars locally if creating new, but for update we just send data.
            // Backend expects `assigneeId`. Using names won't link to `User` model.
            // But `ticket` model has `assignee` relation.
            // I'll skip fixing the user-select perfect linkage for now and focus on the "Edit Settings" flow.
        };

        if (isEditing) {
            onUpdate(ticket.id, payload);
        } else {
            const selectedUser = orgUsers.find(u => u.id === formData.assigneeId);
            onCreate({
                ...payload,
                status: 'To Do',
                createdAt: new Date().toISOString(),
                createdBy: "CURRENT_USER",
                assignee: selectedUser ? {
                    firstName: selectedUser.firstName,
                    lastName: selectedUser.lastName,
                    profilePicture: selectedUser.profilePicture || `https://randomuser.me/api/portraits/lego/1.jpg`
                } : null
            });
        }
        onClose();
    };

    const modalContent = (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Canvas */}
            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shadow-lg shadow-secondary/10">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">
                                {isEditing ? 'Update Task' : 'Create Task'}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Strategic Task Initialization</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-4">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Operational Title</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Implement Neural Hook"
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Priority */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Priority Index</label>
                                <select
                                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all appearance-none cursor-pointer"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                            </div>

                            {/* Assignee */}
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Execution Agent</label>
                                <select
                                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all appearance-none cursor-pointer"
                                    value={formData.assigneeId}
                                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                                >
                                    <option value="">Unassigned</option>
                                    {orgUsers.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName} ({user.role})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Task Summary</label>
                            <textarea
                                required
                                rows={3}
                                placeholder="State the objective..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 h-11 bg-white border border-slate-100 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-[2] h-11 bg-secondary text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-xl shadow-secondary/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {isEditing ? 'Update Task' : 'Initialize Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
};

export default CreateTicketModal;
