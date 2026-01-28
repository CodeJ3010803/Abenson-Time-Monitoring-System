import { useState, useEffect } from 'react';

const DEFAULT_KEY = 'abenson_time_logs';

export const useLogs = (storageKey = DEFAULT_KEY) => {
    // We need to fetch from formatted key whenever it changes, but useState entry only runs once.
    // So we should actually use a simplified approach or just effect to load.
    // However, for React hook rules, we usually want stable initialization.
    // Let's rely on the key changing forcing a re-mount of the component using it, OR use useEffect to swap data.
    // Since App.jsx will conditionally render based on mode, a new component tree effectively is created or we can force key in App.
    // Actually, simpler: The App will pass the key. If the key changes, we want to reload logs.

    // Better pattern for dynamic key in hook:
    const [logs, setLogs] = useState(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    });

    // If param key changes, we need to reload. 
    // BUT useState initial value only runs on mount.
    // We'll add an effect to sync when key changes.
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        setLogs(stored ? JSON.parse(stored) : []);
    }, [storageKey]);

    useEffect(() => {
        if (logs) {
            localStorage.setItem(storageKey, JSON.stringify(logs));
        }
    }, [logs, storageKey]);

    const addLog = (log) => {
        const newLog = { ...log, id: crypto.randomUUID(), timestamp: new Date().toISOString() };
        setLogs((prev) => [newLog, ...prev]);
        return newLog;
    };

    const clearLogs = () => {
        if (confirm('Are you sure you want to clear all logs for this session?')) {
            setLogs([]);
        }
    };

    return { logs, addLog, clearLogs };
};
