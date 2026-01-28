import React, { useState } from 'react';
import { X, Check, Upload, Database, FileSpreadsheet, Loader2 } from 'lucide-react';
import { parseEmployeeFile } from '../utils/excelImport';

export default function SettingsModal({ isOpen, onClose, settings, onUpdateSettings, onImportEmployees, totalEmployees }) {
    const [isLoading, setIsLoading] = useState(false);
    const [importStatus, setImportStatus] = useState(null); // { type: 'success' | 'error', message: '' }

    if (!isOpen) return null;

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setImportStatus(null);
        try {
            const data = await parseEmployeeFile(file);
            onImportEmployees(data);
            setImportStatus({ type: 'success', message: `Successfully loaded ${data.length} employees.` });
        } catch (error) {
            console.error(error);
            setImportStatus({ type: 'error', message: 'Failed to parse file. Check format.' });
        } finally {
            setIsLoading(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-bold text-slate-800">System Settings</h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* General Settings */}
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

                    {/* Database Settings */}
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <Database size={16} />
                            Employee Database
                        </label>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-slate-500">Total Records</span>
                                <span className="text-sm font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200 min-w-[2rem] text-center">
                                    {totalEmployees || 0}
                                </span>
                            </div>

                            <label className="group relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl hover:bg-white hover:border-blue-400 transition-all cursor-pointer">
                                {isLoading ? (
                                    <Loader2 className="animate-spin text-blue-500" size={24} />
                                ) : (
                                    <>
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400 group-hover:text-blue-500 transition-colors">
                                            <Upload className="mb-2" size={24} />
                                            <p className="mb-1 text-sm font-medium">Click to upload .xlsx file</p>
                                            <p className="text-xs opacity-70">Columns: EmployeeNo, EmployeeName, JACKET SIZE</p>
                                        </div>
                                    </>
                                )}
                                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isLoading} />
                            </label>

                            {importStatus && (
                                <div className={`mt-3 text-xs p-2 rounded ${importStatus.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {importStatus.message}
                                </div>
                            )}
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
