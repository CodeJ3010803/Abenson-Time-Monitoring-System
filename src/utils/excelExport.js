import * as XLSX from 'xlsx';
import { format, isSameDay, parseISO } from 'date-fns';

export const exportLogsToExcel = (logs, selectedDate, employees = [], includeJacket = true) => {
    // 1. Filter logs for the selected date
    const filteredLogs = logs.filter((log) =>
        isSameDay(parseISO(log.timestamp), selectedDate)
    );

    if (filteredLogs.length === 0) {
        alert('No logs found for this date.');
        return;
    }

    // 2. Sort logs chronologically (oldest first) to ensure times appear in order
    filteredLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // 3. Group logs by Employee ID
    const groupedLogs = {};

    filteredLogs.forEach(log => {
        // Use ID as key, or 'UNKNOWN' if missing (though unlikely given logic)
        const key = log.employeeId ? String(log.employeeId) : 'UNKNOWN';

        if (!groupedLogs[key]) {
            groupedLogs[key] = {
                logs: [],
                employeeId: log.employeeId,
                // Capture the first non-empty name available, or fallback later
                name: log.name
            };
        }
        groupedLogs[key].logs.push(log);
        // Update name if we didn't have one and this log has one
        if (!groupedLogs[key].name && log.name) {
            groupedLogs[key].name = log.name;
        }
    });

    // 4. Transform groups into Excel rows
    const data = Object.values(groupedLogs).map(group => {
        // Find employee details from DB
        const empDetails = employees.find(emp => String(emp.EmployeeNo) === String(group.employeeId)) || {};

        // Determine final display name: DB Name > Log Name > 'N/A'
        const finalName = empDetails.EmployeeName || group.name || 'N/A';
        const finalId = group.employeeId || 'N/A';

        // Extract Times
        const timeIns = group.logs
            .filter(l => l.type === 'IN')
            .map(l => format(parseISO(l.timestamp), 'hh:mm:ss a'));

        const timeOuts = group.logs
            .filter(l => l.type === 'OUT')
            .map(l => format(parseISO(l.timestamp), 'hh:mm:ss a'));

        const row = {
            'EmployeeNo': finalId,
            'EmployeeName': finalName,
            'Date': format(selectedDate, 'yyyy-MM-dd'),
            'Time In': timeIns.join(', '),   // e.g. "08:00 AM" or "08:00 AM, 01:00 PM"
            'Time Out': timeOuts.join(', '), // e.g. "05:00 PM"
        };

        if (includeJacket) {
            row['JACKET SIZE'] = empDetails.JACKET_SIZE || '';
        }

        return row;
    });

    // 5. Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 6. Set column widths
    const wscols = [
        { wch: 15 }, // EmployeeNo
        { wch: 30 }, // EmployeeName
        { wch: 15 }, // Date
        { wch: 20 }, // Time In
        { wch: 20 }, // Time Out
    ];

    if (includeJacket) {
        wscols.push({ wch: 15 }); // JACKET SIZE
    }

    worksheet['!cols'] = wscols;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'attendance_report');

    // Export
    XLSX.writeFile(workbook, `TimeLogs_${format(selectedDate, 'yyyy-MM-dd')}.xlsx`);
};
