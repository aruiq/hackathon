// Test CSV import functionality
console.log('Testing CSV import...');

// Test CSV data (first few lines from selling_information.csv)
const testCSV = `transaction_id,timestamp,customer_id,product_name,quantity,unit_price,category,total_price
TXN001,2024-01-15 10:30:00,CUST001,iPhone 15 Pro,1,1199.99,Electronics,1199.99
TXN002,2024-01-15 11:00:00,CUST002,MacBook Air M3,1,1299.00,Electronics,1299.00
TXN003,2024-01-15 12:15:00,CUST001,AirPods Pro,2,249.99,Electronics,499.98`;

// Simulate the parsing logic
function parseTestCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    console.log('Headers:', headers);
    
    const transactions = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        
        console.log(`Row ${i}:`, row);
        
        // Test transaction building
        const transaction = {
            transaction_id: row.transaction_id,
            timestamp: new Date(row.timestamp).toISOString(),
            customer_id: row.customer_id,
            total_amount: parseFloat(row.total_price)
        };
        
        console.log('Built transaction:', transaction);
        transactions.push(transaction);
    }
    
    return transactions;
}

// Run test
const result = parseTestCSV(testCSV);
console.log('Final result:', result);
console.log('Total transactions:', result.length);
