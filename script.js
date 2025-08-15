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

// BMI Categories - HANYA UNTUK REFERENCE (TIDAK DIGUNAKAN UNTUK CALCULATION)
const bmiCategories = {
    underweight: {
        min: 0,
        max: 18.5,
        text: 'Berat Badan Kurang',
        color: '#3498db'
    },
    normal: {
        min: 18.5,
        max: 25,
        text: 'Normal',
        color: '#27ae60'
    },
    overweight: {
        min: 25,
        max: 30,
        text: 'Berat Badan Berlebih',
        color: '#f39c12'
    },
    obese: {
        min: 30,
        max: 999,
        text: 'Obesitas',
        color: '#e74c3c'
    }
};

// SEMUA CALCULATION BMI DILAKUKAN DI BACKEND
// Frontend hanya bertugas:
// 1. Validasi input basic
// 2. Kirim data ke backend 
// 3. Tampilkan hasil dari backend

// Format gender display
function formatGender(gender) {
    return gender === 'male' ? 'Laki-laki' : 'Perempuan';
}

// Display backend analysis results
function displayBackendResults(backendData) {
    const { userInfo, analysis, idealWeight, recommendations } = backendData;
    
    // Update user info
    userName.textContent = userInfo.name;
    userAge.textContent = `${userInfo.age} tahun`;
    userGender.textContent = formatGender(userInfo.gender);
    
    // Update BMI display
    bmiValue.textContent = analysis.bmi.toFixed(1);
    bmiCategory.innerHTML = `<span class="category-text">${analysis.category}</span>`;
    
    // Update BMI result colors
    const bmiResult = document.querySelector('.bmi-result');
    bmiResult.style.background = `linear-gradient(135deg, ${analysis.color}, ${analysis.color}dd)`;
    
    // Update metrics
    heightDisplay.textContent = `${userInfo.height} cm`;
    weightDisplay.textContent = `${userInfo.weight} kg`;
    
    // Update advice with backend recommendations
    const adviceHTML = `
        <p><strong>Saran Umum:</strong> ${recommendations.general}</p>
        ${recommendations.specific && recommendations.specific.length > 0 ? 
            `<div style="margin-top: 10px;">
                <strong>Saran Khusus:</strong>
                <ul style="margin: 5px 0 0 20px; color: #cccccc;">
                    ${recommendations.specific.map(advice => `<li>${advice}</li>`).join('')}
                </ul>
            </div>` : ''
        }
        ${idealWeight ? 
            `<div style="margin-top: 10px; padding: 10px; background: #0a0a0a; border-radius: 8px; border: 1px solid #333;">
                <strong style="color: #ff0000;">Berat Badan Ideal:</strong><br>
                <span style="color: #27ae60;">${idealWeight.min} - ${idealWeight.max} kg</span>
            </div>` : ''
        }
    `;
    
    adviceText.innerHTML = adviceHTML;
    
    // Show result container with animation
    resultContainer.classList.add('active');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Show success message
function showSuccessMessage(message) {
    const successContainer = document.createElement('div');
    successContainer.className = 'success-message';
    successContainer.style.cssText = `
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    successContainer.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
        </svg>
        <span>${message}</span>
    `;
    
    // Remove existing messages
    const existingSuccess = document.querySelector('.success-message');
    const existingErrors = document.querySelector('.error-messages');
    if (existingSuccess) existingSuccess.remove();
    if (existingErrors) existingErrors.remove();
    
    // Insert success message
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(successContainer, healthForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successContainer.parentNode) {
            successContainer.remove();
        }
    }, 5000);
}

// FUNGSI displayResults DIHAPUS - TIDAK DIGUNAKAN LAGI
// SEMUA PROCESSING BMI DILAKUKAN DI BACKEND

// Form validation
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name.trim()) {
        errors.push('Nama lengkap harus diisi');
    }
    
    if (formData.age < 1 || formData.age > 120) {
        errors.push('Usia harus antara 1-120 tahun');
    }
    
    if (!formData.gender) {
        errors.push('Jenis kelamin harus dipilih');
    }
    
    if (formData.height < 50 || formData.height > 250) {
        errors.push('Tinggi badan harus antara 50-250 cm');
    }
    
    if (formData.weight < 10 || formData.weight > 300) {
        errors.push('Berat badan harus antara 10-300 kg');
    }
    
    return errors;
}

// Show error messages
function showErrors(errors) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-messages';
    errorContainer.style.cssText = `
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-size: 0.9rem;
        box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    `;
    
    errorContainer.innerHTML = `
        <strong>Terjadi kesalahan:</strong>
        <ul style="margin: 8px 0 0 20px;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    // Remove existing error messages
    const existingErrors = document.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    // Insert error messages
    const formContainer = document.querySelector('.form-container');
    formContainer.insertBefore(errorContainer, healthForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorContainer.parentNode) {
            errorContainer.remove();
        }
    }, 5000);
}

// Backend API configuration - SESUAI DENGAN BACKEND .ENV
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    API_VERSION: 'v1',
    API_BASE_PATH: '/api/v1',
    ENDPOINTS: {
        HEALTH_CHECK: '/health',
        ANALYZE: '/api/v1/health/analyze',
        RECORDS: '/api/v1/health/records',
        CATEGORIES: '/api/v1/health/categories',
        STATS: '/api/v1/health/stats'
    },
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3
};

// API Base URL untuk compatibility
const API_BASE_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_BASE_PATH}`;

// Send data to backend API - MENGGUNAKAN KONFIGURASI YANG SAMA DENGAN BACKEND
async function sendToBackend(formData) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        console.log(`📤 Sending to: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`);
        console.log('📦 Data:', formData);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYZE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'T4-Frontend/1.0.0'
            },
            mode: 'cors',
            body: JSON.stringify(formData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
        
        const result = await response.json();
        console.log('📋 Response data:', result);
        
        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('✅ Backend analysis successful:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Backend API Error:', error);
        
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout (${API_CONFIG.TIMEOUT/1000}s) - silakan coba lagi`);
        } else if (error.message.includes('Failed to fetch')) {
            throw new Error(`Tidak dapat terhubung ke server ${API_CONFIG.BASE_URL} - periksa koneksi`);
        } else if (error.message.includes('CORS')) {
            throw new Error('CORS error - konfigurasi server perlu diperbaiki');
        } else if (error.message.includes('NetworkError')) {
            throw new Error('Network error - periksa koneksi internet');
        }
        
        throw error;
    }
}

// Handle form submission - BACKEND PROCESSING ONLY
healthForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        gender: document.getElementById('gender').value,
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value)
    };
    
    // Validate form (basic validation only)
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    
    // Remove any existing error messages
    const existingErrors = document.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    // Add loading animation
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span>Mengirim ke Server...</span>';
    
    try {
        // HANYA KIRIM KE BACKEND - TIDAK ADA FALLBACK LOCAL
        console.log('📤 Sending data to backend:', formData);
        const backendResponse = await sendToBackend(formData);
        
        if (backendResponse.success) {
            console.log('✅ Backend response received:', backendResponse);
            // Use backend analysis result
            displayBackendResults(backendResponse.data);
            
            // Show success message
            showSuccessMessage('✅ Data berhasil dianalisis di server dan disimpan ke database!');
        } else {
            throw new Error(backendResponse.message || 'Analisis gagal di server');
        }
        
    } catch (error) {
        console.error('❌ Backend Error:', error);
        
        // TIDAK ADA FALLBACK - HARUS MENGGUNAKAN BACKEND
        showErrors([
            `❌ Koneksi ke server gagal: ${error.message}`,
            `🔧 Pastikan backend berjalan di http://localhost:3000`,
            `🌐 Periksa koneksi internet dan CORS settings`
        ]);
        
        // Reset result container
        resultContainer.classList.remove('active');
        
    } finally {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = `
            <span>Analisis Kesehatan</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        `;
    }
});

// Handle reset button
resetBtn.addEventListener('click', function() {
    // Reset form
    healthForm.reset();
    
    // Hide result container
    resultContainer.classList.remove('active');
    
    // Remove error messages
    const existingErrors = document.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    // Reset BMI result colors to default
    const bmiResult = document.querySelector('.bmi-result');
    bmiResult.style.background = 'linear-gradient(135deg, #ff0000, #cc0000)';
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
});

// Add input animations and real-time validation
document.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentNode.style.transform = 'translateY(-2px)';
        this.parentNode.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentNode.style.transform = 'translateY(0)';
    });
    
    // Real-time validation feedback
    input.addEventListener('input', function() {
        if (this.value && this.checkValidity()) {
            this.style.borderColor = '#27ae60';
        } else if (this.value) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#333333';
        }
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        healthForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape to reset
    if (e.key === 'Escape') {
        resetBtn.click();
    }
});

// Add connection status indicator
function addConnectionStatus() {
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'connectionStatus';
    statusIndicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 500;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(statusIndicator);
    return statusIndicator;
}

// Update connection status - MENGGUNAKAN ENDPOINT YANG SAMA DENGAN BACKEND
async function updateConnectionStatus() {
    const statusIndicator = document.getElementById('connectionStatus') || addConnectionStatus();
    
    try {
        // Try to connect to backend health endpoint
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        console.log(`🔍 Testing connection to: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH_CHECK}`);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH_CHECK}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'T4-Frontend/1.0.0'
            },
            mode: 'cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            statusIndicator.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            statusIndicator.style.color = 'white';
            statusIndicator.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                </svg>
                Backend Connected (v${data.version || '1.0.0'})
            `;
            console.log('✅ Backend connection successful:', data);
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
        statusIndicator.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
        statusIndicator.style.color = 'white';
        
        let errorMessage = 'Backend Offline';
        if (error.name === 'AbortError') {
            errorMessage = 'Connection Timeout';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS Error';
        } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Connection Failed';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'Network Error';
        }
        
        statusIndicator.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            ${errorMessage}
        `;
        
        statusIndicator.title = `Error: ${error.message}`;
    }
}

// Load recent records from backend - MENGGUNAKAN ENDPOINT YANG BENAR
async function loadRecentRecords() {
    try {
        console.log(`📊 Loading recent records from: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECORDS}?limit=5`);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECORDS}?limit=5`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'T4-Frontend/1.0.0'
            },
            mode: 'cors'
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('📊 Recent records response:', result);
            
            if (result.success && result.data.length > 0) {
                displayRecentRecords(result.data);
            } else {
                console.log('📊 No recent records found');
            }
        } else {
            console.log('📊 Could not load recent records: HTTP', response.status);
        }
    } catch (error) {
        console.log('📊 Could not load recent records:', error.message);
    }
}

// Display recent records
function displayRecentRecords(records) {
    const recentRecordsHtml = `
        <div class="recent-records" style="margin-top: 20px; padding: 20px; background: #0a0a0a; border-radius: 12px; border: 1px solid #333;">
            <h4 style="color: #ff0000; margin-bottom: 15px; font-size: 1.1rem;">📊 Data Terbaru</h4>
            <div style="max-height: 200px; overflow-y: auto;">
                ${records.map(record => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; margin-bottom: 10px; background: #1a1a1a; border-radius: 8px; border: 1px solid #333;">
                        <div>
                            <strong style="color: #ffffff;">${record.name}</strong><br>
                            <small style="color: #cccccc;">${record.age} tahun • ${formatGender(record.gender)}</small>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: #ff0000; font-weight: 600;">BMI: ${record.bmi}</div>
                            <small style="color: #888888;">${record.bmi_category}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add to result container if not exists
    const existingRecords = document.querySelector('.recent-records');
    if (!existingRecords) {
        resultContainer.insertAdjacentHTML('beforeend', recentRecordsHtml);
    }
}

// Add smooth scrolling for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Add welcome animation
    const header = document.querySelector('.header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        header.style.transition = 'all 0.8s ease';
        header.style.opacity = '1';
        header.style.transform = 'translateY(0)';
    }, 100);
    
    // Stagger form container animation
    const formContainer = document.querySelector('.form-container');
    formContainer.style.opacity = '0';
    formContainer.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        formContainer.style.transition = 'all 0.8s ease';
        formContainer.style.opacity = '1';
        formContainer.style.transform = 'translateX(0)';
    }, 300);
    
    // Initialize backend connection
    updateConnectionStatus();
    loadRecentRecords();
    
    // Check connection every 30 seconds
    setInterval(updateConnectionStatus, 30000);
});

// Add tooltip functionality for BMI categories
function createBMITooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'bmi-tooltip';
    tooltip.style.cssText = `
        position: absolute;
        background: #1a1a1a;
        border: 1px solid #ff0000;
        border-radius: 8px;
        padding: 15px;
        color: white;
        font-size: 0.85rem;
        z-index: 1000;
        display: none;
        max-width: 300px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    
    tooltip.innerHTML = `
        <strong>Kategori BMI:</strong><br>
        <span style="color: #3498db;">Kurang: &lt; 18.5</span><br>
        <span style="color: #27ae60;">Normal: 18.5 - 24.9</span><br>
        <span style="color: #f39c12;">Berlebih: 25.0 - 29.9</span><br>
        <span style="color: #e74c3c;">Obesitas: ≥ 30.0</span>
    `;
    
    document.body.appendChild(tooltip);
    return tooltip;
}

// Initialize tooltip
const bmiTooltip = createBMITooltip();

// Add hover effect for BMI result
document.querySelector('.bmi-result').addEventListener('mouseenter', function(e) {
    bmiTooltip.style.display = 'block';
    bmiTooltip.style.left = e.pageX + 10 + 'px';
    bmiTooltip.style.top = e.pageY - 50 + 'px';
});

document.querySelector('.bmi-result').addEventListener('mouseleave', function() {
    bmiTooltip.style.display = 'none';
});

// Console welcome message
console.log(`
🔗 Backend Integration: ${API_CONFIG.BASE_URL}${API_CONFIG.API_BASE_PATH}
� Backend Environment: ${API_CONFIG.BASE_URL}
📡 API Version: ${API_CONFIG.API_VERSION}
⚡ Timeout: ${API_CONFIG.TIMEOUT/1000}s | Retry: ${API_CONFIG.RETRY_ATTEMPTS}x
`);
