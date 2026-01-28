import React, { useState } from 'react';
import { User, Hash, LogIn, LogOut, ArrowLeft } from 'lucide-react';

export default function ActionCard({ onAction, requireName = true, employees = [] }) {
    const [mode, setMode] = useState(null); // 'IN', 'OUT', or null
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (requireName && !name.trim()) {
            alert('Please enter your name');
            return;
        }

        const trimmedId = employeeId.trim();

        if (!trimmedId) {
            alert('Please enter your Employee ID');
            return;
        }

        let finalName = name;

        // VALDATION LOGIC
        if (employees && employees.length > 0) {
            // Find employee in the database (normalize to string for safety)
            const found = employees.find(emp => String(emp.EmployeeNo).trim() === String(trimmedId));

            if (!found) {
                alert(`Employee ID "${trimmedId}" not found in the database. Please contact your administrator.`);
                return;
            }

            // Use the consistent name from the database
            finalName = found.EmployeeName;
        }

        onAction({
            name: finalName,
            employeeId: trimmedId,
            type: mode
        });

        // Reset
        setName('');
        setEmployeeId('');
    };

    if (mode) {
        return (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-8 w-full max-w-md border border-white/50 animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={() => setMode(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 text-sm font-medium transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="text-center mb-8">
                    <h2 className={`text-2xl font-bold ${mode === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {mode === 'IN' ? 'Time In' : 'Time Out'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        {requireName
                            ? (mode === 'IN' ? 'Enter your details to clock in' : 'Enter your details to clock out')
                            : 'Enter your Employee ID'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {requireName && (
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoFocus
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium text-slate-700"
                            />
                        </div>
                    )}

                    <div className="relative group">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder={requireName ? "Employee ID" : "Scan or Type Employee ID"}
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            autoFocus={!requireName}
                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium text-slate-700"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2
                            ${mode === 'IN'
                                ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30 hover:shadow-emerald-500/40'
                                : 'bg-gradient-to-tr from-rose-500 to-orange-400 shadow-rose-500/30 hover:shadow-rose-500/40'
                            }`}
                    >
                        {mode === 'IN' ? <LogIn size={20} /> : <LogOut size={20} />}
                        Confirm {mode === 'IN' ? 'Time In' : 'Time Out'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-8 w-full max-w-md border border-white/50">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Employee Time Clock</h2>
                <p className="text-slate-500 text-sm mt-1">Select an action to proceed</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={() => setMode('IN')}
                    className="group relative flex items-center justify-between p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/50 hover:border-emerald-200 transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogIn size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Time In</h3>
                            <p className="text-sm text-slate-400 group-hover:text-emerald-600/70 transition-colors">Start your shift</p>
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => setMode('OUT')}
                    className="group relative flex items-center justify-between p-6 rounded-2xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-100/50 hover:border-rose-200 transition-all duration-300"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <LogOut size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-700 transition-colors">Time Out</h3>
                            <p className="text-sm text-slate-400 group-hover:text-rose-600/70 transition-colors">End your shift</p>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
