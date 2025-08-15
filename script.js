// Quantum ML Dashboard JavaScript

// Global variables
let priceChart = null;
let currentData = null;

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Quantum ML Dashboard Initialized');
    
    // Load initial data
    loadDashboardData();
    
    // Set up navigation
    setupNavigation();
    
    // Initialize chart
    initializeChart();
    
    // Add smooth scrolling
    addSmoothScrolling();
});

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add smooth scrolling
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Simulate loading data (in real app, this would call your Python backend)
        const mockData = {
            currentPrice: 9138.90,
            priceChange: 45.20,
            priceChangePercent: 0.50,
            dataPoints: 1261,
            featureCount: 60,
            models: {
                randomForest: { accuracy: 0.5597, precision: 0.5573, recall: 0.5597 },
                hybrid: { accuracy: 0.5309, precision: 0.5160, recall: 0.5309 },
                svm: { accuracy: 0.5350, precision: 0.2862, recall: 0.5350 }
            }
        };
        
        updateDashboard(mockData);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Update dashboard with data
function updateDashboard(data) {
    // Update price information
    document.getElementById('currentPrice').textContent = data.currentPrice.toLocaleString();
    document.getElementById('dataPoints').textContent = data.dataPoints.toLocaleString();
    document.getElementById('featureCount').textContent = data.featureCount;
    
    // Update price change
    const priceChangeElement = document.getElementById('priceChange');
    const changeAmount = priceChangeElement.querySelector('.change-amount');
    const changePercent = priceChangeElement.querySelector('.change-percent');
    
    changeAmount.textContent = (data.priceChange > 0 ? '+' : '') + data.priceChange.toFixed(2);
    changePercent.textContent = (data.priceChange > 0 ? '+' : '') + data.priceChangePercent.toFixed(2) + '%';
    
    // Update model metrics
    updateModelMetrics('rf', data.models.randomForest);
    updateModelMetrics('hybrid', data.models.hybrid);
    updateModelMetrics('svm', data.models.svm);
    
    // Update chart
    updateChart(data);
}

// Update model metrics
function updateModelMetrics(prefix, metrics) {
    document.getElementById(`${prefix}-accuracy`).textContent = (metrics.accuracy * 100).toFixed(1) + '%';
    document.getElementById(`${prefix}-precision`).textContent = (metrics.precision * 100).toFixed(1) + '%';
    document.getElementById(`${prefix}-recall`).textContent = (metrics.recall * 100).toFixed(1) + '%';
}

// Initialize price chart
function initializeChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    
    // Generate mock price data for the last 30 days
    const labels = [];
    const prices = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate realistic price movement
        const basePrice = 9100;
        const randomChange = (Math.random() - 0.5) * 200;
        prices.push(basePrice + randomChange);
    }
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'FTSE 100 Price',
                data: prices,
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#00d4ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return '£' + value.toLocaleString();
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Update chart with new data
function updateChart(data) {
    if (priceChart) {
        // Update with new price data
        const newPrice = data.currentPrice;
        priceChart.data.datasets[0].data.push(newPrice);
        priceChart.data.labels.push('Today');
        
        // Remove oldest data point if more than 30 days
        if (priceChart.data.datasets[0].data.length > 30) {
            priceChart.data.datasets[0].data.shift();
            priceChart.data.labels.shift();
        }
        
        priceChart.update('none');
    }
}

// Add more functions to update model metrics, price, chart, etc.

// Simulate prediction (replace with actual API call)
async function simulatePrediction() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate prediction result
            const prediction = {
                direction: Math.random() > 0.5 ? 'UP' : 'DOWN',
                confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
                probabilities: {
                    up: Math.random() * 100,
                    down: Math.random() * 100
                },
                model: 'random_forest',
                timestamp: new Date().toLocaleString()
            };
            
            // Normalize probabilities
            const total = prediction.probabilities.up + prediction.probabilities.down;
            prediction.probabilities.up = (prediction.probabilities.up / total * 100).toFixed(1);
            prediction.probabilities.down = (prediction.probabilities.down / total * 100).toFixed(1);
            
            displayPrediction(prediction);
            resolve(prediction);
        }, 3000); // Simulate 3-second processing time
    });
}

// No external data fetching. All data is local or simulated.

function runPrediction() {
    showLoading(true);
    simulatePrediction().then(prediction => {
        displayPrediction(prediction);
        showLoading(false);
    }).catch(() => {
        showError('Prediction failed. Please try again.');
        showLoading(false);
    });
}
function runPredictionAndScroll() {
    runPrediction();
    // Animate quantum icons upwards
    const quantumAnim = document.querySelector('.quantum-animation');
    if (quantumAnim) {
        quantumAnim.classList.add('move-up');
    }
    // Smooth scroll to the live prediction section
    const section = document.getElementById('live-prediction');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Simulate prediction (no API call)
async function simulatePrediction() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const prediction = {
                direction: Math.random() > 0.5 ? 'UP' : 'DOWN',
                confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
                probabilities: {
                    up: Math.random() * 100,
                    down: Math.random() * 100
                },
                model: 'random_forest',
                timestamp: new Date().toLocaleString()
            };
            resolve(prediction);
        }, 2000);
    });
}

// Display prediction result in a beginner-friendly way
function displayPrediction(prediction) {
    const resultContainer = document.getElementById('predictionResult');
    const lastUpdateElement = document.getElementById('lastUpdate');
    const directionIcon = prediction.direction === 'UP'
        ? '<i class="fas fa-arrow-up"></i>'
        : '<i class="fas fa-arrow-down"></i>';
    const predictionClass = prediction.direction === 'UP' ? 'prediction-up' : 'prediction-down';
    resultContainer.innerHTML = `
        <div class="${predictionClass}">
            <div class="prediction-direction">
                ${directionIcon} <strong>The market is likely to go ${prediction.direction} tomorrow.</strong>
            </div>
            <div class="prediction-confidence">
                Confidence: ${prediction.confidence}%
            </div>
            <div style="margin-top: 1rem; font-size: 0.95rem; opacity: 0.85;">
                <em>This is an AI-based prediction for educational purposes only.</em>
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.7;">
                Model: ${prediction.model.replace('_', ' ').toUpperCase()}
            </div>
        </div>
    `;
    lastUpdateElement.textContent = prediction.timestamp;
}

// Show loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

// Show error message
function showError(message) {
    const resultContainer = document.getElementById('predictionResult');
    resultContainer.innerHTML = `
        <div style="text-align: center; color: #ff6b6b; padding: 2rem;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <p>${message}</p>
        </div>
    `;
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to model cards
    const modelCards = document.querySelectorAll('.model-card');
    modelCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to CTA button
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to run prediction
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runPrediction();
    }
    
    // Escape to close loading overlay
    if (e.key === 'Escape') {
        showLoading(false);
    }
});

// Add touch support for mobile
if ('ontouchstart' in window) {
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Performance optimization: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize chart updates
const debouncedChartUpdate = debounce(updateChart, 250);

// Add real-time updates (simulated)
setInterval(() => {
    // Simulate real-time price updates
    const currentPriceElement = document.getElementById('currentPrice');
    if (currentPriceElement) {
        const currentPrice = parseFloat(currentPriceElement.textContent.replace(',', ''));
        const change = (Math.random() - 0.5) * 10;
        const newPrice = currentPrice + change;
        currentPriceElement.textContent = newPrice.toLocaleString();
        
        // Update chart with new price
        debouncedChartUpdate({ currentPrice: newPrice });
    }
}, 30000); // Update every 30 seconds

console.log('🎯 Quantum ML Dashboard JavaScript Loaded Successfully!');
