import * as XLSX from 'xlsx';
import { format, isSameDay, parseISO } from 'date-fns';

export const exportLogsToExcel = (logs, selectedDate, employees = [], includeJacket = true) => {
    // Filter logs for the selected date
    const filteredLogs = logs.filter((log) =>
        isSameDay(parseISO(log.timestamp), selectedDate)
    );

    if (filteredLogs.length === 0) {
        alert('No logs found for this date.');
        return;
    }

    // Helper to find employee details
    const getEmployeeDetails = (id) => {
        if (!id) return {};
        return employees.find(emp => String(emp.EmployeeNo) === String(id)) || {};
    };

    // Format data for Excel
    const data = filteredLogs.map((log) => {
        const empDetails = getEmployeeDetails(log.employeeId);

        // Use name from log if available (manual entry), otherwise fallback to DB name
        const finalName = log.name || empDetails.EmployeeName || '';

        const row = {
            'EmployeeNo': log.employeeId || 'N/A',
            'EmployeeName': finalName,
            'Action': log.type === 'IN' ? 'Time In' : 'Time Out',
            'Time': format(parseISO(log.timestamp), 'hh:mm:ss a'),
            'Date': format(parseISO(log.timestamp), 'yyyy-MM-dd'),
        };

        if (includeJacket) {
            row['JACKET SIZE'] = empDetails.JACKET_SIZE || '';
        }

        return row;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const wscols = [
        { wch: 15 }, // EmployeeNo
        { wch: 30 }, // EmployeeName
        { wch: 12 }, // Action
        { wch: 15 }, // Time
        { wch: 15 }, // Date
    ];

    if (includeJacket) {
        wscols.push({ wch: 15 }); // JACKET SIZE
    }

    worksheet['!cols'] = wscols;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Logs');

    // Export
    XLSX.writeFile(workbook, `TimeLogs_${format(selectedDate, 'yyyy-MM-dd')}.xlsx`);
};
