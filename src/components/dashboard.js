// Dashboard Component - Core dashboard functionality
class Dashboard {
    constructor(dataProcessor, chartUtils) {
        this.dataProcessor = dataProcessor;
        this.chartUtils = chartUtils;
        this.defaultDateRange = this.getDefaultDateRange();
        this.bindEvents();
    }
    
    // Get default date range (last 7 days)
    getDefaultDateRange() {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6); // Last 7 days
        
        return {
            start: startDate.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0]
        };
    }
    
    // Bind event listeners
    bindEvents() {
        const refreshBtn = document.getElementById('refresh-btn');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }
        
        if (startDateInput && endDateInput) {
            // Set default values
            startDateInput.value = this.defaultDateRange.start;
            endDateInput.value = this.defaultDateRange.end;
            
            // Listen for date changes
            startDateInput.addEventListener('change', () => this.refresh());
            endDateInput.addEventListener('change', () => this.refresh());
        }
    }
    
    // Get currently selected date range
    getCurrentDateRange() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        
        if (startDateInput && endDateInput) {
            return {
                start: startDateInput.value || this.defaultDateRange.start,
                end: endDateInput.value || this.defaultDateRange.end
            };
        }
        
        return this.defaultDateRange;
    }
    
    // Initialize dashboard
    init() {
        console.log('Initializing dashboard...');
        this.refresh();
    }
    
    // Refresh dashboard data
    refresh() {
        const dateRange = this.getCurrentDateRange();
        console.log('Refreshing dashboard data:', dateRange);
        
        this.showLoading(true);
        
        try {
            // Update core metrics
            this.updateCoreMetrics(dateRange);
            
            // Update charts
            this.updateCharts(dateRange);
            
            // Update top products list
            this.updateTopProducts(dateRange);
            
            // Update hourly heatmap
            this.updateHeatmap(dateRange);
            
        } catch (error) {
            console.error('Dashboard refresh failed:', error);
            this.showError('Data loading failed, please try again');
        } finally {
            this.showLoading(false);
        }
    }
    
    // 更新核心指标卡片
    updateCoreMetrics(dateRange) {
        const metrics = this.dataProcessor.calculateCoreMetrics(dateRange.start, dateRange.end);
        
        // 计算上一期数据用于显示变化趋势
        const daysDiff = this.getDaysDifference(dateRange.start, dateRange.end);
        const previousStart = new Date(new Date(dateRange.start) - daysDiff * 24 * 60 * 60 * 1000);
        const previousEnd = new Date(new Date(dateRange.end) - daysDiff * 24 * 60 * 60 * 1000);
        const previousMetrics = this.dataProcessor.calculateCoreMetrics(
            previousStart.toISOString().split('T')[0],
            previousEnd.toISOString().split('T')[0]
        );
        
        // 更新销售额
        this.updateMetricCard('daily-sales', metrics.dailySales, previousMetrics.dailySales, '$');
        this.updateMetricCard('customer-count', metrics.customerCount, previousMetrics.customerCount);
        this.updateMetricCard('avg-order-value', metrics.avgOrderValue, previousMetrics.avgOrderValue, '$');
        this.updateMetricCard('hot-products', metrics.hotProducts, previousMetrics.hotProducts);
        
        console.log('Core metrics updated:', metrics);
    }
    
    // 更新单个指标卡片
    updateMetricCard(elementId, currentValue, previousValue, prefix = '') {
        const valueElement = document.getElementById(elementId);
        const changeElement = document.getElementById(elementId.replace(/daily-|customer-|avg-order-|hot-/, '') + '-change');
        
        if (valueElement) {
            valueElement.textContent = `${prefix}${this.formatNumber(currentValue)}`;
        }
        
        if (changeElement && previousValue !== undefined) {
            const change = previousValue > 0 ? ((currentValue - previousValue) / previousValue * 100) : 0;
            const changeText = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
            
            changeElement.textContent = changeText;
            changeElement.className = `metric-change ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }
    
    // 更新图表
    updateCharts(dateRange) {
        // 销售趋势图
        const salesTrend = this.dataProcessor.getSalesTrend(7);
        this.chartUtils.createSalesTrendChart('sales-trend-chart', salesTrend);
        
        // 商品分类饼图
        const categoryData = this.dataProcessor.getCategoryDistribution(dateRange.start, dateRange.end);
        this.chartUtils.createCategoryPieChart('category-pie-chart', categoryData);
        
        console.log('Charts updated');
    }
    
    // 更新热销商品列表
    updateTopProducts(dateRange) {
        const products = this.dataProcessor.getProductSales(dateRange.start, dateRange.end);
        const topProducts = products.slice(0, 5);
        
        const container = document.getElementById('top-products-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        topProducts.forEach((product, index) => {
            const productElement = this.createProductItem(product, index + 1);
            container.appendChild(productElement);
        });
        
        console.log('Top products list updated');
    }
    
    // 创建商品项元素
    createProductItem(product, rank) {
        const item = document.createElement('div');
        item.className = 'product-item';
        
        item.innerHTML = `
            <div class="product-info">
                <span class="product-rank">#${rank}</span>
                <span class="product-name">${product.product_name}</span>
            </div>
            <div class="product-stats">
                <span class="product-quantity">${product.total_quantity} pcs</span>
                <span class="product-revenue">$${this.formatNumber(product.total_revenue)}</span>
            </div>
        `;
        
        return item;
    }
    
    // 更新时段热力图
    updateHeatmap(dateRange) {
        const heatmapData = this.dataProcessor.generateHeatmapData(dateRange.start, dateRange.end);
        const container = document.getElementById('heatmap-container');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        heatmapData.forEach(hourData => {
            const cell = document.createElement('div');
            cell.className = `heatmap-cell ${hourData.level}`;
            cell.style.backgroundColor = this.getHeatmapColor(hourData.intensity);
            cell.textContent = hourData.hour.toString().padStart(2, '0');
            cell.title = `${hourData.hour}:00 - Sales: $${hourData.sales.toFixed(2)}, Transactions: ${hourData.transactions}`;
            
            container.appendChild(cell);
        });
        
        console.log('Hourly heatmap updated');
    }
    
    // 获取热力图颜色
    getHeatmapColor(intensity) {
        const baseColor = { r: 37, g: 99, b: 235 }; // 主色调
        const alpha = Math.max(0.1, intensity);
        
        return `rgba(${baseColor.r}, ${baseColor.g}, ${baseColor.b}, ${alpha})`;
    }
    
    // 计算日期差异
    getDaysDifference(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    }
    
    // 格式化数字显示
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
    
    // 显示/隐藏加载状态
    showLoading(show) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            if (show) {
                loadingElement.classList.remove('hidden');
            } else {
                loadingElement.classList.add('hidden');
            }
        }
    }
    
    // 显示错误消息
    showError(message) {
        console.error(message);
        // 这里可以添加用户友好的错误提示
        alert(message);
    }
    
    // 导出仪表盘数据
    exportDashboardData() {
        const dateRange = this.getCurrentDateRange();
        
        try {
            // 获取各种分析数据
            const metrics = this.dataProcessor.calculateCoreMetrics(dateRange.start, dateRange.end);
            const salesTrend = this.dataProcessor.getSalesTrend(7);
            const products = this.dataProcessor.getProductSales(dateRange.start, dateRange.end);
            const categories = this.dataProcessor.getCategoryDistribution(dateRange.start, dateRange.end);
            
            // 创建导出数据
            const exportData = {
                report_date: new Date().toISOString(),
                date_range: dateRange,
                core_metrics: metrics,
                sales_trend: salesTrend,
                top_products: products.slice(0, 10),
                category_distribution: categories
            };
            
            // 导出为JSON文件
            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `dashboard_report_${dateRange.start}_to_${dateRange.end}.json`;
            link.click();
            
            console.log('仪表盘数据已导出');
        } catch (error) {
            console.error('导出失败:', error);
            this.showError('导出失败，请重试');
        }
    }
    
    // 创建快照功能（保存当前状态）
    createSnapshot() {
        const dateRange = this.getCurrentDateRange();
        const snapshot = {
            timestamp: new Date().toISOString(),
            date_range: dateRange,
            metrics: this.dataProcessor.calculateCoreMetrics(dateRange.start, dateRange.end)
        };
        
        // 保存到本地存储
        const snapshots = JSON.parse(localStorage.getItem('dashboard_snapshots') || '[]');
        snapshots.push(snapshot);
        
        // 保持最多10个快照
        if (snapshots.length > 10) {
            snapshots.shift();
        }
        
        localStorage.setItem('dashboard_snapshots', JSON.stringify(snapshots));
        console.log('快照已保存');
    }
    
    // 获取历史快照
    getSnapshots() {
        return JSON.parse(localStorage.getItem('dashboard_snapshots') || '[]');
    }
}

// 导出仪表盘组件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
} else {
    window.Dashboard = Dashboard;
}

