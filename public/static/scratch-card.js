// Scratch Card Implementation - No generic icons, parent-focused
document.addEventListener('DOMContentLoaded', function() {
    initializeScratchCard();
    initializeCountdown();
});

function initializeScratchCard() {
    const scratchCard = document.getElementById('scratch-card');
    const scratchOverlay = document.getElementById('scratch-overlay');
    const scratchContent = document.getElementById('scratch-content');
    
    if (!scratchCard || !scratchOverlay || !scratchContent) return;
    
    let isScratched = false;
    
    // Add click event to scratch the card
    scratchCard.addEventListener('click', function() {
        if (!isScratched) {
            scratchCard();
        }
    });
    
    // Add hover effects
    scratchCard.addEventListener('mouseenter', function() {
        if (!isScratched) {
            scratchCard.style.transform = 'scale(1.05)';
            scratchOverlay.innerHTML = '🎁 Click to reveal your discount!';
        }
    });
    
    scratchCard.addEventListener('mouseleave', function() {
        if (!isScratched) {
            scratchCard.style.transform = 'scale(1.0)';
            scratchOverlay.innerHTML = 'Click to Scratch!';
        }
    });
    
    function scratchCard() {
        isScratched = true;
        
        // Animate the scratching effect
        scratchOverlay.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        scratchOverlay.style.opacity = '0';
        scratchOverlay.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            scratchOverlay.classList.add('hidden');
            scratchContent.classList.remove('hidden');
            
            // Add celebration animation
            scratchContent.style.animation = 'celebrateWin 2s ease-out';
            
            // Show success message
            showScratchSuccess();
            
            // Auto-redirect to checkout after 3 seconds
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const session = urlParams.get('session');
                const email = urlParams.get('email');
                const name = urlParams.get('name');
                const goal = urlParams.get('goal');
                
                const checkoutUrl = `/checkout?session=${encodeURIComponent(session || '')}&email=${encodeURIComponent(email || '')}&name=${encodeURIComponent(name || '')}&goal=${encodeURIComponent(goal || '')}`;
                window.location.href = checkoutUrl;
            }, 3000);
            
        }, 500);
    }
}

function showScratchSuccess() {
    // Create floating success message
    const successMsg = document.createElement('div');
    successMsg.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-xl z-50 shadow-2xl';
    successMsg.innerHTML = '🎉 Congratulations! 50% discount unlocked!';
    successMsg.style.animation = 'bounceIn 1s ease-out';
    
    document.body.appendChild(successMsg);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
        successMsg.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(successMsg);
        }, 500);
    }, 2500);
}

function proceedToCheckout() {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session');
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const goal = urlParams.get('goal');
    
    const checkoutUrl = `/checkout?session=${encodeURIComponent(session || '')}&email=${encodeURIComponent(email || '')}&name=${encodeURIComponent(name || '')}&goal=${encodeURIComponent(goal || '')}`;
    window.location.href = checkoutUrl;
}

function initializeCountdown() {
    // 10-minute countdown timer
    let timeLeft = 10 * 60; // 10 minutes in seconds
    
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        countdownElement.textContent = `${formattedMinutes} : ${formattedSeconds}`;
        
        // Change color as time runs out
        if (timeLeft <= 120) { // Last 2 minutes
            countdownElement.style.color = '#ef4444'; // red-500
            countdownElement.style.animation = 'pulse 1s infinite';
        } else if (timeLeft <= 300) { // Last 5 minutes
            countdownElement.style.color = '#f97316'; // orange-500
        }
        
        if (timeLeft <= 0) {
            countdownElement.textContent = '00 : 00';
            countdownElement.style.color = '#ef4444';
            // Could trigger an "offer expired" modal here
            showExpiredOffer();
            return;
        }
        
        timeLeft--;
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function showExpiredOffer() {
    // Show offer expired message but still allow purchase
    const expiredMsg = document.createElement('div');
    expiredMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold z-50 shadow-lg';
    expiredMsg.innerHTML = 'Time expired! But don\'t worry, discount still applies for AI TechSteps 🎁';
    
    document.body.appendChild(expiredMsg);
    
    setTimeout(() => {
        expiredMsg.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            if (document.body.contains(expiredMsg)) {
                document.body.removeChild(expiredMsg);
            }
        }, 500);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes celebrateWin {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes bounceIn {
        0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        100% { opacity: 0; }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(style);