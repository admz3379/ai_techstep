// Checkout Implementation - One-time $19.99 payment for work-from-home parents
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
});

function initializeCheckout() {
    initializeCountdownTimer();
    setupPaymentButtons();
    displayUserInfo();
    trackCheckoutEvents();
}

function initializeCountdownTimer() {
    // 10-minute countdown timer
    let timeLeft = 10 * 60; // 10 minutes in seconds
    
    const countdownElement = document.getElementById('checkout-countdown');
    if (!countdownElement) return;
    
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        countdownElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
        
        // Change color and add urgency as time runs out
        if (timeLeft <= 120) { // Last 2 minutes
            countdownElement.style.color = '#ef4444'; // red-500
            countdownElement.style.animation = 'pulse 1s infinite';
            countdownElement.classList.add('font-bold');
        } else if (timeLeft <= 300) { // Last 5 minutes
            countdownElement.style.color = '#f97316'; // orange-500
        }
        
        if (timeLeft <= 0) {
            countdownElement.textContent = '00:00';
            countdownElement.style.color = '#ef4444';
            showUrgencyMessage();
            return;
        }
        
        timeLeft--;
    }
    
    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function setupPaymentButtons() {
    const purchaseButton = document.querySelector('[onclick="processPurchase()"]');
    if (!purchaseButton) return;
    
    // Add click tracking
    purchaseButton.addEventListener('click', function(e) {
        e.preventDefault();
        processPurchase();
    });
    
    // Add hover effects for parent-friendly experience
    purchaseButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.innerHTML = '🎉 YES! Get My AI TechStep Challenge - $19.99';
    });
    
    purchaseButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1.0)';
        this.innerHTML = 'GET MY PLAN - $19.99';
    });
}

function displayUserInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const goal = urlParams.get('goal');
    
    // Update goal displays
    const goalElements = document.querySelectorAll('[data-user-goal]');
    goalElements.forEach(el => {
        el.textContent = goal || 'Support children\'s education';
    });
    
    // Show personalized message
    if (name) {
        showPersonalizedMessage(name, goal);
    }
}

function showPersonalizedMessage(name, goal) {
    // Create personalized welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center';
    welcomeMsg.innerHTML = `
        <h3 class="font-bold text-blue-900 mb-2">Hi ${name}! 👋</h3>
        <p class="text-blue-800">We've prepared your personal 4-week AI challenge to help you achieve: <span class="font-semibold">${goal || 'your AI income goals'}</span></p>
        <div class="text-sm text-blue-600 mt-2">Join 700,000+ parents who are already mastering AI!</div>
    `;
    
    // Insert at the top of the checkout page
    const checkoutContainer = document.querySelector('.max-w-4xl');
    if (checkoutContainer && checkoutContainer.children.length > 1) {
        checkoutContainer.insertBefore(welcomeMsg, checkoutContainer.children[1]);
    }
}

function processPurchase() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const name = urlParams.get('name');
    const goal = urlParams.get('goal');
    
    if (!email) {
        showError('Email is required to complete your purchase.');
        return;
    }
    
    // Show processing state
    showProcessingState();
    
    // Simulate payment processing (in real app, integrate with Stripe/PayPal)
    setTimeout(() => {
        processPayment(email, name, goal);
    }, 2000);
}

function showProcessingState() {
    const purchaseButton = document.querySelector('[onclick="processPurchase()"]');
    if (!purchaseButton) return;
    
    purchaseButton.disabled = true;
    purchaseButton.innerHTML = `
        <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing your payment...
        </div>
    `;
    purchaseButton.classList.add('opacity-75');
    
    // Show processing overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.innerHTML = `
        <div class="bg-white rounded-xl p-8 text-center max-w-md mx-4">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Securing Your AI TechStep Access</h3>
            <p class="text-gray-600">Please wait while we process your one-time payment...</p>
            <div class="text-sm text-gray-500 mt-4">This usually takes 5-10 seconds</div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function processPayment(email, name, goal) {
    // In a real application, this would integrate with:
    // - Stripe for credit card processing
    // - PayPal for PayPal payments
    // - Your backend API to create user account and deliver content
    
    // For demo purposes, we'll simulate a successful payment
    const paymentData = {
        email: email,
        name: name || '',
        goal: goal || '',
        amount: 19.99,
        discount: 20.00, // 50% off from $39.99
        originalPrice: 39.99,
        currency: 'USD',
        plan: '4-Week AI TechStep Challenge',
        timestamp: new Date().toISOString(),
        paymentId: 'ai_parent_' + Date.now(),
        isOneTime: true,
        noSubscription: true
    };
    
    // Simulate API call to create user account and deliver content
    fetch('/api/process-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to success page
            const successUrl = `/success?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || '')}`;
            window.location.href = successUrl;
        } else {
            showError('Payment processing failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Payment error:', error);
        showError('Unable to process payment. Please check your connection and try again.');
    });
}

function showError(message) {
    // Remove processing overlay
    const overlay = document.querySelector('.fixed.inset-0.bg-black');
    if (overlay) {
        document.body.removeChild(overlay);
    }
    
    // Reset purchase button
    const purchaseButton = document.querySelector('button[disabled]');
    if (purchaseButton) {
        purchaseButton.disabled = false;
        purchaseButton.innerHTML = 'GET MY PLAN - $19.99';
        purchaseButton.classList.remove('opacity-75');
    }
    
    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold z-50 shadow-lg';
    errorMsg.innerHTML = `⚠️ ${message}`;
    
    document.body.appendChild(errorMsg);
    
    setTimeout(() => {
        if (document.body.contains(errorMsg)) {
            errorMsg.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => {
                if (document.body.contains(errorMsg)) {
                    document.body.removeChild(errorMsg);
                }
            }, 500);
        }
    }, 5000);
}

function showUrgencyMessage() {
    const urgencyMsg = document.createElement('div');
    urgencyMsg.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-6 rounded-xl font-bold text-center z-50 shadow-2xl max-w-md';
    urgencyMsg.innerHTML = `
        <div class="text-2xl mb-4">⏰ Time's Up!</div>
        <div class="mb-4">But don't worry - we're extending your 50% discount for AI TechSteps!</div>
        <button onclick="this.parentElement.remove()" class="bg-white text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-gray-100">
            Continue with Discount
        </button>
    `;
    
    document.body.appendChild(urgencyMsg);
}

function trackCheckoutEvents() {
    // Track page view
    console.log('Checkout page viewed');
    
    // Track button interactions
    document.addEventListener('click', function(e) {
        if (e.target.matches('button') || e.target.closest('button')) {
            const buttonText = e.target.textContent || e.target.closest('button').textContent;
            console.log('Button clicked:', buttonText);
        }
    });
    
    // Track time spent on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        console.log('Time spent on checkout page:', timeSpent, 'seconds');
    });
}

// Global function for purchase button
window.processPurchase = processPurchase;

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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