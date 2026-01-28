import * as XLSX from 'xlsx';
import { format, isSameDay, parseISO } from 'date-fns';

export const exportLogsToExcel = (logs, selectedDate) => {
    // Filter logs for the selected date
    const filteredLogs = logs.filter((log) =>
        isSameDay(parseISO(log.timestamp), selectedDate)
    );

    if (filteredLogs.length === 0) {
        alert('No logs found for this date.');
        return;
    }

    // Format data for Excel
    const data = filteredLogs.map((log) => ({
        'Employee Name': log.name,
        'Employee ID': log.employeeId || 'N/A',
        'Action': log.type === 'IN' ? 'Time In' : 'Time Out',
        'Time': format(parseISO(log.timestamp), 'hh:mm:ss a'),
        'Date': format(parseISO(log.timestamp), 'yyyy-MM-dd'),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Time Logs');

    // Export
    XLSX.writeFile(workbook, `TimeLogs_${format(selectedDate, 'yyyy-MM-dd')}.xlsx`);
};
