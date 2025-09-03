// Simple Quiz Implementation for AI TechStep Challenge
let quizData = null;
let currentQuestion = 0;
let selectedAnswers = [];
let userScores = {
    digital_product: 0,
    service: 0,
    ecommerce: 0,
    consulting: 0
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing quiz...');
    initializeQuiz();
});

async function initializeQuiz() {
    console.log('Starting quiz initialization...');
    try {
        const response = await fetch('/api/quiz-data?lang=en');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Quiz data loaded:', data);
        
        if (data.success && data.questions) {
            quizData = data;
            console.log('Questions count:', data.questions.length);
            setupQuiz();
        } else {
            throw new Error('Invalid quiz data structure');
        }
    } catch (error) {
        console.error('Quiz initialization error:', error);
        showError('Unable to load quiz questions. Please refresh the page.');
    }
}

function setupQuiz() {
    console.log('Setting up quiz interface...');
    const questionContainer = document.getElementById('question-container');
    if (!questionContainer) {
        console.error('Question container not found!');
        showError('Quiz interface not ready. Please refresh the page.');
        return;
    }
    
    const sessionId = questionContainer.dataset.sessionId;
    const lang = questionContainer.dataset.lang;
    const initialAnswer = questionContainer.dataset.initialAnswer;
    
    console.log('Quiz setup data:', { sessionId, lang, initialAnswer });
    
    if (initialAnswer) {
        console.log('Handling initial answer:', initialAnswer);
        handleInitialAnswer(initialAnswer);
    } else {
        console.log('No initial answer, showing first question');
        displayQuestion(0);
    }
}

function handleInitialAnswer(answer) {
    console.log('Processing initial answer:', answer);
    const firstQuestion = quizData.questions[0];
    
    if (!firstQuestion) {
        console.error('First question not found');
        displayQuestion(0);
        return;
    }
    
    const selectedOption = firstQuestion.options.find(opt => {
        const optionText = opt.text.toLowerCase();
        return (answer === 'yes' && optionText.includes('yes')) ||
               (answer === 'no' && optionText.includes('no'));
    });
    
    if (selectedOption) {
        console.log('Found matching option:', selectedOption);
        selectAnswer(selectedOption, 0);
        
        if (answer === 'yes') {
            showEncouragement('ai-knowledge');
        } else {
            showEncouragement('beginner');
        }
    } else {
        console.log('No matching option found, showing question');
        displayQuestion(0);
    }
}

function displayQuestion(questionIndex) {
    console.log('Displaying question', questionIndex);
    
    if (!quizData || !quizData.questions || !quizData.questions[questionIndex]) {
        console.error('Question not available:', questionIndex);
        showError('Question not found. Please try again.');
        return;
    }
    
    const question = quizData.questions[questionIndex];
    currentQuestion = questionIndex;
    
    // Update progress
    updateProgress(questionIndex + 1, quizData.questions.length);
    
    // Update question text
    const questionText = document.getElementById('question-text');
    const questionSubtitle = document.getElementById('question-subtitle');
    
    if (questionText) {
        questionText.textContent = question.text || '';
        console.log('Question text set:', question.text);
    }
    
    if (questionSubtitle) {
        if (question.subtitle) {
            questionSubtitle.textContent = question.subtitle;
            questionSubtitle.classList.remove('hidden');
        } else {
            questionSubtitle.classList.add('hidden');
        }
    }
    
    // Display options
    displayOptions(question.options, questionIndex);
    
    // Update navigation buttons
    updateNavigationButtons(questionIndex);
    
    // Show question container
    showContainer('question-container');
    console.log('Question displayed successfully');
}

function displayOptions(options, questionIndex) {
    console.log('Displaying options for question', questionIndex);
    const optionsContainer = document.getElementById('options-container');
    if (!optionsContainer) {
        console.error('Options container not found');
        return;
    }
    
    optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.className = 'w-full text-left p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500';
        optionElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="font-medium text-gray-900">${option.text}</div>
                    ${option.description ? `<div class="text-sm text-gray-600 mt-1">${option.description}</div>` : ''}
                </div>
                <div class="ml-4">
                    <div class="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <div class="w-3 h-3 bg-blue-500 rounded-full hidden option-selected"></div>
                    </div>
                </div>
            </div>
        `;
        
        optionElement.addEventListener('click', () => {
            selectAnswer(option, questionIndex);
        });
        
        // Check if this option was previously selected
        if (selectedAnswers[questionIndex] && selectedAnswers[questionIndex].value === option.value) {
            selectOptionVisually(optionElement);
        }
        
        optionsContainer.appendChild(optionElement);
    });
    
    console.log('Options displayed:', options.length);
}

function selectAnswer(option, questionIndex) {
    console.log('Answer selected:', option.text, 'for question', questionIndex);
    selectedAnswers[questionIndex] = option;
    
    // Update visual selection
    const optionsContainer = document.getElementById('options-container');
    const optionButtons = optionsContainer.querySelectorAll('button');
    
    optionButtons.forEach((btn, index) => {
        const currentOption = quizData.questions[questionIndex].options[index];
        if (currentOption && currentOption.value === option.value) {
            selectOptionVisually(btn);
        } else {
            deselectOptionVisually(btn);
        }
    });
    
    // Update scores
    updateScores(option);
    
    // Enable next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

function selectOptionVisually(optionElement) {
    optionElement.classList.add('border-blue-500', 'bg-blue-50');
    const indicator = optionElement.querySelector('.option-selected');
    if (indicator) {
        indicator.classList.remove('hidden');
    }
}

function deselectOptionVisually(optionElement) {
    optionElement.classList.remove('border-blue-500', 'bg-blue-50');
    const indicator = optionElement.querySelector('.option-selected');
    if (indicator) {
        indicator.classList.add('hidden');
    }
}

function updateScores(option) {
    if (option.tracks) {
        option.tracks.forEach(track => {
            userScores[track] += option.value;
        });
    }
    console.log('Updated scores:', userScores);
}

function updateProgress(current, total) {
    const currentQ = document.getElementById('current-q');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    
    if (currentQ) currentQ.textContent = current;
    
    const percentage = Math.round((current / total) * 100);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
    if (progressPercent) {
        progressPercent.textContent = percentage;
    }
}

function updateNavigationButtons(questionIndex) {
    const backBtn = document.getElementById('back-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (backBtn) {
        backBtn.disabled = questionIndex === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = !selectedAnswers[questionIndex];
        
        if (questionIndex === quizData.questions.length - 1) {
            nextBtn.textContent = 'Get My Results →';
        } else {
            nextBtn.textContent = 'Next →';
        }
    }
}

function nextQuestion() {
    console.log('Next question clicked, current:', currentQuestion);
    const nextBtn = document.getElementById('next-btn');
    if (!nextBtn || nextBtn.disabled) return;
    
    if (currentQuestion < quizData.questions.length - 1) {
        // Show encouragement after first question
        if (currentQuestion === 0) {
            const answer = selectedAnswers[0];
            if (answer && answer.text.toLowerCase().includes('no')) {
                showEncouragement('beginner');
                return;
            } else if (answer && answer.text.toLowerCase().includes('yes')) {
                showEncouragement('ai-knowledge');
                return;
            }
        }
        
        // Add mid-quiz encouragement at strategic points
        if (currentQuestion === 5) {
            showMidQuizEncouragement();
            return;
        } else if (currentQuestion === 10) {
            showProgressEncouragement();
            return;
        } else if (currentQuestion === 15) {
            showFinalStretchEncouragement();
            return;
        }
        
        displayQuestion(currentQuestion + 1);
    } else {
        showResults();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        displayQuestion(currentQuestion - 1);
    }
}

function showEncouragement(type) {
    console.log('Showing encouragement:', type);
    let containerId = '';
    
    if (type === 'beginner') {
        containerId = 'encouragement-container';
    } else if (type === 'ai-knowledge') {
        containerId = 'ai-knowledge-encouragement';
    }
    
    if (containerId) {
        showContainer(containerId);
    }
}

function continueQuiz() {
    console.log('Continue quiz clicked');
    displayQuestion(currentQuestion + 1);
}

function showResults() {
    console.log('Showing results, scores:', userScores);
    
    // Calculate readiness score
    const totalScore = Object.values(userScores).reduce((sum, score) => sum + score, 0);
    const maxPossibleScore = quizData.questions.length * 10;
    const readinessPercentage = Math.round((totalScore / maxPossibleScore) * 100);
    
    // Update readiness display with more encouraging language
    const readinessLevel = document.getElementById('readiness-level');
    const readinessResult = document.getElementById('readiness-result');
    
    if (readinessLevel && readinessResult) {
        if (readinessPercentage >= 80) {
            readinessLevel.textContent = 'LAUNCH READY!';
            readinessResult.textContent = 'Advanced Creator';
        } else if (readinessPercentage >= 60) {
            readinessLevel.textContent = 'PERFECT!';
            readinessResult.textContent = 'Ready Creator';
        } else {
            readinessLevel.textContent = 'EXCELLENT!';
            readinessResult.textContent = 'Emerging Creator';
        }
    }
    
    // Update other metrics
    updateProfileMetrics();
    
    showContainer('results-container');
}

function updateProfileMetrics() {
    const focusLevel = document.getElementById('focus-level');
    const aiKnowledgeLevel = document.getElementById('ai-knowledge-level');
    
    const firstAnswer = selectedAnswers[0];
    
    if (focusLevel) {
        focusLevel.textContent = 'High';
    }
    
    if (aiKnowledgeLevel) {
        if (firstAnswer && firstAnswer.text.toLowerCase().includes('yes')) {
            aiKnowledgeLevel.textContent = 'Medium';
            aiKnowledgeLevel.className = 'text-xl font-bold text-orange-500';
        } else {
            aiKnowledgeLevel.textContent = 'Beginner';
            aiKnowledgeLevel.className = 'text-xl font-bold text-blue-600';
        }
    }
}

function continueToPersonalization() {
    showContainer('special-achievement-container');
    
    const userGoalElement = document.getElementById('user-goal');
    if (userGoalElement) {
        const goalAnswer = selectedAnswers.find(answer => 
            answer && (answer.text.includes('income') || answer.text.includes('education') || answer.text.includes('career'))
        );
        
        if (goalAnswer) {
            userGoalElement.textContent = goalAnswer.text;
        }
    }
}

function showEmailForm() {
    showContainer('email-form-container');
    
    const emailInput = document.getElementById('user-email');
    if (emailInput) {
        emailInput.focus();
    }
}

async function submitEmail() {
    console.log('Submitting email...');
    const emailInput = document.getElementById('user-email');
    const nameInput = document.getElementById('user-name');
    const submitBtn = document.getElementById('email-submit-btn');
    
    if (!emailInput || !emailInput.value.trim()) {
        showError('Please enter your email address');
        return;
    }
    
    const email = emailInput.value.trim();
    
    if (nameInput.classList.contains('hidden')) {
        nameInput.classList.remove('hidden');
        nameInput.focus();
        submitBtn.textContent = 'GET MY AI TECHSTEP CHALLENGE!';
        return;
    }
    
    const name = nameInput.value.trim();
    const userGoal = document.getElementById('user-goal')?.textContent || 'Create passive income with AI';
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        const questionContainer = document.getElementById('question-container');
        const sessionId = questionContainer.dataset.sessionId;
        
        const response = await fetch('/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: sessionId,
                email: email,
                name: name,
                userGoal: userGoal,
                language: 'en',
                results: {
                    selectedAnswers: selectedAnswers,
                    scores: userScores
                }
            })
        });
        
        const result = await response.json();
        console.log('Quiz submission result:', result);
        
        if (result.success) {
            window.location.href = result.redirectUrl;
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
        showError('Unable to submit quiz. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'GET MY AI TECHSTEP CHALLENGE!';
    }
}

function showContainer(containerId) {
    console.log('Showing container:', containerId);
    const containers = [
        'question-container',
        'encouragement-container', 
        'ai-knowledge-encouragement',
        'mid-quiz-encouragement',
        'progress-encouragement', 
        'final-stretch-encouragement',
        'results-container',
        'special-achievement-container',
        'email-form-container'
    ];
    
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.classList.add('hidden');
        }
    });
    
    const targetContainer = document.getElementById(containerId);
    if (targetContainer) {
        targetContainer.classList.remove('hidden');
    }
}

function showError(message) {
    console.error('Quiz Error:', message);
    
    const questionContainer = document.getElementById('question-container');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="text-center py-8">
                <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 class="text-xl font-bold text-red-800 mb-4">Unable to load quiz</h3>
                    <p class="text-red-700 mb-4">${message}</p>
                    <button onclick="window.location.reload()" class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
    }
}

// Additional encouragement functions
function showMidQuizEncouragement() {
    console.log('Showing mid-quiz encouragement');
    const container = document.createElement('div');
    container.id = 'mid-quiz-encouragement';
    container.className = 'text-center py-8';
    container.innerHTML = `
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
            <div class="text-4xl mb-4">🎯</div>
            <h3 class="text-xl font-bold text-purple-800 mb-4">You're building something real right now!</h3>
            <p class="text-purple-700 leading-relaxed mb-4">
                Every answer is mapping your perfect launch strategy. I can already see your AI business taking shape.
            </p>
            <div class="bg-white rounded-lg p-4 border border-purple-300 mb-4">
                <p class="text-purple-800 font-semibold text-sm">"Small action beats endless research"</p>
            </div>
            <button onclick="continueQuiz()" class="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 font-bold text-lg transition-all duration-200 transform hover:scale-105">
                🚀 Keep Building My Plan →
            </button>
        </div>
    `;
    
    const questionContainer = document.getElementById('question-container').parentNode;
    questionContainer.appendChild(container);
    showContainer('mid-quiz-encouragement');
}

function showProgressEncouragement() {
    console.log('Showing progress encouragement');
    const container = document.createElement('div');
    container.id = 'progress-encouragement';
    container.className = 'text-center py-8';
    container.innerHTML = `
        <div class="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-8 border border-green-200">
            <div class="text-4xl mb-4">🏃‍♀️</div>
            <h3 class="text-xl font-bold text-green-800 mb-4">Halfway there, Creator!</h3>
            <p class="text-green-700 leading-relaxed mb-4">
                You're not just taking a quiz—you're designing your launch strategy. Each question gets you closer to your first $1K.
            </p>
            <div class="bg-gradient-to-r from-green-100 to-teal-100 rounded-lg p-4 mb-4">
                <p class="text-green-800 font-semibold">🎯 "Done is better than perfect. You're a Creator now."</p>
            </div>
            <button onclick="continueQuiz()" class="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 font-bold text-lg transition-all duration-200 transform hover:scale-105">
                💪 Almost There! Continue →
            </button>
        </div>
    `;
    
    const questionContainer = document.getElementById('question-container').parentNode;
    questionContainer.appendChild(container);
    showContainer('progress-encouragement');
}

function showFinalStretchEncouragement() {
    console.log('Showing final stretch encouragement');
    const container = document.createElement('div');
    container.id = 'final-stretch-encouragement';
    container.className = 'text-center py-8';
    container.innerHTML = `
        <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-200">
            <div class="text-4xl mb-4">🔥</div>
            <h3 class="text-xl font-bold text-orange-800 mb-4">Final stretch! Your launch plan is almost ready!</h3>
            <p class="text-orange-700 leading-relaxed mb-4">
                You've been thinking like a Creator this whole time. Five more questions and you'll have your personalized blueprint.
            </p>
            <div class="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4 mb-4">
                <p class="text-orange-800 font-semibold">🚀 "I already started. I've already won. Let's finish this."</p>
            </div>
            <button onclick="continueQuiz()" class="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-bold text-lg transition-all duration-200 transform hover:scale-105">
                🏁 Finish My Launch Plan →
            </button>
        </div>
    `;
    
    const questionContainer = document.getElementById('question-container').parentNode;
    questionContainer.appendChild(container);
    showContainer('final-stretch-encouragement');
}

// Payment flow function
async function proceedToPayment() {
    console.log('Proceeding to payment...');
    const emailInput = document.getElementById('user-email');
    const nameInput = document.getElementById('user-name');
    const paymentBtn = document.getElementById('payment-submit-btn');
    
    if (!emailInput || !emailInput.value.trim()) {
        showError('Please enter your email address');
        return;
    }
    
    const email = emailInput.value.trim();
    
    // If name is hidden, show it first
    if (nameInput && nameInput.classList.contains('hidden')) {
        nameInput.classList.remove('hidden');
        nameInput.focus();
        paymentBtn.textContent = '💳 Continue to Secure Payment ($19.99)';
        paymentBtn.onclick = proceedToPayment; // Keep the same function
        return;
    }
    
    const name = nameInput ? nameInput.value.trim() : '';
    const userGoal = document.getElementById('user-goal')?.textContent || 'Create passive income with AI';
    
    paymentBtn.disabled = true;
    paymentBtn.textContent = 'Processing...';
    
    try {
        const questionContainer = document.getElementById('question-container');
        const sessionId = questionContainer.dataset.sessionId;
        
        // Submit quiz data first
        const quizResponse = await fetch('/api/submit-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sessionId: sessionId,
                email: email,
                name: name,
                userGoal: userGoal,
                language: 'en',
                results: {
                    selectedAnswers: selectedAnswers,
                    scores: userScores
                }
            })
        });
        
        const result = await quizResponse.json();
        console.log('Quiz submission result:', result);
        
        if (result.success) {
            // Redirect to Stripe checkout instead of scratch card
            window.location.href = `/payment?session=${sessionId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&goal=${encodeURIComponent(userGoal)}`;
        } else {
            throw new Error('Quiz submission failed');
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        showError('Unable to process payment. Please try again.');
        paymentBtn.disabled = false;
        paymentBtn.textContent = '🚀 Get My AI TechStep Challenge - $19.99';
    }
}

// Global functions
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.continueQuiz = continueQuiz;
window.continueToPersonalization = continueToPersonalization;
window.showEmailForm = showEmailForm;
window.submitEmail = submitEmail;
window.proceedToPayment = proceedToPayment;
window.showMidQuizEncouragement = showMidQuizEncouragement;
window.showProgressEncouragement = showProgressEncouragement;
window.showFinalStretchEncouragement = showFinalStretchEncouragement;