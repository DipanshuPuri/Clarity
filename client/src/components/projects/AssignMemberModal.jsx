import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, Search, Shield, ChevronRight } from 'lucide-react';
import { usersApi } from '../../api/users';
import Button from '../ui/Button';

const AssignMemberModal = ({ isOpen, onClose, onAssign }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [potentialMembers, setPotentialMembers] = useState([]);

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const users = await usersApi.getUsers();
                setPotentialMembers(users);
            } catch (error) {
                console.error('Failed to fetch members:', error);
            }
        };
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const filteredMembers = potentialMembers.filter(m =>
        (m.firstName + ' ' + m.lastName).toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <UserPlus className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">Assign Member</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Expansion Order</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search agents by unit or role..."
                            className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-[12px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-secondary/30 transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Member List */}
                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                        {filteredMembers.map(member => (
                            <button
                                key={member.id}
                                onClick={() => {
                                    onAssign(member);
                                    onClose();
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                            >
                                {member.profilePicture ? (
                                    <img src={member.profilePicture} className="w-9 h-9 rounded-xl border border-white shadow-sm" alt="" />
                                ) : (
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-400 border border-white shadow-sm">
                                        {member.firstName?.[0] || member.email?.[0]}
                                    </div>
                                )}
                                <div className="flex-1 text-left">
                                    <p className="text-[12px] font-bold text-slate-900 group-hover:text-secondary transition-colors">{member.firstName} {member.lastName}</p>
                                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{member.role}</p>
                                </div>
                                <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ChevronRight className="w-3 h-3 text-secondary" />
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-slate-900 rounded-2xl">
                        <Shield className="w-4 h-4 text-secondary flex-shrink-0" />
                        <p className="text-[9px] text-slate-300 font-medium leading-relaxed uppercase tracking-widest">
                            New agents will inherit <span className="text-secondary font-bold">Strategic Visibility</span> immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
};

export default AssignMemberModal;
