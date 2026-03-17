import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, GitBranchPlus, ChevronDown } from 'lucide-react';
import { usersApi } from '../../api/users';

const CreateWorkflowModal = ({ isOpen, onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        owner: '',
        template: 'Software Dev'
    });

    const [employees, setEmployees] = useState([]);
    const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: '',
                description: '',
                owner: '',
                template: 'Software Dev'
            });
            setOwnerDropdownOpen(false);
            // Fetch employees
            usersApi.getUsers()
                .then(users => setEmployees(users || []))
                .catch(() => setEmployees([]));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({
            ...formData,
            id: `wf_${Math.floor(Math.random() * 90000) + 10000}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            usageCount: 0,
            statuses: [],
            transitions: [],
            discussions: []
        });
        onClose();
    };

    const selectedEmployee = employees.find(e => e.name === formData.owner);

    const modalContent = (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-scale-in">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                            <GitBranchPlus className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight uppercase leading-none">
                                Define Workflow
                            </h2>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Lifecycle Tracking Protocol</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Workflow Name</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Hotfix Pipeline"
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Blueprint Template</label>
                            <select
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all appearance-none cursor-pointer"
                                value={formData.template}
                                onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                            >
                                <option value="Software Dev">Software Dev Pipeline</option>
                                <option value="QA Pipeline">QA Testing Validation</option>
                                <option value="Bug Resolution">Bug / Issue Resolution</option>
                                <option value="Release Pipeline">Release Train Protocol</option>
                                <option value="Onboarding">Employee Onboarding</option>
                                <option value="Client Delivery">Client Delivery Lifecycle</option>
                                <option value="Infrastructure">Infrastructure Provisioning</option>
                                <option value="Security Audit">Security Audit & Compliance</option>
                                <option value="Data Pipeline">Data Pipeline Orchestration</option>
                                <option value="Design Sprint">Design Sprint Process</option>
                            </select>
                        </div>

                        {/* Process Owner — Employee dropdown */}
                        <div className="col-span-2 space-y-1.5 relative">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Process Owner</label>
                            <button
                                type="button"
                                onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
                                className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-left text-xs font-bold text-slate-900 focus:outline-none focus:border-secondary/30 transition-all flex items-center justify-between"
                            >
                                {formData.owner ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                                            {formData.owner.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <span>{formData.owner}</span>
                                        {selectedEmployee && (
                                            <span className="text-[9px] text-slate-400 font-medium">({selectedEmployee.role})</span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-slate-300">Select an employee...</span>
                                )}
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${ownerDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {ownerDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setOwnerDropdownOpen(false)} />
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
                                        {employees.length === 0 ? (
                                            <div className="px-4 py-3 text-xs text-slate-400 text-center">No employees found</div>
                                        ) : (
                                            employees.map((emp) => (
                                                <button
                                                    key={emp._id || emp.id || emp.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, owner: emp.name });
                                                        setOwnerDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${formData.owner === emp.name
                                                            ? 'bg-indigo-50 text-indigo-700'
                                                            : 'hover:bg-slate-50 text-slate-700'
                                                        }`}
                                                >
                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-600 flex-shrink-0">
                                                        {emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-xs font-bold block truncate">{emp.name}</span>
                                                        <span className="text-[9px] text-slate-400">{emp.role || emp.email}</span>
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="col-span-2 space-y-1.5">
                            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block pl-1">Strategic Description</label>
                            <textarea
                                required
                                rows={2}
                                placeholder="Describe the lifecycle logic and branching criteria..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-medium text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-secondary/30 transition-all resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 bg-white border border-slate-100 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] h-11 bg-slate-900 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Initialize Flow
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.getElementById('modal-root'));
};

export default CreateWorkflowModal;
