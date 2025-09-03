// 3-Tier Pricing Modal System
let pricingModal = {
    isOpen: false,
    leadProfile: null,
    selectedTier: 'core',
    selectedPayment: 'full', // 'full' or 'installment'
    
    // Initialize pricing modal system
    init() {
        console.log('Pricing Modal initialized');
        this.createModal();
        this.setupEventListeners();
    },

    // Create pricing modal overlay
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'pricing-modal-overlay';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div id="pricing-modal-content" class="p-6 sm:p-8">
                    <!-- Pricing content will be inserted here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });
    },

    // Setup event listeners
    setupEventListeners() {
        // Add global event listeners here if needed
    },

    // Open pricing modal
    open(leadProfile = null) {
        console.log('Opening pricing modal with lead profile:', leadProfile);
        this.isOpen = true;
        this.leadProfile = leadProfile;
        
        document.getElementById('pricing-modal-overlay').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        this.renderPricingTiers();
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'checkout_view', {
                event_category: 'ecommerce',
                event_label: 'pricing_modal'
            });
        }
    },

    // Close pricing modal
    close() {
        this.isOpen = false;
        document.getElementById('pricing-modal-overlay').classList.add('hidden');
        document.body.style.overflow = 'auto';
    },

    // Render pricing tiers
    renderPricingTiers() {
        const content = document.getElementById('pricing-modal-content');
        
        content.innerHTML = `
            <div class="text-center mb-8">
                <button onclick="pricingModal.close()" class="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
                
                <div class="mb-6">
                    ${this.leadProfile ? `
                        <div class="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 mb-6 max-w-md mx-auto">
                            <div class="text-sm text-purple-700">Your AI Class</div>
                            <div class="font-bold text-purple-900">${this.leadProfile.aiClass}</div>
                            <div class="text-sm text-purple-600">Readiness: ${this.leadProfile.readinessScore}/100</div>
                        </div>
                    ` : ''}
                    
                    <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choose Your AI Launch Plan</h1>
                    <p class="text-lg text-gray-600">Select the plan that matches your commitment level</p>
                </div>
            </div>
            
            <div class="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
                <!-- Starter Tier -->
                <div class="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 relative hover:border-blue-300 transition-all duration-200" onclick="pricingModal.selectTier('starter')">
                    <div class="text-center">
                        <div class="text-lg font-bold text-gray-900 mb-2">Starter Unlock</div>
                        <div class="text-4xl font-bold text-gray-900 mb-1">$49</div>
                        <div class="text-sm text-gray-600 mb-6">One-time payment</div>
                        
                        <div class="text-left space-y-3 mb-6">
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">AI Profile & Readiness Score</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Week-1 roadmap preview</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Starter prompts & mini toolkit</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Upgrade any time (credit $49 to Core within 7 days)</div>
                            </div>
                        </div>
                        
                        <button onclick="pricingModal.purchaseTier('starter', 49)" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                            Start for $49
                        </button>
                    </div>
                </div>
                
                <!-- Core Tier (Most Popular) -->
                <div class="bg-white border-4 border-green-400 rounded-2xl p-6 sm:p-8 relative transform lg:scale-105 shadow-xl" onclick="pricingModal.selectTier('core')">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div class="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full font-bold text-sm">
                            🏆 MOST POPULAR
                        </div>
                    </div>
                    
                    <div class="text-center pt-4">
                        <div class="text-xl font-bold text-gray-900 mb-2">Core Plan</div>
                        <div class="mb-4">
                            <div class="flex items-center justify-center space-x-4 mb-2">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="core-payment" value="full" checked onchange="pricingModal.selectPayment('full')" class="mr-2">
                                    <span class="text-2xl font-bold text-gray-900">$499</span>
                                    <span class="text-sm text-gray-600 ml-2">one-time</span>
                                </label>
                            </div>
                            <div class="flex items-center justify-center">
                                <label class="flex items-center cursor-pointer">
                                    <input type="radio" name="core-payment" value="installment" onchange="pricingModal.selectPayment('installment')" class="mr-2">
                                    <span class="text-xl font-bold text-gray-900">$199 × 3</span>
                                    <span class="text-sm text-gray-600 ml-2">installments</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="text-left space-y-3 mb-6">
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm"><strong>Weekly live coaching</strong> with real entrepreneurs/marketers who've built 100+ high-value businesses</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Full 28-Day AI Launch Plan</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">AI Prompt Bank ($299 value)</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Marketing Toolkit ($199 value)</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Private community</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-green-500 mr-3">✅</div>
                                <div class="text-sm">Templates + resources</div>
                            </div>
                        </div>
                        
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div class="text-xs font-semibold text-green-800 mb-1">💎 RISK REVERSAL</div>
                            <div class="text-sm text-green-700">Complete all 4 weeks; if you don't launch, 50% refund.</div>
                        </div>
                        
                        <button onclick="pricingModal.purchaseCore()" class="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg mb-2">
                            Join Core — <span id="core-price-display">$499</span>
                        </button>
                        
                        <div class="text-xs text-gray-500">Most popular choice • Immediate access</div>
                    </div>
                </div>
                
                <!-- Equity Tier -->
                <div class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8 relative" onclick="pricingModal.selectTier('equity')">
                    <div class="text-center">
                        <div class="text-lg font-bold text-purple-900 mb-2">Founder Equity Track</div>
                        <div class="text-2xl font-bold text-purple-900 mb-1">Apply</div>
                        <div class="text-sm text-purple-600 mb-6">No upfront fee</div>
                        
                        <div class="text-left space-y-3 mb-6">
                            <div class="flex items-start">
                                <div class="text-purple-500 mr-3">🚀</div>
                                <div class="text-sm">Full program + coaching</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-purple-500 mr-3">🤝</div>
                                <div class="text-sm">AI TechStep receives 20% equity in new venture</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-purple-500 mr-3">📋</div>
                                <div class="text-sm">Application only; limited seats</div>
                            </div>
                            <div class="flex items-start">
                                <div class="text-purple-500 mr-3">💼</div>
                                <div class="text-sm">For serious entrepreneurs only</div>
                            </div>
                        </div>
                        
                        <button onclick="pricingModal.openEquityApplication()" class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200">
                            Apply for Equity Track
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Why $499 Section -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 class="text-lg font-bold text-gray-900 mb-3 text-center">Why $499?</h3>
                <p class="text-gray-700 text-center max-w-3xl mx-auto">
                    You're not buying another course. You're working with real entrepreneurs and marketers who've built 100+ high-value businesses. 
                    We package their playbooks into a 28-day launch with live support. Typical consulting = $5,000+. Your investment: $499.
                </p>
            </div>
            
            <!-- Trust Indicators -->
            <div class="text-center">
                <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 mb-4">
                    <div class="flex items-center">
                        <div class="text-green-500 mr-2">🔒</div>
                        <span>Secure Payment</span>
                    </div>
                    <div class="flex items-center">
                        <div class="text-green-500 mr-2">💳</div>
                        <span>PayPal & Cards</span>
                    </div>
                    <div class="flex items-center">
                        <div class="text-green-500 mr-2">↩️</div>
                        <span>Money-Back Guarantee</span>
                    </div>
                </div>
            </div>
        `;
        
        this.updateCorePrice();
    },

    // Select tier
    selectTier(tier) {
        this.selectedTier = tier;
        console.log('Selected tier:', tier);
    },

    // Select payment method for core plan
    selectPayment(paymentType) {
        this.selectedPayment = paymentType;
        this.updateCorePrice();
    },

    // Update core price display
    updateCorePrice() {
        const priceDisplay = document.getElementById('core-price-display');
        if (priceDisplay) {
            if (this.selectedPayment === 'installment') {
                priceDisplay.textContent = '$199 × 3';
            } else {
                priceDisplay.textContent = '$499';
            }
        }
    },

    // Purchase starter tier
    async purchaseTier(tier, amount) {
        console.log(`Purchasing ${tier} tier for $${amount}`);
        
        if (!this.leadProfile || !this.leadProfile.email) {
            alert('Please complete the AI Profile Quiz first');
            return;
        }
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase_attempt', {
                event_category: 'ecommerce',
                event_label: tier,
                value: amount
            });
        }
        
        try {
            // Create checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tier: tier,
                    amount: amount,
                    email: this.leadProfile.email,
                    name: this.leadProfile.name,
                    leadProfile: this.leadProfile
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Redirect to checkout
                window.location.href = result.checkoutUrl;
            } else {
                alert('Error creating checkout. Please try again.');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Error processing purchase. Please try again.');
        }
    },

    // Purchase core tier
    async purchaseCore() {
        const amount = this.selectedPayment === 'installment' ? 199 : 499;
        const planType = this.selectedPayment === 'installment' ? 'core_installment' : 'core_full';
        
        await this.purchaseTier(planType, amount);
    },

    // Open equity application form
    openEquityApplication() {
        console.log('Opening equity application form');
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'equity_application_start', {
                event_category: 'engagement',
                event_label: 'founder_equity_track'
            });
        }
        
        // Show equity application form
        this.showEquityApplicationForm();
    },

    // Show equity application form
    showEquityApplicationForm() {
        const content = document.getElementById('pricing-modal-content');
        content.innerHTML = `
            <div class="max-w-2xl mx-auto">
                <button onclick="pricingModal.renderPricingTiers()" class="mb-6 text-purple-600 hover:text-purple-700 font-semibold">← Back to Pricing</button>
                
                <div class="text-center mb-8">
                    <div class="text-4xl mb-4">🚀</div>
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Founder Equity Track Application</h2>
                    <p class="text-gray-600">All-in founder? Apply to our Equity Track.</p>
                </div>
                
                <div class="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6 mb-8">
                    <h3 class="font-bold text-purple-900 mb-3">What You Get:</h3>
                    <div class="space-y-2 text-sm text-purple-800">
                        <div>• Full program + coaching by entrepreneurs (100+ builds)</div>
                        <div>• We take 20% equity in your new venture</div>
                        <div>• Selection by application; limited seats</div>
                        <div>• No upfront costs - we invest in your success</div>
                    </div>
                </div>
                
                <form id="equity-application-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Founder Name *</label>
                        <input type="text" name="name" value="${this.leadProfile?.name || ''}" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                        <input type="email" name="email" value="${this.leadProfile?.email || ''}" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                        <input type="text" name="location" placeholder="City, Country" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Venture Idea * (200-400 characters)</label>
                        <textarea name="venture_idea" rows="3" maxlength="400" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Describe your AI-powered business idea in 2-3 sentences" required></textarea>
                        <div class="text-xs text-gray-500 mt-1"><span id="idea-count">0</span>/400 characters</div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Target Customer & Problem *</label>
                        <textarea name="target_problem" rows="2" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" placeholder="Who are your customers and what problem do you solve?" required></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Proof of Execution</label>
                        <input type="url" name="portfolio" placeholder="Links, portfolio, previous work (optional)" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Time Commitment *</label>
                        <select name="time_commitment" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" required>
                            <option value="">Select hours per day</option>
                            <option value="2-4">2-4 hours/day</option>
                            <option value="4-6">4-6 hours/day</option>
                            <option value="6-8">6-8 hours/day</option>
                            <option value="8+">8+ hours/day (full-time)</option>
                        </select>
                    </div>
                    
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <label class="flex items-start">
                            <input type="checkbox" name="equity_agreement" required class="mt-1 mr-3">
                            <span class="text-sm text-yellow-800">
                                <strong>I agree to the 20% equity terms</strong> if accepted into the program. I understand this will be formalized in a separate agreement upon acceptance.
                            </span>
                        </label>
                    </div>
                    
                    <div class="text-center">
                        <button type="submit" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg">
                            Submit Application 🚀
                        </button>
                        <p class="text-xs text-gray-500 mt-3">We'll review your application within 48 hours</p>
                    </div>
                </form>
            </div>
        `;
        
        // Setup form handlers
        this.setupEquityFormHandlers();
    },

    // Setup equity form handlers
    setupEquityFormHandlers() {
        // Character counter for venture idea
        const ideaTextarea = document.querySelector('textarea[name="venture_idea"]');
        const ideaCounter = document.getElementById('idea-count');
        
        if (ideaTextarea && ideaCounter) {
            ideaTextarea.addEventListener('input', () => {
                ideaCounter.textContent = ideaTextarea.value.length;
            });
        }
        
        // Form submission
        const form = document.getElementById('equity-application-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitEquityApplication(form);
        });
    },

    // Submit equity application
    async submitEquityApplication(form) {
        const formData = new FormData(form);
        const applicationData = {
            name: formData.get('name'),
            email: formData.get('email'),
            location: formData.get('location'),
            venture_idea: formData.get('venture_idea'),
            target_problem: formData.get('target_problem'),
            portfolio: formData.get('portfolio'),
            time_commitment: formData.get('time_commitment'),
            equity_agreement: formData.get('equity_agreement') === 'on',
            leadProfile: this.leadProfile,
            submitted_at: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/submit-equity-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(applicationData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                this.showEquityApplicationSuccess();
                
                // Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'equity_application_submit', {
                        event_category: 'conversion',
                        event_label: 'founder_equity_track'
                    });
                }
            } else {
                alert('Error submitting application. Please try again.');
            }
        } catch (error) {
            console.error('Equity application error:', error);
            alert('Error submitting application. Please try again.');
        }
    },

    // Show equity application success
    showEquityApplicationSuccess() {
        const content = document.getElementById('pricing-modal-content');
        content.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-6">🎉</div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                <p class="text-lg text-gray-600 mb-6 max-w-md mx-auto">
                    Thank you for your interest in our Founder Equity Track. 
                    We'll review your application and get back to you within 48 hours.
                </p>
                
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
                    <h3 class="font-bold text-purple-900 mb-2">What's Next?</h3>
                    <div class="text-sm text-purple-700 space-y-1">
                        <div>• Check your email for confirmation</div>
                        <div>• We'll schedule a brief interview call if selected</div>
                        <div>• Selected founders join our next cohort</div>
                    </div>
                </div>
                
                <button onclick="pricingModal.close()" class="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                    Close
                </button>
            </div>
        `;
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window !== 'undefined') {
        window.pricingModal = pricingModal;
        pricingModal.init();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = pricingModal;
}