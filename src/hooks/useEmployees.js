import { useState, useEffect } from 'react';

const STORAGE_KEY = 'abenson_employee_db_v3';

export const useEmployees = () => {
    const [employees, setEmployees] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    }, [employees]);

    const saveEmployees = (newEmployees) => {
        setEmployees(newEmployees);
    };

    const getEmployee = (id) => {
        if (!id) return null;
        // Search by string comparison to be safe
        return employees.find(emp => String(emp.EmployeeNo) === String(id));
    };

    const clearEmployees = () => {
        if (confirm('Are you sure you want to clear the employee database?')) {
            setEmployees([]);
        }
    };

    return { employees, saveEmployees, getEmployee, clearEmployees };
};
