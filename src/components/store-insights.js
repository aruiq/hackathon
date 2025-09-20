// Store Insights Component - Hotspot analysis and monitoring visualization
class StoreInsights {
    constructor(monitoringAPI) {
        this.monitoringAPI = monitoringAPI;
        this.currentZoneData = [];
        this.bindEvents();
    }
    
    // Bind event listeners
    bindEvents() {
        const connectBtn = document.getElementById('connect-cameras');
        const testBtn = document.getElementById('test-connection');
        
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.handleConnect());
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', () => this.handleTestConnection());
        }
    }
    
    // Initialize store insights view
    init() {
        console.log('Initializing Store Insights...');
        this.renderStoreLayout();
        this.updateSummaryCards();
        this.renderHotspotTable();
    }
    
    // Handle connect cameras button
    async handleConnect() {
        const apiInput = document.getElementById('monitoring-api');
        const endpoint = apiInput ? apiInput.value.trim() : '';
        
        if (!endpoint) {
            this.showMessage('Please enter a monitoring API endpoint', 'warning');
            return;
        }
        
        try {
            const result = await this.monitoringAPI.connect(endpoint);
            this.showMessage(result.message, result.success ? 'success' : 'error');
            
            if (result.success) {
                this.updateSummaryCards();
            }
        } catch (error) {
            this.showMessage('Connection failed: ' + error.message, 'error');
        }
    }
    
    // Handle test connection button
    async handleTestConnection() {
        const apiInput = document.getElementById('monitoring-api');
        const endpoint = apiInput ? apiInput.value.trim() : '';
        
        if (!endpoint) {
            this.showMessage('Please enter a monitoring API endpoint', 'warning');
            return;
        }
        
        try {
            const result = await this.monitoringAPI.testConnection(endpoint);
            this.showMessage(result.message, result.success ? 'success' : 'error');
        } catch (error) {
            this.showMessage('Test failed: ' + error.message, 'error');
        }
    }
    
    // Update zone data from monitoring API
    updateZoneData(zoneData) {
        this.currentZoneData = zoneData;
        this.renderStoreLayout();
        this.updateSummaryCards();
        this.renderHotspotTable();
    }
    
    // Render store layout with heat zones
    renderStoreLayout() {
        const container = document.getElementById('store-heatmap');
        if (!container) return;
        
        container.innerHTML = '';
        
        // If no zone data, create demo layout
        if (this.currentZoneData.length === 0) {
            this.createDemoStoreLayout(container);
            return;
        }
        
        // Create store zones
        this.currentZoneData.forEach(zone => {
            const zoneElement = this.createZoneElement(zone);
            container.appendChild(zoneElement);
        });
        
        // Add store layout labels
        this.addStoreLabels(container);
    }
    
    // Create demo store layout for demonstration
    createDemoStoreLayout(container) {
        // Redesigned layout with no gaps and utilizing full padded area
        const demoZones = [
            // Top row - Entrance area (starts right after padding)
            { id: 'entrance', name: 'Main Entrance', type: 'entrance', x: 0, y: 0, w: 100, h: 18, people: 8, dwellTime: 5 },
            
            // Second row - Product sections with aisles (no gap)
            { id: 'produce', name: 'Fresh Produce', type: 'product', x: 0, y: 18, w: 30, h: 26, people: 6, dwellTime: 120 },
            { id: 'aisle1', name: 'Aisle 1', type: 'walkway', x: 30, y: 18, w: 10, h: 26, people: 12, dwellTime: 15 },
            { id: 'dairy', name: 'Dairy', type: 'product', x: 40, y: 18, w: 25, h: 26, people: 5, dwellTime: 90 },
            { id: 'aisle2', name: 'Aisle 2', type: 'walkway', x: 65, y: 18, w: 10, h: 26, people: 10, dwellTime: 12 },
            { id: 'frozen', name: 'Frozen Foods', type: 'product', x: 75, y: 18, w: 25, h: 26, people: 4, dwellTime: 80 },
            
            // Third row - More product sections (no gap)
            { id: 'beverages', name: 'Beverages', type: 'product', x: 0, y: 44, w: 30, h: 26, people: 7, dwellTime: 60 },
            { id: 'main-aisle', name: 'Main Aisle', type: 'walkway', x: 30, y: 44, w: 40, h: 26, people: 20, dwellTime: 10 },
            { id: 'household', name: 'Household', type: 'product', x: 70, y: 44, w: 30, h: 26, people: 3, dwellTime: 180 },
            
            // Fourth row - Snacks and specialty items (no gap)
            { id: 'snacks', name: 'Snacks', type: 'product', x: 0, y: 70, w: 25, h: 12, people: 8, dwellTime: 45 },
            { id: 'bakery', name: 'Bakery', type: 'product', x: 25, y: 70, w: 25, h: 12, people: 6, dwellTime: 90 },
            { id: 'deli', name: 'Deli Counter', type: 'product', x: 50, y: 70, w: 25, h: 12, people: 4, dwellTime: 150 },
            { id: 'pharmacy', name: 'Pharmacy', type: 'product', x: 75, y: 70, w: 25, h: 12, people: 2, dwellTime: 200 },
            
            // Bottom row - Checkout area (extends to padding edge)
            { id: 'checkout', name: 'Checkout Area', type: 'cashier', x: 0, y: 82, w: 100, h: 18, people: 15, dwellTime: 45 }
        ];
        
        demoZones.forEach(zone => {
            const zoneElement = this.createZoneElement(zone);
            container.appendChild(zoneElement);
        });
        
        // Don't add store labels as zones now fill the space
        // this.addStoreLabels(container);
        
        // Update summary with demo data
        this.updateDemoSummary();
    }
    
    // Update summary with demo data
    updateDemoSummary() {
        const totalZonesEl = document.getElementById('total-zones');
        const activeHotspotsEl = document.getElementById('active-hotspots');
        const avgDwellTimeEl = document.getElementById('avg-dwell-time');
        const peakHourEl = document.getElementById('peak-hour');
        
        if (totalZonesEl) totalZonesEl.textContent = '13'; // Updated for new layout
        if (activeHotspotsEl) activeHotspotsEl.textContent = '5';
        if (avgDwellTimeEl) avgDwellTimeEl.textContent = '2.8m';
        if (peakHourEl) peakHourEl.textContent = '2-3 PM';
    }
    
    // Create individual zone element
    createZoneElement(zone) {
        const element = document.createElement('div');
        
        // Calculate heat level for demo data
        const heatLevel = this.calculateHeatLevel(zone.people || zone.currentPeople, zone.dwellTime || zone.avgDwellTime, zone.type);
        element.className = `zone ${heatLevel} zone-type-${zone.type}`;
        
        // Use coordinates from zone data or demo data
        const coords = zone.coordinates || { x: zone.x, y: zone.y, w: zone.w, h: zone.h };
        
        // Adjust positioning for container padding (8px on 400px height = 2%)
        const paddingOffset = 2; // 2% to account for 8px padding on 400px container
        element.style.left = `${coords.x}%`;
        element.style.top = `${coords.y}%`;
        element.style.width = `${coords.w}%`;
        element.style.height = `${coords.h}%`;
        
        // Zone content
        const people = zone.people || zone.currentPeople || 0;
        const dwellTime = zone.dwellTime || zone.avgDwellTime || 0;
        const zoneName = zone.zoneName || zone.name;
        
        // Simplified content - only show zone names, details on click
        // All zones show only the name for clean appearance
        let content = `
            <div class="zone-content">
                <div class="zone-name">${this.shortenName(zoneName)}</div>
            </div>
        `;
        
        element.innerHTML = content;
        
        // Add comprehensive tooltip with all information
        element.title = `${zoneName}\nType: ${zone.type}\nCurrent People: ${people}\nAverage Dwell Time: ${Math.round(dwellTime / 60 * 10) / 10} minutes\nHeat Level: ${heatLevel.replace('hotspot-', '').replace('-', ' ')}`;
        
        // Add click handler for details
        element.addEventListener('click', () => this.showZoneDetails({
            zoneId: zone.id,
            zoneName: zoneName,
            currentPeople: people,
            avgDwellTime: dwellTime,
            heatLevel: heatLevel,
            type: zone.type
        }));
        
        return element;
    }
    
    // Shorten zone names for better display
    shortenName(name) {
        const shortNames = {
            'Fresh Produce': 'Produce',
            'Dairy Products': 'Dairy',
            'Beverages': 'Drinks',
            'Snacks & Confectionery': 'Snacks',
            'Household Items': 'Household',
            'Central Aisle 1': 'Aisle 1',
            'Central Aisle 2': 'Aisle 2',
            'Checkout Area': 'Checkout'
        };
        return shortNames[name] || name;
    }
    
    // Calculate heat level for visualization
    calculateHeatLevel(people, dwellTime, zoneType) {
        // Exclude cashier from hotspot analysis as per requirement
        if (zoneType === 'cashier') {
            return 'cashier';
        }
        
        // Calculate heat score based on people count and dwell time
        const trafficScore = people;
        const dwellScore = dwellTime / 30; // Normalize to 30-second units
        const totalScore = trafficScore + dwellScore;
        
        if (totalScore >= 20) return 'hotspot-very-high';
        if (totalScore >= 15) return 'hotspot-high';
        if (totalScore >= 10) return 'hotspot-medium';
        if (totalScore >= 5) return 'hotspot-low';
        return 'hotspot-very-low';
    }
    
    // Add store layout labels
    addStoreLabels(container) {
        const labels = [
            { text: 'ENTRANCE', x: 50, y: 2, className: 'store-label entrance-label' },
            { text: 'PRODUCE', x: 22, y: 30, className: 'store-label produce-label' },
            { text: 'DAIRY', x: 78, y: 30, className: 'store-label dairy-label' },
            { text: 'BEVERAGES', x: 20, y: 57, className: 'store-label beverages-label' },
            { text: 'SNACKS', x: 45, y: 57, className: 'store-label snacks-label' },
            { text: 'HOUSEHOLD', x: 75, y: 57, className: 'store-label household-label' },
            { text: 'CHECKOUT', x: 50, y: 85, className: 'store-label checkout-label' }
        ];
        
        labels.forEach(label => {
            const labelElement = document.createElement('div');
            labelElement.className = label.className;
            labelElement.textContent = label.text;
            labelElement.style.position = 'absolute';
            labelElement.style.left = `${label.x}%`;
            labelElement.style.top = `${label.y}%`;
            labelElement.style.transform = 'translate(-50%, -50%)';
            labelElement.style.fontSize = '0.75rem';
            labelElement.style.fontWeight = '600';
            labelElement.style.color = '#6b7280';
            labelElement.style.pointerEvents = 'none';
            container.appendChild(labelElement);
        });
    }
    
    // Show zone details modal
    // Show detailed zone information in a modal
    showZoneDetails(zone) {
        const modal = document.createElement('div');
        modal.className = 'zone-details-modal';
        
        // Format heat level for display
        const heatLevelText = zone.heatLevel.replace('hotspot-', '').replace('-', ' ').toUpperCase();
        const currentTime = new Date().toLocaleTimeString();
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📍 ${zone.zoneName}</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="zone-detail-grid">
                        <div class="detail-item">
                            <label>🏷️ Zone Type:</label>
                            <span class="zone-type-badge">${zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}</span>
                        </div>
                        <div class="detail-item">
                            <label>👥 Current People:</label>
                            <span class="people-count">${zone.currentPeople}</span>
                        </div>
                        <div class="detail-item">
                            <label>⏱️ Average Dwell Time:</label>
                            <span>${Math.round(zone.avgDwellTime / 60 * 10) / 10} minutes</span>
                        </div>
                        <div class="detail-item">
                            <label>🔥 Heat Level:</label>
                            <span class="heat-level ${zone.heatLevel}">${heatLevelText}</span>
                        </div>
                        <div class="detail-item">
                            <label>📊 Activity Status:</label>
                            <span class="activity-status">${this.getActivityStatus(zone.currentPeople, zone.avgDwellTime)}</span>
                        </div>
                        <div class="detail-item">
                            <label>🕒 Last Updated:</label>
                            <span>${currentTime}</span>
                        </div>
                    </div>
                    <div class="zone-insights">
                        <h4>💡 Insights</h4>
                        <p>${this.generateZoneInsights(zone)}</p>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.closeModal());
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });
        
        // Close modal with ESC key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        document.body.appendChild(modal);
    }
    
    // Close the zone details modal
    closeModal() {
        const modal = document.querySelector('.zone-details-modal');
        if (modal) {
            modal.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modal && modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 200);
        }
    }
    
    // Get activity status based on people count and dwell time
    getActivityStatus(people, dwellTime) {
        if (people >= 10) return 'Very Busy';
        if (people >= 6) return 'Busy';
        if (people >= 3) return 'Moderate';
        if (people >= 1) return 'Light';
        return 'Empty';
    }
    
    // Generate insights for a zone
    generateZoneInsights(zone) {
        const insights = [];
        
        if (zone.currentPeople >= 8) {
            insights.push(`High traffic area with ${zone.currentPeople} people currently present.`);
        }
        
        if (zone.avgDwellTime > 120) {
            insights.push(`Customers spend significant time here (${Math.round(zone.avgDwellTime/60)} min avg).`);
        } else if (zone.avgDwellTime < 30) {
            insights.push('This is a quick-transit zone with low dwell time.');
        }
        
        if (zone.type === 'entrance') {
            insights.push('Main entry point - monitor for peak traffic patterns.');
        } else if (zone.type === 'cashier') {
            insights.push('Checkout area - track queue length and service efficiency.');
        } else if (zone.type === 'walkway') {
            insights.push('Transit zone - optimize for customer flow.');
        } else if (zone.type === 'product') {
            insights.push('Product area - analyze browsing patterns and engagement.');
        }
        
        return insights.join(' ') || 'Monitor this zone for customer behavior patterns.';
    }
    
    // Update summary cards
    updateSummaryCards() {
        const analysis = this.monitoringAPI.getHotspotAnalysis();
        
        // Update total zones
        const totalZonesEl = document.getElementById('total-zones');
        if (totalZonesEl) {
            totalZonesEl.textContent = analysis.summary.totalZones;
        }
        
        // Update active hotspots
        const activeHotspotsEl = document.getElementById('active-hotspots');
        if (activeHotspotsEl) {
            activeHotspotsEl.textContent = analysis.summary.activeHotspots;
        }
        
        // Update average dwell time
        const avgDwellTimeEl = document.getElementById('avg-dwell-time');
        if (avgDwellTimeEl) {
            const minutes = Math.round(analysis.summary.avgDwellTime / 60 * 10) / 10;
            avgDwellTimeEl.textContent = `${minutes}m`;
        }
        
        // Update peak traffic hour
        const peakHourEl = document.getElementById('peak-hour');
        if (peakHourEl) {
            peakHourEl.textContent = analysis.summary.peakTrafficHour;
        }
    }
    
    // Render hotspot analysis table
    renderHotspotTable() {
        const container = document.getElementById('hotspot-list');
        if (!container) return;
        
        let hotspots = [];
        
        // Get hotspots from monitoring API or use demo data
        if (this.currentZoneData.length > 0) {
            const analysis = this.monitoringAPI.getHotspotAnalysis();
            hotspots = analysis.hotspots;
        } else {
            // Create demo hotspot data
            hotspots = this.createDemoHotspotData();
        }
        
        if (hotspots.length === 0) {
            container.innerHTML = '<p class="no-data">No hotspot data available</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'hotspot-table';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Zone Name</th>
                    <th>Current People</th>
                    <th>Avg Dwell Time</th>
                    <th>Heat Level</th>
                    <th>Hourly Total</th>
                    <th>Heat Score</th>
                </tr>
            </thead>
            <tbody>
                ${hotspots.map(zone => `
                    <tr class="hotspot-row" data-zone="${zone.zoneId}">
                        <td class="zone-name-cell">${zone.zoneName}</td>
                        <td class="people-count-cell">${zone.currentPeople}</td>
                        <td class="dwell-time-cell">${Math.round(zone.avgDwellTime / 60 * 10) / 10}m</td>
                        <td class="heat-level-cell">
                            <span class="heat-level ${zone.heatLevel}">${zone.heatLevel.toUpperCase()}</span>
                        </td>
                        <td class="hourly-total-cell">${zone.hourlyTotal || Math.round(zone.currentPeople * 1.5)}</td>
                        <td class="heat-score-cell">${Math.round(zone.heatScore * 10) / 10}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        // Add click handlers to table rows
        const rows = table.querySelectorAll('.hotspot-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const zoneId = row.dataset.zone;
                const zone = this.currentZoneData.find(z => z.zoneId === zoneId) || 
                            this.findDemoZone(zoneId);
                if (zone) {
                    this.showZoneDetails(zone);
                }
            });
            row.style.cursor = 'pointer';
        });
        
        container.innerHTML = '';
        container.appendChild(table);
    }
    
    // Create demo hotspot data
    createDemoHotspotData() {
        const demoZones = [
            { id: 'entrance', name: 'Entrance', people: 8, dwellTime: 5, type: 'entrance' },
            { id: 'produce', name: 'Fresh Produce', people: 6, dwellTime: 120, type: 'product' },
            { id: 'dairy', name: 'Dairy Products', people: 5, dwellTime: 90, type: 'product' },
            { id: 'beverages', name: 'Beverages', people: 7, dwellTime: 60, type: 'product' },
            { id: 'snacks', name: 'Snacks & Confectionery', people: 4, dwellTime: 45, type: 'product' },
            { id: 'household', name: 'Household Items', people: 3, dwellTime: 180, type: 'product' },
            { id: 'aisle1', name: 'Central Aisle 1', people: 12, dwellTime: 15, type: 'walkway' },
            { id: 'aisle2', name: 'Central Aisle 2', people: 10, dwellTime: 12, type: 'walkway' }
        ];
        
        return demoZones.map(zone => {
            const heatLevel = this.calculateHeatLevel(zone.people, zone.dwellTime, zone.type);
            const heatScore = (zone.people * 2) + (zone.dwellTime / 10);
            
            return {
                zoneId: zone.id,
                zoneName: zone.name,
                currentPeople: zone.people,
                avgDwellTime: zone.dwellTime,
                heatLevel: heatLevel,
                heatScore: heatScore,
                type: zone.type
            };
        }).sort((a, b) => b.heatScore - a.heatScore);
    }
    
    // Find demo zone by ID
    findDemoZone(zoneId) {
        const demoZones = [
            { id: 'entrance', name: 'Entrance', people: 8, dwellTime: 5, type: 'entrance' },
            { id: 'produce', name: 'Fresh Produce', people: 6, dwellTime: 120, type: 'product' },
            { id: 'dairy', name: 'Dairy Products', people: 5, dwellTime: 90, type: 'product' },
            { id: 'beverages', name: 'Beverages', people: 7, dwellTime: 60, type: 'product' },
            { id: 'snacks', name: 'Snacks & Confectionery', people: 4, dwellTime: 45, type: 'product' },
            { id: 'household', name: 'Household Items', people: 3, dwellTime: 180, type: 'product' },
            { id: 'aisle1', name: 'Central Aisle 1', people: 12, dwellTime: 15, type: 'walkway' },
            { id: 'aisle2', name: 'Central Aisle 2', people: 10, dwellTime: 12, type: 'walkway' },
            { id: 'checkout', name: 'Checkout Area', people: 15, dwellTime: 45, type: 'cashier' }
        ];
        
        const zone = demoZones.find(z => z.id === zoneId);
        if (zone) {
            return {
                zoneId: zone.id,
                zoneName: zone.name,
                currentPeople: zone.people,
                avgDwellTime: zone.dwellTime,
                heatLevel: this.calculateHeatLevel(zone.people, zone.dwellTime, zone.type),
                type: zone.type
            };
        }
        return null;
    }
    
    // Show message to user
    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1001;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        // Set background color based on type
        const colors = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b',
            'info': '#3b82f6'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(messageEl)) {
                document.body.removeChild(messageEl);
            }
        }, 5000);
    }
    
    // Export hotspot data
    exportHotspotData() {
        const analysis = this.monitoringAPI.getHotspotAnalysis();
        const exportData = {
            timestamp: new Date().toISOString(),
            summary: analysis.summary,
            hotspots: analysis.hotspots,
            zones: this.currentZoneData
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `hotspot_analysis_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('Hotspot analysis data exported');
    }
    
    // Get real-time insights
    getRealTimeInsights() {
        const analysis = this.monitoringAPI.getHotspotAnalysis();
        const insights = [];
        
        // Find top hotspots
        const topHotspots = analysis.hotspots.slice(0, 3);
        if (topHotspots.length > 0) {
            insights.push(`Top hotspot: ${topHotspots[0].zoneName} with ${topHotspots[0].currentPeople} people`);
        }
        
        // Check for congestion
        const congestedZones = analysis.hotspots.filter(h => h.heatLevel === 'very-high');
        if (congestedZones.length > 0) {
            insights.push(`Warning: ${congestedZones.length} zones experiencing high congestion`);
        }
        
        // Check dwell times
        const longDwellZones = analysis.hotspots.filter(h => h.avgDwellTime > 300); // 5+ minutes
        if (longDwellZones.length > 0) {
            insights.push(`${longDwellZones.length} zones with extended dwell times (>5min)`);
        }
        
        return insights;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StoreInsights;
} else {
    window.StoreInsights = StoreInsights;
}
