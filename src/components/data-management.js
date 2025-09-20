// Data Management Component - Handles data import and management
class DataManagement {
    constructor(dataProcessor) {
        this.dataProcessor = dataProcessor;
        this.sampleDataGenerator = new SampleDataGenerator();
        this.bindEvents();
    }
    
    // Bind event listeners
    bindEvents() {
        const uploadBtn = document.getElementById('upload-btn');
        const csvFile = document.getElementById('csv-file');
        const generateSampleBtn = document.getElementById('generate-sample-data');
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => this.handleFileUpload());
        }
        
        if (csvFile) {
            csvFile.addEventListener('change', (event) => this.previewFile(event));
        }
        
        if (generateSampleBtn) {
            generateSampleBtn.addEventListener('click', () => this.generateSampleData());
        }
    }
    
    // Initialize data management interface
    init() {
        console.log('Initializing data management interface...');
        this.showCurrentDataInfo();
    }
    
    // Show current data information
    showCurrentDataInfo() {
        const info = {
            transactions: this.dataProcessor.transactions.length,
            customers: this.dataProcessor.customers.length,
            inventory: this.dataProcessor.inventory.length
        };
        
        const infoElement = document.getElementById('current-data-info');
        if (infoElement) {
            infoElement.innerHTML = `
                <div class="data-info">
                    <h4>Current Data Status</h4>
                    <p>Transactions: ${info.transactions} records</p>
                    <p>Customers: ${info.customers} customers</p>
                    <p>Inventory Items: ${info.inventory} items</p>
                </div>
            `;
        }
    }
    
    // Generate sample data
    async generateSampleData() {
        this.showLoading(true, 'Generating sample data...');
        
        try {
            // Generate data
            const sampleData = this.sampleDataGenerator.generateFullDataset(1000);
            
            // Load data into processor
            this.dataProcessor.loadData(sampleData);
            
            // Save to local storage
            this.saveDataToLocalStorage(sampleData);
            
            // Update preview
            this.previewData(sampleData);
            
            // Update data info
            this.showCurrentDataInfo();
            
            // Trigger global data update event
            window.dispatchEvent(new CustomEvent('dataUpdated', { detail: sampleData }));
            
            this.showSuccess('Sample data generated successfully! Contains 1000 transaction records.');
            
        } catch (error) {
            console.error('Sample data generation failed:', error);
            this.showError('Sample data generation failed, please try again');
        } finally {
            this.showLoading(false);
        }
    }
    
    // 文件预览
    previewFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.showError('Please select a CSV format file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvText = e.target.result;
                const previewData = this.parseCSVPreview(csvText);
                this.showFilePreview(previewData, file.name);
            } catch (error) {
                console.error('File preview failed:', error);
                this.showError('File format incorrect, please check CSV format');
            }
        };
        
        reader.readAsText(file);
    }
    
    // 解析CSV预览
    parseCSVPreview(csvText, maxRows = 10) {
        const lines = csvText.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
            throw new Error('CSV file must contain at least header row and data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = [];
        
        for (let i = 1; i < Math.min(lines.length, maxRows + 1); i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                rows.push(row);
            }
        }
        
        return {
            headers: headers,
            rows: rows,
            totalRows: lines.length - 1
        };
    }
    
    // 显示文件预览
    showFilePreview(previewData, filename) {
        const container = document.getElementById('data-preview-table');
        if (!container) return;
        
        let html = `
            <div class="file-preview-header">
                <h4>File Preview: ${filename}</h4>
                <p>Total Rows: ${previewData.totalRows} (showing first 10 rows)</p>
            </div>
            <div class="table-container">
                <table class="preview-table">
                    <thead>
                        <tr>
                            ${previewData.headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${previewData.rows.map(row => `
                            <tr>
                                ${previewData.headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    // 处理文件上传
    async handleFileUpload() {
        const fileInput = document.getElementById('csv-file');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showError('Please select a CSV file first');
            return;
        }
        
        this.showLoading(true, 'Processing CSV file...');
        
        try {
            const csvText = await this.readFileAsText(file);
            const parsedData = await this.parseCSVData(csvText);
            
            // 加载数据到处理器
            this.dataProcessor.loadData(parsedData);
            
            // 存储到本地
            this.saveDataToLocalStorage(parsedData);
            
            // 更新数据信息
            this.showCurrentDataInfo();
            
            // 触发全局数据更新事件
            window.dispatchEvent(new CustomEvent('dataUpdated', { detail: parsedData }));
            
            this.showSuccess(`CSV file uploaded successfully! Processed ${parsedData.transactions.length} transaction records.`);
            
        } catch (error) {
            console.error('CSV file processing failed:', error);
            this.showError(`CSV file processing failed: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }
    
    // 读取文件为文本
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('File read failed'));
            reader.readAsText(file);
        });
    }
    
    // 解析CSV数据
    async parseCSVData(csvText) {
        return new Promise((resolve, reject) => {
            try {
                const lines = csvText.split('\n').filter(line => line.trim());
                if (lines.length < 2) {
                    throw new Error('CSV file format incorrect');
                }
                
                const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                const transactions = [];
                const customers = new Set();
                const products = new Map();
                
                // 检查必需的列
                const requiredColumns = ['transaction_id', 'timestamp', 'customer_id', 'product_name', 'quantity', 'unit_price'];
                const missingColumns = requiredColumns.filter(col => !headers.includes(col));
                if (missingColumns.length > 0) {
                    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
                }
                
                // 解析数据行
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    if (values.length !== headers.length) continue;
                    
                    const row = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index];
                    });
                    
                    // 构建交易记录
                    const transaction = this.buildTransactionFromCSV(row);
                    if (transaction) {
                        transactions.push(transaction);
                        customers.add(transaction.customer_id);
                        
                        // 收集商品信息
                        transaction.items.forEach(item => {
                            if (!products.has(item.product_name)) {
                                products.set(item.product_name, {
                                    product_name: item.product_name,
                                    category: item.category || 'Unknown',
                                    current_stock: 100, // 默认库存
                                    reorder_level: 20,
                                    unit_cost: item.unit_price * 0.6, // 假设成本为售价的60%
                                    unit_price: item.unit_price
                                });
                            }
                        });
                    }
                }
                
                // 构建完整数据集
                const result = {
                    transactions: transactions,
                    customers: Array.from(customers).map(id => ({
                        customer_id: id,
                        name: `Customer ${id}`,
                        email: `${id}@email.com`
                    })),
                    inventory: Array.from(products.values()),
                    metadata: {
                        imported_at: new Date().toISOString(),
                        source: 'csv_import',
                        transaction_count: transactions.length
                    }
                };
                
                resolve(result);
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    // 从CSV行构建交易记录
    buildTransactionFromCSV(row) {
        try {
            const transaction = {
                transaction_id: row.transaction_id,
                timestamp: new Date(row.timestamp).toISOString(),
                customer_id: row.customer_id,
                items: [{
                    product_name: row.product_name,
                    category: row.category || 'Unknown',
                    quantity: parseInt(row.quantity) || 1,
                    unit_price: parseFloat(row.unit_price) || 0,
                    total_price: 0
                }],
                total_amount: 0
            };
            
            // 计算总价
            transaction.items[0].total_price = transaction.items[0].quantity * transaction.items[0].unit_price;
            transaction.total_amount = transaction.items[0].total_price;
            
            return transaction;
        } catch (error) {
            console.warn('Skipping invalid CSV row:', row);
            return null;
        }
    }
    
    // 预览数据
    previewData(data) {
        const container = document.getElementById('data-preview-table');
        if (!container) return;
        
        const sampleTransactions = data.transactions.slice(0, 5);
        
        let html = `
            <div class="data-preview-header">
                <h4>Data Preview</h4>
                <p>Transactions: ${data.transactions.length} | Customers: ${data.customers.length} | Products: ${data.inventory.length}</p>
            </div>
            <div class="table-container">
                <h5>Recent Transactions (First 5)</h5>
                <table class="preview-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Time</th>
                            <th>Customer ID</th>
                            <th>Product</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sampleTransactions.map(t => `
                            <tr>
                                <td>${t.transaction_id}</td>
                                <td>${this.formatDateTime(t.timestamp)}</td>
                                <td>${t.customer_id}</td>
                                <td>${t.items[0]?.product_name || 'N/A'}</td>
                                <td>$${t.total_amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    // 保存数据到本地存储
    saveDataToLocalStorage(data) {
        try {
            localStorage.setItem('retail_analysis_data', JSON.stringify(data));
            console.log('Data saved to local storage');
        } catch (error) {
            console.warn('Local storage save failed:', error);
        }
    }
    
    // 从本地存储加载数据
    loadDataFromLocalStorage() {
        try {
            const data = localStorage.getItem('retail_analysis_data');
            if (data) {
                const parsedData = JSON.parse(data);
                this.dataProcessor.loadData(parsedData);
                this.previewData(parsedData);
                this.showCurrentDataInfo();
                
                // 触发全局数据更新事件
                window.dispatchEvent(new CustomEvent('dataUpdated', { detail: parsedData }));
                
                console.log('Data loaded from local storage successfully');
                return true;
            }
        } catch (error) {
            console.warn('Local storage loading failed:', error);
        }
        return false;
    }
    
    // Clear all data
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            // Clear data in processor
            this.dataProcessor.loadData({ transactions: [], customers: [], inventory: [] });
            
            // Clear local storage
            localStorage.removeItem('retail_analysis_data');
            
            // Clear preview
            const container = document.getElementById('data-preview-table');
            if (container) {
                container.innerHTML = '<p class="no-data">No data available</p>';
            }
            
            // Update data info
            this.showCurrentDataInfo();
            
            // Trigger global data update event
            window.dispatchEvent(new CustomEvent('dataUpdated', { detail: { transactions: [], customers: [], inventory: [] } }));
            
            this.showSuccess('All data has been cleared');
        }
    }
    
    // 导出当前数据
    exportCurrentData() {
        const data = {
            transactions: this.dataProcessor.transactions,
            customers: this.dataProcessor.customers,
            inventory: this.dataProcessor.inventory,
            exported_at: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `retail_data_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('Data export completed');
    }
    
    // 格式化日期时间
    formatDateTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
    
    // Show success message
    showSuccess(message) {
        console.log('Success:', message);
        // Can add user-friendly success notification
        alert(message);
    }
    
    // Show error message
    showError(message) {
        console.error('Error:', message);
        alert(message);
    }
    
    // Show/hide loading state
    showLoading(show, message = 'Processing...') {
        const loadingElement = document.getElementById('loading');
        const loadingText = document.querySelector('.loading-text');
        
        if (loadingElement) {
            if (show) {
                loadingElement.classList.remove('hidden');
                if (loadingText) loadingText.textContent = message;
            } else {
                loadingElement.classList.add('hidden');
            }
        }
    }
}

// 导出数据管理组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManagement;
} else {
    window.DataManagement = DataManagement;
}

