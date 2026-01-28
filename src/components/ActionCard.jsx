import React, { useState } from 'react';
import { User, Hash, LogIn, LogOut } from 'lucide-react';

export default function ActionCard({ onAction }) {
    const [name, setName] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    const handleAction = (type) => {
        if (!name.trim()) {
            alert('Please enter your name');
            return;
        }
        onAction({ name, employeeId, type });
        setName('');
        setEmployeeId('');
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 p-8 w-full max-w-md border border-white/50">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Employee Time Clock</h2>
                <p className="text-slate-500 text-sm mt-1">Record your daily attendance</p>
            </div>

            <div className="space-y-5">
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    />
                </div>

                <div className="relative group">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Employee ID (Optional)"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 font-medium text-slate-700"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                    <button
                        onClick={() => handleAction('IN')}
                        className="group relative flex items-center justify-center gap-2 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <LogIn size={20} className="relative z-10" />
                        <span className="relative z-10">Time In</span>
                    </button>

                    <button
                        onClick={() => handleAction('OUT')}
                        className="group relative flex items-center justify-center gap-2 bg-gradient-to-tr from-rose-500 to-orange-400 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <LogOut size={20} className="relative z-10" />
                        <span className="relative z-10">Time Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
