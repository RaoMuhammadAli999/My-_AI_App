/**
 * SubSage - Smart Subscription Manager
 * Frontend JavaScript for handling UI interactions, API calls, and visualizations
 */

// ==================== STATE MANAGEMENT ====================
let subscriptions = [];
let chart = null;
let chartType = 'bar'; // 'bar' or 'pie'
let uiMode = 'friendly'; // 'friendly' or 'robotic'
let theme = 'light'; // 'light' or 'dark'

// ==================== UI TEXT CONTENT ====================
const uiText = {
    friendly: {
        tagline: "Your intelligent subscription assistant 😊",
        subscriptionsTitle: "Your Subscriptions",
        statsTitle: "Spending Overview",
        avgLabel: "Average",
        yearlyLabel: "Yearly Total",
        chartTitle: "Category Breakdown",
        insightsTitle: "AI Insights",
        couponsTitle: "Available Deals",
        addBtnText: "Add Subscription",
        refreshText: "Refresh Insights",
        emptyMessage: "No subscriptions yet. Add your first one above! 🚀",
        loadingText: "Analyzing your spending patterns...",
        footerText: "Built with SubSage - Track smarter, save more ❤️",
        chartToggleText: chartType === 'bar' ? "Switch to Pie Chart 🥧" : "Switch to Bar Chart 📊"
    },
    robotic: {
        tagline: "SUBSCRIPTION MANAGEMENT SYSTEM v1.0",
        subscriptionsTitle: "SUBSCRIPTION DATABASE",
        statsTitle: "FINANCIAL METRICS",
        avgLabel: "AVG COST",
        yearlyLabel: "ANNUAL TOTAL",
        chartTitle: "CATEGORY ANALYSIS",
        insightsTitle: "SYSTEM INSIGHTS",
        couponsTitle: "PROMOTIONAL OFFERS",
        addBtnText: "ADD ENTRY",
        refreshText: "REFRESH DATA",
        emptyMessage: "DATABASE EMPTY. INITIALIZE FIRST ENTRY.",
        loadingText: "PROCESSING DATA...",
        footerText: "SUBSAGE SYSTEM © 2025 - OPERATIONAL",
        chartToggleText: chartType === 'bar' ? "SWITCH TO PIE CHART" : "SWITCH TO BAR CHART"
    }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved preferences from localStorage
    loadPreferences();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadSubscriptions();
    loadCoupons();
    loadAIInsights();
    
    // Initialize chart
    initializeChart();
}

// ==================== PREFERENCES MANAGEMENT ====================
function loadPreferences() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    theme = savedTheme;
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
    
    // Load UI mode
    const savedMode = localStorage.getItem('uiMode') || 'friendly';
    uiMode = savedMode;
    updateUIText();
    updateModeIcon();
}

function savePreferences() {
    localStorage.setItem('theme', theme);
    localStorage.setItem('uiMode', uiMode);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Mode toggle
    document.getElementById('modeToggle').addEventListener('click', toggleMode);
    
    // Add subscription form
    document.getElementById('addSubForm').addEventListener('submit', handleAddSubscription);
    
    // Refresh insights
    document.getElementById('refreshInsights').addEventListener('click', loadAIInsights);
    
    // Chart type toggle
    document.getElementById('chartTypeToggle').addEventListener('click', toggleChartType);
}

// ==================== THEME TOGGLE ====================
function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
    savePreferences();
    
    // Update chart colors for new theme
    if (chart) {
        updateChart();
    }
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle .toggle-icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ==================== MODE TOGGLE ====================
function toggleMode() {
    uiMode = uiMode === 'friendly' ? 'robotic' : 'friendly';
    updateUIText();
    updateModeIcon();
    savePreferences();
}

function updateModeIcon() {
    const icon = document.getElementById('modeIcon');
    icon.textContent = uiMode === 'friendly' ? '😊' : '🤖';
}

function updateUIText() {
    const texts = uiText[uiMode];
    
    document.getElementById('tagline').textContent = texts.tagline;
    document.getElementById('subscriptionsTitle').textContent = texts.subscriptionsTitle;
    document.getElementById('statsTitle').textContent = texts.statsTitle;
    document.getElementById('avgLabel').textContent = texts.avgLabel;
    document.getElementById('yearlyLabel').textContent = texts.yearlyLabel;
    document.getElementById('chartTitle').textContent = texts.chartTitle;
    document.getElementById('insightsTitle').innerHTML = `<span class="icon">${uiMode === 'friendly' ? '🤖' : '⚙️'}</span>${texts.insightsTitle}`;
    document.getElementById('couponsTitle').innerHTML = `<span class="icon">🎟️</span>${texts.couponsTitle}`;
    document.getElementById('addBtnText').textContent = texts.addBtnText;
    document.getElementById('refreshText').textContent = texts.refreshText;
    document.getElementById('emptyMessage').textContent = texts.emptyMessage;
    document.getElementById('loadingText').textContent = texts.loadingText;
    document.getElementById('footerText').textContent = texts.footerText;
    document.getElementById('chartToggleText').textContent = texts.chartToggleText;
}

// ==================== API CALLS ====================
async function loadSubscriptions() {
    try {
        const response = await fetch('/api/subscriptions');
        const data = await response.json();
        
        if (data.success) {
            subscriptions = data.subscriptions;
            renderSubscriptions();
            updateAnalytics();
            updateChart();
        }
    } catch (error) {
        console.error('Error loading subscriptions:', error);
    }
}

async function handleAddSubscription(e) {
    e.preventDefault();
    
    const name = document.getElementById('subName').value;
    const cost = parseFloat(document.getElementById('subCost').value);
    const renewalDate = document.getElementById('subRenewal').value;
    const category = document.getElementById('subCategory').value;
    
    try {
        const response = await fetch('/api/subscriptions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                cost,
                renewalDate,
                category
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Clear form
            document.getElementById('addSubForm').reset();
            
            // Reload subscriptions
            await loadSubscriptions();
            
            // Reload AI insights
            await loadAIInsights();
        }
    } catch (error) {
        console.error('Error adding subscription:', error);
        alert('Failed to add subscription. Please try again.');
    }
}

async function deleteSubscription(id) {
    if (!confirm(uiMode === 'friendly' ? 
        'Are you sure you want to remove this subscription?' : 
        'CONFIRM DELETION OF ENTRY?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/subscriptions/${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            await loadSubscriptions();
            await loadAIInsights();
        }
    } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Failed to delete subscription. Please try again.');
    }
}

async function loadAIInsights() {
    const insightsContent = document.getElementById('insightsContent');
    insightsContent.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p id="loadingText">${uiText[uiMode].loadingText}</p>
        </div>
    `;
    
    try {
        const response = await fetch('/api/ai-insights');
        const data = await response.json();
        
        if (data.success) {
            renderInsights(data.insights);
        }
    } catch (error) {
        console.error('Error loading AI insights:', error);
        insightsContent.innerHTML = '<p>Failed to load insights. Please try again.</p>';
    }
}

async function loadCoupons() {
    try {
        const response = await fetch('/api/coupons');
        const data = await response.json();
        
        if (data.success) {
            renderCoupons(data.coupons);
        }
    } catch (error) {
        console.error('Error loading coupons:', error);
    }
}

// ==================== RENDERING FUNCTIONS ====================
function renderSubscriptions() {
    const container = document.getElementById('subscriptionsList');
    const emptyState = document.getElementById('emptyState');
    const countBadge = document.getElementById('subCount');
    
    countBadge.textContent = subscriptions.length;
    
    if (subscriptions.length === 0) {
        emptyState.classList.remove('hidden');
        container.innerHTML = '';
        container.appendChild(emptyState);
        return;
    }
    
    emptyState.classList.add('hidden');
    
    container.innerHTML = subscriptions.map(sub => `
        <div class="subscription-item">
            <div class="sub-info">
                <div class="sub-name">${sub.name}</div>
                <div class="sub-details">
                    <span class="sub-detail">
                        📅 ${formatDate(sub.renewalDate)}
                    </span>
                    <span class="sub-category">${sub.category}</span>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="sub-cost">$${sub.cost.toFixed(2)}</div>
                <button class="delete-btn" onclick="deleteSubscription(${sub.id})">
                    ${uiMode === 'friendly' ? '🗑️ Remove' : 'DELETE'}
                </button>
            </div>
        </div>
    `).join('');
}

function renderInsights(insights) {
    const container = document.getElementById('insightsContent');
    
    if (insights.length === 0) {
        container.innerHTML = '<p>No insights available yet.</p>';
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item ${insight.type}">
            <p class="insight-message">${insight.message}</p>
        </div>
    `).join('');
}

function renderCoupons(coupons) {
    const container = document.getElementById('couponsList');
    
    container.innerHTML = coupons.map(coupon => `
        <div class="coupon-item">
            <div class="coupon-header">
                <div class="coupon-service">${coupon.service}</div>
                <div class="coupon-discount">${coupon.discount}</div>
            </div>
            <div class="coupon-description">${coupon.description}</div>
            <div class="coupon-footer">
                <span class="coupon-code">${coupon.code}</span>
                <span class="coupon-expiry">Expires: ${formatDate(coupon.expiryDate)}</span>
            </div>
        </div>
    `).join('');
}

function updateAnalytics() {
    const totalCost = subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
    const avgCost = subscriptions.length > 0 ? totalCost / subscriptions.length : 0;
    const yearlyCost = totalCost * 12;
    
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);
    document.getElementById('avgCost').textContent = avgCost.toFixed(2);
    document.getElementById('yearlyCost').textContent = yearlyCost.toFixed(2);
}

// ==================== CHART FUNCTIONS ====================
function initializeChart() {
    const ctx = document.getElementById('spendingChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: [],
            datasets: [{
                label: 'Spending by Category',
                data: [],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(107, 114, 128, 0.8)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(107, 114, 128, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: chartType === 'pie',
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-primary').trim(),
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': $' + context.parsed.toFixed(2);
                        }
                    }
                }
            },
            scales: chartType === 'bar' ? {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary').trim(),
                        callback: function(value) {
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--bg-tertiary').trim()
                    }
                },
                x: {
                    ticks: {
                        color: getComputedStyle(document.documentElement)
                            .getPropertyValue('--text-secondary').trim()
                    },
                    grid: {
                        display: false
                    }
                }
            } : {}
        }
    });
}

function updateChart() {
    if (!chart) return;
    
    // Calculate spending by category
    const categorySpending = {};
    subscriptions.forEach(sub => {
        if (categorySpending[sub.category]) {
            categorySpending[sub.category] += sub.cost;
        } else {
            categorySpending[sub.category] = sub.cost;
        }
    });
    
    const labels = Object.keys(categorySpending);
    const data = Object.values(categorySpending);
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    
    // Update colors based on theme
    const textColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--text-primary').trim();
    
    if (chart.options.plugins.legend) {
        chart.options.plugins.legend.labels.color = textColor;
    }
    
    chart.update();
}

function toggleChartType() {
    chartType = chartType === 'bar' ? 'pie' : 'bar';
    
    // Destroy old chart
    chart.destroy();
    
    // Create new chart with new type
    initializeChart();
    updateChart();
    
    // Update button text
    document.getElementById('chartToggleText').textContent = 
        uiText[uiMode].chartToggleText = 
        chartType === 'bar' ? 
        (uiMode === 'friendly' ? "Switch to Pie Chart 🥧" : "SWITCH TO PIE CHART") : 
        (uiMode === 'friendly' ? "Switch to Bar Chart 📊" : "SWITCH TO BAR CHART");
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// ==================== GLOBAL FUNCTIONS ====================
// Make deleteSubscription available globally for onclick handlers
window.deleteSubscription = deleteSubscription;
