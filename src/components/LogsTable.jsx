import React, { useState } from 'react';
import { Download, Calendar, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { exportLogsToExcel } from '../utils/excelExport';

export default function LogsTable({ logs, onClear, employees = [] }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Filter logs where the ISO timestamp starts with the selected YYYY-MM-DD string
    // Note: Date input returns YYYY-MM-DD. ISOString() is UTC, but useful for storage. 
    // Ideally we should compare date parts or use date-fns isSameDay across timezones.
    // But for simple "filteredLogs" without tz complexity, string match on YYYY-MM-DD is risky if offsets differ.
    // Better to use date-fns helpers.

    const filteredLogs = logs.filter(log => {
        // Parse the log timestamp
        const logDate = parseISO(log.timestamp);
        // Parse selected date (it's YYYY-MM-DD but represented as local midnight usually when passed to Date, or UTC?
        // The value of input date is YYYY-MM-DD.
        const selected = new Date(selectedDate); // This creates UTC midnight usually? No, "2023-01-01" parsed is UTC.
        // Wait. new Date("2023-01-28") is parsed as UTC by spec?
        // Actually, let's just format the log timestamp to 'yyyy-MM-dd' and compare string.
        return format(logDate, 'yyyy-MM-dd') === selectedDate;
    });

    const handleExport = () => {
        exportLogsToExcel(logs, new Date(selectedDate), employees);
    };

    return (
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 flex flex-col h-[calc(100vh-210px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-blue-500" size={24} />
                    Attendance Logs
                </h3>

                <div className="flex items-center gap-3">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium"
                    />
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-lg shadow-slate-500/20 active:scale-95"
                    >
                        <Download size={18} />
                        Export Excel
                    </button>
                    <button
                        onClick={onClear}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                        title="Clear All Logs"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Time</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Employee ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Jacket Size</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLogs.length > 0 ? (
                            filteredLogs
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // Newest first
                                .map((log, index) => {
                                    const employee = employees.find(e => String(e.EmployeeNo) === String(log.employeeId));
                                    const jacketSize = employee ? employee.JACKET_SIZE : '-';
                                    const isLatest = index === 0;

                                    return (
                                        <tr
                                            key={log.id}
                                            className={`transition-all group border-b border-slate-50 ${isLatest
                                                ? 'bg-blue-100/60 shadow-sm relative z-10'
                                                : 'filter blur-[5px] opacity-50 select-none pointer-events-none grayscale'
                                                }`}
                                        >
                                            <td className={`px-6 text-slate-600 font-mono text-xs font-medium ${isLatest ? 'py-5 font-bold text-blue-700' : 'py-3'}`}>
                                                {format(parseISO(log.timestamp), 'hh:mm:ss a')}
                                            </td>
                                            <td className={`px-6 text-slate-800 font-medium ${isLatest ? 'py-5 font-bold text-lg' : 'py-3'}`}>
                                                {log.name || '-'}
                                            </td>
                                            <td className={`px-6 text-slate-500 text-sm ${isLatest ? 'py-5 font-semibold text-slate-600' : 'py-3'}`}>
                                                {log.employeeId || <span className="text-slate-300 italic">None</span>}
                                            </td>
                                            <td className={`px-6 text-slate-500 text-sm ${isLatest ? 'py-5 font-semibold text-slate-600' : 'py-3'}`}>
                                                {jacketSize}
                                            </td>
                                            <td className={`px-6 ${isLatest ? 'py-5' : 'py-3'}`}>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${log.type === 'IN'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 group-hover:bg-emerald-100'
                                                    : 'bg-rose-50 text-rose-700 border-rose-100 group-hover:bg-rose-100'
                                                    } ${isLatest ? 'scale-110 shadow-sm' : ''}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${log.type === 'IN' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    {log.type === 'IN' ? 'Time In' : 'Time Out'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Calendar size={48} className="mb-4 opacity-20" />
                                        <p className="text-lg font-medium text-slate-500">No logs found</p>
                                        <p className="text-sm">Select a different date or start simpler.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
