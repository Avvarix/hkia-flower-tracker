
// Configuration - UPDATE THESE URLs WITH YOUR ACTUAL LINKS
const CONFIG = {
    // Your existing Google Apps Script URL
    GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxjVLHPb64_KWIBLU6AHl4bnDwQ2J_IKw9TaRkfRez94tyvhSWWH2ImdT7j3yIWt_7inQ/exec',

// UPDATE THESE WITH YOUR ACTUAL URLS:
GOOGLE_FORM_URL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform',
POWERBI_PERSONAL_URL: 'https://app.powerbi.com/view?r=YOUR_PERSONAL_REPORT_ID',
POWERBI_COMMUNITY_URL: 'https://app.powerbi.com/view?r=YOUR_COMMUNITY_REPORT_ID',

// Update intervals (in milliseconds)
STATS_UPDATE_INTERVAL: 300000, // 5 minutes
PERSONAL_UPDATE_INTERVAL: 180000, // 3 minutes

};
// Global state
let userData = {
playerName: localStorage.getItem('hkia_player_name') || '',
personalStats: {},
isLoggedIn: false
};
// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
console.log('🌸 HKIA Flower Tracker initialized');
    
// Initialize components
initNavigation();
initUserSession();
loadCommunityStats();
loadPersonalStats();
startPeriodicUpdates();

console.log('✅ All components loaded successfully');

});
// Navigation functionality
function initNavigation() {
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinksContainer = document.querySelector('.nav-links');

// Handle nav link clicks
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Smooth scroll to section
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Mobile menu toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        navLinksContainer.style.display = 
            navLinksContainer.style.display === 'flex' ? 'none' : 'flex';
    });
}

}
// User session management
function initUserSession() {
if (userData.playerName) {
userData.isLoggedIn = true;
console.log(👋 Welcome back, ${userData.playerName}!);
} else {
// Prompt for player name on first visit
setTimeout(promptForPlayerName, 2000);
}
}
function promptForPlayerName() {
const playerName = prompt('🎮 Welcome to HKIA Flower Tracker!\n\nWhat's your player name? (This helps us show your personal stats)');
    
if (playerName && playerName.trim()) {
    userData.playerName = playerName.trim();
    userData.isLoggedIn = true;
    localStorage.setItem('hkia_player_name', userData.playerName);
    
    console.log(`🌸 Welcome, ${userData.playerName}! Loading your stats...`);
    loadPersonalStats();
}

}
// Load community statistics
async function loadCommunityStats() {
try {
console.log('📊 Loading community stats...');
    
const response = await fetch(`${CONFIG.GOOGLE_APPS_SCRIPT_URL}?action=getCommunityStats`);
    const data = await response.json();
    
    if (data.success) {
        updateCommunityStatsDisplay(data);
        console.log('✅ Community stats loaded successfully');
    } else {
        console.warn('⚠️ Failed to load community stats:', data.error);
        showFallbackCommunityStats();
    }
} catch (error) {
    console.warn('⚠️ Error loading community stats:', error);
    showFallbackCommunityStats();
}

}
function updateCommunityStatsDisplay(data) {
// Update main stats
updateElementText('activeCollectors', data.activeCollectors || 0);
updateElementText('totalDiscoveries', data.totalDiscoveries || 0);
updateElementText('totalFlowers', '77,856'); // Static total
    
// Update trending flowers
if (data.trendingFlowers) {
    updateTrendingFlowers(data.trendingFlowers);
}

// Update rare flowers
if (data.rareFlowers) {
    updateRareFlowers(data.rareFlowers);
}

// Update top collectors
if (data.topCollectors) {
    updateTopCollectors(data.topCollectors);
}

}
function showFallbackCommunityStats() {
// Show placeholder data when API isn't available
updateElementText('activeCollectors', '342');
updateElementText('totalDiscoveries', '12,445');
updateElementText('totalFlowers', '77,856');
    
console.log('📊 Showing fallback community stats');

}
// Load personal statistics
async function loadPersonalStats() {
if (!userData.isLoggedIn || !userData.playerName) {
showDefaultPersonalStats();
return;
}
    
try {
    console.log(`📈 Loading personal stats for ${userData.playerName}...`);
    
    const response = await fetch(
        `${CONFIG.GOOGLE_APPS_SCRIPT_URL}?action=getPersonalStats&playerName=${encodeURIComponent(userData.playerName)}`
    );
    const data = await response.json();
    
    if (data.success) {
        userData.personalStats = data;
        updatePersonalStatsDisplay(data);
        console.log('✅ Personal stats loaded successfully');
    } else {
        console.warn('⚠️ Failed to load personal stats:', data.error);
        showDefaultPersonalStats();
    }
} catch (error) {
    console.warn('⚠️ Error loading personal stats:', error);
    showDefaultPersonalStats();
}

}
function updatePersonalStatsDisplay(data) {
updateElementText('personalFlowers', data.flowersOwned || 0);
updateElementText('personalCompletion', ${data.completionPercentage || 0}%);
updateElementText('weeklyProgress', data.weeklyAdditions || 0);
updateElementText('playerRank', data.rank ? #${data.rank} : '#-');
}
function showDefaultPersonalStats() {
updateElementText('personalFlowers', '0');
updateElementText('personalCompletion', '0%');
updateElementText('weeklyProgress', '0');
updateElementText('playerRank', '#-');
}
// Helper function to update element text safely
function updateElementText(elementId, value) {
const element = document.getElementById(elementId);
if (element) {
// Add number formatting for large numbers
if (typeof value === 'number' && value >= 1000) {
element.textContent = value.toLocaleString();
} else {
element.textContent = value;
}
}
}
// Update trending flowers display
function updateTrendingFlowers(trendingData) {
const container = document.getElementById('trendingFlowers');
if (!container || !trendingData.length) return;
    
container.innerHTML = trendingData.slice(0, 5).map(flower => `
    <div class="trending-item">
        <span class="flower-name">${flower.name}</span>
        <span class="trend-count">+${flower.recentCount} this week</span>
    </div>
`).join('');

}
// Update rare flowers display
function updateRareFlowers(rareData) {
const container = document.getElementById('rareFlowers');
if (!container || !rareData.length) return;
    
container.innerHTML = rareData.slice(0, 5).map(flower => `
    <div class="rare-item">
        <span class="flower-name">${flower.name}</span>
        <span class="rarity-percent">${flower.rarity}% have this</span>
    </div>
`).join('');

}
// Update top collectors display
function updateTopCollectors(collectorsData) {
const container = document.getElementById('topCollectors');
if (!container || !collectorsData.length) return;
    
container.innerHTML = collectorsData.slice(0, 5).map((collector, index) => `
    <div class="leader-item">
        <span class="rank">#${index + 1}</span>
        <span class="player-name">${collector.name}</span>
        <span class="flower-count">${collector.count} flowers</span>
    </div>
`).join('');

}
// Main action functions
function openCollectionForm() {
console.log('🌱 Opening collection form...');
    
if (CONFIG.GOOGLE_FORM_URL.includes('YOUR_FORM_ID')) {
    alert('🔧 Setup needed: Please update the Google Form URL in app.js with your actual form link!');
    return;
}

window.open(CONFIG.GOOGLE_FORM_URL, '_blank');

}
function openCommunityDashboard() {
console.log('🌍 Opening community dashboard...');
    
}
function openPersonalDashboard() {
console.log('📈 Opening personal dashboard...');
    
if (CONFIG.POWERBI_PERSONAL_URL.includes('YOUR_PERSONAL_REPORT_ID')) {
    alert('🔧 Setup needed: Please update the PowerBI personal dashboard URL in app.js with your actual report link!');
    return;
}

window.open(CONFIG.POWERBI_PERSONAL_URL, '_blank');

if (CONFIG.POWERBI_COMMUNITY_URL.includes('YOUR_COMMUNITY_REPORT_ID')) {
    alert('🔧 Setup needed: Please update the PowerBI community dashboard URL in app.js with your actual report link!');
    return;
}

window.open(CONFIG.POWERBI_COMMUNITY_URL, '_blank');

}
// Footer link functions
function showAbout() {
alert(`🌸 About HKIA Flower Tracker
This community project helps Hello Kitty Island Adventure players track their flower collections and discover rare combinations.
Built with:

Google Forms for easy data collection
Google Sheets for reliable storage
PowerBI for beautiful analytics
GitHub Pages for fast, free hosting

Made with 💖 by the HKIA community!`);
}
function showHelp() {
alert(`❓ How to Use HKIA Flower Tracker)
}
