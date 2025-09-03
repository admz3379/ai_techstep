// Checkout Payment Handler
// Handles PayPal integration for pricing modal checkout

let paypalLoaded = false;
let paypalButtons = null;

// Initialize checkout payment system
document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout payment system initializing...');
    
    if (typeof window.checkoutData === 'undefined') {
        console.error('Checkout data not found');
        return;
    }
    
    console.log('Checkout data:', window.checkoutData);
    
    // Initialize PayPal
    initializePayPal();
    
    // Setup countdown timer
    setupCountdownTimer();
});

// Initialize PayPal SDK and buttons
function initializePayPal() {
    // Check if PayPal SDK is already loaded
    if (typeof paypal !== 'undefined') {
        renderPayPalButtons();
        return;
    }
    
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=demo_client_id&currency=USD&disable-funding=venmo';
    script.onload = function() {
        console.log('PayPal SDK loaded');
        paypalLoaded = true;
        renderPayPalButtons();
    };
    script.onerror = function() {
        console.error('Failed to load PayPal SDK');
        showPaymentError('Failed to load payment system. Please refresh and try again.');
    };
    
    document.head.appendChild(script);
}

// Render PayPal buttons
function renderPayPalButtons() {
    const container = document.getElementById('paypal-checkout-container');
    if (!container) {
        console.error('PayPal container not found');
        return;
    }
    
    // Clear loading state
    container.innerHTML = '';
    
    // For demo purposes, create a demo PayPal button
    if (typeof paypal === 'undefined') {
        // Demo mode - create mock PayPal button
        container.innerHTML = `
            <button 
                onclick="processDemoPayment()" 
                class="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 px-6 rounded-lg font-bold text-lg transition-colors shadow-lg"
                style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border: 1px solid #d97706;"
            >
                <div class="flex items-center justify-center">
                    <span style="font-weight: bold; font-size: 16px;">Pay</span>
                    <span style="color: #003087; font-weight: bold; margin-left: 4px;">Pal</span>
                    <span class="ml-4">$${(window.checkoutData.amount / 100).toFixed(2)}</span>
                </div>
            </button>
            <div class="text-xs text-gray-500 mt-2 text-center">Demo mode - Click to simulate payment</div>
        `;
        return;
    }
    
    // Real PayPal buttons (when SDK is properly loaded with real client ID)
    try {
        paypalButtons = paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                label: 'paypal',
                height: 55
            },
            
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: (window.checkoutData.amount / 100).toFixed(2),
                            currency_code: 'USD'
                        },
                        description: getTierDescription(window.checkoutData.tier),
                        custom_id: window.checkoutData.checkoutId
                    }]
                });
            },
            
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    console.log('PayPal payment completed:', details);
                    
                    // Process the payment
                    processCheckoutPayment({
                        checkoutId: window.checkoutData.checkoutId,
                        paypalOrderId: data.orderID,
                        paypalDetails: details,
                        amount: window.checkoutData.amount / 100,
                        currency: 'USD'
                    });
                });
            },
            
            onError: function(err) {
                console.error('PayPal error:', err);
                showPaymentError('Payment failed. Please try again or contact support.');
            },
            
            onCancel: function(data) {
                console.log('PayPal payment cancelled:', data);
                // Track abandonment for email sequence
                trackPaymentAbandonment();
            }
        });
        
        paypalButtons.render('#paypal-checkout-container');
        
    } catch (error) {
        console.error('PayPal buttons render error:', error);
        showPaymentError('Payment system error. Please refresh and try again.');
    }
}

// Process demo payment (for testing)
function processDemoPayment() {
    console.log('Processing demo payment...');
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>';
    button.disabled = true;
    
    // Simulate payment processing delay
    setTimeout(() => {
        processCheckoutPayment({
            checkoutId: window.checkoutData.checkoutId,
            paypalOrderId: 'DEMO_ORDER_' + Date.now(),
            paypalDetails: {
                id: 'DEMO_ORDER_' + Date.now(),
                status: 'COMPLETED',
                payer: {
                    email_address: window.checkoutData.email,
                    name: { given_name: window.checkoutData.name }
                }
            },
            amount: window.checkoutData.amount / 100,
            currency: 'USD'
        });
    }, 2000);
}

// Process checkout payment
async function processCheckoutPayment(paymentData) {
    try {
        console.log('Processing checkout payment:', paymentData);
        
        const response = await fetch('/api/process-checkout-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Track successful purchase
            if (typeof gtag !== 'undefined') {
                gtag('event', 'purchase', {
                    transaction_id: paymentData.paypalOrderId,
                    value: paymentData.amount,
                    currency: paymentData.currency,
                    items: [{
                        item_id: window.checkoutData.tier,
                        item_name: getTierDescription(window.checkoutData.tier),
                        category: 'AI Course',
                        quantity: 1,
                        price: paymentData.amount
                    }]
                });
            }
            
            // Redirect to success page
            window.location.href = result.successUrl || `/success?checkout=${paymentData.checkoutId}`;
            
        } else {
            console.error('Payment processing failed:', result.error);
            showPaymentError(result.error || 'Payment processing failed. Please contact support.');
        }
        
    } catch (error) {
        console.error('Checkout payment error:', error);
        showPaymentError('Network error. Please check your connection and try again.');
    }
}

// Get tier description for PayPal
function getTierDescription(tier) {
    switch (tier) {
        case 'starter':
            return 'AI TechStep Starter Unlock';
        case 'core_full':
            return 'AI TechStep Core Plan - Full Payment';
        case 'core_installment':
            return 'AI TechStep Core Plan - First Installment';
        default:
            return 'AI TechStep Course';
    }
}

// Setup countdown timer for checkout expiration
function setupCountdownTimer() {
    const expiresElement = document.getElementById('checkout-expires');
    if (!expiresElement || !window.checkoutData.expiresAt) return;
    
    const expiresAt = new Date(window.checkoutData.expiresAt);
    
    function updateCountdown() {
        const now = new Date();
        const timeLeft = expiresAt - now;
        
        if (timeLeft <= 0) {
            // Session expired
            showSessionExpired();
            return;
        }
        
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        expiresElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
        
        // Update color based on time left
        if (minutes < 5) {
            expiresElement.className = 'text-red-600 font-bold';
        } else if (minutes < 10) {
            expiresElement.className = 'text-yellow-600 font-semibold';
        }
    }
    
    // Update immediately and then every second
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    
    // Clear timer when leaving page
    window.addEventListener('beforeunload', () => clearInterval(timer));
}

// Show session expired message
function showSessionExpired() {
    const container = document.querySelector('.max-w-2xl');
    if (container) {
        container.innerHTML = `
            <div class="bg-white rounded-2xl shadow-xl border-2 border-red-300 p-8 text-center">
                <div class="text-6xl mb-4">⏰</div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Checkout Session Expired</h2>
                <p class="text-gray-600 mb-6">
                    Your checkout session has expired for security reasons. 
                    Please start over to complete your purchase.
                </p>
                <a href="/" class="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold">
                    Start Over
                </a>
            </div>
        `;
    }
}

// Show payment error
function showPaymentError(message) {
    const container = document.getElementById('paypal-checkout-container');
    if (container) {
        container.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div class="text-red-600 font-semibold mb-2">Payment Error</div>
                <div class="text-red-700 text-sm mb-3">${message}</div>
                <button 
                    onclick="location.reload()" 
                    class="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold text-sm"
                >
                    Try Again
                </button>
            </div>
        `;
    }
}

// Track payment abandonment for email sequence
function trackPaymentAbandonment() {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'checkout_abandon', {
            event_category: 'ecommerce',
            event_label: window.checkoutData.tier,
            value: window.checkoutData.amount / 100
        });
    }
    
    // Send abandonment data to backend for email sequence
    fetch('/api/track-checkout-abandonment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            checkoutId: window.checkoutData.checkoutId,
            tier: window.checkoutData.tier,
            abandonedAt: new Date().toISOString()
        })
    }).catch(error => {
        console.log('Abandonment tracking failed:', error);
        // Non-critical, don't show error to user
    });
}

// Export for global access
if (typeof window !== 'undefined') {
    window.checkoutPayment = {
        processDemoPayment,
        processCheckoutPayment,
        trackPaymentAbandonment
    };
}