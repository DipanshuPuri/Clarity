import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Calendar, BarChart3, Users, Target, Info } from 'lucide-react';
import Button from '../ui/Button';

const CreateProjectModal = ({ isOpen, onClose, onCreate, onUpdate, project, isEditing = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        team: 'Alpha',
        budget: '',
        deadline: '',
        priority: 'Medium',
        problemStatement: '',
        successDefinition: ''
    });

    useEffect(() => {
        if (isOpen && isEditing && project) {
            setFormData({
                name: project.name || '',
                team: project.team || 'Alpha',
                budget: project.budget || '',
                deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
                priority: project.priority || 'Medium',
                problemStatement: project.problemStatement || '',
                successDefinition: project.successDefinition || ''
            });
        } else if (isOpen && !isEditing) {
            setFormData({
                name: '',
                team: 'Alpha',
                budget: '',
                deadline: '',
                priority: 'Medium',
                problemStatement: '',
                successDefinition: ''
            });
        }
    }, [isOpen, isEditing, project]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            budget: formData.budget ? parseFloat(formData.budget) : 0,
            deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null
        };

        if (isEditing) {
            onUpdate(project.id, payload);
        } else {
            onCreate({
                ...payload,
                id: `PRJ-${Math.floor(Math.random() * 9000) + 1000}`,
                status: 'Ongoing',
                contributors: 0,
                tickets: 0,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
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
            <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                            <Target className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">
                                {isEditing ? 'Update Protocols' : 'Initialize Container'}
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Operational Directive Protocol</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Project Name */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Project Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Neural Data Pipeline"
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Team Selection */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Execution Team</label>
                            <select
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all appearance-none cursor-pointer"
                                value={formData.team}
                                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                            >
                                <option value="Alpha">Alpha Unit</option>
                                <option value="Beta">Beta Unit</option>
                                <option value="Gamma">Gamma Unit</option>
                                <option value="Omega">Omega Unit</option>
                            </select>
                        </div>

                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Priority Index</label>
                            <select
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all appearance-none cursor-pointer"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="Critical">Critical</option>
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Flow</option>
                                <option value="Low">Low Priority</option>
                            </select>
                        </div>

                        {/* Budget */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Strategic Budget</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px]">$</span>
                                <input
                                    required
                                    type="number"
                                    placeholder="50000"
                                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Target Deadline</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                    required
                                    type="date"
                                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Summary Area */}
                        <div className="col-span-2 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Problem Statement</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="What strategic gap are we closing?"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all resize-none"
                                    value={formData.problemStatement}
                                    onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Success Definition</label>
                                <textarea
                                    required
                                    rows={2}
                                    placeholder="What does 'Mission Accomplished' look like?"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all resize-none"
                                    value={formData.successDefinition}
                                    onChange={(e) => setFormData({ ...formData, successDefinition: e.target.value })}
                                />
                            </div>
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
                            className="flex-[2] h-11 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {isEditing ? 'Save Revisions' : 'Initialize Container'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
};

export default CreateProjectModal;
