import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import Button from './Button';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", isDangerous = true }) => {
    if (!isOpen) return null;

    return createPortal(
        <>
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] transition-opacity" onClick={onClose} />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-[10000] overflow-hidden">
                <div className={`p-6 border-b border-slate-100 flex items-center gap-4 ${isDangerous ? 'bg-red-50/50' : 'bg-slate-50/50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDangerous ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-700'}`}>
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-[13px] text-slate-600 font-medium leading-relaxed">
                        {message}
                    </p>
                </div>
                <div className="p-6 pt-0 flex gap-3">
                    <Button onClick={onClose} variant="secondary" className="flex-1 h-11 bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 h-11 ${isDangerous ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' : 'bg-slate-900 hover:bg-black text-white'}`}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ConfirmationModal;
