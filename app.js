// UPDATE THESE WITH YOUR ACTUAL URLS:
GOOGLE_FORM_URL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform',
POWERBI_PERSONAL_URL: 'https://app.powerbi.com/view?r=YOUR_PERSONAL_REPORT_ID',
POWERBI_COMMUNITY_URL: 'https://app.powerbi.com/view?r=YOUR_COMMUNITY_REPORT_ID',

// Update intervals (in milliseconds)
STATS_UPDATE_INTERVAL: 300000, // 5 minutes
PERSONAL_UPDATE_INTERVAL: 180000, // 3 minutes

// Initialize components
initNavigation();
initUserSession();
loadCommunityStats();
loadPersonalStats();
startPeriodicUpdates();

console.log('✅ All components loaded successfully');

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

if (playerName && playerName.trim()) {
    userData.playerName = playerName.trim();
    userData.isLoggedIn = true;
    localStorage.setItem('hkia_player_name', userData.playerName);
    
    console.log(`🌸 Welcome, ${userData.playerName}! Loading your stats...`);
    loadPersonalStats();
}

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

console.log('📊 Showing fallback community stats');

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

container.innerHTML = trendingData.slice(0, 5).map(flower => `
    <div class="trending-item">
        <span class="flower-name">${flower.name}</span>
        <span class="trend-count">+${flower.recentCount} this week</span>
    </div>
`).join('');

container.innerHTML = rareData.slice(0, 5).map(flower => `
    <div class="rare-item">
        <span class="flower-name">${flower.name}</span>
        <span class="rarity-percent">${flower.rarity}% have this</span>
    </div>
`).join('');

container.innerHTML = collectorsData.slice(0, 5).map((collector, index) => `
    <div class="leader-item">
        <span class="rank">#${index + 1}</span>
        <span class="player-name">${collector.name}</span>
        <span class="flower-count">${collector.count} flowers</span>
    </div>
`).join('');

if (CONFIG.GOOGLE_FORM_URL.includes('YOUR_FORM_ID')) {
    alert('🔧 Setup needed: Please update the Google Form URL in app.js with your actual form link!');
    return;
}

window.open(CONFIG.GOOGLE_FORM_URL, '_blank');

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
