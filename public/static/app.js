// AI Income Builder v1.0 - Frontend JavaScript

// Global utilities and helpers
window.AIIncomeBuilder = {
  // Language support
  currentLanguage: 'en',
  
  // Track user interactions
  analytics: {
    trackEvent: function(eventName, properties = {}) {
      console.log('Analytics Event:', eventName, properties);
      // This will integrate with analytics services later
    },
    
    trackQuizStart: function(language) {
      this.trackEvent('quiz_started', { language });
    },
    
    trackQuizComplete: function(track, score) {
      this.trackEvent('quiz_completed', { track, score });
    },
    
    trackCheckoutStart: function(email, track) {
      this.trackEvent('checkout_started', { email, track });
    }
  },
  
  // UI helpers
  ui: {
    showLoading: function(element) {
      if (element) {
        element.classList.add('loading');
        element.disabled = true;
      }
    },
    
    hideLoading: function(element) {
      if (element) {
        element.classList.remove('loading');
        element.disabled = false;
      }
    },
    
    showNotification: function(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
      }`;
      notification.textContent = message;
      
      // Add to DOM
      document.body.appendChild(notification);
      
      // Animate in
      setTimeout(() => notification.classList.add('translate-x-0'), 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    },
    
    animateProgress: function(element, targetWidth) {
      if (!element) return;
      
      let currentWidth = 0;
      const increment = targetWidth / 20; // 20 steps
      
      const animate = () => {
        currentWidth += increment;
        if (currentWidth <= targetWidth) {
          element.style.width = currentWidth + '%';
          requestAnimationFrame(animate);
        } else {
          element.style.width = targetWidth + '%';
        }
      };
      
      animate();
    }
  },
  
  // Quiz functionality
  quiz: {
    currentSession: null,
    
    validateEmail: function(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    saveProgress: function() {
      if (this.currentSession && localStorage) {
        localStorage.setItem('quiz_progress', JSON.stringify(this.currentSession));
      }
    },
    
    loadProgress: function() {
      if (localStorage) {
        const saved = localStorage.getItem('quiz_progress');
        if (saved) {
          try {
            this.currentSession = JSON.parse(saved);
            return this.currentSession;
          } catch (e) {
            console.error('Failed to load quiz progress:', e);
          }
        }
      }
      return null;
    },
    
    clearProgress: function() {
      if (localStorage) {
        localStorage.removeItem('quiz_progress');
      }
    }
  },
  
  // API helpers
  api: {
    baseUrl: '',
    
    async request(endpoint, options = {}) {
      try {
        const response = await fetch(this.baseUrl + endpoint, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          },
          ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || `HTTP ${response.status}`);
        }
        
        return data;
      } catch (error) {
        console.error('API Request failed:', error);
        throw error;
      }
    },
    
    async submitQuiz(sessionId, email, results, language) {
      return this.request('/api/submit-quiz', {
        method: 'POST',
        body: JSON.stringify({ sessionId, email, results, language })
      });
    },
    
    async createCheckoutSession(email, trackType, discountCode = null) {
      return this.request('/api/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ email, trackType, discountCode })
      });
    }
  },
  
  // Multilingual support
  i18n: {
    translations: {
      en: {
        quiz_start: 'Start Quiz',
        next: 'Next',
        back: 'Back',
        email_required: 'Please enter your email address',
        invalid_email: 'Please enter a valid email address',
        network_error: 'Network error. Please try again.',
        loading: 'Loading...',
        complete: 'Complete'
      },
      es: {
        quiz_start: 'Comenzar Quiz',
        next: 'Siguiente',
        back: 'Atrás',
        email_required: 'Por favor ingresa tu dirección de correo',
        invalid_email: 'Por favor ingresa un correo válido',
        network_error: 'Error de red. Por favor intenta de nuevo.',
        loading: 'Cargando...',
        complete: 'Completar'
      },
      ru: {
        quiz_start: 'Начать Тест',
        next: 'Далее',
        back: 'Назад',
        email_required: 'Пожалуйста, введите адрес электронной почты',
        invalid_email: 'Пожалуйста, введите действительный адрес электронной почты',
        network_error: 'Ошибка сети. Пожалуйста, попробуйте еще раз.',
        loading: 'Загрузка...',
        complete: 'Завершить'
      }
      // Add other languages as needed
    },
    
    t: function(key, lang = null) {
      const language = lang || this.currentLanguage || 'en';
      const translations = this.translations[language] || this.translations.en;
      return translations[key] || key;
    },
    
    setLanguage: function(lang) {
      this.currentLanguage = lang;
      document.documentElement.lang = lang;
      
      // Apply RTL for Persian and Pashto
      if (lang === 'fa' || lang === 'ps') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
      } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
      }
    }
  },
  
  // Keyboard shortcuts
  shortcuts: {
    init: function() {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    },
    
    handleKeydown: function(event) {
      // Quiz navigation shortcuts
      if (event.key === 'ArrowRight' || event.key === 'Enter') {
        const nextBtn = document.getElementById('next-btn');
        if (nextBtn && !nextBtn.disabled) {
          nextBtn.click();
        }
      }
      
      if (event.key === 'ArrowLeft') {
        const backBtn = document.getElementById('back-btn');
        if (backBtn && !backBtn.disabled) {
          backBtn.click();
        }
      }
      
      // Number key shortcuts for quiz options
      if (event.key >= '1' && event.key <= '9') {
        const optionIndex = parseInt(event.key) - 1;
        const options = document.querySelectorAll('#options-container > div');
        if (options[optionIndex]) {
          options[optionIndex].click();
        }
      }
    }
  },
  
  // Device detection
  device: {
    isMobile: function() {
      return window.innerWidth < 768;
    },
    
    isTablet: function() {
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    },
    
    isDesktop: function() {
      return window.innerWidth >= 1024;
    },
    
    hasTouch: function() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const app = window.AIIncomeBuilder;
  
  // Initialize shortcuts
  app.shortcuts.init();
  
  // Set initial language from URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') || localStorage.getItem('preferred_language') || 'en';
  app.i18n.setLanguage(lang);
  
  // Save language preference
  if (localStorage) {
    localStorage.setItem('preferred_language', lang);
  }
  
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add loading states to forms
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        app.ui.showLoading(submitBtn);
      }
    });
  });
  
  // Track page views
  app.analytics.trackEvent('page_view', {
    page: window.location.pathname,
    language: lang,
    device: app.device.isMobile() ? 'mobile' : app.device.isTablet() ? 'tablet' : 'desktop'
  });
});

// Error handling
window.addEventListener('error', function(event) {
  console.error('JavaScript error:', event.error);
  window.AIIncomeBuilder.analytics.trackEvent('javascript_error', {
    message: event.message,
    filename: event.filename,
    line: event.lineno
  });
});

// Unload handling
window.addEventListener('beforeunload', function() {
  window.AIIncomeBuilder.quiz.saveProgress();
});