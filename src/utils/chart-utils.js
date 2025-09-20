// 图表工具类，使用Chart.js绘制各种图表
class ChartUtils {
    constructor() {
        this.charts = new Map(); // 存储已创建的图表实例
        this.colors = {
            primary: '#2563eb',
            secondary: '#f59e0b',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            palette: [
                '#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', 
                '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
            ]
        };
    }
    
    // 销毁现有图表
    destroyChart(chartId) {
        if (this.charts.has(chartId)) {
            this.charts.get(chartId).destroy();
            this.charts.delete(chartId);
        }
    }
    
    // Create sales trend line chart
    createSalesTrendChart(canvasId, data) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => this.formatDate(d.date)),
                datasets: [{
                    label: 'Sales Revenue',
                    data: data.map(d => d.sales),
                    borderColor: this.colors.primary,
                    backgroundColor: this.colors.primary + '20',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.colors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: this.colors.primary,
                        borderWidth: 1,
                        callbacks: {
                            label: (context) => `Sales: $${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        grid: {
                            color: '#e5e7eb'
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: (value) => `$${value}`
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    // Create product category pie chart
    createCategoryPieChart(canvasId, data) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.category),
                datasets: [{
                    data: data.map(d => d.total_revenue),
                    backgroundColor: this.colors.palette.slice(0, data.length),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverBorderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: $${context.parsed.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    // 创建商品销量柱状图
    createProductBarChart(canvasId, data, limit = 10) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const limitedData = data.slice(0, limit);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: limitedData.map(d => this.truncateText(d.product_name, 15)),
                datasets: [{
                    label: 'Revenue',
                    data: limitedData.map(d => d.total_revenue),
                    backgroundColor: this.colors.primary + '80',
                    borderColor: this.colors.primary,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            title: (context) => limitedData[context[0].dataIndex].product_name,
                            label: (context) => `Revenue: $${context.parsed.y.toFixed(2)}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280',
                            maxRotation: 45
                        }
                    },
                    y: {
                        grid: {
                            color: '#e5e7eb'
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: (value) => `$${value}`
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    // 创建客户分析图表
    createCustomerAnalysisChart(canvasId, data, type = 'spending') {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        let chartData, chartOptions;
        
        if (type === 'spending') {
            // 客户消费分布
            const spendingRanges = this.groupCustomersBySpending(data);
            chartData = {
                labels: spendingRanges.map(r => r.range),
                datasets: [{
                    label: 'Customer Count',
                    data: spendingRanges.map(r => r.count),
                    backgroundColor: this.colors.success + '80',
                    borderColor: this.colors.success,
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            };
        } else if (type === 'tier') {
            // 客户分层分布
            const tierData = this.groupCustomersByTier(data);
            chartData = {
                labels: tierData.map(t => t.tier),
                datasets: [{
                    data: tierData.map(t => t.count),
                    backgroundColor: ['#fbbf24', '#c0c0c0', '#cd7f32', '#2563eb'],
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            };
        }
        
        const chart = new Chart(ctx, {
            type: type === 'tier' ? 'doughnut' : 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: type === 'tier',
                        position: 'bottom'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
                    }
                },
                scales: type === 'tier' ? {} : {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6b7280' }
                    },
                    y: {
                        grid: { color: '#e5e7eb' },
                        ticks: { color: '#6b7280' }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    // 创建库存状态图表
    createInventoryStatusChart(canvasId, data) {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const statusCounts = this.groupInventoryByStatus(data);
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: statusCounts.map(s => s.label),
                datasets: [{
                    data: statusCounts.map(s => s.count),
                    backgroundColor: statusCounts.map(s => s.color),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '50%'
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    // 创建成本分析图表
    createCostAnalysisChart(canvasId, data, type = 'profit') {
        this.destroyChart(canvasId);
        
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const limitedData = data.slice(0, 10);
        
        let chartData;
        if (type === 'profit') {
            chartData = {
                labels: limitedData.map(d => this.truncateText(d.product_name, 12)),
                datasets: [
                    {
                        label: '收入',
                        data: limitedData.map(d => d.total_revenue),
                        backgroundColor: this.colors.success + '80',
                        borderColor: this.colors.success,
                        borderWidth: 1
                    },
                    {
                        label: '成本',
                        data: limitedData.map(d => d.total_cost),
                        backgroundColor: this.colors.danger + '80',
                        borderColor: this.colors.danger,
                        borderWidth: 1
                    }
                ]
            };
        } else if (type === 'roi') {
            chartData = {
                labels: limitedData.map(d => this.truncateText(d.product_name, 12)),
                datasets: [{
                    label: 'ROI (%)',
                    data: limitedData.map(d => d.roi),
                    backgroundColor: limitedData.map(d => 
                        d.roi > 100 ? this.colors.success + '80' : 
                        d.roi > 50 ? this.colors.warning + '80' : 
                        this.colors.danger + '80'
                    ),
                    borderColor: limitedData.map(d => 
                        d.roi > 100 ? this.colors.success : 
                        d.roi > 50 ? this.colors.warning : 
                        this.colors.danger
                    ),
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            };
        }
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: type === 'profit'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        callbacks: {
                            title: (context) => limitedData[context[0].dataIndex].product_name,
                            label: (context) => {
                                if (type === 'profit') {
                                    return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                                } else {
                                    return `ROI: ${context.parsed.y.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { 
                            color: '#6b7280',
                            maxRotation: 45 
                        }
                    },
                    y: {
                        grid: { color: '#e5e7eb' },
                        ticks: { 
                            color: '#6b7280',
                            callback: (value) => type === 'profit' ? `$${value}` : `${value}%`
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }
    
    // 辅助方法：格式化日期
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    
    // 辅助方法：截断文本
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    // 辅助方法：按消费额分组客户
    groupCustomersBySpending(customers) {
        const ranges = [
            { range: '0-50', min: 0, max: 50, count: 0 },
            { range: '51-100', min: 51, max: 100, count: 0 },
            { range: '101-200', min: 101, max: 200, count: 0 },
            { range: '201-500', min: 201, max: 500, count: 0 },
            { range: '500+', min: 501, max: Infinity, count: 0 }
        ];
        
        customers.forEach(customer => {
            const spending = customer.total_spent;
            const range = ranges.find(r => spending >= r.min && spending <= r.max);
            if (range) range.count++;
        });
        
        return ranges.filter(r => r.count > 0);
    }
    
    // 辅助方法：按客户分层分组
    groupCustomersByTier(customers) {
        const tiers = { VIP: 0, Gold: 0, Silver: 0, Bronze: 0 };
        
        customers.forEach(customer => {
            if (tiers.hasOwnProperty(customer.tier)) {
                tiers[customer.tier]++;
            }
        });
        
        return Object.entries(tiers)
            .filter(([_, count]) => count > 0)
            .map(([tier, count]) => ({ tier, count }));
    }
    
    // 辅助方法：按库存状态分组
    groupInventoryByStatus(inventory) {
        const statusMap = {
            'normal': { label: '正常库存', color: this.colors.success, count: 0 },
            'low_stock': { label: '库存不足', color: this.colors.danger, count: 0 },
            'overstocked': { label: '库存过多', color: this.colors.warning, count: 0 },
            'no_sales': { label: '无销售', color: this.colors.info, count: 0 }
        };
        
        inventory.forEach(item => {
            if (statusMap[item.status]) {
                statusMap[item.status].count++;
            }
        });
        
        return Object.values(statusMap).filter(status => status.count > 0);
    }
    
    // 清理所有图表
    destroyAllCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }
}

// 导出图表工具
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartUtils;
} else {
    window.ChartUtils = ChartUtils;
}

