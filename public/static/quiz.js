// Quiz functionality for AI Income Builder v1.0

let quizState = {
  sessionId: null,
  questions: [],
  lang: 'en',
  trackDescriptions: {},
  currentQuestion: 0,
  selectedAnswers: []
};

async function initializeQuiz() {
  // Get quiz data from data attributes
  const container = document.getElementById('question-container');
  if (container) {
    quizState.sessionId = container.dataset.sessionId;
    quizState.lang = container.dataset.lang || 'en';
  }
  
  // Fetch quiz questions and track descriptions via API
  try {
    const response = await fetch('/api/quiz-data?lang=' + quizState.lang);
    const data = await response.json();
    
    if (data.success) {
      quizState.questions = data.questions;
      quizState.trackDescriptions = data.trackDescriptions;
      
      // Load first question
      loadQuestion(0);
    } else {
      console.error('Failed to load quiz data:', data.error);
      alert('Failed to load quiz. Please refresh the page.');
    }
  } catch (error) {
    console.error('Failed to fetch quiz data:', error);
    alert('Network error. Please refresh the page.');
  }
}

function loadQuestion(index) {
  const question = quizState.questions[index];
  if (!question) return;
  
  document.getElementById('current-q').textContent = index + 1;
  document.getElementById('progress-percent').textContent = Math.round(((index + 1) / quizState.questions.length) * 100);
  document.getElementById('progress-bar').style.width = ((index + 1) / quizState.questions.length) * 100 + '%';
  
  // Add question type styling for better B2C appeal
  const questionText = question.text[quizState.lang] || question.text.en;
  const isFirstQuestion = index === 0;
  
  if (isFirstQuestion) {
    document.getElementById('question-text').innerHTML = `
      <div class="text-center mb-6">
        <span class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
          🚀 QUESTION ${index + 1}
        </span>
      </div>
      <div class="text-3xl font-bold text-center mb-4">${questionText}</div>
    `;
  } else {
    document.getElementById('question-text').innerHTML = `
      <div class="text-center mb-4">
        <span class="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
          QUESTION ${index + 1} OF 20
        </span>
      </div>
      <div class="text-xl font-semibold text-center">${questionText}</div>
    `;
  }
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, optionIndex) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'border-2 border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transform hover:scale-105 shadow-sm hover:shadow-md';
    optionDiv.onclick = () => selectOption(optionIndex, option.value);
    
    // Special styling for first question (YES/NO)
    if (isFirstQuestion) {
      optionDiv.className = 'border-3 border-gray-300 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transform hover:scale-105 shadow-lg hover:shadow-xl';
      optionDiv.innerHTML = `
        <div class="text-center">
          <div class="text-4xl font-bold mb-2 ${optionIndex === 0 ? 'text-green-600' : 'text-blue-600'}">${option.text[quizState.lang] || option.text.en}</div>
        </div>
      `;
    } else {
      optionDiv.innerHTML = `
        <div class="flex items-start">
          <div class="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 mt-0.5 flex items-center justify-center flex-shrink-0">
            <div class="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hidden"></div>
          </div>
          <span class="text-gray-700 leading-relaxed font-medium">${option.text[quizState.lang] || option.text.en}</span>
        </div>
      `;
    }
    
    optionsContainer.appendChild(optionDiv);
  });
  
  document.getElementById('back-btn').disabled = index === 0;
  updateNextButton();
}

function selectOption(optionIndex, value) {
  // Update UI with more colorful B2C styling
  document.querySelectorAll('#options-container > div').forEach((div, index) => {
    const circle = div.querySelector('.w-6') || div.querySelector('.w-5'); // Handle both circle sizes
    const innerCircle = circle?.querySelector('div');
    
    if (index === optionIndex) {
      div.classList.add('border-purple-600', 'bg-gradient-to-r', 'from-purple-100', 'to-blue-100', 'shadow-lg');
      div.classList.remove('border-gray-200', 'border-gray-300');
      if (innerCircle) {
        innerCircle.classList.remove('hidden');
      }
      
      // Add celebration animation for selection
      div.style.animation = 'pulse 0.3s ease-in-out';
      setTimeout(() => {
        div.style.animation = '';
      }, 300);
    } else {
      div.classList.remove('border-purple-600', 'bg-gradient-to-r', 'from-purple-100', 'to-blue-100', 'shadow-lg');
      div.classList.add('border-gray-200');
      if (innerCircle) {
        innerCircle.classList.add('hidden');
      }
    }
  });
  
  // Store answer
  quizState.selectedAnswers[quizState.currentQuestion] = { optionIndex, value };
  updateNextButton();
  
  // Add some encouragement for progress
  if (quizState.currentQuestion === 0) {
    setTimeout(() => {
      const nextBtn = document.getElementById('next-btn');
      nextBtn.innerHTML = '🎯 Amazing! Continue →';
    }, 500);
  }
}

function updateNextButton() {
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = !quizState.selectedAnswers[quizState.currentQuestion];
  
  if (quizState.currentQuestion === quizState.questions.length - 1 && quizState.selectedAnswers[quizState.currentQuestion]) {
    nextBtn.innerHTML = '🎉 See My AI Path →';
    nextBtn.classList.add('animate-pulse');
  } else if (quizState.selectedAnswers[quizState.currentQuestion]) {
    // Progressive encouragement throughout the quiz
    if (quizState.currentQuestion < 5) {
      nextBtn.innerHTML = 'Continue 🚀';
    } else if (quizState.currentQuestion < 10) {
      nextBtn.innerHTML = 'Keep Going! 💪';
    } else if (quizState.currentQuestion < 15) {
      nextBtn.innerHTML = 'Almost There! ⚡';
    } else {
      nextBtn.innerHTML = 'Final Steps! 🎯';
    }
    nextBtn.classList.remove('animate-pulse');
  } else {
    nextBtn.innerHTML = 'Continue 🚀';
    nextBtn.classList.remove('animate-pulse');
  }
}

function nextQuestion() {
  if (!quizState.selectedAnswers[quizState.currentQuestion]) return;
  
  if (quizState.currentQuestion < quizState.questions.length - 1) {
    quizState.currentQuestion++;
    loadQuestion(quizState.currentQuestion);
  } else {
    showResults();
  }
}

function previousQuestion() {
  if (quizState.currentQuestion > 0) {
    quizState.currentQuestion--;
    loadQuestion(quizState.currentQuestion);
  }
}

async function showResults() {
  // Calculate scores
  const scores = { digital_product: 0, service: 0, ecommerce: 0, consulting: 0 };
  
  quizState.selectedAnswers.forEach((answer, index) => {
    const question = quizState.questions[index];
    const option = question.options[answer.optionIndex];
    option.tracks.forEach(track => {
      scores[track] += option.value;
    });
  });
  
  // Find best track
  const trackEntries = Object.entries(scores);
  const [bestTrack, bestScore] = trackEntries.reduce((a, b) => a[1] > b[1] ? a : b);
  
  // Show results
  document.getElementById('question-container').classList.add('hidden');
  document.getElementById('results-container').classList.remove('hidden');
  
  const trackNames = {
    digital_product: '🚀 AI Digital Product Creator',
    service: '💼 AI Service Provider', 
    ecommerce: '🛒 AI E-commerce Entrepreneur',
    consulting: '🎯 AI Strategy Consultant'
  };
  
  document.getElementById('track-name').textContent = trackNames[bestTrack];
  document.getElementById('track-description').textContent = quizState.trackDescriptions[bestTrack][quizState.lang] || quizState.trackDescriptions[bestTrack].en;
  
  // Store results in global object
  window.quizResults = { bestTrack, scores, selectedAnswers: quizState.selectedAnswers };
}

async function submitQuiz() {
  const email = document.getElementById('user-email').value;
  if (!email) {
    alert('Please enter your email address');
    return;
  }
  
  try {
    const response = await fetch('/api/submit-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: quizState.sessionId,
        email,
        results: window.quizResults,
        language: quizState.lang
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      window.location.href = '/checkout?session=' + quizState.sessionId + '&email=' + encodeURIComponent(email);
    } else {
      alert('Error: ' + (result.error || 'Please try again'));
    }
  } catch (error) {
    alert('Network error. Please try again.');
  }
}

// Make functions available globally for onclick handlers
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.selectOption = selectOption;
window.submitQuiz = submitQuiz;
window.initializeQuiz = initializeQuiz;