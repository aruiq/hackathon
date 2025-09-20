// 数据处理和分析工具类
class DataProcessor {
    constructor() {
        this.transactions = [];
        this.customers = [];
        this.inventory = [];
    }
    
    // 加载数据
    loadData(data) {
        this.transactions = data.transactions || [];
        this.customers = data.customers || [];
        this.inventory = data.inventory || [];
        console.log('Data loading completed:', {
            transactions: this.transactions.length,
            customers: this.customers.length,
            inventory: this.inventory.length
        });
    }
    
    // 获取日期范围内的交易
    getTransactionsByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // 包含结束日期的全天
        
        return this.transactions.filter(t => {
            const transactionDate = new Date(t.timestamp);
            return transactionDate >= start && transactionDate <= end;
        });
    }
    
    // 计算核心指标
    calculateCoreMetrics(startDate, endDate) {
        const transactions = this.getTransactionsByDateRange(startDate, endDate);
        const totalSales = transactions.reduce((sum, t) => sum + t.total_amount, 0);
        const customerCount = new Set(transactions.map(t => t.customer_id)).size;
        const avgOrderValue = transactions.length > 0 ? totalSales / transactions.length : 0;
        
        // 计算热销商品数（销量前20%的商品）
        const productSales = this.getProductSales(startDate, endDate);
        const hotProductsThreshold = Math.ceil(productSales.length * 0.2);
        const hotProducts = productSales.slice(0, hotProductsThreshold);
        
        return {
            dailySales: Math.round(totalSales * 100) / 100,
            customerCount: customerCount,
            avgOrderValue: Math.round(avgOrderValue * 100) / 100,
            hotProducts: hotProducts.length,
            transactionCount: transactions.length
        };
    }
    
    // 获取销售趋势数据
    getSalesTrend(days = 7) {
        const endDate = new Date();
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - days + 1);
        
        const trends = [];
        
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayStart = new Date(currentDate);
            const dayEnd = new Date(currentDate);
            dayEnd.setHours(23, 59, 59, 999);
            
            const dayTransactions = this.transactions.filter(t => {
                const transactionDate = new Date(t.timestamp);
                return transactionDate >= dayStart && transactionDate <= dayEnd;
            });
            
            const sales = dayTransactions.reduce((sum, t) => sum + t.total_amount, 0);
            
            trends.push({
                date: currentDate.toISOString().split('T')[0],
                sales: Math.round(sales * 100) / 100,
                transactions: dayTransactions.length
            });
        }
        
        return trends;
    }
    
    // 获取商品销售排行
    getProductSales(startDate, endDate) {
        const transactions = this.getTransactionsByDateRange(startDate, endDate);
        const productMap = new Map();
        
        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                const key = item.product_name;
                if (!productMap.has(key)) {
                    productMap.set(key, {
                        product_name: item.product_name,
                        category: item.category,
                        total_quantity: 0,
                        total_revenue: 0,
                        total_cost: 0,
                        transaction_count: 0
                    });
                }
                
                const product = productMap.get(key);
                product.total_quantity += item.quantity;
                product.total_revenue += item.total_price;
                product.total_cost += item.cost || 0;
                product.transaction_count++;
            });
        });
        
        const products = Array.from(productMap.values());
        
        // 计算利润和利润率
        products.forEach(product => {
            product.profit = product.total_revenue - product.total_cost;
            product.profit_margin = product.total_revenue > 0 ? 
                (product.profit / product.total_revenue) * 100 : 0;
        });
        
        return products.sort((a, b) => b.total_revenue - a.total_revenue);
    }
    
    // 获取商品分类分布
    getCategoryDistribution(startDate, endDate) {
        const transactions = this.getTransactionsByDateRange(startDate, endDate);
        const categoryMap = new Map();
        
        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                const category = item.category;
                if (!categoryMap.has(category)) {
                    categoryMap.set(category, {
                        category: category,
                        total_revenue: 0,
                        total_quantity: 0
                    });
                }
                
                const cat = categoryMap.get(category);
                cat.total_revenue += item.total_price;
                cat.total_quantity += item.quantity;
            });
        });
        
        return Array.from(categoryMap.values())
            .sort((a, b) => b.total_revenue - a.total_revenue);
    }
    
    // 生成时段热力图数据
    generateHeatmapData(startDate, endDate) {
        const transactions = this.getTransactionsByDateRange(startDate, endDate);
        const heatmapData = Array.from({ length: 24 }, (_, hour) => ({
            hour: hour,
            sales: 0,
            transactions: 0
        }));
        
        transactions.forEach(transaction => {
            const hour = new Date(transaction.timestamp).getHours();
            heatmapData[hour].sales += transaction.total_amount;
            heatmapData[hour].transactions++;
        });
        
        // 找到最大值用于标准化
        const maxSales = Math.max(...heatmapData.map(h => h.sales));
        
        // 标准化并添加强度级别
        heatmapData.forEach(data => {
            data.intensity = maxSales > 0 ? data.sales / maxSales : 0;
            data.level = this.getHeatmapLevel(data.intensity);
        });
        
        return heatmapData;
    }
    
    // 获取热力图强度级别
    getHeatmapLevel(intensity) {
        if (intensity >= 0.8) return 'very-high';
        if (intensity >= 0.6) return 'high';
        if (intensity >= 0.4) return 'medium';
        if (intensity >= 0.2) return 'low';
        return 'very-low';
    }
    
    // 客户分析
    analyzeCustomers(startDate, endDate) {
        const transactions = this.getTransactionsByDateRange(startDate, endDate);
        const customerMap = new Map();
        
        // 收集客户交易数据
        transactions.forEach(transaction => {
            const customerId = transaction.customer_id;
            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    customer_id: customerId,
                    transaction_count: 0,
                    total_spent: 0,
                    avg_order_value: 0,
                    first_transaction: transaction.timestamp,
                    last_transaction: transaction.timestamp
                });
            }
            
            const customer = customerMap.get(customerId);
            customer.transaction_count++;
            customer.total_spent += transaction.total_amount;
            
            const transactionDate = new Date(transaction.timestamp);
            if (transactionDate < new Date(customer.first_transaction)) {
                customer.first_transaction = transaction.timestamp;
            }
            if (transactionDate > new Date(customer.last_transaction)) {
                customer.last_transaction = transaction.timestamp;
            }
        });
        
        // 计算客户价值分层
        const customers = Array.from(customerMap.values());
        customers.forEach(customer => {
            customer.avg_order_value = customer.total_spent / customer.transaction_count;
            
            // 计算客户生命周期（天）
            const firstDate = new Date(customer.first_transaction);
            const lastDate = new Date(customer.last_transaction);
            customer.lifecycle_days = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
            
            // 客户价值分层
            customer.tier = this.getCustomerTier(customer.total_spent, customer.transaction_count);
        });
        
        return customers.sort((a, b) => b.total_spent - a.total_spent);
    }
    
    // 获取客户价值分层
    getCustomerTier(totalSpent, transactionCount) {
        if (totalSpent >= 500 && transactionCount >= 10) return 'VIP';
        if (totalSpent >= 200 && transactionCount >= 5) return 'Gold';
        if (totalSpent >= 100 && transactionCount >= 3) return 'Silver';
        return 'Bronze';
    }
    
    // 库存分析
    analyzeInventory() {
        const analysis = this.inventory.map(item => {
            // 计算库存周转率（基于最近30天的销售）
            const endDate = new Date();
            const startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - 30);
            
            const productSales = this.getProductSalesByName(item.product_name, 
                startDate.toISOString().split('T')[0], 
                endDate.toISOString().split('T')[0]);
            
            const monthlySales = productSales ? productSales.total_quantity : 0;
            const turnoverRate = item.current_stock > 0 ? monthlySales / item.current_stock : 0;
            
            // 库存天数
            const stockDays = monthlySales > 0 ? Math.ceil((item.current_stock * 30) / monthlySales) : 999;
            
            // 库存状态
            let status = 'normal';
            if (item.current_stock <= item.reorder_level) {
                status = 'low_stock';
            } else if (stockDays > 60) {
                status = 'overstocked';
            } else if (monthlySales === 0) {
                status = 'no_sales';
            }
            
            return {
                ...item,
                monthly_sales: monthlySales,
                turnover_rate: Math.round(turnoverRate * 100) / 100,
                stock_days: stockDays,
                status: status,
                reorder_needed: item.current_stock <= item.reorder_level
            };
        });
        
        return {
            items: analysis,
            summary: {
                total_items: analysis.length,
                low_stock_items: analysis.filter(i => i.status === 'low_stock').length,
                overstocked_items: analysis.filter(i => i.status === 'overstocked').length,
                no_sales_items: analysis.filter(i => i.status === 'no_sales').length,
                reorder_needed: analysis.filter(i => i.reorder_needed).length
            }
        };
    }
    
    // 根据商品名称获取销售数据
    getProductSalesByName(productName, startDate, endDate) {
        const products = this.getProductSales(startDate, endDate);
        return products.find(p => p.product_name === productName);
    }
    
    // 成本分析
    analyzeCosts(startDate, endDate) {
        const transactions = this.getTransactionsByDateRange(startDate, endDate);
        let totalRevenue = 0;
        let totalCost = 0;
        
        const productCosts = new Map();
        
        transactions.forEach(transaction => {
            transaction.items.forEach(item => {
                totalRevenue += item.total_price;
                totalCost += item.cost || 0;
                
                const productName = item.product_name;
                if (!productCosts.has(productName)) {
                    productCosts.set(productName, {
                        product_name: productName,
                        category: item.category,
                        total_revenue: 0,
                        total_cost: 0,
                        quantity: 0
                    });
                }
                
                const product = productCosts.get(productName);
                product.total_revenue += item.total_price;
                product.total_cost += item.cost || 0;
                product.quantity += item.quantity;
            });
        });
        
        // 计算商品ROI
        const productROI = Array.from(productCosts.values()).map(product => ({
            ...product,
            profit: product.total_revenue - product.total_cost,
            profit_margin: product.total_revenue > 0 ? 
                ((product.total_revenue - product.total_cost) / product.total_revenue) * 100 : 0,
            roi: product.total_cost > 0 ? 
                ((product.total_revenue - product.total_cost) / product.total_cost) * 100 : 0
        })).sort((a, b) => b.roi - a.roi);
        
        const totalProfit = totalRevenue - totalCost;
        const overallProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        const overallROI = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
        
        return {
            summary: {
                total_revenue: Math.round(totalRevenue * 100) / 100,
                total_cost: Math.round(totalCost * 100) / 100,
                total_profit: Math.round(totalProfit * 100) / 100,
                profit_margin: Math.round(overallProfitMargin * 100) / 100,
                roi: Math.round(overallROI * 100) / 100
            },
            products: productROI
        };
    }
    
    // AI预测建议（简化版本，基于历史数据趋势）
    generateAIPredictions() {
        const predictions = [];
        
        // 分析每个商品的销售趋势
        this.inventory.forEach(item => {
            const last30Days = this.getProductSalesByName(item.product_name, 
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                new Date().toISOString().split('T')[0]);
            
            const last60Days = this.getProductSalesByName(item.product_name, 
                new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                new Date().toISOString().split('T')[0]);
            
            const recent30Sales = last30Days ? last30Days.total_quantity : 0;
            const previous30Sales = last60Days ? (last60Days.total_quantity - recent30Sales) : 0;
            
            // 预测下个月销量
            let predictedSales = recent30Sales;
            if (previous30Sales > 0) {
                const growthRate = (recent30Sales - previous30Sales) / previous30Sales;
                predictedSales = recent30Sales * (1 + growthRate);
            }
            
            // 补货建议
            const suggestedReorder = Math.max(0, predictedSales - item.current_stock + item.reorder_level);
            
            if (suggestedReorder > 0 || item.current_stock <= item.reorder_level) {
                predictions.push({
                    product_name: item.product_name,
                    current_stock: item.current_stock,
                    predicted_demand: Math.round(predictedSales),
                    suggested_reorder: Math.round(suggestedReorder),
                    priority: item.current_stock <= item.reorder_level ? 'high' : 'medium',
                    reason: item.current_stock <= item.reorder_level ? 
                        'Stock shortage, urgent restocking needed' : 'Predicted demand growth, recommend advance restocking'
                });
            }
        });
        
        return predictions.sort((a, b) => {
            if (a.priority === 'high' && b.priority !== 'high') return -1;
            if (b.priority === 'high' && a.priority !== 'high') return 1;
            return b.suggested_reorder - a.suggested_reorder;
        });
    }
    
    // 生成CSV格式的数据导出
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            console.warn('没有数据可以导出');
            return;
        }
        
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        return `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// 导出数据处理器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataProcessor;
} else {
    window.DataProcessor = DataProcessor;
}

