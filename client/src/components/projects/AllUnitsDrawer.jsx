import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, LayoutGrid, ChevronRight, Hash } from 'lucide-react';

const AllUnitsDrawer = ({ isOpen, onClose, units, onSelect, currentUnit }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUnits = units.filter(unit =>
        unit.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isOpen) return null;

    const drawerContent = (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Side Drawer */}
            <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[201] transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-slate-100 flex flex-col`}>
                {/* Header */}
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <LayoutGrid className="w-5 h-5 text-secondary" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-lg font-bold text-slate-900 leading-none uppercase tracking-tight">Execution Units</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Full Organizational Directory</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find project..."
                            className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 text-[12px] font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-secondary/30 transition-all shadow-inner"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Unit List */}
                    <div className="space-y-1">
                        <button
                            onClick={() => {
                                onSelect('All Units');
                                onClose();
                            }}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${currentUnit === 'All Units' ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'}`}
                        >
                            <div className="flex items-center gap-3">
                                <LayoutGrid className={`w-4 h-4 ${currentUnit === 'All Units' ? 'text-secondary' : 'text-slate-400'}`} />
                                <span className={`text-[11px] font-bold uppercase tracking-widest`}>Strategic Overview (All)</span>
                            </div>
                            {currentUnit === 'All Units' && <ChevronRight className="w-4 h-4 text-secondary" />}
                        </button>

                        <div className="h-px bg-slate-50 my-4" />

                        <div className="grid grid-cols-1 gap-1">
                            {filteredUnits.map(unit => (
                                <button
                                    key={unit}
                                    onClick={() => {
                                        onSelect(unit);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${currentUnit === unit ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-transparent hover:bg-slate-50 text-slate-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Hash className={`w-4 h-4 ${currentUnit === unit ? 'text-secondary' : 'text-slate-400'}`} />
                                        <span className={`text-[11px] font-bold uppercase tracking-widest`}>{unit}</span>
                                    </div>
                                    {currentUnit === unit && <ChevronRight className="w-4 h-4 text-secondary" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="p-6 bg-slate-50/30 border-t border-slate-100">
                    <div className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <LayoutGrid className="w-4 h-4 text-secondary" />
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            Total Units: <span className="font-bold text-slate-900">{units.length}</span>. Selecting a unit filters all active Bureau projects.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(drawerContent, document.getElementById('modal-root'));
};

export default AllUnitsDrawer;
