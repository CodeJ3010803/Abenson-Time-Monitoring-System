import * as XLSX from 'xlsx';

export const parseEmployeeFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Get first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Validation/Mapping
                // Expected: Column A (EmployeeNo), B (EmployeeName), C (JACKET)
                // sheet_to_json uses the first row as keys by default.
                // We should normalize keys to remove spaces or handle slight variations.

                const normalizedData = jsonData.map(row => {
                    // Find keys regardless of casing or small spacing diffs if possible, 
                    // but user specified format: EmployeeNo, EmployeeName, JACKET.
                    // Let's look for standard keys.

                    return {
                        EmployeeNo: String(row['EmployeeNo'] || row['Employee No'] || row['EmployeeID'] || '').trim(),
                        EmployeeName: String(row['EmployeeName'] || row['Employee Name'] || '').trim(),
                        JACKET_SIZE: String(row['JACKET SIZE'] || row['Jacket Size'] || row['JACKET'] || row['Jacket'] || '').trim()
                    };
                }).filter(item => item.EmployeeNo); // Filter out empty rows

                resolve(normalizedData);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
