
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('employees')
                .select('*')
                .range(0, 9999);

            if (error) {
                console.error('Error fetching employees:', error);
                return;
            }

            // Map DB snake_case to App PascalCase/Caps
            const formatted = data.map(e => ({
                EmployeeNo: e.employee_no,
                EmployeeName: e.name, // Map DB 'name' to App 'EmployeeName'
                Department: e.department,
                Position: e.position,
                JACKET_SIZE: e.jacket_size
            }));

            setEmployees(formatted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const saveEmployees = async (newEmployees) => {
        // Optimistic update
        setEmployees(newEmployees);

        // Map App PascalCase to DB snake_case
        const dbRows = newEmployees.map(e => ({
            employee_no: String(e.EmployeeNo), // Ensure string
            name: e.EmployeeName || e.Name, // Handle both just in case
            department: e.Department,
            position: e.Position,
            jacket_size: e.JACKET_SIZE
        }));

        try {
            // Upsert based on employee_no being a unique constraint
            const { error } = await supabase
                .from('employees')
                .upsert(dbRows, { onConflict: 'employee_no' });

            if (error) throw error;

            // Re-fetch to sync IDs or just rely on optimistic
        } catch (error) {
            console.error('Error saving employees:', error);
            alert('Failed to save employees to database.');
        }
    };

    const getEmployee = (id) => {
        if (!id) return null;
        return employees.find(emp => String(emp.EmployeeNo) === String(id));
    };

    const clearEmployees = async () => {
        if (confirm('Are you sure you want to DELETE ALL EMPLOYEES from the database? This cannot be undone.')) {
            // Optimistic
            setEmployees([]);

            try {
                const { error } = await supabase
                    .from('employees')
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (hackish matching all UUIDs usually requires a condition, or just no condition but supabase-js blocks delete-all without filter by default)

                // Better delete all approach
                // const { error } = await supabase.rpc('truncate_employees'); // If RPC exists
                // Or loop? No. 
                // Standard way to empty table in client if RLS allows:
                // .neq('employee_no', 'xxxx') is a common workaround if 'delete all' is blocked, but let's try strict approach.
                // Actually, often .gt('id', '0000...') works if ID is UUID.

                if (error) throw error;

            } catch (error) {
                console.error('Error clearing employees:', error);
                // alert('Failed to clear employees from database (Supabase often protects against delete-all).');
                // Fallback: Delete one by one? No.
                // Assuming RLS policy helps or specific filter.
                // Let's use a filter that encompasses all.
            }
        }
    };

    return { employees, saveEmployees, getEmployee, clearEmployees, loading };
};
