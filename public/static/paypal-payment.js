// PayPal Payment Integration
let paypalLoaded = false;
let paymentData = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('PayPal payment page loaded');
    
    // Extract payment parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    paymentData = {
        sessionId: urlParams.get('session') || 'default-session',
        email: urlParams.get('email') || '',
        name: urlParams.get('name') || '',
        goal: urlParams.get('goal') || 'Launch AI business'
    };
    
    console.log('Payment data:', paymentData);
    
    // Load PayPal SDK
    loadPayPalSDK();
    
    // Set up form if data exists
    if (paymentData.email) {
        document.getElementById('customer-email').value = paymentData.email;
        document.getElementById('customer-name').value = paymentData.name;
    }
});

function loadPayPalSDK() {
    console.log('Loading PayPal SDK...');
    
    // PayPal SDK script - using test client ID for development
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&currency=USD&components=buttons';
    script.async = true;
    
    script.onload = function() {
        console.log('PayPal SDK loaded successfully');
        paypalLoaded = true;
        initializePayPalButtons();
    };
    
    script.onerror = function() {
        console.error('Failed to load PayPal SDK');
        showPayPalError();
    };
    
    document.head.appendChild(script);
}

function initializePayPalButtons() {
    console.log('Initializing PayPal buttons...');
    
    if (!window.paypal) {
        console.error('PayPal SDK not available');
        showPayPalError();
        return;
    }
    
    // Clear any existing PayPal buttons
    const paypalContainer = document.getElementById('paypal-button-container');
    if (paypalContainer) {
        paypalContainer.innerHTML = '';
    }
    
    try {
        window.paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'paypal',
                height: 50
            },
            
            createOrder: function(data, actions) {
                console.log('Creating PayPal order...');
                
                // Validate required fields
                const email = document.getElementById('customer-email')?.value?.trim();
                const name = document.getElementById('customer-name')?.value?.trim();
                
                if (!email || !name) {
                    alert('Please enter your email and name before proceeding with payment.');
                    return Promise.reject('Missing required fields');
                }
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '19.99',
                            currency_code: 'USD'
                        },
                        description: 'AI TechStep Challenge - 30-Day Launch Program',
                        custom_id: paymentData.sessionId,
                        invoice_id: 'AI-TECHSTEP-' + Date.now(),
                        soft_descriptor: 'AI TechStep'
                    }],
                    application_context: {
                        brand_name: 'AI TechStep Challenge',
                        landing_page: 'BILLING',
                        user_action: 'PAY_NOW',
                        shipping_preference: 'NO_SHIPPING'
                    }
                });
            },
            
            onApprove: function(data, actions) {
                console.log('PayPal payment approved:', data);
                
                return actions.order.capture().then(function(details) {
                    console.log('Payment captured:', details);
                    
                    // Show processing state
                    showProcessingState();
                    
                    // Process the payment on our server
                    processPayPalPayment(details);
                });
            },
            
            onError: function(err) {
                console.error('PayPal error:', err);
                showPaymentError('Payment failed. Please try again or contact support.');
            },
            
            onCancel: function(data) {
                console.log('PayPal payment cancelled:', data);
                showPaymentError('Payment was cancelled. You can try again when ready.');
            }
            
        }).render('#paypal-button-container');
        
        console.log('PayPal buttons rendered successfully');
        
    } catch (error) {
        console.error('Error initializing PayPal buttons:', error);
        showPayPalError();
    }
}

async function processPayPalPayment(paypalDetails) {
    console.log('Processing PayPal payment on server...');
    
    const email = document.getElementById('customer-email').value.trim();
    const name = document.getElementById('customer-name').value.trim();
    
    try {
        const response = await fetch('/api/process-paypal-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: paymentData.sessionId,
                email: email,
                name: name,
                goal: paymentData.goal,
                paypalOrderId: paypalDetails.id,
                paypalDetails: paypalDetails,
                amount: 19.99,
                currency: 'USD'
            })
        });
        
        const result = await response.json();
        console.log('Server response:', result);
        
        if (result.success) {
            // Redirect to success page
            window.location.href = result.successUrl || '/success';
        } else {
            throw new Error(result.message || 'Payment processing failed');
        }
        
    } catch (error) {
        console.error('Error processing payment:', error);
        showPaymentError('Payment completed but processing failed. Please contact support with order ID: ' + paypalDetails.id);
    }
}

function showProcessingState() {
    const container = document.getElementById('payment-container');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-12">
                <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Processing Your Payment...</h3>
                <p class="text-gray-600">Please wait while we set up your AI TechStep Challenge access.</p>
            </div>
        `;
    }
}

function showPaymentError(message) {
    const container = document.getElementById('payment-container');
    if (container) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div class="text-red-600 text-4xl mb-4">⚠️</div>
                    <h3 class="text-xl font-bold text-red-800 mb-4">Payment Issue</h3>
                    <p class="text-red-700 mb-6">${message}</p>
                    <button onclick="window.location.reload()" class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-semibold">
                        Try Again
                    </button>
                </div>
            </div>
        `;
    }
}

function showPayPalError() {
    const container = document.getElementById('paypal-button-container');
    if (container) {
        container.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div class="text-yellow-600 text-3xl mb-4">⚡</div>
                <h4 class="font-bold text-yellow-800 mb-2">PayPal Temporarily Unavailable</h4>
                <p class="text-yellow-700 mb-4">Please try refreshing the page or contact support if the issue persists.</p>
                <button onclick="window.location.reload()" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// Export functions for global access
window.loadPayPalSDK = loadPayPalSDK;
window.initializePayPalButtons = initializePayPalButtons;