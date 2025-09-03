// Stripe Payment Integration for AI TechStep Challenge
let stripe = null;
let elements = null;
let paymentElement = null;

// Initialize Stripe when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Stripe payment...');
    initializeStripe();
});

async function initializeStripe() {
    try {
        // Get Stripe public key and create payment intent
        const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: 1999, // $19.99 in cents
                currency: 'usd',
                metadata: {
                    product: 'AI TechStep Challenge',
                    session: getUrlParameter('session'),
                    email: getUrlParameter('email'),
                    name: getUrlParameter('name'),
                    goal: getUrlParameter('goal')
                }
            })
        });
        
        const { client_secret, publishable_key } = await response.json();
        
        if (!publishable_key || !client_secret) {
            throw new Error('Failed to initialize payment');
        }
        
        // Initialize Stripe
        stripe = Stripe(publishable_key);
        
        // Create Elements instance
        elements = stripe.elements({
            clientSecret: client_secret,
            appearance: {
                theme: 'stripe',
                variables: {
                    colorPrimary: '#10b981', // green-500
                    colorBackground: '#ffffff',
                    colorText: '#374151',
                    colorDanger: '#dc2626',
                    fontFamily: 'system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px'
                }
            }
        });
        
        // Create and mount Payment Element
        paymentElement = elements.create('payment');
        paymentElement.mount('#stripe-payment-element');
        
        // Handle form submission
        const submitButton = document.getElementById('stripe-submit');
        if (submitButton) {
            submitButton.addEventListener('click', handleSubmit);
        }
        
        console.log('Stripe initialized successfully');
        
    } catch (error) {
        console.error('Stripe initialization error:', error);
        showPaymentError('Payment system unavailable. Please try again later.');
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!stripe || !elements) {
        showPaymentError('Payment system not ready. Please refresh the page.');
        return;
    }
    
    const submitButton = document.getElementById('stripe-submit');
    submitButton.disabled = true;
    submitButton.innerHTML = '🔄 Processing Payment...';
    
    try {
        // Confirm payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success?session=${getUrlParameter('session')}&email=${getUrlParameter('email')}&name=${getUrlParameter('name')}`
            },
        });
        
        if (error) {
            console.error('Payment error:', error);
            showPaymentError(error.message || 'Payment failed. Please try again.');
            submitButton.disabled = false;
            submitButton.innerHTML = '🚀 Secure My AI TechStep Challenge - $19.99';
        } else if (paymentIntent.status === 'succeeded') {
            // Payment succeeded, redirect will happen automatically
            console.log('Payment succeeded:', paymentIntent);
        }
        
    } catch (error) {
        console.error('Payment processing error:', error);
        showPaymentError('Payment processing failed. Please try again.');
        submitButton.disabled = false;
        submitButton.innerHTML = '🚀 Secure My AI TechStep Challenge - $19.99';
    }
}

function showPaymentError(message) {
    // Create or update error message
    let errorDiv = document.getElementById('payment-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'payment-error';
        errorDiv.className = 'bg-red-50 border border-red-200 rounded-lg p-4 mb-4';
        
        const paymentElement = document.getElementById('stripe-payment-element');
        paymentElement.parentNode.insertBefore(errorDiv, paymentElement);
    }
    
    errorDiv.innerHTML = `
        <div class="flex">
            <div class="text-red-500 mr-3">❌</div>
            <div>
                <h4 class="font-semibold text-red-800">Payment Error</h4>
                <p class="text-red-700 text-sm">${message}</p>
            </div>
        </div>
    `;
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (errorDiv && errorDiv.parentNode) {
            errorDiv.parentNode.removeChild(errorDiv);
        }
    }, 10000);
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Global functions
window.handleSubmit = handleSubmit;
window.showPaymentError = showPaymentError;