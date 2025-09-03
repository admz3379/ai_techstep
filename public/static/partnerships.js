/**
 * AI TechStep - Partnerships Page JavaScript
 * Handles tab navigation and form submissions for all partnership types
 */

class PartnershipsManager {
  constructor() {
    this.initializeTabs();
    this.initializeForms();
  }

  initializeTabs() {
    // Tab navigation functionality
    const tabButtons = document.querySelectorAll('.partnership-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const targetTab = button.dataset.tab;
        
        // Remove active class from all tabs and contents
        tabButtons.forEach(tab => {
          tab.classList.remove('active');
          tab.classList.remove('bg-blue-100', 'text-blue-700');
          tab.classList.add('text-gray-600', 'hover:text-gray-900');
        });
        
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        
        // Add active class to clicked tab
        button.classList.add('active');
        button.classList.add('bg-blue-100', 'text-blue-700');
        button.classList.remove('text-gray-600', 'hover:text-gray-900');
        
        // Show corresponding content
        const targetContent = document.getElementById(`${targetTab}-tab`);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });

    // Initialize first tab as active
    if (tabButtons.length > 0) {
      tabButtons[0].classList.add('active', 'bg-blue-100', 'text-blue-700');
      tabButtons[0].classList.remove('text-gray-600', 'hover:text-gray-900');
    }
  }

  initializeForms() {
    // Equity application form
    const equityForm = document.getElementById('equity-application-form');
    if (equityForm) {
      equityForm.addEventListener('submit', (e) => this.handleEquityApplication(e));
    }

    // Affiliate application form  
    const affiliateForm = document.getElementById('affiliate-application-form');
    if (affiliateForm) {
      affiliateForm.addEventListener('submit', (e) => this.handleAffiliateApplication(e));
    }

    // Institutional partnership form
    const institutionalForm = document.getElementById('institutional-partnership-form');
    if (institutionalForm) {
      institutionalForm.addEventListener('submit', (e) => this.handleInstitutionalPartnership(e));
    }
  }

  async handleEquityApplication(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = '🔄 Submitting Application...';
    submitButton.disabled = true;

    try {
      const data = {
        type: 'equity',
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        linkedin: formData.get('linkedin'),
        expertise: formData.get('expertise'),
        time_commitment: formData.get('time_commitment'),
        message: formData.get('message'),
        submitted_at: new Date().toISOString()
      };

      console.log('Submitting equity application:', data);

      const response = await fetch('/api/submit-partnership-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage('equity', data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Error submitting equity application:', error);
      this.showErrorMessage('There was an error submitting your application. Please try again.');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  async handleAffiliateApplication(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = '🔄 Processing Application...';
    submitButton.disabled = true;

    try {
      const data = {
        type: 'affiliate',
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        website: formData.get('website'),
        traffic_source: formData.get('traffic_source'),
        audience_size: formData.get('audience_size'),
        audience_description: formData.get('audience_description'),
        submitted_at: new Date().toISOString()
      };

      console.log('Submitting affiliate application:', data);

      const response = await fetch('/api/submit-partnership-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage('affiliate', data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }

    } catch (error) {
      console.error('Error submitting affiliate application:', error);
      this.showErrorMessage('There was an error submitting your application. Please try again.');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  async handleInstitutionalPartnership(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = '🔄 Submitting Inquiry...';
    submitButton.disabled = true;

    try {
      const data = {
        type: 'institutional',
        organization_name: formData.get('organization_name'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        title: formData.get('title'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        partnership_type: formData.get('partnership_type'),
        organization_size: formData.get('organization_size'),
        goals: formData.get('goals'),
        submitted_at: new Date().toISOString()
      };

      console.log('Submitting institutional partnership:', data);

      const response = await fetch('/api/submit-partnership-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        this.showSuccessMessage('institutional', data);
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to submit inquiry');
      }

    } catch (error) {
      console.error('Error submitting institutional partnership:', error);
      this.showErrorMessage('There was an error submitting your inquiry. Please try again.');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  showSuccessMessage(type, data) {
    let message, nextSteps;
    
    switch (type) {
      case 'equity':
        message = `Thank you ${data.first_name}! Your equity partnership application has been submitted.`;
        nextSteps = 'Our founding team will review your application and reach out within 2-3 business days to discuss next steps.';
        break;
      case 'affiliate':
        message = `Welcome to our affiliate family, ${data.first_name}!`;
        nextSteps = 'We\'ll send your affiliate dashboard access and marketing materials to your email within 24 hours.';
        break;
      case 'institutional':
        message = `Thank you ${data.first_name}! We\'ve received your partnership inquiry.`;
        nextSteps = 'Our business development team will contact you within 1-2 business days to discuss partnership opportunities.';
        break;
      default:
        message = 'Thank you! Your application has been submitted successfully.';
        nextSteps = 'We\'ll be in touch soon.';
    }

    // Create and show success modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h3>
        <p class="text-gray-600 mb-4">${message}</p>
        <p class="text-sm text-gray-500 mb-6">${nextSteps}</p>
        <button 
          onclick="this.closest('.fixed').remove()" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Continue Exploring
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);

    // Auto-remove modal after 8 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 8000);
  }

  showErrorMessage(message) {
    // Create and show error modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Submission Error</h3>
        <p class="text-gray-600 mb-6">${message}</p>
        <button 
          onclick="this.closest('.fixed').remove()" 
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);

    // Auto-remove modal after 6 seconds
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 6000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🤝 Partnerships page initialized');
  new PartnershipsManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .partnership-tab {
    transition: all 0.3s ease;
  }
  
  .partnership-tab:hover {
    transform: translateY(-2px);
  }
  
  .partnership-tab.active {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  /* Mobile responsive tabs */
  @media (max-width: 768px) {
    .partnership-tab {
      flex: 1;
      min-width: 100px;
      padding: 12px 8px;
      font-size: 14px;
    }
    
    .partnership-tab span {
      display: block;
      font-size: 16px;
      margin-bottom: 2px;
    }
  }
`;
document.head.appendChild(style);