import { useState, useEffect } from 'react';

const STORAGE_KEY = 'abenson_time_logs';

export const useLogs = () => {
    const [logs, setLogs] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }, [logs]);

    const addLog = (log) => {
        const newLog = { ...log, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
        setLogs((prev) => [newLog, ...prev]);
        return newLog;
    };

    const clearLogs = () => {
        if (confirm('Are you sure you want to clear all logs?')) {
            setLogs([]);
        }
    };

    return { logs, addLog, clearLogs };
};
