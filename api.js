/**
 * T4-Frontend API Layer
 * Handles all backend communication
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://3.27.160.150:3000',  // Backend EC2 IP
    API_VERSION: 'v1',
    API_BASE_PATH: '/api/v1',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    ENDPOINTS: {
        HEALTH_CHECK: '/health',
        ANALYZE: '/api/v1/health/analyze'
    }
};

/**
 * API Client Class
 */
class ApiClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.isOnline = false;
        this.retryCount = 0;
        
        // Check backend status on init
        this.checkBackendStatus();
    }

    /**
     * Check if backend is online
     */
    async checkBackendStatus() {
        try {
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.HEALTH_CHECK}`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                this.isOnline = true;
                this.updateConnectionStatus(true);
                console.log('✅ Backend connected successfully');
                return true;
            }
        } catch (error) {
            this.isOnline = false;
            this.updateConnectionStatus(false);
            console.error('❌ Backend connection failed:', error);
            return false;
        }
    }

    /**
     * Update connection status indicator
     */
    updateConnectionStatus(isOnline) {
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            statusElement.textContent = isOnline ? 'Backend Online' : 'Backend Offline';
            statusElement.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
        }
    }

    /**
     * Send health data to backend for analysis
     */
    async analyzeHealth(healthData) {
        try {
            console.log('📤 Sending health data to backend:', healthData);
            
            const response = await fetch(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(healthData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('📥 Backend response:', result);
            
            return {
                success: true,
                data: result.data
            };

        } catch (error) {
            console.error('❌ API Error:', error);
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get backend info
     */
    async getBackendInfo() {
        try {
            const response = await fetch(`${this.baseUrl}/`, {
                method: 'GET'
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error getting backend info:', error);
            return null;
        }
    }
}

// Create global API client instance
const apiClient = new ApiClient();
