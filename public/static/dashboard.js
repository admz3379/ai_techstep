// AI TechStep Dashboard - Interactive Features
let dashboard = {
    currentUser: null,
    currentWeek: 1,
    
    // Initialize dashboard
    init() {
        console.log('AI TechStep Dashboard initialized');
        this.setupEventListeners();
        this.loadUserData();
        this.updateProgress();
    },
    
    // Setup event listeners
    setupEventListeners() {
        // Week navigation buttons
        document.querySelectorAll('[data-week]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const week = parseInt(e.target.dataset.week);
                this.switchWeek(week);
            });
        });
        
        // Quick action buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                this.handleQuickAction(e.target.dataset.action);
            }
        });
        
        // Day progress buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-day-action]')) {
                const day = parseInt(e.target.dataset.day);
                const action = e.target.dataset.dayAction;
                this.handleDayAction(day, action);
            }
        });
    },
    
    // Load user data from URL parameters or localStorage
    loadUserData() {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const demo = urlParams.get('demo') === 'true';
        
        this.currentUser = {
            email: email || 'demo@example.com',
            isDemo: demo,
            name: demo ? 'Demo User' : (localStorage.getItem('userName') || 'User')
        };
        
        console.log('User data loaded:', this.currentUser);
    },
    
    // Switch between weeks
    switchWeek(week) {
        this.currentWeek = week;
        
        // Update active week button
        document.querySelectorAll('[data-week]').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
        });
        
        const activeBtn = document.querySelector(`[data-week="${week}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'text-gray-600', 'hover:bg-gray-200');
            activeBtn.classList.add('bg-blue-600', 'text-white');
        }
        
        // Update progress timeline (this would typically fetch new data)
        this.updateProgressTimeline(week);
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dashboard_week_switch', {
                event_category: 'engagement',
                event_label: `week_${week}`
            });
        }
    },
    
    // Update progress timeline for selected week
    updateProgressTimeline(week) {
        // This would typically make an API call to get week-specific progress
        console.log(`Loading progress for week ${week}`);
        
        // For demo, we'll just show a loading state briefly
        const timeline = document.querySelector('[data-progress-timeline]');
        if (timeline) {
            timeline.style.opacity = '0.5';
            setTimeout(() => {
                timeline.style.opacity = '1';
            }, 300);
        }
    },
    
    // Handle quick action buttons
    handleQuickAction(action) {
        console.log('Quick action:', action);
        
        switch (action) {
            case 'watch_lesson':
                this.openTodaysLesson();
                break;
            case 'join_coaching':
                this.openLiveCoaching();
                break;
            case 'community_chat':
                this.openCommunityChat();
                break;
            case 'view_resources':
                this.openResourceLibrary();
                break;
            default:
                console.log('Unknown action:', action);
        }
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dashboard_quick_action', {
                event_category: 'engagement',
                event_label: action
            });
        }
    },
    
    // Handle day-specific actions
    handleDayAction(day, action) {
        console.log(`Day ${day} action:`, action);
        
        switch (action) {
            case 'start':
                this.startDay(day);
                break;
            case 'continue':
                this.continueDay(day);
                break;
            case 'review':
                this.reviewDay(day);
                break;
            default:
                console.log('Unknown day action:', action);
        }
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dashboard_day_action', {
                event_category: 'engagement',
                event_label: `day_${day}_${action}`
            });
        }
    },
    
    // Open today's lesson
    openTodaysLesson() {
        // Create modal or navigate to lesson page
        this.showModal({
            title: 'Today\'s Lesson',
            content: `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">🎓</div>
                    <h3 class="text-xl font-bold mb-4">AI Foundations & Goal Setting</h3>
                    <p class="text-gray-600 mb-6">Learn the fundamentals of AI and set your success goals</p>
                    <button onclick="dashboard.closeModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Start Lesson
                    </button>
                </div>
            `
        });
    },
    
    // Open live coaching
    openLiveCoaching() {
        this.showModal({
            title: 'Live Coaching',
            content: `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">💬</div>
                    <h3 class="text-xl font-bold mb-4">Weekly Live Coaching</h3>
                    <p class="text-gray-600 mb-4">Join our entrepreneurs for live Q&A and guidance</p>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p class="text-green-800 font-semibold">Next Session: Tomorrow at 2:00 PM EST</p>
                        <p class="text-green-600 text-sm">Topic: "AI Tools for Content Creation"</p>
                    </div>
                    <button onclick="dashboard.closeModal()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                        Set Reminder
                    </button>
                </div>
            `
        });
    },
    
    // Open community chat
    openCommunityChat() {
        this.showModal({
            title: 'Community Chat',
            content: `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">👥</div>
                    <h3 class="text-xl font-bold mb-4">AI TechStep Community</h3>
                    <p class="text-gray-600 mb-6">Connect with 700,000+ members on their AI journey</p>
                    <div class="space-y-3">
                        <button onclick="dashboard.closeModal()" class="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700">
                            💬 General Chat
                        </button>
                        <button onclick="dashboard.closeModal()" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            🎯 Week 1 Support Group
                        </button>
                        <button onclick="dashboard.closeModal()" class="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                            🚀 Success Stories
                        </button>
                    </div>
                </div>
            `
        });
    },
    
    // Open resource library
    openResourceLibrary() {
        this.showModal({
            title: 'Resource Library',
            content: `
                <div class="py-6">
                    <div class="text-center mb-6">
                        <div class="text-6xl mb-4">📚</div>
                        <h3 class="text-xl font-bold mb-2">Your AI Resource Library</h3>
                        <p class="text-gray-600">Access all your templates, tools, and guides</p>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-blue-600 text-2xl mb-2">📝</div>
                            <h4 class="font-semibold">AI Prompt Bank</h4>
                            <p class="text-sm text-gray-600">299 proven prompts</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="text-green-600 text-2xl mb-2">🛠️</div>
                            <h4 class="font-semibold">Marketing Toolkit</h4>
                            <p class="text-sm text-gray-600">Templates & frameworks</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-purple-600 text-2xl mb-2">🎓</div>
                            <h4 class="font-semibold">Course Materials</h4>
                            <p class="text-sm text-gray-600">Videos & guides</p>
                        </div>
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <div class="text-yellow-600 text-2xl mb-2">📊</div>
                            <h4 class="font-semibold">Progress Tracker</h4>
                            <p class="text-sm text-gray-600">Monitor your growth</p>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <button onclick="dashboard.closeModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                            Browse All Resources
                        </button>
                    </div>
                </div>
            `
        });
    },
    
    // Start a specific day
    startDay(day) {
        console.log(`Starting Day ${day}`);
        
        // Update day status in UI
        const dayElement = document.querySelector(`[data-day="${day}"]`);
        if (dayElement) {
            const statusIcon = dayElement.querySelector('[data-status-icon]');
            if (statusIcon) {
                statusIcon.className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold bg-blue-500 text-white';
                statusIcon.textContent = day;
            }
        }
        
        // Open lesson modal
        this.showModal({
            title: `Day ${day} Lesson`,
            content: `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">🚀</div>
                    <h3 class="text-xl font-bold mb-4">Starting Day ${day}</h3>
                    <p class="text-gray-600 mb-6">Ready to dive into today's AI lesson?</p>
                    <button onclick="dashboard.closeModal(); dashboard.markDayCompleted(${day})" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
                        Complete Day ${day}
                    </button>
                </div>
            `
        });
    },
    
    // Continue a day
    continueDay(day) {
        console.log(`Continuing Day ${day}`);
        this.startDay(day); // Same as start for demo
    },
    
    // Review a completed day
    reviewDay(day) {
        console.log(`Reviewing Day ${day}`);
        
        this.showModal({
            title: `Day ${day} Review`,
            content: `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">✅</div>
                    <h3 class="text-xl font-bold mb-4">Day ${day} Completed!</h3>
                    <p class="text-gray-600 mb-6">Great job! Review your progress and key learnings.</p>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <h4 class="font-semibold text-green-800 mb-2">What You Learned:</h4>
                        <ul class="text-left text-green-700 text-sm space-y-1">
                            <li>• AI fundamentals and terminology</li>
                            <li>• Goal setting for AI success</li>
                            <li>• First steps with AI tools</li>
                        </ul>
                    </div>
                    <button onclick="dashboard.closeModal()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Close Review
                    </button>
                </div>
            `
        });
    },
    
    // Mark day as completed
    markDayCompleted(day) {
        console.log(`Marking Day ${day} as completed`);
        
        // Update day status in UI
        const dayElement = document.querySelector(`[data-day="${day}"]`);
        if (dayElement) {
            const statusIcon = dayElement.querySelector('[data-status-icon]');
            if (statusIcon) {
                statusIcon.className = 'w-10 h-10 rounded-full flex items-center justify-center font-bold bg-green-500 text-white';
                statusIcon.textContent = '✓';
            }
            
            // Update action button
            const actionBtn = dayElement.querySelector('[data-day-action]');
            if (actionBtn) {
                actionBtn.textContent = 'Review';
                actionBtn.dataset.dayAction = 'review';
                actionBtn.className = 'text-blue-600 hover:text-blue-700 text-sm font-medium';
            }
        }
        
        // Update progress counters
        this.updateProgress();
        
        // Show celebration
        this.showCelebration(day);
    },
    
    // Show completion celebration
    showCelebration(day) {
        this.showModal({
            title: 'Congratulations! 🎉',
            content: `
                <div class="text-center py-8">
                    <div class="text-8xl mb-4">🎉</div>
                    <h3 class="text-2xl font-bold mb-4">Day ${day} Complete!</h3>
                    <p class="text-gray-600 mb-6">You're one step closer to AI mastery. Keep up the great work!</p>
                    <div class="bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg mb-6">
                        <p class="font-semibold">🏆 Achievement Unlocked: Day ${day} Master</p>
                    </div>
                    <button onclick="dashboard.closeModal()" class="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-semibold">
                        Continue Journey
                    </button>
                </div>
            `
        });
    },
    
    // Update progress counters
    updateProgress() {
        // This would typically make an API call to save progress
        console.log('Updating progress counters');
        
        // Update local progress display
        const completedElements = document.querySelectorAll('[data-status="completed"]');
        const completedCount = completedElements.length;
        
        // Update progress percentage
        const progressElement = document.querySelector('[data-progress-percentage]');
        if (progressElement) {
            const percentage = Math.round((completedCount / 28) * 100);
            progressElement.textContent = `${percentage}%`;
        }
    },
    
    // Show modal
    showModal({ title, content }) {
        // Remove existing modal
        const existingModal = document.getElementById('dashboard-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'dashboard-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-md w-full shadow-2xl">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">${title}</h2>
                        <button onclick="dashboard.closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                    <div>${content}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    },
    
    // Close modal
    closeModal() {
        const modal = document.getElementById('dashboard-modal');
        if (modal) {
            modal.remove();
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window !== 'undefined') {
        window.dashboard = dashboard;
        dashboard.init();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dashboard;
}