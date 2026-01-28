import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { exportLogsToExcel } from '../utils/excelExport';

const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 30);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col select-none">
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-mono text-slate-800 tracking-tighter">
                    {format(time, 'HH:mm:ss')}
                </span>
                <span className="text-xl font-mono font-medium text-slate-400 w-[4ch]">
                    .{format(time, 'SSS')}
                </span>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">
                {format(time, 'MMMM dd, yyyy')}
            </span>
        </div>
    );
};

export default function LogsTable({ logs, onClear, employees = [], showJacket = true }) {
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
        exportLogsToExcel(logs, new Date(selectedDate), employees, showJacket);
    };

    return (
        <div className="w-full bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 flex flex-col h-[calc(100vh-210px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-6 items-center justify-between">
                <LiveClock />

                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2">
                        <span className="text-xs uppercase font-bold text-blue-400 tracking-wider">Total Logs</span>
                        <span className="text-xl font-bold text-blue-700">{filteredLogs.length}</span>
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium"
                    />
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95 hover:shadow-xl"
                    >
                        <Download size={18} />
                        Export Excel
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
                            {showJacket && <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Jacket Size</th>}
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
                                            {showJacket && (
                                                <td className={`px-6 text-slate-500 text-sm ${isLatest ? 'py-5 font-semibold text-slate-600' : 'py-3'}`}>
                                                    {jacketSize !== '-' ? (
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs border font-bold tracking-wide ${jacketSize.toUpperCase().includes('ABENSON') ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                            jacketSize.toUpperCase().includes('AUTOMATIC') ? 'bg-red-100 text-red-700 border-red-200' :
                                                                jacketSize.toUpperCase().includes('MOTORPRO') ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                                    jacketSize.toUpperCase().includes('ELECTROWORLD') ? 'bg-pink-100 text-pink-700 border-pink-200' :
                                                                        'bg-slate-100 text-slate-600 border-slate-200'
                                                            }`}>
                                                            {jacketSize}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                            )}
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
                                <td colSpan={showJacket ? 5 : 4} className="px-6 py-24 text-center">
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
