// Monitoring API - Camera and sensor integration utilities
class MonitoringAPI {
    constructor() {
        this.apiEndpoint = '';
        this.connected = false;
        this.lastUpdate = null;
        this.updateInterval = null;
        this.simulationMode = false;
        
        // Store zones configuration (excluding cashier as main focus)
        this.zones = [
            { id: 'entrance', name: 'Entrance', type: 'entrance', x: 45, y: 5, w: 10, h: 15 },
            { id: 'produce', name: 'Fresh Produce', type: 'product', x: 10, y: 20, w: 25, h: 20 },
            { id: 'dairy', name: 'Dairy Products', type: 'product', x: 65, y: 20, w: 25, h: 20 },
            { id: 'beverages', name: 'Beverages', type: 'product', x: 10, y: 45, w: 20, h: 25 },
            { id: 'snacks', name: 'Snacks & Confectionery', type: 'product', x: 35, y: 45, w: 20, h: 25 },
            { id: 'household', name: 'Household Items', type: 'product', x: 65, y: 45, w: 20, h: 25 },
            { id: 'aisle1', name: 'Central Aisle 1', type: 'walkway', x: 40, y: 25, w: 8, h: 45 },
            { id: 'aisle2', name: 'Central Aisle 2', type: 'walkway', x: 52, y: 25, w: 8, h: 45 },
            { id: 'checkout', name: 'Checkout Area', type: 'cashier', x: 40, y: 75, w: 20, h: 20 }
        ];
        
        this.currentZoneData = new Map();
        this.historicalData = [];
    }
    
    // Connect to camera monitoring system
    async connect(endpoint) {
        this.apiEndpoint = endpoint;
        
        try {
            // Update UI status
            this.updateConnectionStatus('connecting');
            
            // Attempt to connect to real API
            const response = await fetch(endpoint + '/status', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                this.connected = true;
                this.simulationMode = false;
                this.updateConnectionStatus('online');
                
                // Start real data polling
                this.startDataPolling();
                
                console.log('Connected to monitoring system:', data);
                return { success: true, message: 'Connected to camera system successfully' };
            } else {
                throw new Error('Failed to connect to monitoring system');
            }
        } catch (error) {
            console.warn('Real camera connection failed, falling back to simulation:', error);
            
            // Fall back to simulation mode
            return this.enableSimulation();
        }
    }
    
    // Enable simulation mode for demo purposes
    enableSimulation() {
        this.connected = true;
        this.simulationMode = true;
        this.updateConnectionStatus('online');
        
        // Generate initial zone data
        this.generateSimulatedZoneData();
        
        // Start simulation updates
        this.startSimulationUpdates();
        
        console.log('Simulation mode enabled');
        return { success: true, message: 'Simulation mode enabled - generating demo data' };
    }
    
    // Disconnect from monitoring system
    disconnect() {
        this.connected = false;
        this.simulationMode = false;
        this.clearUpdateInterval();
        this.updateConnectionStatus('offline');
        
        console.log('Disconnected from monitoring system');
    }
    
    // Update connection status in UI
    updateConnectionStatus(status) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (statusDot) {
            statusDot.className = `status-dot ${status}`;
        }
        
        if (statusText) {
            const statusMessages = {
                'online': 'Camera System: Connected',
                'offline': 'Camera System: Offline',
                'connecting': 'Camera System: Connecting...'
            };
            statusText.textContent = statusMessages[status] || status;
        }
        
        // Update integration status
        const integrationStatus = document.getElementById('integration-status');
        const lastUpdate = document.getElementById('last-update');
        
        if (integrationStatus) {
            integrationStatus.textContent = status === 'online' ? 'Connected' : 'Not Connected';
        }
        
        if (lastUpdate && status === 'online') {
            lastUpdate.textContent = new Date().toLocaleTimeString();
        }
    }
    
    // Start polling real API data
    startDataPolling() {
        this.clearUpdateInterval();
        
        this.updateInterval = setInterval(async () => {
            try {
                const response = await fetch(this.apiEndpoint + '/zones', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 5000
                });
                
                if (response.ok) {
                    const zoneData = await response.json();
                    this.processZoneData(zoneData);
                    this.lastUpdate = new Date();
                    
                    // Update last update time in UI
                    const lastUpdateEl = document.getElementById('last-update');
                    if (lastUpdateEl) {
                        lastUpdateEl.textContent = this.lastUpdate.toLocaleTimeString();
                    }
                } else {
                    throw new Error('Failed to fetch zone data');
                }
            } catch (error) {
                console.error('Data polling error:', error);
                // Could implement retry logic or fallback to simulation
            }
        }, 10000); // Poll every 10 seconds
    }
    
    // Start simulation data updates
    startSimulationUpdates() {
        this.clearUpdateInterval();
        
        this.updateInterval = setInterval(() => {
            this.generateSimulatedZoneData();
            this.lastUpdate = new Date();
            
            // Update last update time in UI
            const lastUpdateEl = document.getElementById('last-update');
            if (lastUpdateEl) {
                lastUpdateEl.textContent = this.lastUpdate.toLocaleTimeString();
            }
        }, 5000); // Update every 5 seconds in simulation
    }
    
    // Clear update interval
    clearUpdateInterval() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    // Generate simulated zone data
    generateSimulatedZoneData() {
        const currentHour = new Date().getHours();
        const timestamp = Date.now();
        
        this.zones.forEach(zone => {
            // Simulate realistic traffic patterns based on time and zone type
            let baseTraffic = this.getBaseTrafficForZone(zone, currentHour);
            
            // Add some randomness
            const variance = 0.3;
            const randomFactor = 1 + (Math.random() - 0.5) * variance;
            const currentTraffic = Math.max(0, Math.round(baseTraffic * randomFactor));
            
            // Calculate average dwell time (excluding cashier for hotspot analysis)
            const dwellTime = zone.type === 'cashier' ? 45 : // Shorter at checkout
                            zone.type === 'entrance' ? 8 : // Quick pass-through
                            zone.type === 'walkway' ? 15 : // Moving through aisles
                            this.simulateDwellTime(zone, currentTraffic); // Longer at product areas
            
            const zoneData = {
                zoneId: zone.id,
                zoneName: zone.name,
                currentPeople: currentTraffic,
                avgDwellTime: dwellTime,
                hourlyTotal: Math.round(baseTraffic * 1.5),
                heatLevel: this.calculateHeatLevel(currentTraffic, dwellTime, zone.type),
                timestamp: timestamp,
                coordinates: { x: zone.x, y: zone.y, w: zone.w, h: zone.h }
            };
            
            this.currentZoneData.set(zone.id, zoneData);
        });
        
        // Store historical data
        this.storeHistoricalData();
        
        // Trigger UI update
        if (window.storeInsights) {
            window.storeInsights.updateZoneData(Array.from(this.currentZoneData.values()));
        }
    }
    
    // Get base traffic for zone based on time and zone type
    getBaseTrafficForZone(zone, hour) {
        // Peak hours: 12-14 (lunch), 17-19 (after work)
        let timeMultiplier = 1;
        if (hour >= 12 && hour <= 14) {
            timeMultiplier = 1.8; // Lunch peak
        } else if (hour >= 17 && hour <= 19) {
            timeMultiplier = 2.0; // Evening peak
        } else if (hour >= 7 && hour <= 11) {
            timeMultiplier = 1.3; // Morning rush
        } else if (hour >= 20 && hour <= 22) {
            timeMultiplier = 0.8; // Evening wind-down
        } else if (hour >= 23 || hour <= 6) {
            timeMultiplier = 0.1; // Night/early morning
        }
        
        // Zone-specific base traffic
        const zoneTrafficMap = {
            'entrance': 8,
            'produce': 6,
            'dairy': 5,
            'beverages': 7,
            'snacks': 4,
            'household': 3,
            'aisle1': 12,
            'aisle2': 10,
            'checkout': 15
        };
        
        return Math.round((zoneTrafficMap[zone.id] || 5) * timeMultiplier);
    }
    
    // Simulate dwell time based on zone and current traffic
    simulateDwellTime(zone, currentTraffic) {
        const baseTime = {
            'entrance': 5,
            'product': 120, // 2 minutes average for shopping
            'walkway': 10,
            'cashier': 45
        };
        
        const base = baseTime[zone.type] || 60;
        
        // Higher traffic might mean longer dwell times (congestion)
        const trafficFactor = 1 + (currentTraffic * 0.1);
        
        // Add randomness
        const randomFactor = 0.8 + Math.random() * 0.4; // ±20%
        
        return Math.round(base * trafficFactor * randomFactor);
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
        
        if (totalScore >= 20) return 'very-high';
        if (totalScore >= 15) return 'high';
        if (totalScore >= 10) return 'medium';
        if (totalScore >= 5) return 'low';
        return 'very-low';
    }
    
    // Process real API zone data
    processZoneData(zoneData) {
        zoneData.forEach(data => {
            // Ensure data matches our zone structure
            const processedData = {
                zoneId: data.zoneId || data.id,
                zoneName: data.zoneName || data.name,
                currentPeople: data.currentPeople || 0,
                avgDwellTime: data.avgDwellTime || 0,
                hourlyTotal: data.hourlyTotal || 0,
                heatLevel: this.calculateHeatLevel(
                    data.currentPeople || 0, 
                    data.avgDwellTime || 0, 
                    this.getZoneType(data.zoneId)
                ),
                timestamp: data.timestamp || Date.now(),
                coordinates: data.coordinates || this.getZoneCoordinates(data.zoneId)
            };
            
            this.currentZoneData.set(processedData.zoneId, processedData);
        });
        
        // Store historical data
        this.storeHistoricalData();
        
        // Trigger UI update
        if (window.storeInsights) {
            window.storeInsights.updateZoneData(Array.from(this.currentZoneData.values()));
        }
    }
    
    // Store data for historical analysis
    storeHistoricalData() {
        const snapshot = {
            timestamp: Date.now(),
            zones: Array.from(this.currentZoneData.values())
        };
        
        this.historicalData.push(snapshot);
        
        // Keep only last 100 snapshots to prevent memory issues
        if (this.historicalData.length > 100) {
            this.historicalData.shift();
        }
    }
    
    // Get zone type by ID
    getZoneType(zoneId) {
        const zone = this.zones.find(z => z.id === zoneId);
        return zone ? zone.type : 'product';
    }
    
    // Get zone coordinates by ID
    getZoneCoordinates(zoneId) {
        const zone = this.zones.find(z => z.id === zoneId);
        return zone ? { x: zone.x, y: zone.y, w: zone.w, h: zone.h } : { x: 0, y: 0, w: 10, h: 10 };
    }
    
    // Get current zone data
    getCurrentZoneData() {
        return Array.from(this.currentZoneData.values());
    }
    
    // Get historical data for analysis
    getHistoricalData(hours = 24) {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        return this.historicalData.filter(snapshot => snapshot.timestamp >= cutoffTime);
    }
    
    // Get hotspot analysis (excluding cashier)
    getHotspotAnalysis() {
        const currentData = this.getCurrentZoneData()
            .filter(zone => this.getZoneType(zone.zoneId) !== 'cashier');
        
        // Sort by heat level and dwell time
        const hotspots = currentData
            .map(zone => ({
                ...zone,
                heatScore: this.calculateHeatScore(zone.currentPeople, zone.avgDwellTime)
            }))
            .sort((a, b) => b.heatScore - a.heatScore);
        
        return {
            hotspots: hotspots,
            summary: {
                totalZones: currentData.length,
                activeHotspots: hotspots.filter(h => h.heatLevel === 'high' || h.heatLevel === 'very-high').length,
                avgDwellTime: this.calculateAverageDwellTime(currentData),
                peakTrafficHour: this.calculatePeakTrafficHour()
            }
        };
    }
    
    // Calculate heat score for sorting
    calculateHeatScore(people, dwellTime) {
        return (people * 2) + (dwellTime / 10);
    }
    
    // Calculate average dwell time across all zones
    calculateAverageDwellTime(zoneData) {
        if (zoneData.length === 0) return 0;
        const totalTime = zoneData.reduce((sum, zone) => sum + zone.avgDwellTime, 0);
        return Math.round(totalTime / zoneData.length);
    }
    
    // Calculate peak traffic hour from historical data
    calculatePeakTrafficHour() {
        const currentHour = new Date().getHours();
        // Simplified - could be enhanced with real historical analysis
        if (currentHour >= 12 && currentHour <= 14) return '12-2 PM';
        if (currentHour >= 17 && currentHour <= 19) return '5-7 PM';
        return `${currentHour % 12 || 12}-${(currentHour + 1) % 12 || 12} ${currentHour >= 12 ? 'PM' : 'AM'}`;
    }
    
    // Test API connection
    async testConnection(endpoint) {
        try {
            const response = await fetch(endpoint + '/ping', {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                return { success: true, message: 'Connection successful' };
            } else {
                throw new Error('Connection failed');
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    
    // Export zone data for analysis
    exportZoneData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            currentData: Array.from(this.currentZoneData.values()),
            historicalData: this.historicalData,
            config: {
                zones: this.zones,
                connected: this.connected,
                simulationMode: this.simulationMode
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `zone_monitoring_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('Zone monitoring data exported');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonitoringAPI;
} else {
    window.MonitoringAPI = MonitoringAPI;
}
