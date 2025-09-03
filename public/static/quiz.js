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
  
  document.getElementById('question-text').textContent = question.text[quizState.lang] || question.text.en;
  
  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, optionIndex) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'bg-white/5 hover:bg-white/10 border-2 border-transparent hover:border-purple-400 rounded-lg p-4 cursor-pointer transition-all duration-200';
    optionDiv.onclick = () => selectOption(optionIndex, option.value);
    optionDiv.innerHTML = `
      <div class="flex items-center">
        <div class="w-4 h-4 border-2 border-white rounded-full mr-4 flex items-center justify-center">
          <div class="w-2 h-2 bg-white rounded-full hidden"></div>
        </div>
        <span>${option.text[quizState.lang] || option.text.en}</span>
      </div>
    `;
    optionsContainer.appendChild(optionDiv);
  });
  
  document.getElementById('back-btn').disabled = index === 0;
  updateNextButton();
}

function selectOption(optionIndex, value) {
  // Update UI
  document.querySelectorAll('#options-container > div').forEach((div, index) => {
    const circle = div.querySelector('div > div');
    if (index === optionIndex) {
      div.classList.add('border-purple-400', 'bg-white/10');
      circle.classList.remove('hidden');
    } else {
      div.classList.remove('border-purple-400', 'bg-white/10');
      circle.classList.add('hidden');
    }
  });
  
  // Store answer
  quizState.selectedAnswers[quizState.currentQuestion] = { optionIndex, value };
  updateNextButton();
}

function updateNextButton() {
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = !quizState.selectedAnswers[quizState.currentQuestion];
  
  if (quizState.currentQuestion === quizState.questions.length - 1 && quizState.selectedAnswers[quizState.currentQuestion]) {
    nextBtn.textContent = 'See Results 🎉';
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
    digital_product: '🎓 Digital Product Creator',
    service: '⚡ AI Service Provider', 
    ecommerce: '🛍️ E-commerce Entrepreneur',
    consulting: '🧠 AI Strategy Consultant'
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