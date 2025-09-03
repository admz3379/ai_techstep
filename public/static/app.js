// AI Income Builder v1.0 - Frontend JavaScript

// Mobile Showcase & Responsive Enhancements
class MobileShowcase {
  constructor() {
    this.greetings = ['Hi', 'Hola', 'Bonjour', '你好', 'مرحبا', 'नमस्ते', 'こんにちは', '안녕하세요', 'Olá', 'Привет', 'Merhaba', 'سلام', 'Xin chào'];
    this.currentGreetingIndex = 0;
    this.init();
  }

  init() {
    this.setupScrollToQuiz();
    this.setupGlobalGreetings();
    this.setupResponsiveEnhancements();
    this.setupParallax();
  }

  setupScrollToQuiz() {
    // Handle "See how it works" button click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('scroll-to-quiz') || e.target.closest('.scroll-to-quiz')) {
        e.preventDefault();
        const quizSection = document.querySelector('.bg-white.rounded-2xl.shadow-lg');
        if (quizSection) {
          quizSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  setupGlobalGreetings() {
    const greetingElement = document.querySelector('.global-greeting-text');
    if (!greetingElement) return;

    setInterval(() => {
      this.currentGreetingIndex = (this.currentGreetingIndex + 1) % this.greetings.length;
      greetingElement.style.opacity = '0.5';
      
      setTimeout(() => {
        greetingElement.textContent = `${this.greetings[this.currentGreetingIndex]} from our global community`;
        greetingElement.style.opacity = '1';
      }, 200);
    }, 3000);
  }

  setupResponsiveEnhancements() {
    // Enhanced touch interaction for mobile
    if ('ontouchstart' in window) {
      document.body.classList.add('touch-device');
      
      // Improve button interactions on touch devices
      document.querySelectorAll('button, .btn-primary, .quiz-option').forEach(element => {
        element.addEventListener('touchstart', function() {
          this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
          setTimeout(() => {
            this.style.transform = '';
          }, 100);
        });
      });
    }
  }

  setupParallax() {
    // Subtle parallax effect for desktop only
    if (window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const phoneFrame = document.querySelector('.mobile-phone-frame');
      if (phoneFrame) {
        let ticking = false;
        
        const updateParallax = () => {
          const scrolled = window.pageYOffset;
          const parallax = scrolled * 0.01; // Very subtle 1% parallax
          
          phoneFrame.style.transform = `translateY(${parallax}px)`;
          ticking = false;
        };

        const requestTick = () => {
          if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
          }
        };

        window.addEventListener('scroll', requestTick);
      }
    }
  }
}

// Enhanced responsive utilities
class ResponsiveUtils {
  constructor() {
    this.breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    };
    this.init();
  }

  init() {
    this.setupViewportHeightFix();
    this.setupKeyboardHandling();
    this.setupContainerSizing();
  }

  setupViewportHeightFix() {
    // Fix viewport height issues on mobile
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });
  }

  setupKeyboardHandling() {
    // Handle virtual keyboard on mobile
    if ('visualViewport' in window) {
      const viewport = window.visualViewport;
      const initialHeight = window.innerHeight;

      const handleViewportChange = () => {
        if (viewport.height < initialHeight * 0.75) {
          // Keyboard is likely open
          document.body.classList.add('keyboard-open');
        } else {
          document.body.classList.remove('keyboard-open');
        }
      };

      viewport.addEventListener('resize', handleViewportChange);
    }
  }

  setupContainerSizing() {
    // Dynamic container sizing based on screen width
    const updateContainerSizes = () => {
      const containers = document.querySelectorAll('.max-w-4xl, .max-w-7xl');
      const screenWidth = window.innerWidth;
      
      containers.forEach(container => {
        if (screenWidth >= this.breakpoints.xl) {
          container.style.maxWidth = '1280px';
        } else if (screenWidth >= this.breakpoints.lg) {
          container.style.maxWidth = '1200px';
        } else {
          container.style.maxWidth = 'none';
        }
      });
    };

    updateContainerSizes();
    window.addEventListener('resize', updateContainerSizes);
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width >= this.breakpoints.xl) return 'xl';
    if (width >= this.breakpoints.lg) return 'lg';
    if (width >= this.breakpoints.md) return 'md';
    return 'sm';
  }
}

// Performance monitoring
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.monitorLCP();
    this.monitorCLS();
    this.monitorFID();
  }

  monitorLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Fallback for browsers that don't support LCP
      }
    }
  }

  monitorCLS() {
    if ('LayoutShift' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        console.log('CLS:', clsValue);
      });
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Fallback for browsers that don't support CLS
      }
    }
  }

  monitorFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
      
      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Fallback for browsers that don't support FID
      }
    }
  }
}

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
  
  // Initialize Mobile Showcase functionality
  window.mobileShowcase = new MobileShowcase();
  window.responsiveUtils = new ResponsiveUtils();
  window.performanceMonitor = new PerformanceMonitor();
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