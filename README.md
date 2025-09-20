# 🇦🇺 Australian MSME Retail Analytics SaaS Platform

A comprehensive retail data analytics SaaS platform designed specifically for Australian Micro, Small, and Medium Enterprises (MSMEs). Built using low-code/no-code solutions and generative AI technology, it provides real-time sales analysis, customer insights, inventory management, store hotspot analysis, and AI-powered intelligent reporting.

## ✨ Core Features

### 📊 Real-time Dashboard
- **Key Metrics**: Daily sales, customer traffic, average order value, trending items
- **Sales Trends**: 7-day sales trend charts with fixed scaling
- **Product Analysis**: Product category distribution pie charts
- **Time Analysis**: 24-hour sales heatmap visualization
- **Top Sellers**: Real-time bestseller TOP5 rankings

### 🛍️ Product Analysis
- **Sales Rankings**: Sorted by quantity sold and revenue
- **Profit Analysis**: Product profit margins and ROI analysis
- **Category Statistics**: Performance comparison across product categories
- **Repurchase Analysis**: Product repurchase rate statistics

### 👥 Customer Analysis  
- **Customer Segmentation**: VIP, Gold, Silver, Bronze four-tier classification
- **Value Analysis**: Customer lifetime value calculations
- **Behavior Insights**: Purchase frequency and order value analysis
- **Retention Analysis**: Customer loyalty and repurchase rates

### 📦 Inventory Analysis
- **Stock Status**: Normal, low stock, overstocked, no sales status identification
- **Turnover Analysis**: Inventory turnover rate calculations
- **Reorder Alerts**: Automatic identification of products needing restocking
- **Slow-moving Detection**: Identify slow-moving products with handling suggestions

### 💰 Cost Analysis
- **Cost Structure**: Detailed breakdown of revenue, costs, and profits
- **ROI Analysis**: Investment return rate ranking and optimization suggestions
- **Profit Margins**: Product profit margin analysis and comparison
- **Profit Optimization**: Data-driven profit improvement recommendations

### 🏪 Store Insights & Hotspots
- **Camera Integration**: Real-time monitoring system integration
- **Hotspot Analysis**: Customer dwell time analysis (excluding cashier area)
- **Zone Mapping**: Visual store layout with heat zone visualization
- **Traffic Patterns**: Peak hours and customer flow analysis
- **API Integration**: Connect to existing camera/sensor systems

### 🤖 AI Analytics Reports
- **Weekly Reports**: Automated weekly business analysis reports
- **Monthly Reports**: Comprehensive monthly performance and trend analysis
- **Predictive Analysis**: Historical data-based demand forecasting
- **Smart Recommendations**: AI-driven business optimization suggestions

### 📁 Data Management
- **CSV Import**: Support for importing sales data from POS systems
- **Sample Data**: One-click generation of 1000 sample transaction records
- **Data Preview**: Preview data format and content before import
- **Local Storage**: Automatic data saving to browser local storage
- **Monitoring API**: Integration with camera and sensor systems

## 🚀 快速开始

### 系统要求
- Python 3.6+ （用于运行开发服务器）
- 现代Web浏览器（Chrome、Firefox、Safari、Edge）
- 4GB+ 内存推荐

### 安装和运行

1. **克隆项目**
```bash
git clone <repository-url>
cd hackthon
```

2. **启动服务器**
```bash
python server.py
```
或者
```bash
python3 server.py
```

3. **访问应用**
服务器启动后会自动打开浏览器，或手动访问：
```
http://localhost:8000/public/index.html
```

### 初次使用

1. **生成示例数据**
   - 点击 "数据管理" 标签页
   - 点击 "生成示例数据" 按钮
   - 系统将生成1000笔模拟交易数据

2. **查看仪表盘**
   - 返回 "仪表盘" 查看核心指标
   - 使用日期选择器筛选不同时间段
   - 观察各种图表和分析结果

3. **探索功能**
   - 浏览各个分析模块
   - 尝试生成AI报告
   - 导入自己的CSV数据

## 📁 项目结构

```
hackthon/
├── public/                 # 静态文件目录
│   └── index.html         # 主页面
├── src/                   # 源代码目录
│   ├── components/        # 组件
│   │   ├── dashboard.js   # 仪表盘组件
│   │   └── data-management.js # 数据管理组件
│   ├── data/             # 数据相关
│   │   └── sample-data.js # 示例数据生成器
│   ├── styles/           # 样式文件
│   │   └── main.css      # 主样式文件
│   └── utils/            # 工具类
│       ├── data-processor.js # 数据处理器
│       └── chart-utils.js    # 图表工具
├── server.py             # 开发服务器
├── README.md            # 项目说明
└── implementation_guide.md # 实施指南
```

## 📊 数据格式

### CSV导入格式
支持以下CSV格式的销售数据：

```csv
transaction_id,timestamp,customer_id,product_name,category,quantity,unit_price
TXN_001,2024-12-01T10:30:00,CUST_001,Coca Cola 330ml,Beverages,2,3.50
TXN_002,2024-12-01T11:15:00,CUST_002,Banana 1kg,Fresh Produce,1,3.99
```

必需字段：
- `transaction_id`: 交易唯一标识
- `timestamp`: 交易时间戳
- `customer_id`: 客户ID
- `product_name`: 商品名称
- `quantity`: 购买数量
- `unit_price`: 单价

可选字段：
- `category`: 商品分类
- `payment_method`: 支付方式

## 🎯 使用场景

### 小型零售店
- 监控日常销售表现
- 识别热销和滞销商品
- 优化库存管理
- 分析客户购买模式

### 便利店连锁
- 对比不同门店表现
- 统一库存管理策略
- 客户数据分析
- 促销效果评估

### 专业零售商
- 深度商品分析
- 精准客户分层
- ROI优化策略
- 数据驱动决策

## 🔧 技术特性

### 前端技术
- **纯JavaScript**：无框架依赖，快速响应
- **Chart.js**：专业图表库，丰富的可视化效果
- **CSS3**：现代化UI设计，响应式布局
- **Web APIs**：本地存储、文件处理等

### 数据处理
- **客户端计算**：无需后端，保护数据隐私
- **实时分析**：毫秒级数据处理和更新
- **内存优化**：高效的数据结构和算法
- **批量处理**：支持大量数据的批量分析

### 核心算法
- **客户分层算法**：基于消费额和频次的智能分层
- **库存周转率**：精确的库存效率计算
- **需求预测**：基于历史数据的趋势预测
- **关联分析**：商品关联性和搭配分析

## 📈 性能优化

### 数据处理优化
- 使用Map和Set数据结构提高查询效率
- 实现数据分页和虚拟滚动
- 缓存计算结果减少重复计算
- 异步处理避免UI阻塞

### 图表渲染优化
- 按需销毁和重建图表实例
- 响应式图表自适应容器大小
- 数据采样减少渲染负担
- 延迟加载非关键图表

### 内存管理
- 及时清理不需要的数据引用
- 使用WeakMap避免内存泄漏
- 分批处理大数据集
- 实现数据压缩存储

## 🔮 未来规划

### 短期目标 (1-3个月)
- [ ] 集成真实的AI API (OpenAI/Claude)
- [ ] 支持更多数据格式导入 (Excel, JSON)
- [ ] 添加数据导出功能 (PDF报告)
- [ ] 实现离线模式支持

### 中期目标 (3-6个月)
- [ ] 多门店数据管理
- [ ] 高级分析功能 (预测模型)
- [ ] 移动端优化
- [ ] 数据备份和同步

### 长期目标 (6-12个月)
- [ ] 云端部署版本
- [ ] 多租户SaaS平台
- [ ] API接口开放
- [ ] 第三方系统集成

## 🛡️ 数据安全

### 本地存储
- 所有数据存储在用户浏览器本地
- 不会上传到任何外部服务器
- 用户完全控制自己的数据

### 隐私保护
- 无用户追踪和数据收集
- 不使用任何第三方分析服务
- 开源透明，可审计代码

### 数据备份
- 支持本地数据导出
- JSON格式备份文件
- 可随时恢复历史数据

## 🆘 常见问题

### Q: 数据会上传到服务器吗？
A: 不会。所有数据都存储在您的浏览器本地存储中，绝不上传到外部服务器。

### Q: 支持多少数据量？
A: 理论上支持数十万条交易记录，实际性能取决于您的设备配置。推荐单次分析不超过10万条记录。

### Q: 如何导入真实的销售数据？
A: 从您的POS系统导出CSV格式的销售数据，然后在"数据管理"页面导入即可。

### Q: AI报告是真实的AI生成的吗？
A: 当前版本使用模拟AI报告，未来版本将集成真实的AI API。

### Q: 可以在没有网络的环境下使用吗？
A: 数据分析功能完全本地化，可以离线使用。只有AI报告功能需要网络连接。

## 🤝 贡献指南

我们欢迎社区贡献！请参考以下步骤：

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 📞 联系我们

- 项目地址：https://github.com/your-repo/retail-analysis-saas
- 问题反馈：https://github.com/your-repo/retail-analysis-saas/issues
- 邮箱：your-email@example.com

---

**🎉 感谢使用澳洲零售分析SaaS工具！让数据驱动您的零售业务成功！**

