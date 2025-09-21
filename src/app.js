// Main Application Class - Manages the entire SaaS application state and components
class RetailAnalysisApp {
    constructor() {
        this.dataProcessor = new DataProcessor();
        this.chartUtils = new ChartUtils();
        this.monitoringAPI = new MonitoringAPI();
        this.dashboard = null;
        this.dataManagement = null;
        this.storeInsights = null;
        this.products = null;
        this.customers = null;
        this.inventory = null;
        this.costs = null;
        this.reports = null;
        
        this.currentView = 'dashboard';
        this.isInitialized = false;
        
        this.init();
    }
    
    // Initialize application
    async init() {
        console.log('Initializing Australian Retail Analytics SaaS Application...');
        
        try {
            // Initialize components
            this.initComponents();
            
            // Bind navigation events
            this.bindNavigationEvents();
            
            // Bind global events
            this.bindGlobalEvents();
            
            // Try to load data from local storage
            await this.loadInitialData();
            
            // Show default view
            this.showView('dashboard');
            
            this.isInitialized = true;
            console.log('Application initialization completed');
            
        } catch (error) {
            console.error('Application initialization failed:', error);
            this.showError('Application initialization failed, please refresh the page and try again');
        }
    }
    
    // Initialize components
    initComponents() {
        // Initialize data management component
        this.dataManagement = new DataManagement(this.dataProcessor);
        
        // Initialize dashboard component
        this.dashboard = new Dashboard(this.dataProcessor, this.chartUtils);
        
        // Initialize store insights component
        this.storeInsights = new StoreInsights(this.monitoringAPI);
        
        // Make store insights globally available for monitoring API callbacks
        window.storeInsights = this.storeInsights;
        
        console.log('Components initialization completed');
    }
    
    // Bind navigation events
    bindNavigationEvents() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                if (view) {
                    this.showView(view);
                }
            });
        });
        
        console.log('Navigation events bound successfully');
    }
    
    // Bind global events
    bindGlobalEvents() {
        // Listen for data update events
        window.addEventListener('dataUpdated', (event) => {
            this.handleDataUpdated(event.detail);
        });
        
        // Listen for window resize events
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
        
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
        
        console.log('Global events bound successfully');
    }
    
    // Load initial data
    async loadInitialData() {
        console.log('Attempting to load initial data...');
        
        // 强制清除本地存储，确保显示新的初始数据
        console.log('Clearing local storage to show fresh initial data...');
        localStorage.removeItem('retail_analysis_data');
        
        // Always generate fresh sample data
        console.log('Generating fresh sample data for initialization...');
        await this.dataManagement.generateSampleData();
    }
    
    // Show view
    showView(viewName) {
        if (!this.isValidView(viewName)) {
            console.warn('Invalid view name:', viewName);
            return;
        }
        
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Remove active state from all navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        // Activate corresponding navigation button
        const navBtn = document.querySelector(`[data-view="${viewName}"]`);
        if (navBtn) {
            navBtn.classList.add('active');
        }
        
        // Update current view
        this.currentView = viewName;
        
        // Initialize view content
        this.initializeView(viewName);
        
        console.log('Switched to view:', viewName);
    }
    
    // Initialize view content
    initializeView(viewName) {
        switch (viewName) {
            case 'dashboard':
                if (this.dashboard) {
                    this.dashboard.init();
                }
                break;
                
            case 'data':
                if (this.dataManagement) {
                    this.dataManagement.init();
                }
                break;
                
            case 'hotspots':
                if (this.storeInsights) {
                    this.storeInsights.init();
                }
                break;
                
            case 'products':
                this.initProductsView();
                break;
                
            case 'customers':
                this.initCustomersView();
                break;
                
            case 'inventory':
                this.initInventoryView();
                break;
                
            case 'costs':
                this.initCostsView();
                break;
                
            case 'reports':
                this.initReportsView();
                break;
        }
    }
    
    // Initialize product analysis view
    initProductsView() {
        const container = document.getElementById('products-content');
        if (!container) return;
        
        // Bind tab events
        this.bindProductTabEvents();
        
        // Show default tab content (Sales Ranking)
        this.showProductTab('ranking');
    }
    
    // Bind product analysis tab events
    bindProductTabEvents() {
        const tabButtons = document.querySelectorAll('#products-view .tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.showProductTab(tab);
                
                // Update active tab button
                document.querySelectorAll('#products-view .tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
    
    // Show specific product analysis tab
    showProductTab(tabName) {
        const container = document.getElementById('products-content');
        if (!container) return;
        
        switch (tabName) {
            case 'ranking':
                this.renderProductRanking(container);
                break;
            case 'repurchase':
                this.renderRepurchaseRate(container);
                break;
            case 'correlation':
                this.renderProductCorrelation(container);
                break;
            default:
                this.renderProductRanking(container);
        }
    }
    
    // Render Sales Ranking tab
    renderProductRanking(container) {
        const dateRange = this.getDefaultDateRange();
        const products = this.dataProcessor.getProductSales(dateRange.start, dateRange.end);
        
        container.innerHTML = `
            <div class="products-analysis">
                <div class="analysis-summary">
                    <div class="summary-card">
                        <h4>Total Products</h4>
                        <div class="summary-value">${products.length}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Total Sales</h4>
                        <div class="summary-value">$${this.formatNumber(products.reduce((sum, p) => sum + p.total_revenue, 0))}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Avg Profit Margin</h4>
                        <div class="summary-value">${this.formatNumber(this.calculateAvgProfitMargin(products))}%</div>
                    </div>
                </div>
                <div class="products-table-container">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Quantity Sold</th>
                                <th>Revenue</th>
                                <th>Profit</th>
                                <th>Profit Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.slice(0, 20).map((product, index) => `
                                <tr>
                                    <td><span class="rank">#${index + 1}</span></td>
                                    <td>${product.product_name}</td>
                                    <td>${product.category}</td>
                                    <td>${product.total_quantity}</td>
                                    <td>$${product.total_revenue.toFixed(2)}</td>
                                    <td>$${product.profit.toFixed(2)}</td>
                                    <td class="${product.profit_margin > 30 ? 'high-profit' : product.profit_margin > 15 ? 'medium-profit' : 'low-profit'}">
                                        ${product.profit_margin.toFixed(1)}%
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Add styles
        this.addProductsStyles();
    }
    
    // Render Repurchase Rate tab
    renderRepurchaseRate(container) {
        const dateRange = this.getDefaultDateRange();
        const products = this.dataProcessor.getProductSales(dateRange.start, dateRange.end);
        
        // Calculate repurchase rates (simulated data for demo)
        const repurchaseData = products.map(product => ({
            ...product,
            repurchase_rate: Math.random() * 40 + 10, // 10-50% repurchase rate
            repeat_customers: Math.floor(product.total_quantity * (Math.random() * 0.3 + 0.1)), // 10-40% repeat customers
            avg_purchase_interval: Math.floor(Math.random() * 30 + 15) // 15-45 days
        })).sort((a, b) => b.repurchase_rate - a.repurchase_rate);
        
        container.innerHTML = `
            <div class="products-analysis">
                <div class="analysis-summary">
                    <div class="summary-card">
                        <h4>Avg Repurchase Rate</h4>
                        <div class="summary-value">${(repurchaseData.reduce((sum, p) => sum + p.repurchase_rate, 0) / repurchaseData.length).toFixed(1)}%</div>
                    </div>
                    <div class="summary-card">
                        <h4>High Loyalty Products</h4>
                        <div class="summary-value">${repurchaseData.filter(p => p.repurchase_rate > 30).length}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Avg Purchase Interval</h4>
                        <div class="summary-value">${(repurchaseData.reduce((sum, p) => sum + p.avg_purchase_interval, 0) / repurchaseData.length).toFixed(0)} days</div>
                    </div>
                </div>
                <div class="products-table-container">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Repurchase Rate</th>
                                <th>Repeat Customers</th>
                                <th>Avg Purchase Interval</th>
                                <th>Customer Loyalty</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${repurchaseData.slice(0, 20).map(product => `
                                <tr>
                                    <td>${product.product_name}</td>
                                    <td>${product.category}</td>
                                    <td class="${product.repurchase_rate > 30 ? 'high-repurchase' : product.repurchase_rate > 20 ? 'medium-repurchase' : 'low-repurchase'}">
                                        ${product.repurchase_rate.toFixed(1)}%
                                    </td>
                                    <td>${product.repeat_customers}</td>
                                    <td>${product.avg_purchase_interval} days</td>
                                    <td>
                                        <span class="loyalty-badge ${product.repurchase_rate > 30 ? 'high' : product.repurchase_rate > 20 ? 'medium' : 'low'}">
                                            ${product.repurchase_rate > 30 ? 'High' : product.repurchase_rate > 20 ? 'Medium' : 'Low'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.addProductsStyles();
    }
    
    // Render Product Correlation tab
    renderProductCorrelation(container) {
        const dateRange = this.getDefaultDateRange();
        const products = this.dataProcessor.getProductSales(dateRange.start, dateRange.end);
        
        // Generate correlation data (simulated for demo)
        const correlationData = [];
        for (let i = 0; i < products.length && i < 15; i++) {
            const product1 = products[i];
            for (let j = i + 1; j < products.length && j < i + 3; j++) {
                const product2 = products[j];
                correlationData.push({
                    product1: product1.product_name,
                    product2: product2.product_name,
                    category1: product1.category,
                    category2: product2.category,
                    correlation_strength: Math.random() * 80 + 20, // 20-100% correlation
                    co_purchase_rate: Math.random() * 30 + 10, // 10-40% co-purchase rate
                    lift_score: (Math.random() * 3 + 1).toFixed(2) // 1.0-4.0 lift score
                });
            }
        }
        
        correlationData.sort((a, b) => b.correlation_strength - a.correlation_strength);
        
        container.innerHTML = `
            <div class="products-analysis">
                <div class="analysis-summary">
                    <div class="summary-card">
                        <h4>Strong Correlations</h4>
                        <div class="summary-value">${correlationData.filter(c => c.correlation_strength > 60).length}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Avg Correlation</h4>
                        <div class="summary-value">${(correlationData.reduce((sum, c) => sum + c.correlation_strength, 0) / correlationData.length).toFixed(1)}%</div>
                    </div>
                    <div class="summary-card">
                        <h4>Avg Co-purchase Rate</h4>
                        <div class="summary-value">${(correlationData.reduce((sum, c) => sum + c.co_purchase_rate, 0) / correlationData.length).toFixed(1)}%</div>
                    </div>
                </div>
                <div class="products-table-container">
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>Product A</th>
                                <th>Product B</th>
                                <th>Correlation Strength</th>
                                <th>Co-purchase Rate</th>
                                <th>Lift Score</th>
                                <th>Recommendation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${correlationData.map(item => `
                                <tr>
                                    <td>
                                        <div class="product-cell">
                                            <span class="product-name">${item.product1}</span>
                                            <span class="product-category">${item.category1}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="product-cell">
                                            <span class="product-name">${item.product2}</span>
                                            <span class="product-category">${item.category2}</span>
                                        </div>
                                    </td>
                                    <td class="${item.correlation_strength > 60 ? 'strong-correlation' : item.correlation_strength > 40 ? 'medium-correlation' : 'weak-correlation'}">
                                        ${item.correlation_strength.toFixed(1)}%
                                    </td>
                                    <td>${item.co_purchase_rate.toFixed(1)}%</td>
                                    <td class="lift-score">${item.lift_score}x</td>
                                    <td>
                                        <span class="recommendation-badge ${item.correlation_strength > 60 ? 'bundle' : item.correlation_strength > 40 ? 'cross-sell' : 'monitor'}">
                                            ${item.correlation_strength > 60 ? 'Bundle Products' : item.correlation_strength > 40 ? 'Cross-sell' : 'Monitor'}
                                        </span>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.addProductsStyles();
    }
    
    // Initialize customer analysis view
    initCustomersView() {
        const container = document.getElementById('customers-content');
        if (!container) return;
        
        const dateRange = this.getDefaultDateRange();
        const customers = this.dataProcessor.analyzeCustomers(dateRange.start, dateRange.end);
        
        // Calculate customer tier statistics
        const tierStats = this.calculateCustomerTierStats(customers);
        
        container.innerHTML = `
            <div class="customers-analysis">
                <div class="analysis-summary">
                    <div class="summary-card">
                        <h4>Total Customers</h4>
                        <div class="summary-value">${customers.length}</div>
                    </div>
                    <div class="summary-card">
                        <h4>VIP Customers</h4>
                        <div class="summary-value">${tierStats.VIP}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Avg Order Value</h4>
                        <div class="summary-value">$${this.formatNumber(this.calculateAvgOrderValue(customers))}</div>
                    </div>
                </div>
                <div class="tier-distribution">
                    <h4>Customer Tier Distribution</h4>
                    <div class="tier-stats">
                        <div class="tier-item vip">VIP: ${tierStats.VIP}</div>
                        <div class="tier-item gold">Gold: ${tierStats.Gold}</div>
                        <div class="tier-item silver">Silver: ${tierStats.Silver}</div>
                        <div class="tier-item bronze">Bronze: ${tierStats.Bronze}</div>
                    </div>
                </div>
                <div class="customers-table-container">
                    <table class="customers-table">
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Tier</th>
                                <th>Transactions</th>
                                <th>Total Spent</th>
                                <th>Avg Order Value</th>
                                <th>Lifecycle (Days)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customers.slice(0, 20).map(customer => `
                                <tr>
                                    <td>${customer.customer_id}</td>
                                    <td><span class="tier-badge ${customer.tier.toLowerCase()}">${customer.tier}</span></td>
                                    <td>${customer.transaction_count}</td>
                                    <td>$${customer.total_spent.toFixed(2)}</td>
                                    <td>$${customer.avg_order_value.toFixed(2)}</td>
                                    <td>${customer.lifecycle_days}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.addCustomersStyles();
    }
    
    // Initialize inventory analysis view
    initInventoryView() {
        const container = document.getElementById('inventory-content');
        if (!container) return;
        
        const inventoryAnalysis = this.dataProcessor.analyzeInventory();
        
        container.innerHTML = `
            <div class="inventory-analysis">
                <div class="analysis-summary">
                    <div class="summary-card">
                        <h4>Total Items</h4>
                        <div class="summary-value">${inventoryAnalysis.summary.total_items}</div>
                    </div>
                    <div class="summary-card alert">
                        <h4>Low Stock</h4>
                        <div class="summary-value">${inventoryAnalysis.summary.low_stock_items}</div>
                    </div>
                    <div class="summary-card warning">
                        <h4>Need Reorder</h4>
                        <div class="summary-value">${inventoryAnalysis.summary.reorder_needed}</div>
                    </div>
                    <div class="summary-card info">
                        <h4>Overstocked</h4>
                        <div class="summary-value">${inventoryAnalysis.summary.overstocked_items}</div>
                    </div>
                </div>
                <div class="inventory-table-container">
                    <table class="inventory-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Current Stock</th>
                                <th>Reorder Level</th>
                                <th>Turnover Rate</th>
                                <th>Stock Days</th>
                                <th>Status</th>
                                <th>Action Required</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventoryAnalysis.items.map(item => `
                                <tr class="${item.status}">
                                    <td>${item.product_name}</td>
                                    <td>${item.category}</td>
                                    <td>${item.current_stock}</td>
                                    <td>${item.reorder_level}</td>
                                    <td>${item.turnover_rate.toFixed(2)}</td>
                                    <td>${item.stock_days > 999 ? '∞' : item.stock_days}</td>
                                    <td><span class="status-badge ${item.status}">${this.getStatusText(item.status)}</span></td>
                                    <td>${this.getInventoryAction(item)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.addInventoryStyles();
    }
    
    // Initialize cost analysis view
    initCostsView() {
        const container = document.getElementById('costs-content');
        if (!container) return;
        
        const dateRange = this.getDefaultDateRange();
        const costAnalysis = this.dataProcessor.analyzeCosts(dateRange.start, dateRange.end);
        
        container.innerHTML = `
            <div class="costs-analysis">
                <div class="analysis-summary">
                    <div class="summary-card">
                        <h4>Total Revenue</h4>
                        <div class="summary-value">$${this.formatNumber(costAnalysis.summary.total_revenue)}</div>
                    </div>
                    <div class="summary-card">
                        <h4>Total Cost</h4>
                        <div class="summary-value">$${this.formatNumber(costAnalysis.summary.total_cost)}</div>
                    </div>
                    <div class="summary-card success">
                        <h4>Total Profit</h4>
                        <div class="summary-value">$${this.formatNumber(costAnalysis.summary.total_profit)}</div>
                    </div>
                    <div class="summary-card info">
                        <h4>Profit Margin</h4>
                        <div class="summary-value">${costAnalysis.summary.profit_margin.toFixed(1)}%</div>
                    </div>
                </div>
                <div class="costs-table-container">
                    <table class="costs-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Revenue</th>
                                <th>Cost</th>
                                <th>Profit</th>
                                <th>Profit Margin</th>
                                <th>ROI</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${costAnalysis.products.slice(0, 20).map(product => `
                                <tr>
                                    <td>${product.product_name}</td>
                                    <td>${product.category}</td>
                                    <td>$${product.total_revenue.toFixed(2)}</td>
                                    <td>$${product.total_cost.toFixed(2)}</td>
                                    <td class="${product.profit > 0 ? 'positive' : 'negative'}">$${product.profit.toFixed(2)}</td>
                                    <td class="${this.getProfitMarginClass(product.profit_margin)}">${product.profit_margin.toFixed(1)}%</td>
                                    <td class="${this.getROIClass(product.roi)}">${product.roi.toFixed(1)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        this.addCostsStyles();
    }
    
    // Initialize AI reports view
    initReportsView() {
        const container = document.getElementById('ai-reports-content');
        if (!container) return;
        
        container.innerHTML = `
            <div class="reports-analysis">
                <div class="reports-header">
                    <h3>AI Analytics Reports</h3>
                    <p>Based on your sales data, AI generates in-depth analysis reports and business recommendations</p>
                </div>
                <div class="reports-controls">
                    <button class="btn-primary" onclick="app.generateAIReport('weekly')">Generate Weekly Report</button>
                    <button class="btn-secondary" onclick="app.generateAIReport('monthly')">Generate Monthly Report</button>
                    <button class="btn-info" onclick="app.generatePredictions()">Generate Predictions</button>
                </div>
                <div id="ai-report-content" class="report-content">
                    <div class="no-report">
                        <p>Click the buttons above to generate AI analysis reports</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate AI report (simplified version, real AI API calls needed in production)
    async generateAIReport(type) {
        const container = document.getElementById('ai-report-content');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-report">Generating AI report...</div>';
        
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const dateRange = this.getDefaultDateRange();
        const metrics = this.dataProcessor.calculateCoreMetrics(dateRange.start, dateRange.end);
        const products = this.dataProcessor.getProductSales(dateRange.start, dateRange.end);
        const customers = this.dataProcessor.analyzeCustomers(dateRange.start, dateRange.end);
        
        const report = this.generateMockAIReport(type, metrics, products, customers);
        
        container.innerHTML = `
            <div class="ai-report">
                <div class="report-header">
                    <h3>${type === 'weekly' ? 'Weekly' : 'Monthly'} AI Analysis Report</h3>
                    <div class="report-date">Generated: ${new Date().toLocaleString()}</div>
                </div>
                <div class="report-sections">
                    ${report.sections.map(section => `
                        <div class="report-section">
                            <h4>${section.title}</h4>
                            <div class="section-content">${section.content}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="report-recommendations">
                    <h4>🎯 AI Recommendations</h4>
                    <ul>
                        ${report.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    // 生成预测报告
    async generatePredictions() {
        const container = document.getElementById('ai-report-content');
        if (!container) return;
        
        container.innerHTML = '<div class="loading-report">Generating prediction report...</div>';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const predictions = this.dataProcessor.generateAIPredictions();
        
        container.innerHTML = `
            <div class="ai-report">
                <div class="report-header">
                    <h3>📊 Smart Inventory Prediction Report</h3>
                    <div class="report-date">Generated: ${new Date().toLocaleString()}</div>
                </div>
                <div class="predictions-summary">
                    <p>Based on historical sales data and trend analysis, AI has predicted restocking requirements for ${predictions.length} products</p>
                </div>
                <div class="predictions-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Current Stock</th>
                                <th>Predicted Demand</th>
                                <th>Suggested Reorder</th>
                                <th>Priority</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${predictions.map(pred => `
                                <tr class="priority-${pred.priority}">
                                    <td>${pred.product_name}</td>
                                    <td>${pred.current_stock}</td>
                                    <td>${pred.predicted_demand}</td>
                                    <td>${pred.suggested_reorder}</td>
                                    <td><span class="priority-badge ${pred.priority}">${pred.priority}</span></td>
                                    <td>${pred.reason}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    // Handle data update events
    handleDataUpdated(data) {
        console.log('Data updated, refreshing current view');
        
        // If currently on dashboard view, refresh dashboard
        if (this.currentView === 'dashboard' && this.dashboard) {
            this.dashboard.refresh();
        }
        
        // Other views also need reinitialization
        if (this.currentView !== 'dashboard' && this.currentView !== 'data') {
            this.initializeView(this.currentView);
        }
    }
    
    // Handle window resize
    handleWindowResize() {
        // Re-render charts to fit new container size
        if (this.chartUtils) {
            // Chart.js charts automatically respond to container size changes
            console.log('Window resized, charts will auto-adjust');
        }
    }
    
    // 处理键盘快捷键
    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    this.showView('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    this.showView('products');
                    break;
                case '3':
                    e.preventDefault();
                    this.showView('customers');
                    break;
                case 'r':
                    e.preventDefault();
                    this.refreshCurrentView();
                    break;
            }
        }
    }
    
    // 刷新当前视图
    refreshCurrentView() {
        this.initializeView(this.currentView);
    }
    
    // 获取默认日期范围
    getDefaultDateRange() {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        
        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    }
    
    // 验证视图名称
    isValidView(viewName) {
        const validViews = ['dashboard', 'products', 'customers', 'inventory', 'costs', 'hotspots', 'reports', 'data'];
        return validViews.includes(viewName);
    }
    
    // 辅助方法
    formatNumber(value) {
        if (typeof value !== 'number') return '0';
        
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        } else {
            return value.toFixed(2);
        }
    }
    
    calculateAvgProfitMargin(products) {
        if (products.length === 0) return 0;
        const totalMargin = products.reduce((sum, p) => sum + (p.profit_margin || 0), 0);
        return totalMargin / products.length;
    }
    
    calculateCustomerTierStats(customers) {
        const stats = { VIP: 0, Gold: 0, Silver: 0, Bronze: 0 };
        customers.forEach(customer => {
            if (stats.hasOwnProperty(customer.tier)) {
                stats[customer.tier]++;
            }
        });
        return stats;
    }
    
    calculateAvgOrderValue(customers) {
        if (customers.length === 0) return 0;
        const totalAvg = customers.reduce((sum, c) => sum + (c.avg_order_value || 0), 0);
        return totalAvg / customers.length;
    }
    
    getStatusText(status) {
        const statusMap = {
            'normal': 'Normal',
            'low_stock': 'Low Stock',
            'overstocked': 'Overstocked',
            'no_sales': 'No Sales'
        };
        return statusMap[status] || status;
    }
    
    getInventoryAction(item) {
        switch (item.status) {
            case 'low_stock':
                return 'Restock Now';
            case 'overstocked':
                return 'Promote Sales';
            case 'no_sales':
                return 'Review Pricing';
            default:
                return 'Monitor';
        }
    }
    
    getProfitMarginClass(margin) {
        if (margin > 30) return 'high-profit';
        if (margin > 15) return 'medium-profit';
        return 'low-profit';
    }
    
    getROIClass(roi) {
        if (roi > 100) return 'excellent-roi';
        if (roi > 50) return 'good-roi';
        return 'poor-roi';
    }
    
    // Generate mock AI report
    generateMockAIReport(type, metrics, products, customers) {
        const period = type === 'weekly' ? 'This week' : 'This month';
        
        return {
            sections: [
                {
                    title: '📊 Performance Overview',
                    content: `${period}, total sales revenue was $${this.formatNumber(metrics.dailySales)}, serving ${metrics.customerCount} customers with an average order value of $${this.formatNumber(metrics.avgOrderValue)}. Compared to last period, performance shows ${Math.random() > 0.5 ? 'steady growth' : 'some fluctuation'}.`
                },
                {
                    title: '🏆 Top Product Analysis',
                    content: `${period}, the top 3 bestselling products were: ${products.slice(0, 3).map((p, i) => `${i+1}. ${p.product_name} (Revenue: $${p.total_revenue.toFixed(2)})`).join(', ')}. Recommend strengthening inventory management for these products.`
                },
                {
                    title: '👥 Customer Behavior Insights',
                    content: `Among the customer base, high-value customers account for ${((customers.filter(c => c.tier === 'VIP').length / customers.length) * 100).toFixed(1)}% with good repeat purchase behavior. Recommend implementing differentiated marketing strategies for different customer tiers.`
                },
                {
                    title: '💡 Business Improvement Opportunities',
                    content: `Data analysis reveals that ${Math.floor(Math.random() * 3) + 2} product categories have growth potential. Recommend optimizing product mix and pricing strategies, which could improve overall profit margin by ${(Math.random() * 10 + 5).toFixed(1)}%.`
                }
            ],
            recommendations: [
                'Optimize inventory structure, focus on fast-moving consumer goods restocking frequency',
                'Implement customer segmentation marketing to improve high-value customer retention',
                'Adjust product pricing strategy to balance sales volume and profit margins',
                'Strengthen data analytics application, build more accurate demand forecasting models',
                'Consider promotional activities to clear slow-moving inventory'
            ]
        };
    }
    
    // 添加样式方法
    addProductsStyles() {
        if (document.getElementById('products-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'products-styles';
        style.textContent = `
            .high-profit { color: var(--success-color); font-weight: bold; }
            .medium-profit { color: var(--warning-color); }
            .low-profit { color: var(--danger-color); }
            .products-analysis .summary-card { margin-bottom: 1rem; }
            
            /* Ranking styles */
            .rank { 
                font-weight: bold; 
                color: var(--primary-color); 
            }
            
            /* Repurchase rate styles */
            .high-repurchase { color: var(--success-color); font-weight: bold; }
            .medium-repurchase { color: var(--warning-color); }
            .low-repurchase { color: var(--danger-color); }
            
            .loyalty-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: bold;
            }
            .loyalty-badge.high { background: var(--success-color); color: white; }
            .loyalty-badge.medium { background: var(--warning-color); color: white; }
            .loyalty-badge.low { background: var(--danger-color); color: white; }
            
            /* Correlation styles */
            .strong-correlation { color: var(--success-color); font-weight: bold; }
            .medium-correlation { color: var(--warning-color); font-weight: bold; }
            .weak-correlation { color: var(--danger-color); }
            
            .product-cell {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            .product-name { font-weight: bold; }
            .product-category { 
                font-size: 0.8em; 
                color: var(--text-light); 
                opacity: 0.7;
            }
            
            .lift-score { 
                font-weight: bold; 
                color: var(--primary-color); 
            }
            
            .recommendation-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: bold;
            }
            .recommendation-badge.bundle { background: var(--success-color); color: white; }
            .recommendation-badge.cross-sell { background: var(--info-color); color: white; }
            .recommendation-badge.monitor { background: var(--secondary-color); color: white; }
        `;
        document.head.appendChild(style);
    }
    
    addCustomersStyles() {
        if (document.getElementById('customers-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'customers-styles';
        style.textContent = `
            .tier-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
            .tier-badge.vip { background: gold; color: black; }
            .tier-badge.gold { background: #ffd700; color: black; }
            .tier-badge.silver { background: #c0c0c0; color: black; }
            .tier-badge.bronze { background: #cd7f32; color: white; }
            .tier-stats { display: flex; gap: 1rem; margin: 1rem 0; }
            .tier-item { padding: 0.5rem 1rem; border-radius: 4px; }
            .tier-item.vip { background: gold; color: black; }
        `;
        document.head.appendChild(style);
    }
    
    addInventoryStyles() {
        if (document.getElementById('inventory-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'inventory-styles';
        style.textContent = `
            .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
            .status-badge.normal { background: var(--success-color); color: white; }
            .status-badge.low_stock { background: var(--danger-color); color: white; }
            .status-badge.overstocked { background: var(--warning-color); color: white; }
            .status-badge.no_sales { background: var(--info-color); color: white; }
            .summary-card.alert { border-left: 4px solid var(--danger-color); }
            .summary-card.warning { border-left: 4px solid var(--warning-color); }
            .summary-card.info { border-left: 4px solid var(--info-color); }
        `;
        document.head.appendChild(style);
    }
    
    addCostsStyles() {
        if (document.getElementById('costs-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'costs-styles';
        style.textContent = `
            .positive { color: var(--success-color); font-weight: bold; }
            .negative { color: var(--danger-color); font-weight: bold; }
            .excellent-roi { color: var(--success-color); font-weight: bold; }
            .good-roi { color: var(--warning-color); }
            .poor-roi { color: var(--danger-color); }
            .summary-card.success { border-left: 4px solid var(--success-color); }
        `;
        document.head.appendChild(style);
    }
    
    showError(message) {
        console.error(message);
        alert(message);
    }
}

// 应用初始化
document.addEventListener('DOMContentLoaded', function() {
    window.app = new RetailAnalysisApp();
});

