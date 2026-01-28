import React from 'react';
import { Monitor, GraduationCap, ChevronRight } from 'lucide-react';

export default function LandingPage({ onSelect }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden p-6">
            {/* Background decorations - consistent with App */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-blue-400/20 blur-[120px] mix-blend-multiply filter opacity-50 animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-400/20 blur-[120px] mix-blend-multiply filter opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-emerald-400/20 blur-[120px] mix-blend-multiply filter opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-4xl w-full">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600 shadow-xl shadow-blue-500/30 mb-6 border-2 border-blue-400/30">
                        <span className="text-white font-bold text-4xl pb-1">a.</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                        Time Monitor
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Select your workspace to begin attendance tracking.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
                    {/* AA Time System Card */}
                    <button
                        onClick={() => onSelect('AA')}
                        className="group relative bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl shadow-slate-200/50 hover:shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-2 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <Monitor size={32} />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                                Daily Attendance
                            </h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Standard time-in and time-out monitoring for daily operations.
                            </p>

                            <div className="flex items-center text-blue-600 font-bold text-sm tracking-wide uppercase group-hover:translate-x-2 transition-transform">
                                Enter System <ChevronRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </button>

                    {/* Training System Card */}
                    <button
                        onClick={() => onSelect('TRAINING')}
                        className="group relative bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-xl hover:shadow-2xl shadow-slate-200/50 hover:shadow-purple-200/50 transition-all duration-300 transform hover:-translate-y-2 text-left"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300" />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                <GraduationCap size={32} />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">
                                Training Mode
                            </h2>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Specialized tracking for training sessions, seminars, and workshops.
                            </p>

                            <div className="flex items-center text-purple-600 font-bold text-sm tracking-wide uppercase group-hover:translate-x-2 transition-transform">
                                Enter System <ChevronRight size={16} className="ml-1" />
                            </div>
                        </div>
                    </button>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                        Official Abenson System
                    </p>
                </div>
            </div>
        </div>
    );
}
