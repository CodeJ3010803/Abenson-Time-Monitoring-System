
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useLogs = (storageKey = 'abenson_time_logs') => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Determine category based on storageKey
    // abenson_training_logs -> TRAINING
    // abenson_time_logs (or default) -> AA
    const category = storageKey === 'abenson_training_logs' ? 'TRAINING' : 'AA';

    useEffect(() => {
        fetchLogs();

        // Optional: Real-time subscription could go here in the future
        // const channel = supabase.channel('logs_channel_' + category)
        //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'logs', filter: `category=eq.${category}` }, payload => {
        //     setLogs(prev => [payload.new, ...prev])
        //   })
        //   .subscribe()
        // return () => supabase.removeChannel(channel)

    }, [category]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('logs')
                .select('*')
                .eq('category', category)
                .order('timestamp', { ascending: false })
                .range(0, 9999);

            if (error) {
                console.error('Error fetching logs:', error);
                return;
            }

            // Map DB columns to app state shape
            // DB: employee_id -> app: employeeId
            const formattedLogs = (data || []).map(log => ({
                ...log,
                employeeId: log.employee_id
            }));

            setLogs(formattedLogs);
        } catch (error) {
            console.error('Error in fetchLogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const addLog = async (logData) => {
        const timestamp = new Date().toISOString();
        const newLog = {
            ...logData,
            id: crypto.randomUUID(),
            timestamp,
            category
        };

        // Optimistic update
        setLogs((prev) => [newLog, ...prev]);

        try {
            const { error } = await supabase
                .from('logs')
                .insert([
                    {
                        employee_id: logData.employeeId, // Map to column name
                        name: logData.name,
                        type: logData.type,
                        timestamp: timestamp,
                        category: category
                    }
                ]);

            if (error) {
                throw error;
            }
            // Success
        } catch (error) {
            console.error('Error adding log to Supabase:', error);
            alert('Failed to save log to cloud. It may disappear on refresh.');
            // In a real app, we might tag this log as "unsynced" in local state
        }

        return newLog;
    };

    const clearLogs = async () => {
        if (confirm('Are you sure you want to DELETE ALL LOGS from the database for this mode? This cannot be undone.')) {
            try {
                const { error } = await supabase
                    .from('logs')
                    .delete()
                    .eq('category', category);

                if (error) throw error;

                setLogs([]);
            } catch (error) {
                console.error('Error clearing logs:', error);
                alert('Failed to clear logs from database.');
            }
        }
    };

    return { logs, addLog, clearLogs, loading };
};
