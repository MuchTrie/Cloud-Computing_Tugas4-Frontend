/**
 * T4-Frontend UI Layer
 * Handles all DOM manipulation and user interactions
 */

// DOM Elements
const healthForm = document.getElementById('healthForm');
const resultContainer = document.getElementById('resultContainer');
const resetBtn = document.getElementById('resetBtn');

// Result display elements
const userName = document.getElementById('userName');
const userAge = document.getElementById('userAge');
const userGender = document.getElementById('userGender');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const heightDisplay = document.getElementById('heightDisplay');
const weightDisplay = document.getElementById('weightDisplay');
const adviceText = document.getElementById('adviceText');

/**
 * App Class - Main UI Controller
 */
class HealthApp {
    constructor() {
        this.isLoading = false;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.showConnectionStatus();
        console.log('🚀 T4-Frontend initialized');
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Form submission
        if (healthForm) {
            healthForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Reset button
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }

        // Real-time input validation
        const inputs = healthForm?.querySelectorAll('input, select');
        inputs?.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    /**
     * Handle form submission
     */
    async handleFormSubmission(e) {
        e.preventDefault();
        
        if (this.isLoading) return;

        // Get form data
        const formData = new FormData(healthForm);
        const healthData = {
            name: formData.get('name')?.trim(),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            height: parseFloat(formData.get('height')),
            weight: parseFloat(formData.get('weight'))
        };

        // Validate data
        if (!this.validateHealthData(healthData)) {
            return;
        }

        try {
            this.setLoading(true);
            
            // Send to backend via API
            const result = await apiClient.analyzeHealth(healthData);
            
            if (result.success) {
                this.displayResults(result.data);
                this.showSuccessMessage('Analisis kesehatan berhasil!');
            } else {
                this.showErrorMessage(`Error: ${result.error}`);
            }

        } catch (error) {
            console.error('❌ Form submission error:', error);
            this.showErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            this.setLoading(false);
        }
    }

    /**
     * Validate health data
     */
    validateHealthData(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Nama harus diisi minimal 2 karakter');
        }

        if (!data.age || data.age < 1 || data.age > 120) {
            errors.push('Usia harus antara 1-120 tahun');
        }

        if (!data.gender) {
            errors.push('Jenis kelamin harus dipilih');
        }

        if (!data.height || data.height < 50 || data.height > 250) {
            errors.push('Tinggi badan harus antara 50-250 cm');
        }

        if (!data.weight || data.weight < 10 || data.weight > 300) {
            errors.push('Berat badan harus antara 10-300 kg');
        }

        if (errors.length > 0) {
            this.showErrorMessage(errors.join('\n'));
            return false;
        }

        return true;
    }

    /**
     * Display analysis results
     */
    displayResults(data) {
        if (!data || !data.userInfo || !data.analysis) {
            this.showErrorMessage('Data hasil tidak valid');
            return;
        }

        const { userInfo, analysis } = data;

        // Update result display
        if (userName) userName.textContent = userInfo.name;
        if (userAge) userAge.textContent = `${userInfo.age} tahun`;
        if (userGender) userGender.textContent = userInfo.gender;
        if (heightDisplay) heightDisplay.textContent = `${userInfo.height} cm`;
        if (weightDisplay) weightDisplay.textContent = `${userInfo.weight} kg`;
        if (bmiValue) bmiValue.textContent = analysis.bmi;
        if (bmiCategory) {
            bmiCategory.textContent = analysis.category;
            bmiCategory.style.color = analysis.color || '#333';
        }
        if (adviceText) adviceText.textContent = analysis.advice;

        // Show result container
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Set loading state
     */
    setLoading(loading) {
        this.isLoading = loading;
        const submitBtn = healthForm?.querySelector('button[type="submit"]');
        
        if (submitBtn) {
            submitBtn.disabled = loading;
            submitBtn.textContent = loading ? 'Menganalisis...' : 'Analisis Kesehatan';
        }

        // Add loading class to form
        if (healthForm) {
            healthForm.classList.toggle('loading', loading);
        }
    }

    /**
     * Reset form and results
     */
    resetForm() {
        if (healthForm) {
            healthForm.reset();
        }
        
        if (resultContainer) {
            resultContainer.style.display = 'none';
        }

        this.clearMessages();
        console.log('🔄 Form reset');
    }

    /**
     * Validate individual input
     */
    validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        // Remove previous error styling
        input.classList.remove('error');

        // Basic validation based on input type
        switch (input.name) {
            case 'age':
                isValid = value && parseInt(value) >= 1 && parseInt(value) <= 120;
                break;
            case 'height':
                isValid = value && parseFloat(value) >= 50 && parseFloat(value) <= 250;
                break;
            case 'weight':
                isValid = value && parseFloat(value) >= 10 && parseFloat(value) <= 300;
                break;
            case 'name':
                isValid = value.length >= 2;
                break;
        }

        // Add error styling if invalid
        if (!isValid && value) {
            input.classList.add('error');
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    /**
     * Show message with type
     */
    showMessage(message, type = 'info') {
        // Remove existing messages
        this.clearMessages();

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;

        // Insert message before form
        if (healthForm && healthForm.parentNode) {
            healthForm.parentNode.insertBefore(messageEl, healthForm);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

    /**
     * Clear all messages
     */
    clearMessages() {
        const messages = document.querySelectorAll('.message');
        messages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }

    /**
     * Show connection status
     */
    showConnectionStatus() {
        // Create connection status if not exists
        if (!document.getElementById('connectionStatus')) {
            const statusEl = document.createElement('div');
            statusEl.id = 'connectionStatus';
            statusEl.className = 'connection-status offline';
            statusEl.textContent = 'Checking backend...';
            
            // Insert at top of page
            const container = document.querySelector('.container');
            if (container) {
                container.insertBefore(statusEl, container.firstChild);
            }
        }
    }
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize health app
    const app = new HealthApp();
    
    // Make app globally accessible for debugging
    window.healthApp = app;
    window.apiClient = apiClient;
});

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Check backend status when page becomes visible
        apiClient.checkBackendStatus();
    }
});
