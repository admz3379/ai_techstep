// Live Purchase Notifications - Social proof for parents
document.addEventListener('DOMContentLoaded', function() {
    initializeLivePurchases();
});

function initializeLivePurchases() {
    const livePurchasesContainer = document.getElementById('live-purchases');
    if (!livePurchasesContainer) return;
    
    // Parent-focused purchase data
    const parentPurchases = [
        { name: 'Sarah M.', location: 'Austin, TX', type: '4-Week AI Challenge', time: '2 minutes ago', message: 'Finally ready to create passive income while caring for my twins!' },
        { name: 'Michael D.', location: 'Denver, CO', type: '4-Week AI Challenge', time: '4 minutes ago', message: 'Been looking for flexible income options as a stay-at-home dad' },
        { name: 'Jennifer L.', location: 'Miami, FL', type: '4-Week AI Challenge', time: '7 minutes ago', message: 'Perfect timing - kids are napping more and I want to learn AI' },
        { name: 'David R.', location: 'Seattle, WA', type: '4-Week AI Challenge', time: '11 minutes ago', message: 'My wife recommended AI TechStep after her success story' },
        { name: 'Amanda K.', location: 'Phoenix, AZ', type: '4-Week AI Challenge', time: '13 minutes ago', message: 'Excited to master AI tools during my maternity leave' },
        { name: 'Chris B.', location: 'Orlando, FL', type: '4-Week AI Challenge', time: '16 minutes ago', message: 'Need new skills for remote work while homeschooling' },
        { name: 'Lisa W.', location: 'Portland, OR', type: '4-Week AI Challenge', time: '18 minutes ago', message: 'Love that this is designed for busy parents like me' },
        { name: 'Robert H.', location: 'Nashville, TN', type: '4-Week AI Challenge', time: '21 minutes ago', message: 'Finally a course that fits around my kids\' schedule' },
        { name: 'Emily C.', location: 'San Diego, CA', type: '4-Week AI Challenge', time: '24 minutes ago', message: 'Ready to turn my mom blog into an AI-powered income stream' },
        { name: 'Kevin M.', location: 'Boston, MA', type: '4-Week AI Challenge', time: '27 minutes ago', message: 'Been following AI TechStep for months, finally taking the leap' },
        { name: 'Michelle T.', location: 'Chicago, IL', type: '4-Week AI Challenge', time: '29 minutes ago', message: 'Perfect for learning during my baby\'s nap times' },
        { name: 'Andrew J.', location: 'Las Vegas, NV', type: '4-Week AI Challenge', time: '32 minutes ago', message: 'Hoping to supplement our family income with AI skills' },
        { name: 'Rachel P.', location: 'Atlanta, GA', type: '4-Week AI Challenge', time: '35 minutes ago', message: 'My friend made $500 last month using AI techniques from here' },
        { name: 'Mark S.', location: 'Minneapolis, MN', type: '4-Week AI Challenge', time: '37 minutes ago', message: 'Work-from-home dad ready to level up my skills' },
        { name: 'Stephanie F.', location: 'Tampa, FL', type: '4-Week AI Challenge', time: '40 minutes ago', message: 'Love that I can learn AI while my toddler plays nearby' },
        { name: 'Daniel G.', location: 'Sacramento, CA', type: '4-Week AI Challenge', time: '43 minutes ago', message: 'Been searching for parent-friendly AI education for months' },
        { name: 'Nicole R.', location: 'Columbus, OH', type: '4-Week AI Challenge', time: '45 minutes ago', message: 'Ready to create multiple income streams with AI' },
        { name: 'Jason L.', location: 'Kansas City, MO', type: '4-Week AI Challenge', time: '48 minutes ago', message: 'Excited to teach my kids about AI while I learn too' },
        { name: 'Heather M.', location: 'Charlotte, NC', type: '4-Week AI Challenge', time: '51 minutes ago', message: 'Perfect timing - just started my work-from-home journey' },
        { name: 'Tyler K.', location: 'San Antonio, TX', type: '4-Week AI Challenge', time: '54 minutes ago', message: 'Need flexible skills for my growing family' }
    ];
    
    let currentIndex = 0;
    
    // Show initial purchases
    displayInitialPurchases();
    
    // Add new purchases every 15-45 seconds
    setInterval(() => {
        addNewPurchase();
    }, getRandomInterval(15000, 45000));
    
    function displayInitialPurchases() {
        // Show 5 initial purchases
        for (let i = 0; i < 5; i++) {
            const purchase = getNextPurchase();
            addPurchaseNotification(purchase, false);
        }
    }
    
    function addNewPurchase() {
        const purchase = getNextPurchase();
        addPurchaseNotification(purchase, true);
        
        // Keep only last 8 notifications visible
        const notifications = livePurchasesContainer.children;
        if (notifications.length > 8) {
            const oldestNotification = notifications[notifications.length - 1];
            oldestNotification.style.animation = 'slideOutDown 0.5s ease-out';
            setTimeout(() => {
                if (livePurchasesContainer.contains(oldestNotification)) {
                    livePurchasesContainer.removeChild(oldestNotification);
                }
            }, 500);
        }
    }
    
    function getNextPurchase() {
        const purchase = parentPurchases[currentIndex % parentPurchases.length];
        currentIndex++;
        
        // Randomize the time to make it feel more real
        const randomMinutes = Math.floor(Math.random() * 3) + 1; // 1-3 minutes ago
        return {
            ...purchase,
            time: `${randomMinutes} minute${randomMinutes > 1 ? 's' : ''} ago`
        };
    }
    
    function addPurchaseNotification(purchase, animate = false) {
        const notification = document.createElement('div');
        notification.className = 'bg-green-50 border border-green-200 rounded-lg p-3 transition-all duration-300';
        
        if (animate) {
            notification.style.animation = 'slideInUp 0.5s ease-out';
        }
        
        notification.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span class="font-semibold text-gray-900">${purchase.name}</span>
                        <span class="text-gray-500 text-sm ml-2">${purchase.location}</span>
                    </div>
                    <div class="text-sm text-gray-700 mt-1">
                        Purchased: <span class="font-medium text-blue-600">${purchase.type}</span>
                    </div>
                    <div class="text-xs text-gray-600 italic mt-1">
                        "${purchase.message}"
                    </div>
                </div>
                <div class="text-xs text-gray-500 ml-4">
                    ${purchase.time}
                </div>
            </div>
        `;
        
        // Insert at the beginning (most recent first)
        livePurchasesContainer.insertBefore(notification, livePurchasesContainer.firstChild);
    }
    
    function getRandomInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInUp {
        0% {
            transform: translateY(20px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);