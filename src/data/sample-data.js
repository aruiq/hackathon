// 示例数据生成器
class SampleDataGenerator {
    constructor() {
        this.categories = [
            'Beverages', 'Snacks', 'Fresh Produce', 'Dairy', 'Bakery', 
            'Household', 'Personal Care', 'Frozen Foods', 'Meat', 'Seafood'
        ];
        
        this.products = [
            // Beverages
            { name: 'Coca Cola 330ml', category: 'Beverages', cost: 1.20, price: 3.50 },
            { name: 'Water Bottle 500ml', category: 'Beverages', cost: 0.80, price: 2.00 },
            { name: 'Orange Juice 1L', category: 'Beverages', cost: 2.50, price: 5.99 },
            { name: 'Energy Drink 250ml', category: 'Beverages', cost: 1.80, price: 4.50 },
            
            // Snacks
            { name: 'Potato Chips 150g', category: 'Snacks', cost: 1.50, price: 4.99 },
            { name: 'Chocolate Bar 50g', category: 'Snacks', cost: 0.90, price: 2.50 },
            { name: 'Mixed Nuts 200g', category: 'Snacks', cost: 3.20, price: 8.99 },
            { name: 'Cookies 250g', category: 'Snacks', cost: 1.80, price: 4.50 },
            
            // Fresh Produce
            { name: 'Bananas 1kg', category: 'Fresh Produce', cost: 1.20, price: 3.99 },
            { name: 'Apples 1kg', category: 'Fresh Produce', cost: 2.00, price: 5.99 },
            { name: 'Tomatoes 500g', category: 'Fresh Produce', cost: 1.50, price: 4.50 },
            { name: 'Lettuce Head', category: 'Fresh Produce', cost: 0.80, price: 2.99 },
            
            // Dairy
            { name: 'Milk 1L', category: 'Dairy', cost: 1.80, price: 3.50 },
            { name: 'Yogurt 170g', category: 'Dairy', cost: 0.90, price: 2.20 },
            { name: 'Cheese Block 200g', category: 'Dairy', cost: 3.50, price: 7.99 },
            { name: 'Butter 250g', category: 'Dairy', cost: 2.20, price: 4.99 },
            
            // Bakery
            { name: 'White Bread Loaf', category: 'Bakery', cost: 1.00, price: 2.80 },
            { name: 'Croissants 4-pack', category: 'Bakery', cost: 2.50, price: 5.99 },
            { name: 'Muffins 6-pack', category: 'Bakery', cost: 3.00, price: 6.99 },
            
            // Household
            { name: 'Toilet Paper 8-pack', category: 'Household', cost: 4.50, price: 9.99 },
            { name: 'Dish Soap 500ml', category: 'Household', cost: 1.20, price: 3.50 },
            { name: 'Laundry Detergent 1L', category: 'Household', cost: 3.80, price: 8.99 }
        ];
        
        this.customerNames = [
            'John Smith', 'Emma Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson',
            'Lisa Anderson', 'James Taylor', 'Jennifer White', 'Robert Garcia', 'Maria Martinez',
            'Christopher Rodriguez', 'Amy Lewis', 'Daniel Lee', 'Michelle Walker', 'Kevin Hall',
            'Karen Allen', 'Thomas Young', 'Nancy King', 'Mark Wright', 'Helen Lopez'
        ];
    }
    
    // 生成随机日期（最近30天内）
    generateRandomDate(daysAgo = 30) {
        const now = new Date();
        const pastDate = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
        const randomTime = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
        return new Date(randomTime);
    }
    
    // 生成客户ID
    generateCustomerId(index) {
        return `CUST_${String(index).padStart(5, '0')}`;
    }
    
    // 生成交易ID
    generateTransactionId(index) {
        return `TXN_${String(index).padStart(6, '0')}`;
    }
    
    // 生成单笔交易
    generateTransaction(transactionIndex, customerId = null) {
        const timestamp = this.generateRandomDate();
        const customer_id = customerId || this.generateCustomerId(Math.floor(Math.random() * 100) + 1);
        
        // 随机选择1-5件商品
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const selectedProducts = [];
        const items = [];
        
        let total_amount = 0;
        
        for (let i = 0; i < itemCount; i++) {
            const product = this.products[Math.floor(Math.random() * this.products.length)];
            
            // 避免重复商品
            if (selectedProducts.includes(product.name)) {
                continue;
            }
            selectedProducts.push(product.name);
            
            const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 数量
            const unit_price = product.price;
            const total_price = quantity * unit_price;
            
            items.push({
                product_name: product.name,
                category: product.category,
                quantity: quantity,
                unit_price: unit_price,
                total_price: total_price,
                cost: product.cost * quantity
            });
            
            total_amount += total_price;
        }
        
        return {
            transaction_id: this.generateTransactionId(transactionIndex),
            timestamp: timestamp.toISOString(),
            customer_id: customer_id,
            items: items,
            total_amount: Math.round(total_amount * 100) / 100,
            payment_method: ['Cash', 'Card', 'Mobile'][Math.floor(Math.random() * 3)]
        };
    }
    
    // 生成库存数据
    generateInventory() {
        return this.products.map(product => ({
            product_name: product.name,
            category: product.category,
            current_stock: Math.floor(Math.random() * 200) + 10,
            reorder_level: Math.floor(Math.random() * 50) + 5,
            unit_cost: product.cost,
            unit_price: product.price,
            supplier: `Supplier ${Math.floor(Math.random() * 5) + 1}`,
            last_restock: this.generateRandomDate(15).toISOString().split('T')[0],
            shelf_life_days: product.category === 'Fresh Produce' ? 
                Math.floor(Math.random() * 7) + 3 : 
                Math.floor(Math.random() * 365) + 30
        }));
    }
    
    // 生成客户数据
    generateCustomers() {
        return this.customerNames.map((name, index) => ({
            customer_id: this.generateCustomerId(index + 1),
            name: name,
            email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: `+61${Math.floor(Math.random() * 900000000) + 100000000}`,
            registration_date: this.generateRandomDate(180).toISOString().split('T')[0],
            loyalty_points: Math.floor(Math.random() * 1000),
            total_spent: 0 // 将在交易数据生成后计算
        }));
    }
    
    // 生成完整的示例数据集
    generateFullDataset(transactionCount = 1000) {
        console.log('Generating sample data...');
        
        // 生成客户数据
        const customers = this.generateCustomers();
        
        // 生成库存数据
        const inventory = this.generateInventory();
        
        // 生成交易数据
        const transactions = [];
        
        for (let i = 1; i <= transactionCount; i++) {
            // 80% 的交易来自现有客户，20% 来自新客户
            let customerId = null;
            if (Math.random() < 0.8 && customers.length > 0) {
                customerId = customers[Math.floor(Math.random() * customers.length)].customer_id;
            }
            
            const transaction = this.generateTransaction(i, customerId);
            transactions.push(transaction);
        }
        
        // 计算客户总消费
        customers.forEach(customer => {
            const customerTransactions = transactions.filter(t => t.customer_id === customer.customer_id);
            customer.total_spent = customerTransactions.reduce((sum, t) => sum + t.total_amount, 0);
            customer.transaction_count = customerTransactions.length;
            customer.avg_order_value = customer.transaction_count > 0 ? 
                customer.total_spent / customer.transaction_count : 0;
        });
        
        console.log(`Generation completed: ${transactions.length} transactions, ${customers.length} customers, ${inventory.length} products`);
        
        return {
            transactions,
            customers,
            inventory,
            metadata: {
                generated_at: new Date().toISOString(),
                transaction_count: transactions.length,
                customer_count: customers.length,
                product_count: inventory.length,
                date_range: {
                    start: new Date(Math.min(...transactions.map(t => new Date(t.timestamp)))).toISOString().split('T')[0],
                    end: new Date(Math.max(...transactions.map(t => new Date(t.timestamp)))).toISOString().split('T')[0]
                }
            }
        };
    }
}

// 导出数据生成器
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SampleDataGenerator;
} else {
    window.SampleDataGenerator = SampleDataGenerator;
}

