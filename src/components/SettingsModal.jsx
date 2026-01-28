import React from 'react';
import { X, Check } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">System Settings</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-3 block">Input Requirement</label>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => onUpdateSettings({ ...settings, requireName: true })}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${settings.requireName
                                        ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                    }`}
                            >
                                <span className="font-medium">Name & Employee ID</span>
                                {settings.requireName && <Check size={20} className="text-blue-500" />}
                            </button>

                            <button
                                onClick={() => onUpdateSettings({ ...settings, requireName: false })}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${!settings.requireName
                                        ? 'border-blue-500 bg-blue-50/50 text-blue-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                    }`}
                            >
                                <div className="text-left">
                                    <span className="font-medium block">Employee ID Only</span>
                                    <span className="text-xs opacity-70">Faster logging, no name required</span>
                                </div>
                                {!settings.requireName && <Check size={20} className="text-blue-500" />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
