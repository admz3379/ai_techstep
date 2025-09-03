// AI Profile Quiz System - Gamified Overlay
let aiProfileQuiz = {
    currentStep: 0,
    answers: {},
    leadProfile: {},
    isOpen: false,
    
    questions: [
        {
            id: 'goals',
            question: 'What\'s your main goal right now?',
            type: 'single',
            options: [
                { value: 'wealth', text: 'Grow wealth', icon: '💰' },
                { value: 'boss', text: 'Be my own boss', icon: '👑' },
                { value: 'freedom', text: 'Financial freedom', icon: '🗽' },
                { value: 'travel', text: 'Travel the world', icon: '✈️' },
                { value: 'growth', text: 'Professional growth', icon: '📈' },
                { value: 'balance', text: 'Work-life balance', icon: '⚖️' }
            ]
        },
        {
            id: 'income_source',
            question: 'What income source are you most familiar with?',
            type: 'single',
            options: [
                { value: 'job', text: 'Full-time job', icon: '💼' },
                { value: 'passive', text: 'Passive income', icon: '💸' },
                { value: 'other', text: 'Other', icon: '🔄' }
            ]
        },
        {
            id: 'work_schedule',
            question: 'What\'s your current work schedule?',
            type: 'single',
            options: [
                { value: '9to5', text: '9 to 5', icon: '⏰' },
                { value: 'night', text: 'Night shifts', icon: '🌙' },
                { value: 'flexible', text: 'Flexible', icon: '🔄' },
                { value: 'retired', text: 'Retired', icon: '🏖️' }
            ]
        },
        {
            id: 'job_challenges',
            question: 'What job challenges do you face? (Select all that apply)',
            type: 'multi',
            options: [
                { value: 'underpaid', text: 'Underpaid', icon: '💔' },
                { value: 'dependence', text: 'Financial dependence', icon: '⛓️' },
                { value: 'no_time', text: 'No free time', icon: '⏰' },
                { value: 'routine', text: 'Boring routine', icon: '🔄' },
                { value: 'worry', text: 'Constant worry', icon: '😰' },
                { value: 'toxic', text: 'Toxic environment', icon: '☠️' },
                { value: 'other', text: 'Other', icon: '❓' }
            ]
        },
        {
            id: 'finance_feeling',
            question: 'How do you feel about your finances?',
            type: 'single',
            options: [
                { value: 'comfortable', text: 'Comfortable', icon: '😌' },
                { value: 'stability', text: 'Want more stability', icon: '🎯' },
                { value: 'struggling', text: 'Struggling to meet goals', icon: '😓' }
            ]
        },
        {
            id: 'target_income',
            question: 'What\'s your target annual income?',
            type: 'single',
            options: [
                { value: '30-50k', text: '$30–50k', icon: '💵' },
                { value: '50-100k', text: '$50–100k', icon: '💴' },
                { value: '100k+', text: '$100k+', icon: '💎' }
            ]
        },
        {
            id: 'location_control',
            question: 'Do you want control over your hours and location?',
            type: 'single',
            options: [
                { value: 'yes', text: 'Yes', icon: '✅' },
                { value: 'no', text: 'No', icon: '❌' },
                { value: 'not_sure', text: 'Not sure', icon: '🤷' }
            ]
        },
        {
            id: 'automation_comfort',
            question: 'How do you feel about automating routine tasks?',
            type: 'single',
            options: [
                { value: 'dream', text: 'It\'s a dream!', icon: '🌟' },
                { value: 'somewhat', text: 'Somewhat interested', icon: '👍' },
                { value: 'maybe', text: 'Maybe', icon: '🤔' },
                { value: 'not_necessarily', text: 'Not necessarily', icon: '🚫' }
            ]
        },
        {
            id: 'time_saved_use',
            question: 'What would you do with saved time?',
            type: 'single',
            options: [
                { value: 'creative', text: 'Creative passions', icon: '🎨' },
                { value: 'loved_ones', text: 'Spend with loved ones', icon: '❤️' },
                { value: 'growth', text: 'Personal growth', icon: '🌱' },
                { value: 'health', text: 'Health & well-being', icon: '💪' }
            ]
        },
        {
            id: 'interest_job',
            question: 'Would you enjoy a job that matches your interests?',
            type: 'single',
            options: [
                { value: 'absolutely', text: 'Absolutely!', icon: '🎯' },
                { value: 'somewhat', text: 'Somewhat', icon: '👌' },
                { value: 'maybe', text: 'Maybe', icon: '🤷' },
                { value: 'not_necessarily', text: 'Not necessarily', icon: '🚫' }
            ]
        },
        {
            id: 'digital_knowledge',
            question: 'How would you rate your digital business knowledge?',
            type: 'single',
            options: [
                { value: 'well_informed', text: 'Well-informed', icon: '🧠' },
                { value: 'some_aspects', text: 'Know some aspects', icon: '📚' },
                { value: 'limited', text: 'Limited knowledge', icon: '🔰' }
            ]
        },
        {
            id: 'earning_beyond',
            question: 'Have you tried earning beyond your main job?',
            type: 'single',
            options: [
                { value: 'side_gigs', text: 'Yes, side gigs', icon: '💼' },
                { value: 'no', text: 'No', icon: '❌' },
                { value: 'freelanced', text: 'Freelanced before', icon: '🆓' }
            ]
        },
        {
            id: 'learn_comfort',
            question: 'Are you comfortable learning new skills?',
            type: 'single',
            options: [
                { value: 'yes', text: 'Yes, love learning!', icon: '🎓' },
                { value: 'no', text: 'Not really', icon: '😅' },
                { value: 'not_sure', text: 'Not sure', icon: '🤔' }
            ]
        },
        {
            id: 'ai_tools',
            question: 'Which AI tools do you know? (Select all that apply)',
            type: 'multi',
            options: [
                { value: 'none', text: 'None', icon: '🚫' },
                { value: 'chatgpt', text: 'ChatGPT', icon: '🤖' },
                { value: 'midjourney', text: 'Midjourney', icon: '🎨' },
                { value: 'gemini', text: 'Gemini', icon: '💎' },
                { value: 'otter', text: 'Otter.ai', icon: '🦦' },
                { value: 'aiva', text: 'AIVA', icon: '🎵' },
                { value: 'dalle', text: 'DALL-E', icon: '🖼️' },
                { value: 'jasper', text: 'Jasper', icon: '✍️' },
                { value: 'copilot', text: 'Copilot', icon: '👨‍💻' },
                { value: 'playground', text: 'Playground AI', icon: '🎮' }
            ]
        },
        {
            id: 'content_writing',
            question: 'What\'s your content writing level?',
            type: 'single',
            options: [
                { value: 'expert', text: 'Expert', icon: '🏆' },
                { value: 'proficient', text: 'Proficient', icon: '👌' },
                { value: 'intermediate', text: 'Intermediate', icon: '📝' },
                { value: 'novice', text: 'Novice', icon: '🔰' }
            ]
        },
        {
            id: 'digital_marketing',
            question: 'What\'s your digital marketing level?',
            type: 'single',
            options: [
                { value: 'expert', text: 'Expert', icon: '🚀' },
                { value: 'proficient', text: 'Proficient', icon: '📈' },
                { value: 'intermediate', text: 'Intermediate', icon: '📊' },
                { value: 'novice', text: 'Novice', icon: '🔰' }
            ]
        },
        {
            id: 'ai_income_boost',
            question: 'Have you heard AI can boost income?',
            type: 'single',
            options: [
                { value: 'yes', text: 'Yes, I know!', icon: '✅' },
                { value: 'curious', text: 'Curious to learn', icon: '🤔' },
                { value: 'no', text: 'No, tell me more', icon: '❓' }
            ]
        },
        {
            id: 'fields_interest',
            question: 'Which fields interest you? (Select all that apply)',
            type: 'multi',
            options: [
                { value: 'graphic_design', text: 'Graphic Design', icon: '🎨' },
                { value: 'content', text: 'Content Creation', icon: '✍️' },
                { value: 'web_dev', text: 'Web Development', icon: '💻' },
                { value: 'ai', text: 'AI & Automation', icon: '🤖' },
                { value: 'digital_marketing', text: 'Digital Marketing', icon: '📱' },
                { value: 'social', text: 'Social Media', icon: '📲' },
                { value: 'video', text: 'Video Production', icon: '🎬' },
                { value: 'photo', text: 'Photography', icon: '📸' },
                { value: 'ecommerce', text: 'E-commerce', icon: '🛒' },
                { value: 'consulting', text: 'Consulting', icon: '💼' }
            ]
        },
        {
            id: 'ai_readiness',
            question: 'How ready are you to master AI?',
            type: 'single',
            options: [
                { value: 'all_set', text: 'All set!', icon: '🚀' },
                { value: 'ready', text: 'Ready to start', icon: '✅' },
                { value: 'somewhat', text: 'Somewhat ready', icon: '🤔' },
                { value: 'not_ready', text: 'Not ready yet', icon: '⏰' }
            ]
        },
        {
            id: 'big_milestone',
            question: 'What\'s your next big milestone?',
            type: 'single',
            options: [
                { value: 'house', text: 'Buy a house', icon: '🏠' },
                { value: 'wedding', text: 'Plan wedding', icon: '💒' },
                { value: 'vacation', text: 'Dream vacation', icon: '🏖️' },
                { value: 'car', text: 'New car', icon: '🚗' },
                { value: 'retirement', text: 'Early retirement', icon: '🏖️' },
                { value: 'other', text: 'Other goal', icon: '🎯' }
            ]
        },
        {
            id: 'time_commit',
            question: 'How much time can you commit daily?',
            type: 'single',
            options: [
                { value: '5', text: '5 minutes/day', icon: '⏱️' },
                { value: '10', text: '10 minutes/day', icon: '⏰' },
                { value: '15', text: '15 minutes/day', icon: '🕐' },
                { value: '20', text: '20 minutes/day', icon: '🕕' }
            ]
        }
    ],

    // Initialize quiz system
    init() {
        console.log('AI Profile Quiz initialized');
        this.addCTAButton();
        this.createOverlay();
    },

    // Add CTA button to existing hero section
    addCTAButton() {
        const heroSection = document.querySelector('.max-w-4xl.mx-auto.px-4.py-8');
        if (heroSection && !document.getElementById('ai-profile-cta')) {
            const ctaContainer = document.createElement('div');
            ctaContainer.className = 'text-center mb-6 sm:mb-8';
            ctaContainer.innerHTML = `
                <button 
                    id="ai-profile-cta" 
                    class="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl animate-pulse"
                    onclick="aiProfileQuiz.openQuiz()"
                >
                    ✨ Start My AI Profile
                    <div class="text-xs sm:text-sm font-normal opacity-90 mt-1">Discover your perfect AI path in 2 minutes</div>
                </button>
            `;
            
            // Insert after the trust indicators
            const trustIndicators = heroSection.querySelector('.flex.flex-col.sm\\:flex-row');
            if (trustIndicators) {
                trustIndicators.parentNode.insertBefore(ctaContainer, trustIndicators.nextSibling);
            }
        }
    },

    // Create quiz overlay
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'ai-profile-overlay';
        overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4';
        overlay.innerHTML = `
            <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div id="quiz-content" class="p-6 sm:p-8">
                    <!-- Quiz content will be inserted here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Close on outside click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeQuiz();
            }
        });
    },

    // Open quiz overlay
    openQuiz() {
        console.log('Opening AI Profile Quiz');
        this.isOpen = true;
        this.currentStep = 0;
        this.answers = {};
        
        document.getElementById('ai-profile-overlay').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        this.renderQuestion();
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_start', {
                event_category: 'engagement',
                event_label: 'ai_profile_quiz'
            });
        }
    },

    // Close quiz overlay
    closeQuiz() {
        this.isOpen = false;
        document.getElementById('ai-profile-overlay').classList.add('hidden');
        document.body.style.overflow = 'auto';
    },

    // Render current question
    renderQuestion() {
        const question = this.questions[this.currentStep];
        const progress = ((this.currentStep + 1) / this.questions.length) * 100;
        
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="text-center mb-6">
                <div class="flex justify-between items-center mb-4">
                    <button onclick="aiProfileQuiz.closeQuiz()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    <span class="text-sm text-gray-500">${this.currentStep + 1} / ${this.questions.length}</span>
                </div>
                
                <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
                    <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                </div>
                
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6">${question.question}</h2>
            </div>
            
            <div class="space-y-3" id="options-container">
                ${this.renderOptions(question)}
            </div>
            
            <div class="flex justify-between mt-8">
                <button 
                    onclick="aiProfileQuiz.previousQuestion()" 
                    class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 ${this.currentStep === 0 ? 'invisible' : ''}"
                    ${this.currentStep === 0 ? 'disabled' : ''}
                >
                    ← Back
                </button>
                <button 
                    onclick="aiProfileQuiz.nextQuestion()" 
                    class="px-8 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 font-semibold"
                    id="next-btn"
                    disabled
                >
                    ${this.currentStep === this.questions.length - 1 ? 'Complete →' : 'Next →'}
                </button>
            </div>
        `;
    },

    // Render question options
    renderOptions(question) {
        return question.options.map((option, index) => {
            const isSelected = this.isOptionSelected(question.id, option.value);
            return `
                <button 
                    class="w-full text-left p-4 border-2 rounded-lg transition-all duration-200 ${
                        isSelected 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }"
                    onclick="aiProfileQuiz.selectOption('${question.id}', '${option.value}', '${question.type}')"
                >
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">${option.icon}</span>
                        <span class="flex-1 font-medium">${option.text}</span>
                        <div class="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center ${
                            isSelected ? 'border-purple-500' : ''
                        }">
                            ${isSelected ? '<div class="w-3 h-3 bg-purple-500 rounded-full"></div>' : ''}
                        </div>
                    </div>
                </button>
            `;
        }).join('');
    },

    // Check if option is selected
    isOptionSelected(questionId, optionValue) {
        if (!this.answers[questionId]) return false;
        
        if (Array.isArray(this.answers[questionId])) {
            return this.answers[questionId].includes(optionValue);
        }
        return this.answers[questionId] === optionValue;
    },

    // Select option
    selectOption(questionId, optionValue, questionType) {
        if (questionType === 'multi') {
            if (!this.answers[questionId]) {
                this.answers[questionId] = [];
            }
            
            const index = this.answers[questionId].indexOf(optionValue);
            if (index === -1) {
                this.answers[questionId].push(optionValue);
            } else {
                this.answers[questionId].splice(index, 1);
            }
            
            // Handle "none" option for AI tools
            if (questionId === 'ai_tools') {
                if (optionValue === 'none') {
                    this.answers[questionId] = ['none'];
                } else if (this.answers[questionId].includes('none')) {
                    this.answers[questionId] = this.answers[questionId].filter(v => v !== 'none');
                    if (!this.answers[questionId].includes(optionValue)) {
                        this.answers[questionId].push(optionValue);
                    }
                }
            }
        } else {
            this.answers[questionId] = optionValue;
        }
        
        this.renderQuestion();
        this.updateNextButton();
    },

    // Update next button state
    updateNextButton() {
        const nextBtn = document.getElementById('next-btn');
        const question = this.questions[this.currentStep];
        const hasAnswer = this.answers[question.id] && (
            Array.isArray(this.answers[question.id]) 
                ? this.answers[question.id].length > 0 
                : true
        );
        
        nextBtn.disabled = !hasAnswer;
    },

    // Go to next question
    nextQuestion() {
        if (this.currentStep < this.questions.length - 1) {
            this.currentStep++;
            this.renderQuestion();
        } else {
            this.completeQuiz();
        }
    },

    // Go to previous question
    previousQuestion() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderQuestion();
        }
    },

    // Complete quiz and trigger jackpot
    completeQuiz() {
        console.log('Quiz completed:', this.answers);
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quiz_finish', {
                event_category: 'engagement',
                event_label: 'ai_profile_quiz'
            });
        }
        
        this.generateLeadProfile();
        this.showJackpotSpin();
    },

    // Generate lead profile from answers
    generateLeadProfile() {
        this.leadProfile = {
            ...this.answers,
            timestamp: new Date().toISOString(),
            aiClass: this.calculateAIClass(),
            readinessScore: this.calculateReadinessScore(),
            suggestedPathways: this.calculateSuggestedPathways()
        };
        
        console.log('Generated lead profile:', this.leadProfile);
    },

    // Calculate AI class based on mapping rules
    calculateAIClass() {
        const { goals, work_schedule, digital_marketing, ai_tools, content_writing, earning_beyond, fields_interest } = this.answers;
        
        // Count AI tools (excluding 'none')
        const aiToolsCount = Array.isArray(ai_tools) ? ai_tools.filter(tool => tool !== 'none').length : 0;
        const hasEcommerce = Array.isArray(fields_interest) ? fields_interest.includes('ecommerce') : false;
        
        // Apply mapping rules
        if (goals === 'freedom' && work_schedule === 'flexible' && digital_marketing && ['intermediate', 'proficient', 'expert'].includes(digital_marketing)) {
            return 'Digital Nomad Rogue';
        }
        
        if (goals === 'wealth' && aiToolsCount >= 2 && ['proficient', 'expert'].includes(content_writing)) {
            return 'AI Sorcerer of Stability';
        }
        
        if (goals === 'boss' && hasEcommerce && earning_beyond === 'side_gigs') {
            return 'Commerce Vanguard';
        }
        
        if (['balance', 'health'].includes(goals) && (aiToolsCount === 0 || content_writing === 'novice')) {
            return 'Creator Monk (Starter)';
        }
        
        // Default classifications
        if (aiToolsCount >= 3) return 'AI Automation Master';
        if (goals === 'boss') return 'Entrepreneurial Visionary';
        if (goals === 'travel') return 'Location Freedom Seeker';
        
        return 'Rising Digital Creator';
    },

    // Calculate readiness score (0-100)
    calculateReadinessScore() {
        let score = 0;
        let maxScore = 0;
        
        // AI readiness weight (25%)
        const readinessMap = { 'all_set': 25, 'ready': 20, 'somewhat': 15, 'not_ready': 5 };
        score += readinessMap[this.answers.ai_readiness] || 10;
        maxScore += 25;
        
        // Skills weight (25%)
        const skillLevels = ['novice', 'intermediate', 'proficient', 'expert'];
        const writingScore = (skillLevels.indexOf(this.answers.content_writing) + 1) * 6.25;
        const marketingScore = (skillLevels.indexOf(this.answers.digital_marketing) + 1) * 6.25;
        score += writingScore + marketingScore;
        maxScore += 25;
        
        // Time commitment weight (20%)
        const timeCommitMap = { '5': 12, '10': 16, '15': 18, '20': 20 };
        score += timeCommitMap[this.answers.time_commit] || 10;
        maxScore += 20;
        
        // Tool familiarity weight (20%)
        const aiTools = Array.isArray(this.answers.ai_tools) ? this.answers.ai_tools : [];
        const toolScore = aiTools.includes('none') ? 5 : Math.min(aiTools.length * 3, 20);
        score += toolScore;
        maxScore += 20;
        
        // Learning comfort weight (10%)
        const learnComfortMap = { 'yes': 10, 'not_sure': 7, 'no': 3 };
        score += learnComfortMap[this.answers.learn_comfort] || 5;
        maxScore += 10;
        
        return Math.round((score / maxScore) * 100);
    },

    // Calculate suggested pathways
    calculateSuggestedPathways() {
        const pathways = [];
        const { fields_interest, content_writing, digital_marketing, ai_tools } = this.answers;
        
        if (Array.isArray(fields_interest)) {
            if (fields_interest.includes('content') || content_writing === 'expert') {
                pathways.push('AI Content Creator');
            }
            if (fields_interest.includes('digital_marketing') || digital_marketing === 'expert') {
                pathways.push('AI Marketing Specialist');
            }
            if (fields_interest.includes('ecommerce')) {
                pathways.push('E-commerce Automation Expert');
            }
            if (fields_interest.includes('ai') || (Array.isArray(ai_tools) && ai_tools.length > 3)) {
                pathways.push('AI Solutions Consultant');
            }
            if (fields_interest.includes('consulting')) {
                pathways.push('Digital Transformation Coach');
            }
        }
        
        // Default pathways if none match
        if (pathways.length === 0) {
            pathways.push('AI-Powered Freelancer', 'Digital Product Creator', 'Online Course Creator');
        }
        
        return pathways.slice(0, 3); // Top 3 pathways
    },

    // Show jackpot spin animation
    showJackpotSpin() {
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="text-center py-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-8">Calculating Your AI Profile...</h2>
                
                <div class="flex justify-center space-x-4 mb-8" id="slot-machine">
                    <div class="slot-reel" data-final="💰">
                        <div class="slot-symbols">💰⚡🤖🚀💎✨🎯💼</div>
                    </div>
                    <div class="slot-reel" data-final="⚡">
                        <div class="slot-symbols">⚡💰🤖🚀💎✨🎯💼</div>
                    </div>
                    <div class="slot-reel" data-final="🤖">
                        <div class="slot-symbols">🤖💰⚡🚀💎✨🎯💼</div>
                    </div>
                    <div class="slot-reel" data-final="🚀">
                        <div class="slot-symbols">🚀💰⚡🤖💎✨🎯💼</div>
                    </div>
                </div>
                
                <div class="text-lg text-gray-600">
                    <div class="animate-pulse">Analyzing your responses...</div>
                </div>
            </div>
        `;
        
        // Add slot machine CSS
        this.addSlotMachineCSS();
        
        // Start animation
        setTimeout(() => {
            this.animateSlotMachine();
        }, 500);
        
        // Show results after animation
        setTimeout(() => {
            this.showResults();
        }, 3000);
    },

    // Add slot machine CSS
    addSlotMachineCSS() {
        if (!document.getElementById('slot-machine-css')) {
            const style = document.createElement('style');
            style.id = 'slot-machine-css';
            style.textContent = `
                .slot-reel {
                    width: 80px;
                    height: 80px;
                    border: 3px solid #d1d5db;
                    border-radius: 12px;
                    overflow: hidden;
                    background: linear-gradient(45deg, #f3f4f6, #e5e7eb);
                    position: relative;
                }
                
                .slot-symbols {
                    font-size: 48px;
                    line-height: 80px;
                    text-align: center;
                    animation: spin 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    transform: translateY(0);
                }
                
                @keyframes spin {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-400px); }
                    100% { transform: translateY(0); }
                }
                
                .slot-reel.spinning .slot-symbols {
                    animation: spin 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Animate slot machine
    animateSlotMachine() {
        const reels = document.querySelectorAll('.slot-reel');
        reels.forEach((reel, index) => {
            reel.classList.add('spinning');
            
            setTimeout(() => {
                const finalSymbol = reel.dataset.final;
                reel.querySelector('.slot-symbols').textContent = finalSymbol;
                reel.classList.remove('spinning');
            }, 2000 + index * 200);
        });
    },

    // Show quiz results
    showResults() {
        const { aiClass, readinessScore, suggestedPathways } = this.leadProfile;
        
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="text-center">
                <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
                    <div class="text-4xl mb-3">🎉</div>
                    <h2 class="text-2xl font-bold text-purple-900 mb-2">Your AI Class Revealed!</h2>
                    <div class="bg-white rounded-lg p-4 mb-4 shadow-lg">
                        <div class="text-xl font-bold text-purple-700">${aiClass}</div>
                    </div>
                    
                    <div class="mb-4">
                        <div class="text-sm text-purple-700 mb-2">Readiness Score</div>
                        <div class="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div class="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-1000" style="width: ${readinessScore}%"></div>
                        </div>
                        <div class="text-2xl font-bold text-gray-800">${readinessScore}/100</div>
                    </div>
                </div>
                
                <div class="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">🎯 Top 3 Suggested Pathways</h3>
                    <div class="space-y-3">
                        ${suggestedPathways.map((pathway, index) => `
                            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                <span class="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">${index + 1}</span>
                                <span class="font-medium text-gray-800">${pathway}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button 
                    onclick="aiProfileQuiz.showEmailCapture()" 
                    class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                >
                    Save & Continue
                </button>
            </div>
        `;
    },

    // Show email capture form
    showEmailCapture() {
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="text-center">
                <div class="mb-6">
                    <div class="text-4xl mb-4">💾</div>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">Save Your Profile</h2>
                    <p class="text-gray-600">Save your profile and unlock your next step</p>
                </div>
                
                <form id="email-capture-form" class="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            id="user-name"
                            placeholder="Your first name" 
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            id="user-email"
                            placeholder="Your email address" 
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                    >
                        Save Profile & See Pricing
                    </button>
                </form>
                
                <p class="text-xs text-gray-500 mt-4">
                    We respect your privacy. No spam, ever.
                </p>
            </div>
        `;
        
        // Handle form submission
        document.getElementById('email-capture-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEmailCapture();
        });
    },

    // Submit email capture
    async submitEmailCapture() {
        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        
        if (!name || !email) {
            alert('Please fill in all fields');
            return;
        }
        
        // Add name and email to lead profile
        this.leadProfile.name = name;
        this.leadProfile.email = email;
        
        try {
            // Save lead profile to backend
            const response = await fetch('/api/save-lead-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.leadProfile)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'email_capture', {
                        event_category: 'conversion',
                        event_label: 'ai_profile_quiz'
                    });
                }
                
                // Close quiz and open pricing modal
                this.closeQuiz();
                
                // Show pricing modal (will implement next)
                if (typeof pricingModal !== 'undefined') {
                    pricingModal.open(this.leadProfile);
                } else {
                    // Fallback: redirect to pricing page
                    window.location.href = '/pricing';
                }
            } else {
                alert('Error saving profile. Please try again.');
            }
        } catch (error) {
            console.error('Error saving lead profile:', error);
            alert('Error saving profile. Please try again.');
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window !== 'undefined') {
        window.aiProfileQuiz = aiProfileQuiz;
        aiProfileQuiz.init();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = aiProfileQuiz;
}