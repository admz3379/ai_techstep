// Countdown Timer for Scratch Card Page
document.addEventListener('DOMContentLoaded', function() {
    initializeScratchCardCountdown();
});

function initializeScratchCardCountdown() {
    // 10-minute countdown timer for scratch card page
    let timeLeft = 10 * 60; // 10 minutes in seconds
    
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        countdownElement.textContent = `${formattedMinutes} : ${formattedSeconds}`;
        
        // Add urgency styling as time runs out
        if (timeLeft <= 120) { // Last 2 minutes
            countdownElement.style.color = '#ef4444'; // red-500
            countdownElement.style.animation = 'pulse 1s infinite';
            countdownElement.classList.add('font-bold');
        } else if (timeLeft <= 300) { // Last 5 minutes
            countdownElement.style.color = '#f97316'; // orange-500
        }
        
        if (timeLeft <= 0) {
            countdownElement.textContent = '00 : 00';
            countdownElement.style.color = '#ef4444';
            showTimeExpiredMessage();
            return;
        }
        
        timeLeft--;
    }
    
    // Update immediately and then every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // Store interval ID for cleanup
    window.scratchCardCountdown = countdownInterval;
}

function showTimeExpiredMessage() {
    // Create expired message overlay
    const expiredOverlay = document.createElement('div');
    expiredOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    expiredOverlay.innerHTML = `
        <div class="bg-white rounded-2xl p-8 text-center max-w-md mx-4 shadow-2xl">
            <div class="text-6xl mb-4">⏰</div>
            <h2 class="text-2xl font-bold text-red-600 mb-4">Time's Up!</h2>
            <p class="text-gray-700 mb-6">
                But don't worry! We're extending your <span class="font-bold text-green-600">50% discount</span> 
                because we want to help all parents succeed with AI.
            </p>
            <div class="space-y-3">
                <button 
                    onclick="continueWithDiscount()" 
                    class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                    Continue with 50% OFF
                </button>
                <button 
                    onclick="closeExpiredMessage()" 
                    class="w-full text-gray-600 py-2 px-6 rounded-lg hover:text-gray-800 transition-colors"
                >
                    Maybe later
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(expiredOverlay);
    
    // Store reference for cleanup
    window.expiredOverlay = expiredOverlay;
}

function continueWithDiscount() {
    // Close expired message and proceed to checkout
    closeExpiredMessage();
    
    // Proceed to checkout with discount maintained
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const goal = urlParams.get('goal');
    
    const checkoutUrl = `/checkout?session=${encodeURIComponent(session || '')}&email=${encodeURIComponent(email || '')}&name=${encodeURIComponent(name || '')}&goal=${encodeURIComponent(goal || '')}`;
    window.location.href = checkoutUrl;
}

function closeExpiredMessage() {
    if (window.expiredOverlay && document.body.contains(window.expiredOverlay)) {
        document.body.removeChild(window.expiredOverlay);
        window.expiredOverlay = null;
    }
    
    // Reset countdown to show extended offer
    resetCountdownWithExtension();
}

function resetCountdownWithExtension() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    // Set to 5 more minutes
    let timeLeft = 5 * 60;
    
    function updateExtendedCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        countdownElement.textContent = `${formattedMinutes} : ${formattedSeconds}`;
        countdownElement.style.color = '#10b981'; // green-500
        
        if (timeLeft <= 0) {
            countdownElement.textContent = '00 : 00';
            countdownElement.style.color = '#ef4444';
            // Show final message
            showFinalOffer();
            return;
        }
        
        timeLeft--;
    }
    
    // Clear existing countdown
    if (window.scratchCardCountdown) {
        clearInterval(window.scratchCardCountdown);
    }
    
    // Start extended countdown
    updateExtendedCountdown();
    window.scratchCardCountdown = setInterval(updateExtendedCountdown, 1000);
    
    // Show extension notice
    showExtensionNotice();
}

function showExtensionNotice() {
    const notice = document.createElement('div');
    notice.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold z-40 shadow-lg';
    notice.innerHTML = '🎉 Extended! 5 more minutes with your 50% discount';
    
    document.body.appendChild(notice);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notice)) {
            notice.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                if (document.body.contains(notice)) {
                    document.body.removeChild(notice);
                }
            }, 500);
        }
    }, 5000);
}

function showFinalOffer() {
    const finalOffer = document.createElement('div');
    finalOffer.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-bold z-40 shadow-2xl max-w-sm text-center';
    finalOffer.innerHTML = `
        <div class="mb-2">🚀 Last Chance!</div>
        <div class="text-sm mb-3">Your 50% discount is still valid for AI TechSteps</div>
        <button 
            onclick="continueWithDiscount()" 
            class="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
        >
            Claim Now
        </button>
    `;
    
    document.body.appendChild(finalOffer);
}

// Global functions
window.continueWithDiscount = continueWithDiscount;
window.closeExpiredMessage = closeExpiredMessage;

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (window.scratchCardCountdown) {
        clearInterval(window.scratchCardCountdown);
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-10px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);