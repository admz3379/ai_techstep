import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, QuizSession, TrackScores, User, QuizResult, Language, TrackType } from './types'
import { aiTechStepQuizQuestions, aiTechStepTrackDescriptions } from './simple-quiz-data'
import { renderer } from './renderer'

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS and add renderer
app.use('*', cors())
app.use('*', renderer)

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Database helper functions
async function createUser(env: Bindings, email: string, name?: string, language: Language = 'en'): Promise<number> {
  const result = await env.DB.prepare(`
    INSERT INTO users (email, name, language) VALUES (?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET name = ?, language = ?, updated_at = CURRENT_TIMESTAMP
    RETURNING id
  `).bind(email, name, language, name, language).first<{ id: number }>();
  
  return result?.id || 0;
}

async function getUserByEmail(env: Bindings, email: string): Promise<User | null> {
  return await env.DB.prepare(`
    SELECT * FROM users WHERE email = ?
  `).bind(email).first<User>();
}

async function saveQuizResponse(env: Bindings, userId: number, sessionId: string, questionId: number, answerValue: number, answerText?: string) {
  await env.DB.prepare(`
    INSERT INTO quiz_responses (user_id, session_id, question_id, answer_value, answer_text)
    VALUES (?, ?, ?, ?, ?)
  `).bind(userId, sessionId, questionId, answerValue, answerText).run();
}

async function calculateTrackScores(env: Bindings, sessionId: string): Promise<TrackScores> {
  const responses = await env.DB.prepare(`
    SELECT qr.question_id, qr.answer_value, qr.answer_text
    FROM quiz_responses qr
    WHERE qr.session_id = ?
    ORDER BY qr.question_id
  `).bind(sessionId).all();

  const scores: TrackScores = {
    digital_product: 0,
    service: 0,
    ecommerce: 0,
    consulting: 0
  };

  responses.results?.forEach((response: any) => {
    const question = aiTechStepQuizQuestions.find(q => q.id === response.question_id);
    if (question) {
      const selectedOption = question.options.find(opt => opt.value === response.answer_value);
      if (selectedOption) {
        selectedOption.tracks.forEach(track => {
          scores[track] += selectedOption.value;
        });
      }
    }
  });

  return scores;
}

async function assignUserTrack(env: Bindings, userId: number, scores: TrackScores): Promise<TrackType> {
  // Find the track with the highest score
  const trackEntries = Object.entries(scores) as [TrackType, number][];
  const [bestTrack, bestScore] = trackEntries.reduce((a, b) => a[1] > b[1] ? a : b);

  // Save the track assignment
  await env.DB.prepare(`
    INSERT INTO user_tracks (user_id, track_type, score) VALUES (?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET track_type = ?, score = ?, assigned_at = CURRENT_TIMESTAMP
  `).bind(userId, bestTrack, bestScore, bestTrack, bestScore).run();

  return bestTrack;
}

async function createUserProgress(env: Bindings, userId: number) {
  // Create 28-day progress for work-from-home parents
  for (let day = 1; day <= 28; day++) {
    const status = day === 1 ? 'unlocked' : 'locked';
    const unlockedAt = day === 1 ? new Date().toISOString() : null;
    
    await env.DB.prepare(`
      INSERT INTO user_progress (user_id, day, phase, status, unlocked_at) VALUES (?, ?, 'ai_mastery', ?, ?)
      ON CONFLICT(user_id, day, phase) DO NOTHING
    `).bind(userId, day, status, unlockedAt).run();
  }
}

async function deliverAssets(env: Bindings, userId: number, trackType: TrackType) {
  // Get admin assets for the user's track
  const assets = await env.DB.prepare(`
    SELECT * FROM admin_assets WHERE track_type = ?
  `).bind(trackType).all();

  // Deliver assets to user
  for (const asset of assets.results || []) {
    await env.DB.prepare(`
      INSERT INTO user_assets (user_id, asset_type, asset_name, asset_url, track_type)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, asset_name) DO NOTHING
    `).bind(userId, (asset as any).asset_type, (asset as any).name, (asset as any).file_url, trackType).run();
  }
}

// Homepage - Coursiv-style landing with trust indicators
app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.render(
    <div className="min-h-screen bg-white">
      {/* Clean header - Coursiv style - Mobile optimized */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              AI TechStep
            </div>
            <div className="text-xs sm:text-sm text-blue-600 font-medium px-2">"Step into AI Success - One Click at a Time"</div>
          </div>
        </div>
      </div>

      {/* Main content - Clean Coursiv style - Mobile optimized */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center">
        
        {/* Trust indicators - minimal - Mobile responsive */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded-full font-semibold">
            700k+ users' choice
          </div>
          <div className="font-medium">★★★★★ 4.5 Rated on Trustpilot</div>
        </div>
        
        {/* Main headline - Mobile optimized */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold inline-block mb-4 sm:mb-6">
            28-DAY AI CHALLENGE
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight px-2">
            Launch Your First $1K+ AI Project in 30 Days
          </h1>
          
          <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-4 px-2">
            "You bring the vision. We'll teach you the AI to bring it to life."
          </p>
          
          <p className="text-base sm:text-lg text-gray-600 mb-6 px-2">
            We don't teach AI. We help you launch your first income stream using AI—even if you've never touched a prompt before.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              🌱 "You already have everything it takes. AI is the tool. The next 4 weeks are your launchpad."
            </p>
          </div>
        </div>

        {/* Mobile Showcase Section */}
        <div className="mb-12 sm:mb-16">
          <div className="max-w-7xl mx-auto">
            
            {/* Global Network Banner - Optional subtle element */}
            <div className="text-center mb-6 opacity-70">
              <div className="flex justify-center items-center space-x-2 text-xs text-gray-500">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-xs">👋</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-white text-xs">Hi</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs">你好</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-white text-xs">مرحبا</div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center justify-center text-white text-xs">नमस्ते</div>
                </div>
                <span className="ml-2 global-greeting-text">Global AI community</span>
              </div>
            </div>

            {/* Desktop: 2-column, Mobile: stacked */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Mobile: Device first, Desktop: Text first */}
              <div className="order-2 lg:order-1 text-center lg:text-left">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Built for desktop & mobile
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 mb-6">
                  Launch from anywhere—your 28-day plan fits your day.
                </p>
                <button 
                  className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 scroll-to-quiz"
                  onclick="document.querySelector('.bg-white.rounded-2xl.shadow-lg').scrollIntoView({ behavior: 'smooth' })"
                >
                  See how it works
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>

              {/* Device Mockup - Mobile first, Desktop second */}
              <div className="order-1 lg:order-2 relative">
                <div className="mobile-showcase-container relative">
                  
                  {/* Optional desktop browser frame (subtle, blurred background) */}
                  <div className="hidden lg:block absolute -top-4 -left-8 w-96 h-64 opacity-20 blur-sm">
                    <div className="bg-gray-800 rounded-lg p-2">
                      <div className="flex space-x-1 mb-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="bg-white h-52 rounded"></div>
                    </div>
                  </div>

                  {/* Phone mockup */}
                  <div className="mobile-phone-frame relative mx-auto w-fit transform hover:scale-105 transition-transform duration-300">
                    <picture>
                      <source 
                        media="(min-width: 1280px)" 
                        srcset="/static/mobile-mockup.svg"
                        sizes="480px"
                      />
                      <source 
                        media="(min-width: 768px)" 
                        srcset="/static/mobile-mockup.svg"
                        sizes="60vw"
                      />
                      <img 
                        src="/static/mobile-mockup.svg"
                        alt="AI TechStep mobile view showing the 28-Day AI Challenge"
                        className="max-w-full h-auto"
                        loading="lazy"
                        decoding="async"
                        sizes="90vw"
                        style={{ maxWidth: '320px', height: 'auto' }}
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Path Milestone Tracker - Mobile optimized */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-green-200">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">Your 30-Day Launch Journey</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm sm:text-base">1</div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">Week 1</div>
              <div className="text-xs sm:text-sm text-gray-600">Discover Your AI Idea</div>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm sm:text-base">2</div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">Week 2</div>
              <div className="text-xs sm:text-sm text-gray-600">Build Your Asset</div>
            </div>
            <div className="text-center">
              <div className="bg-orange-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm sm:text-base">3</div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">Week 3</div>
              <div className="text-xs sm:text-sm text-gray-600">Launch & Test</div>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-sm sm:text-base">4</div>
              <div className="font-semibold text-gray-800 text-sm sm:text-base">Week 4</div>
              <div className="text-xs sm:text-sm text-gray-600">Market & Monetize</div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-green-700 font-semibold mb-2 text-sm sm:text-base">🎯 Goal: Launch your first $1K+ project using AI</p>
            <p className="text-gray-600 text-xs sm:text-sm px-2">No coding. No experience. Just your idea + the tools to build it.</p>
          </div>
        </div>

        {/* Main question - Enhanced roleplay funnel with coach persona - Mobile optimized */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium inline-block mb-4">
              👋 Hey there! I'm your AI Launch Coach...
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 px-2">Quick question to get us started:</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-yellow-800 font-semibold mb-2 text-sm sm:text-base">🎯 \"I already started. I've already won. I trust this. Let's finish it.\"</p>
              <p className="text-yellow-700 text-xs sm:text-sm">This attitude shift changes everything. Ready?</p>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-2 px-2">HAVE YOU EVER USED AI?</h3>
            <p className="text-gray-600 text-sm sm:text-base px-2">Your answer unlocks your personalized launch path. No wrong answers—just different starting points.</p>
          </div>
          
          <div className="space-y-3 sm:space-y-4 max-w-lg mx-auto">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-1">
              <a href={`/quiz?lang=${lang}&answer=yes`} 
                 className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 sm:py-4 px-4 sm:px-8 rounded-lg text-base sm:text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[60px] flex flex-col justify-center">
                <span>🚀 YES - I've experimented with it</span>
                <div className="text-xs sm:text-sm font-normal opacity-90 mt-1">"Great! We'll build on what you know"</div>
              </a>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-1">
              <a href={`/quiz?lang=${lang}&answer=no`}
                 className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-8 rounded-lg text-base sm:text-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg min-h-[60px] flex flex-col justify-center">
                <span>✨ NO - I'm ready to start fresh</span>
                <div className="text-xs sm:text-sm font-normal opacity-90 mt-1">"Perfect! You're ahead of 80% already"</div>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4 sm:mt-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 sm:p-4">
              <p className="text-purple-800 font-semibold text-xs sm:text-sm">
                💡 Remember: This is not school—this is your launchpad. Every question gets you closer to your first $1K.
              </p>
            </div>
          </div>
        </div>

        {/* Simple social proof */}
        <div className="text-center mb-8">
          <div className="text-lg font-semibold text-gray-800 mb-2">
            Over 700,000 people chose AI TechStep
          </div>
          <div className="text-gray-600">Trusted by work-from-home parents worldwide</div>
        </div>

        {/* Legal footer */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
          By proceeding, you agree with <a href="/terms" className="underline hover:text-gray-700">Terms and Conditions</a>, 
          <a href="/privacy" className="underline hover:text-gray-700 ml-1">Privacy Policy</a>, 
          <a href="/payment-terms" className="underline hover:text-gray-700 ml-1">Payment Terms</a>, 
          <a href="/disclaimer" className="underline hover:text-gray-700 ml-1">Disclaimer</a><br/>
          <div className="mt-3">
            <strong>AI TechStep</strong>, Dallas, Texas • <span className="text-blue-600 font-medium">Powered by iPS</span>
          </div>
        </div>
      </div>
    </div>,
    { title: 'AI TechStep - Master AI Skills for Passive Income | Step into AI Success' }
  );
});

// Coursiv-style quiz with exact flow
app.get('/quiz', async (c) => {
  const lang = (c.req.query('lang') || 'en') as Language;
  const sessionId = crypto.randomUUID();
  const initialAnswer = c.req.query('answer'); // 'yes' or 'no' from homepage
  
  // Store quiz session in KV (if available)
  const quizSession: QuizSession = {
    session_id: sessionId,
    current_question: 0,
    responses: [],
    language: lang
  };
  
  try {
    if (c.env.KV) {
      await c.env.KV.put(`quiz_session:${sessionId}`, JSON.stringify(quizSession), { expirationTtl: 3600 });
    }
  } catch (e) {
    console.log('KV not available, continuing without session storage');
  }
  
  return c.render(
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Progress header - Mobile optimized */}
        <div className="text-center mb-4 sm:mb-8 quiz-progress-mobile">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              <span id="current-q">1</span> / 20
            </span>
            <div className="flex-1 mx-2 sm:mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div id="progress-bar" className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-500" style="width: 5%"></div>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-gray-600">
              <span id="progress-percent">5</span>%
            </span>
          </div>
        </div>

        {/* Question container - Mobile optimized */}
        <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100 mb-4 sm:mb-8">
          <div id="question-container" data-session-id={sessionId} data-lang={lang} data-initial-answer={initialAnswer}>
            
            <div id="question-text-container" className="text-center mb-6 sm:mb-8">
              <h2 id="question-text" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight px-2"></h2>
              <p id="question-subtitle" className="text-gray-600 text-sm sm:text-base hidden px-2"></p>
            </div>
            
            <div id="options-container" className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
              {/* Options will be populated by JavaScript */}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 sm:mt-12">
              <button 
                id="back-btn" 
                onclick="previousQuestion()" 
                className="w-full sm:w-auto px-4 sm:px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base min-h-[48px]" 
                disabled
              >
                ← Back
              </button>
              <button 
                id="next-btn" 
                onclick="nextQuestion()" 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base min-h-[48px]" 
                disabled
              >
                Next →
              </button>
            </div>
          </div>

          {/* Encouragement messages - shown between questions */}
          <div id="encouragement-container" className="hidden text-center py-8">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-4">Worry no more! We will help you to gain your confidence back</h3>
              <p className="text-green-700 leading-relaxed">
                Over 700,000 adults joined our AI challenge to improve their skills. Our challenge is backed by thousands 
                hours of research and content carefully crafted to your needs and skills!
              </p>
              <button onclick="continueQuiz()" className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold">
                Continue →
              </button>
            </div>
          </div>

          {/* AI Knowledge encouragement */}
          <div id="ai-knowledge-encouragement" className="hidden text-center py-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Great to hear that you already know how to use AI!</h3>
              <div className="text-sm text-blue-600 font-semibold mb-2">AI TechStep - "Step into AI Success"</div>
              <p className="text-blue-700 leading-relaxed">
                AI always evolves, we make sure that you learn the latest tools that you can apply in real life. 
                Our challenge combines 30+ various AI tools that you can use for any task, moreover we have multiple 
                practical lessons how you can apply AI to explore new income opportunities.
              </p>
              <button onclick="continueQuiz()" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold">
                Continue →
              </button>
            </div>
          </div>

          {/* Results container - AI Experience Profile */}
          <div id="results-container" className="hidden">
            <div className="text-center">
              
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Here's Your AI Experience Profile</h2>
              
              {/* Readiness Score Dashboard */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Readiness score</h3>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  <span id="readiness-level">Perfect</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">Result: <span id="readiness-result">Intermediate</span></div>
                
                <div className="text-lg font-semibold text-green-700 mb-4">
                  Impressive score to succeed in AI
                </div>
                
                <div className="bg-white rounded-lg p-4 text-sm text-gray-700">
                  A recent study by PwC in 2024 revealed that professionals in AI-related roles earn, 
                  on average, 25% more in the United States than their peers in similar positions without AI expertise.
                </div>
              </div>

              {/* Profile metrics */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-1">Motivation</div>
                  <div className="text-xl font-bold text-green-600">High</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-1">Potential</div>
                  <div className="text-xl font-bold text-green-600">High</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-1">Focus</div>
                  <div className="text-xl font-bold text-orange-500" id="focus-level">Limited</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-1">AI Knowledge</div>
                  <div className="text-xl font-bold text-blue-600" id="ai-knowledge-level">Low</div>
                </div>
              </div>

              <button 
                onclick="continueToPersonalization()" 
                className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                Continue →
              </button>
            </div>
          </div>

          {/* Personal Launch Plan */}
          <div id="special-achievement-container" className="hidden text-center py-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                🎯 Your Personal 30-Day Launch Plan
              </h2>
              
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-8 border border-green-200 mb-6">
                <div className="text-center mb-6">
                  <div className="text-lg text-blue-700 font-semibold mb-2">
                    💡 "You already have everything it takes. AI is the tool."
                  </div>
                  <p className="text-gray-700 mb-4">
                    Based on your answers, here's your customized launch strategy:
                  </p>
                </div>
                
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Launch Focus</h3>
                  <div className="text-gray-700 mb-4">
                    Primary Goal: <span id="user-goal" className="font-semibold text-blue-600">Launch your first $1K+ AI project</span>
                  </div>
                  
                  {/* Success Path Tracker */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded text-xs font-medium">
                      Week 1<br/>Discover
                    </div>
                    <div className="bg-purple-100 text-purple-800 p-2 rounded text-xs font-medium">
                      Week 2<br/>Build
                    </div>
                    <div className="bg-orange-100 text-orange-800 p-2 rounded text-xs font-medium">
                      Week 3<br/>Launch
                    </div>
                    <div className="bg-green-100 text-green-800 p-2 rounded text-xs font-medium">
                      Week 4<br/>Monetize
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    ✅ Small action beats endless research<br/>
                    ✅ Done is better than perfect<br/>
                    ✅ You're a Creator now—this is your launchpad
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <h4 className="font-bold text-yellow-800 mb-3">🚀 Your Immediate Next Step:</h4>
                  <div className="bg-white rounded-lg p-3 mb-3">
                    <div className="text-sm text-yellow-700 font-semibold">"I already started. I've already won. I trust this."</div>
                  </div>
                  <div className="text-yellow-700 text-sm space-y-1">
                    <div>✅ Get your personalized launch templates</div>
                    <div>✅ Start Week 1 action steps (15 min today)</div>
                    <div>✅ Join your Creator Community</div>
                    <div>✅ Access your $1K project blueprint</div>
                  </div>
                  <p className="text-yellow-800 font-semibold text-sm mt-2">
                    No more waiting. No more research. Let's launch something real.
                  </p>
                </div>
              </div>
              
              <div className="text-lg font-semibold text-gray-800 mb-2">
                Join 700,000+ people who've already started their launch
              </div>
              <div className="text-gray-600 text-sm mb-6">
                "I already started. I've already won. I trust this. Let's finish it."
              </div>
              
              <button 
                onclick="showEmailForm()" 
                className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
              >
                🎯 Get My Launch Plan & Templates
              </button>
            </div>
          </div>

          {/* Email collection form - Action-oriented */}
          <div id="email-form-container" className="hidden text-center py-8">
            <div className="max-w-md mx-auto">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  🎯 Secure Your AI TechStep Challenge
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-800 text-sm">One-time payment • No subscription</span>
                  <span className="text-2xl font-bold text-green-700">$19.99</span>
                </div>
                <p className="text-green-700 text-sm">
                  Your personalized launch plan + templates delivered instantly after payment
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <h4 className="font-semibold text-blue-900 mb-3">🎁 What launches in your inbox right now:</h4>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-800">📋 Your Launch Roadmap</div>
                    <div className="text-xs text-blue-600">30-day step-by-step blueprint</div>
                  </div>
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-800">🛠️ AI Templates Library</div>
                    <div className="text-xs text-blue-600">Ready-to-customize frameworks</div>
                  </div>
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-800">⚡ Week 1 Actions</div>
                    <div className="text-xs text-blue-600">15 min daily launch tasks</div>
                  </div>
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-800">👥 Creator Community</div>
                    <div className="text-xs text-blue-600">700K+ parent entrepreneurs</div>
                  </div>
                </div>
                <div className="bg-green-100 border border-green-300 rounded p-3">
                  <div className="text-sm text-green-800 font-semibold">💡 "This is not school. This is your launchpad."</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <input 
                  type="email" 
                  id="user-email" 
                  placeholder="Enter your email to get started" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                  required 
                />
                <input 
                  type="text" 
                  id="user-name" 
                  placeholder="What's your first name?" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none hidden" 
                  required 
                />
                <button 
                  onclick="proceedToPayment()" 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                  id="payment-submit-btn"
                >
                  🚀 Get My AI TechStep Challenge - $19.99
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">
                Your launch starts today. Privacy protected. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Footer social proof */}
        <div className="text-center text-sm text-gray-500">
          <div className="flex justify-center items-center space-x-6 mb-2">
            <span>700k+ users' choice</span>
            <span>★★★★★ 4.5 Rated on Trustpilot</span>
          </div>
          <div>AI TechStep, Dallas, Texas • Powered by iPS</div>
        </div>
      </div>
      
      <script src="/static/quiz.js"></script>
    </div>,
    { title: 'AI TechStep Challenge - Discover Your Perfect AI Income Path | Step into Success' }
  );
});

// API endpoint to get quiz data
app.get('/api/quiz-data', async (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.json({
    success: true,
    questions: aiTechStepQuizQuestions,
    trackDescriptions: aiTechStepTrackDescriptions
  });
});

// API endpoint to submit quiz results
app.post('/api/submit-quiz', async (c) => {
  try {
    const { sessionId, email, results, language, name, userGoal } = await c.req.json();
    
    // Create or get user
    const userId = await createUser(c.env, email, name, language);
    
    // Save quiz responses
    for (let i = 0; i < results.selectedAnswers.length; i++) {
      const answer = results.selectedAnswers[i];
      if (answer) {
        await saveQuizResponse(c.env, userId, sessionId, i + 1, answer.value);
      }
    }
    
    // Assign track
    const trackType = await assignUserTrack(c.env, userId, results.scores);
    
    // Send email notification to support@techstepfoundation.org
    try {
      const emailResult = await sendEmailNotification(email, name, userGoal, results.scores);
      console.log('Email notification result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the signup if email fails
    }
    
    return c.json({ 
      success: true, 
      trackType, 
      userId,
      redirectUrl: `/scratch-card?session=${sessionId}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || '')}&goal=${encodeURIComponent(userGoal || '')}`
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return c.json({ success: false, error: 'Failed to process quiz results' }, 500);
  }
});

// Scratch card discount page - Coursiv style
app.get('/scratch-card', async (c) => {
  const sessionId = c.req.query('session');
  const email = c.req.query('email');
  const name = c.req.query('name');
  const goal = c.req.query('goal');
  
  if (!sessionId || !email) {
    return c.redirect('/quiz');
  }
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Scratch & Save on your<br/>
            28-Day AI TechStep Challenge!
          </h1>
          <p className="text-xl text-gray-600 mb-2">Boost your skills and master AI!</p>
          <p className="text-lg text-gray-700">Get you gift with us 🎁</p>
          <p className="text-gray-600 mt-4">Scratch the card👇🏻</p>
        </div>

        {/* Scratch card */}
        <div className="max-w-md mx-auto mb-8">
          <div id="scratch-card" className="relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-center cursor-pointer transform hover:scale-105 transition-all duration-200 shadow-xl">
            <div id="scratch-overlay" className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
              Click to Scratch!
            </div>
            <div id="scratch-content" className="hidden">
              <div className="text-white text-2xl font-bold mb-2">Woo hoo!</div>
              <div className="text-white text-lg mb-2">You won a discount</div>
              <div className="text-5xl font-bold text-white mb-2">50% off</div>
              <div className="text-white text-sm">It will be applied automatically</div>
            </div>
          </div>
        </div>

        {/* Readiness chart */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your readiness level</h2>
          <p className="text-center text-sm text-gray-600 mb-6">This chart is for illustrative purposes only</p>
          
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="text-lg font-semibold text-gray-700 mb-2">Your 4-week Personal AI TechStep Challenge is ready!</div>
            </div>
            
            {/* Before/After comparison */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">Now</div>
                  <div className="bg-red-100 rounded-lg p-4 border border-red-200">
                    <div className="text-sm font-semibold text-gray-800 mb-1">Goal</div>
                    <div className="text-xs text-gray-600">{goal || 'AI skills'}</div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                      <div className="h-2 bg-red-400 rounded-full" style="width: 20%"></div>
                    </div>
                    <div className="text-xs text-red-600 mt-1">Limited</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">After 4 weeks</div>
                  <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                    <div className="text-sm font-semibold text-gray-800 mb-1">{goal || 'AI skills'}</div>
                    <div className="text-xs text-gray-600">Profit Readiness</div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                      <div className="h-2 bg-green-500 rounded-full" style="width: 85%"></div>
                    </div>
                    <div className="text-xs text-green-600 mt-1">High</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <div className="text-sm text-gray-500 mb-2">This is not a guarantee or promise of results.</div>
                <div className="text-lg font-bold text-green-600 mb-2">Your readiness: 83%</div>
                <div className="text-sm text-gray-700">4-week program is enough for you to start your AI journey</div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits section */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">AI is easier than you think</h3>
          <div className="text-center text-blue-600 font-semibold mb-4">AI TechStep - "Step into AI Success"</div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">✓ No prior AI knowledge is required</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">✓ No need for a university degree</div>
            </div>
            <div className="text-center">
              <div className="text-green-600 font-semibold mb-2">✓ Work at your own pace and terms</div>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-xl font-bold text-gray-900 mb-4">Try AI TechStep and you will:</h4>
            <div className="space-y-3 text-gray-700">
              <p>• Master AI tools that can boost your income</p>
              <p>• Discover new professions and income sources with AI</p>
              <p>• Learn key AI terms and lessons</p>
            </div>
            
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Your goal</span>
                <span className="font-semibold">Create passive income while caring for kids</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Your target</span>
                <span className="font-semibold">{goal || 'Support children\'s education'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Continue button with countdown */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="text-red-600 font-bold mb-2">Discount expires in</div>
            <div id="countdown-timer" className="text-3xl font-bold text-red-600">09 : 42</div>
            <div className="text-sm text-gray-600">min &nbsp;&nbsp;&nbsp; sec</div>
          </div>
          
          <button 
            onclick="proceedToCheckout()" 
            className="w-full max-w-md mx-auto block bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            GET MY AI TECHSTEP PLAN
          </button>
        </div>
      </div>
      
      <script src="/static/scratch-card.js"></script>
      <script src="/static/countdown.js"></script>
    </div>,
    { title: 'Scratch & Save 50% OFF - AI TechStep Challenge' }
  );
});

// Stripe payment page (replaces scratch card for direct conversion)
app.get('/payment', async (c) => {
  const sessionId = c.req.query('session');
  const email = c.req.query('email');
  const name = c.req.query('name');
  const goal = c.req.query('goal');
  
  if (!sessionId || !email) {
    return c.redirect('/quiz');
  }
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="text-center mb-6 sm:mb-8 px-4">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-full font-bold mb-4 inline-block animate-pulse text-sm sm:text-base">
            🎯 SECURE YOUR SPOT NOW
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Ready to Launch Your First $1K AI Project?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-3">Join 700,000+ parents who've already started</p>
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 sm:p-4 max-w-sm sm:max-w-md mx-auto">
            <p className="text-yellow-800 font-semibold text-sm sm:text-base">⚡ Limited Time: Only $19.99 (Reg. $49.99)</p>
          </div>
        </div>

        {/* Payment Card - Mobile optimized */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border-2 sm:border-4 border-green-300 p-4 sm:p-6 md:p-8 relative">
            
            {/* Most popular badge */}
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-base">
                🚀 LAUNCH READY
              </div>
            </div>
            
            <div className="text-center pt-6 sm:pt-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">AI TechStep Challenge</h2>
              
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  <span className="line-through text-gray-400 text-lg sm:text-xl md:text-2xl mr-2">$49.99</span>
                  $19.99
                </div>
                <div className="text-base sm:text-lg text-green-600 font-semibold px-2">
                  One-time payment • No recurring charges • Instant access
                </div>
              </div>

              <div className="text-left space-y-4 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">Your Complete Launch System:</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">🎯</div>
                    <div>
                      <div className="font-semibold">Your Personalized Launch Roadmap</div>
                      <div className="text-sm text-gray-600">30-day step-by-step plan tailored to your quiz results</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">🛠️</div>
                    <div>
                      <div className="font-semibold">AI Templates & Tools Library</div>
                      <div className="text-sm text-gray-600">30+ ready-to-use templates for immediate implementation</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">👥</div>
                    <div>
                      <div className="font-semibold">Creator Community Access</div>
                      <div className="text-sm text-gray-600">Join 700K+ parent entrepreneurs</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">⚡</div>
                    <div>
                      <div className="font-semibold">Week 1 Quick-Start Actions</div>
                      <div className="text-sm text-gray-600">15-minute daily tasks to launch immediately</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">💬</div>
                    <div>
                      <div className="font-semibold">24/7 Support Access</div>
                      <div className="text-sm text-gray-600">Get help whenever you need it</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information Form - Mobile optimized */}
              <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 payment-mobile" id="payment-container">
                <div className="text-left">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="customer-email" 
                    defaultValue={email}
                    className="form-input w-full px-3 sm:px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="text-left">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="customer-name" 
                    defaultValue={name}
                    className="form-input w-full px-3 sm:px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                {/* PayPal Payment Button - Mobile optimized */}
                <div className="mt-4 sm:mt-6">
                  <div className="text-center mb-3 sm:mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Complete your payment with PayPal</p>
                    <p className="text-xs text-gray-500">💳 Credit cards, debit cards, or PayPal balance</p>
                  </div>
                  
                  <div id="paypal-button-container" className="paypal-mobile min-h-[60px] sm:min-h-[70px]">
                    {/* PayPal button will be inserted here */}
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <p className="text-xs sm:text-sm text-gray-500">Loading PayPal...</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mb-4 sm:mb-6 px-2 text-center">
                🔒 Secure PayPal encryption • 💳 All payment methods accepted • ✅ No subscription
              </div>

              {/* Payment security */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💝 30-Day Money-Back Guarantee</h4>
                  <p className="text-sm text-green-700">
                    Try the AI TechStep Challenge risk-free. If you're not completely satisfied within 30 days, 
                    we'll refund every penny. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live purchase notifications */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
          <h3 className="font-bold text-gray-900 mb-4 text-center">
            ⚡ 47 people joined AI TechStep in the last hour
          </h3>
          <div id="live-purchases-payment" className="space-y-2 text-sm text-gray-600 max-h-32 overflow-y-auto">
            {/* Will be populated by JavaScript */}
          </div>
        </div>
      </div>
      
      <script src="/static/paypal-payment.js"></script>
      <script src="/static/live-purchases.js"></script>
    </div>,
    { title: 'Secure Payment - AI TechStep Challenge $19.99' }
  );
});

// One-time payment checkout (NO SUBSCRIPTION)
app.get('/checkout', async (c) => {
  const sessionId = c.req.query('session');
  const email = c.req.query('email');
  const name = c.req.query('name');
  const goal = c.req.query('goal');
  
  if (!sessionId || !email) {
    return c.redirect('/quiz');
  }
  
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="text-center mb-8">
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full font-bold mb-4 animate-pulse">
            50% OFF Applied!
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose the best plan for you
          </h1>
          <div className="text-lg text-gray-600">Your promo code applied: <span className="font-bold text-green-600">parent_50off</span></div>
          <div id="checkout-countdown" className="text-red-600 font-bold mt-2">09:42</div>
        </div>

        {/* Single 4-week plan - NO SUBSCRIPTION */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-4 border-blue-300 p-8 relative">
            
            {/* Most popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-bold">
                MOST POPULAR
              </div>
            </div>
            
            <div className="text-center pt-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">4-WEEK AI TECHSTEP CHALLENGE</h2>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <span className="line-through text-gray-400 text-2xl mr-2">$39.99</span>
                  $19.99
                </div>
                <div className="text-lg text-green-600 font-semibold">
                  One-time payment • No recurring charges
                </div>
                <div className="text-gray-600">
                  $0.71 per day
                </div>
              </div>

              <div className="text-left space-y-4 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">What you get:</h3>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <div>
                      <div className="font-semibold">Guides on Trending AI tools</div>
                      <div className="text-sm text-gray-600">30+ AI tools specifically for parents</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <div>
                      <div className="font-semibold">Access to beginner-friendly lessons</div>
                      <div className="text-sm text-gray-600">Step-by-step tutorials for work-from-home parents</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <div>
                      <div className="font-semibold">Comprehensive skill-enhancing courses</div>
                      <div className="text-sm text-gray-600">Master passive income strategies with AI</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <div>
                      <div className="font-semibold">Resources for work-life balance</div>
                      <div className="text-sm text-gray-600">Designed specifically for busy parents</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-green-500 mr-3 mt-1">✓</div>
                    <div>
                      <div className="font-semibold">24/7 chat with online support</div>
                      <div className="text-sm text-gray-600">Get all answers and reduce mistakes</div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onclick="processPurchase()" 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 rounded-xl font-bold text-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg mb-4"
              >
                GET MY AI TECHSTEP PLAN - $19.99
              </button>
              
              <div className="text-xs text-gray-500 mb-6">
                One-time payment • No subscription • No automatic renewal • Instant access
              </div>

              {/* Payment security */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <div className="text-sm text-gray-600">Pay safe & secure</div>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Money-Back Guarantee</h4>
                  <p className="text-sm text-green-700">
                    We are so confident in our service that we are ready to offer a full refund within 30 days 
                    of your purchase. No questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live purchase notifications */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold text-gray-900 mb-4 text-center">
            203 people purchased AI TechStep plans in the last hour
          </h3>
          <div id="live-purchases" className="space-y-2 text-sm text-gray-600 max-h-32 overflow-y-auto">
            {/* Will be populated by JavaScript */}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">People love AI TechStep</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="font-bold text-gray-900 mb-2">@sarah_mompreneur</div>
              <p className="text-sm text-gray-700">
                "The learning is straightforward and has all the necessary information! It serves as a great 
                starting point for parents new to AI who want to build passive income while caring for kids."
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="font-bold text-gray-900 mb-2">@mike_dadlife</div>
              <p className="text-sm text-gray-700">
                "AI TechStep's wide range of educational materials and interactive features enables parents 
                of all levels to easily understand complicated AI principles while managing family time."
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="font-bold text-gray-900 mb-2">@jenny_workfromhome</div>
              <p className="text-sm text-gray-700">
                "AI TechStep has simplified understanding complex topics while enhancing my skills. 
                The customized learning tailored to working parents has significantly boosted my progress."
              </p>
            </div>
          </div>
        </div>

        {/* Mobile app section */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Access AI TechStep anywhere using your mobile device
          </h3>
          <p className="text-gray-600 mb-6">Learn AI skills on-the-go, perfect for busy parents</p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12">
          <div>AI TechStep, Dallas, Texas • Powered by iPS</div>
        </div>
      </div>
      
      <script src="/static/live-purchases.js"></script>
      <script src="/static/checkout.js"></script>
    </div>,
    { title: '4-Week AI TechStep Challenge - One-Time Payment $19.99' }
  );
});

// Success page after purchase
app.get('/success', async (c) => {
  const email = c.req.query('email');
  const name = c.req.query('name');
  const sessionId = c.req.query('session');
  const paymentIntentId = c.req.query('payment_intent');
  
  // Process the successful payment
  if (paymentIntentId && email) {
    try {
      const response = await fetch(`${c.req.url.split('/success')[0]}/api/process-payment-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          sessionId,
          email,
          name: name || '',
          goal: 'Create passive income with AI'
        })
      });
      
      const result = await response.json();
      console.log('Payment processing result:', result);
    } catch (error) {
      console.error('Error processing payment success:', error);
    }
  }
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-12 shadow-xl">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to AI TechStep Challenge!
          </h1>
          <div className="text-lg text-blue-600 font-semibold mb-4">"Step into AI Success - One Click at a Time"</div>
          <p className="text-xl text-gray-600 mb-8">
            Thank you {name || 'parent'}! Your 4-week AI journey starts now.
          </p>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
            <div className="text-left space-y-4">
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 mt-1 text-xl">1.</div>
                <div>
                  <div className="font-semibold">Check your email</div>
                  <div className="text-gray-600">We've sent your login details to {email}</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 mt-1 text-xl">2.</div>
                <div>
                  <div className="font-semibold">Start Day 1</div>
                  <div className="text-gray-600">Begin your AI journey with beginner-friendly lessons</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 mt-1 text-xl">3.</div>
                <div>
                  <div className="font-semibold">Join our community</div>
                  <div className="text-gray-600">Connect with 700,000+ parents mastering AI</div>
                </div>
              </div>
            </div>
          </div>
          
          <a href="/dashboard" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
            Access Your Dashboard
          </a>
        </div>
      </div>
    </div>,
    { title: 'Welcome to AI TechStep Challenge - Success!' }
  );
});

// Purchase confirmation email function
async function sendPurchaseConfirmationEmail(userEmail: string, userName: string, tier: string, amount: number) {
  const tierNames = {
    'starter': 'Starter Unlock',
    'core_full': 'Core Plan',
    'core_installment': 'Core Plan (Installments)'
  };
  
  const tierName = tierNames[tier] || 'AI TechStep Plan';
  
  const confirmationEmailData = {
    to: userEmail,
    subject: `🎉 Welcome to ${tierName} - AI TechStep Challenge!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 10px;">
              Welcome to AI TechStep! 🚀
            </h1>
            <p style="color: #3b82f6; font-size: 16px; font-weight: 600; margin: 0;">
              "Step into AI Success - One Click at a Time"
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px;">Hi ${userName}! 👋</h2>
            <p style="margin: 0; font-size: 16px;">Your ${tierName} is now active!</p>
            <div style="margin-top: 15px; font-size: 14px; opacity: 0.9;">
              Payment confirmed: $${amount.toFixed(2)}
            </div>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin-bottom: 15px;">🎯 What's Next?</h3>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #1f2937;">1. Access Your Dashboard</strong><br/>
                <span style="color: #6b7280;">Click the link below to start your AI journey</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #1f2937;">2. ${tier === 'starter' ? 'Explore Starter Resources' : 'Join Live Coaching'}</strong><br/>
                <span style="color: #6b7280;">${
                  tier === 'starter' 
                    ? 'Get your AI profile and week-1 preview' 
                    : 'Weekly live sessions with real entrepreneurs'
                }</span>
              </div>
              <div>
                <strong style="color: #1f2937;">3. Connect with Community</strong><br/>
                <span style="color: #6b7280;">Join 700,000+ parent entrepreneurs</span>
              </div>
            </div>
          </div>
          
          ${tier === 'core_installment' ? `
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #92400e; margin-top: 0; margin-bottom: 10px;">💳 Installment Plan Active</h4>
            <div style="color: #92400e; font-size: 14px;">
              <div>• <strong>First payment:</strong> $199.00 (completed today)</div>
              <div>• <strong>Second payment:</strong> $199.00 (due in 30 days)</div>
              <div>• <strong>Final payment:</strong> $199.00 (due in 60 days)</div>
              <p style="margin-top: 10px; font-size: 13px;">You'll receive email reminders before each installment.</p>
            </div>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              🚀 Access Your Dashboard
            </a>
          </div>
          
          ${tier !== 'starter' ? `
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 10px;">🎁 Your Core Plan Includes:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Weekly live coaching with entrepreneurs who've built 100+ businesses</li>
              <li>Full 28-Day AI Launch Plan</li>
              <li>AI Prompt Bank ($299 value)</li>
              <li>Marketing Toolkit ($199 value)</li>
              <li>Private community access</li>
              <li>Templates & resources library</li>
            </ul>
          </div>
          ` : `
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 10px;">🎁 Your Starter Unlock Includes:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>AI Profile & Readiness Score</li>
              <li>Week-1 roadmap preview</li>
              <li>Starter prompts & mini toolkit</li>
              <li>Upgrade to Core anytime (credit $49 within 7 days)</li>
            </ul>
          </div>
          `}
          
          <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #15803d; font-size: 14px;">
              <strong>💝 Money-Back Guarantee:</strong> ${
                tier !== 'starter' 
                  ? 'Complete all 4 weeks; if you don\'t launch, 50% refund.'
                  : 'Full refund within 30 days if not satisfied.'
              }
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Need help? Reply to this email or contact us at<br/>
            <a href="mailto:support@techstepfoundation.org" style="color: #3b82f6;">support@techstepfoundation.org</a></p>
            <p style="margin-top: 15px;">AI TechStep Challenge<br/>
            Dallas, Texas • Powered by iPS</p>
          </div>
        </div>
      </div>
    `
  };
  
  console.log('📧 Purchase confirmation email prepared for:', userEmail);
  console.log('🎯 Tier:', tierName);
  console.log('💰 Amount:', amount);
  
  return {
    success: true,
    message: 'Purchase confirmation email prepared successfully',
    emailSent: false, // Set to true when using real email service
    recipientEmail: userEmail,
    tier: tier
  };
}

// Welcome email function for users
async function sendWelcomeEmail(userEmail: string, userName: string) {
  const welcomeEmailData = {
    to: userEmail,
    subject: '🎉 Welcome to AI TechStep Challenge - Your 28-Day Journey Starts Now!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 10px;">
              Welcome to AI TechStep! 🚀
            </h1>
            <p style="color: #3b82f6; font-size: 16px; font-weight: 600; margin: 0;">
              "Step into AI Success - One Click at a Time"
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 20px;">Hi ${userName}! 👋</h2>
            <p style="margin: 0; font-size: 16px;">Your 28-Day AI Challenge starts now!</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin-bottom: 15px;">🎯 What's Next?</h3>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #1f2937;">1. Check Your Email</strong><br/>
                <span style="color: #6b7280;">Look for your login details and dashboard access</span>
              </div>
              <div style="margin-bottom: 15px;">
                <strong style="color: #1f2937;">2. Start Day 1</strong><br/>
                <span style="color: #6b7280;">Begin with our beginner-friendly AI lessons (15-20 minutes)</span>
              </div>
              <div>
                <strong style="color: #1f2937;">3. Join Our Community</strong><br/>
                <span style="color: #6b7280;">Connect with 700,000+ parents mastering AI skills</span>
              </div>
            </div>
          </div>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 10px;">💡 Perfect for Busy Parents:</h4>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px;">
              <li>15-20 minute lessons (perfect for nap time!)</li>
              <li>30+ AI tools specifically for parents</li>
              <li>Learn while kids play nearby</li>
              <li>Build passive income streams</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              🚀 Access Your Dashboard
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Need help? Reply to this email or contact us at<br/>
            <a href="mailto:support@techstepfoundation.org" style="color: #3b82f6;">support@techstepfoundation.org</a></p>
            <p style="margin-top: 15px;">AI TechStep Challenge<br/>
            Dallas, Texas • Powered by iPS</p>
          </div>
        </div>
      </div>
    `,
    text: `
Welcome to AI TechStep Challenge! 🚀
"Step into AI Success - One Click at a Time"

Hi ${userName}!

Your 28-Day AI Challenge starts now!

What's Next?
1. Check Your Email - Look for your login details and dashboard access
2. Start Day 1 - Begin with our beginner-friendly AI lessons (15-20 minutes)
3. Join Our Community - Connect with 700,000+ parents mastering AI skills

Perfect for Busy Parents:
- 15-20 minute lessons (perfect for nap time!)
- 30+ AI tools specifically for parents  
- Learn while kids play nearby
- Build passive income streams

Access your dashboard: /dashboard

Need help? Contact us at support@techstepfoundation.org

AI TechStep Challenge
Dallas, Texas • Powered by iPS
    `
  };
  
  console.log('📧 Welcome email prepared for user:', userEmail);
  console.log('👋 Welcome message for:', userName);
  
  return {
    success: true,
    message: 'Welcome email prepared successfully',
    emailSent: false, // Set to true when using real email service
    recipientEmail: userEmail
  };
}

// Equity application confirmation email function
async function sendEquityApplicationConfirmationEmail(userEmail: string, userName: string, applicationData: any) {
  const confirmationEmailData = {
    to: userEmail,
    subject: '🚀 Your Founder Equity Track Application Received!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 10px;">
              Application Received! 🎉
            </h1>
            <p style="color: #7c3aed; font-size: 16px; font-weight: 600; margin: 0;">
              Founder Equity Track - AI TechStep Challenge
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 22px;">Hi ${userName}! 👋</h2>
            <p style="margin: 0; font-size: 16px;">We've received your Founder Equity Track application</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin-bottom: 15px;">📋 Application Summary</h3>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
              <div style="margin-bottom: 10px;">
                <strong style="color: #1f2937;">Venture Idea:</strong><br/>
                <span style="color: #4b5563;">${applicationData.venture_idea}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #1f2937;">Time Commitment:</strong><br/>
                <span style="color: #4b5563;">${applicationData.time_commitment} hours/day</span>
              </div>
              <div>
                <strong style="color: #1f2937;">Location:</strong><br/>
                <span style="color: #4b5563;">${applicationData.location}</span>
              </div>
            </div>
          </div>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px;">
            <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 10px;">🕐 What Happens Next?</h4>
            <div style="color: #1e40af; font-size: 14px; space-y: 5px;">
              <div style="margin-bottom: 5px;">• <strong>Review Period:</strong> 48 hours</div>
              <div style="margin-bottom: 5px;">• <strong>Interview:</strong> Brief call if selected (15-20 minutes)</div>
              <div style="margin-bottom: 5px;">• <strong>Decision:</strong> Final acceptance notification</div>
              <div>• <strong>Cohort Start:</strong> Next available group (usually within 2 weeks)</div>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">💡 Reminder: Equity Terms</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              If accepted, AI TechStep will receive 20% equity in your new venture in exchange for:
              <br/>• Full program access + weekly coaching
              <br/>• Direct mentorship from entrepreneurs who've built 100+ businesses
              <br/>• No upfront costs - we invest in your success
            </p>
          </div>
          
          <div style="text-center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="margin: 5px 0;">Questions? Reply to this email or contact us at support@techstepfoundation.org</p>
            <p style="margin: 5px 0;">AI TechStep Challenge • Dallas, Texas • Powered by iPS</p>
          </div>
        </div>
      </div>
    `
  };
  
  console.log('📧 Equity application confirmation email prepared for:', userEmail);
  
  return {
    success: true,
    message: 'Equity application confirmation email prepared successfully',
    emailSent: false, // Set to true when using real email service
    recipientEmail: userEmail
  };
}

// Equity application notification email function (to support team)
async function sendEquityApplicationNotificationEmail(applicationData: any) {
  const notificationEmailData = {
    to: 'support@techstepfoundation.org',
    subject: `🚀 New Founder Equity Track Application - ${applicationData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h1 style="color: #1f2937; margin-bottom: 20px; text-align: center;">
            🚀 New Founder Equity Track Application
          </h1>
          
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px;">Application Details</h2>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">👤 Founder Information</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
              <p><strong>📧 Email:</strong> ${applicationData.email}</p>
              <p><strong>👤 Name:</strong> ${applicationData.name}</p>
              <p><strong>📍 Location:</strong> ${applicationData.location}</p>
              <p><strong>⏰ Time Commitment:</strong> ${applicationData.time_commitment} hours/day</p>
              ${applicationData.portfolio ? `<p><strong>🔗 Portfolio:</strong> <a href="${applicationData.portfolio}">${applicationData.portfolio}</a></p>` : ''}
              <p><strong>📅 Application Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">💼 Venture Details</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
              <div style="margin-bottom: 15px;">
                <strong style="color: #1f2937;">Business Idea:</strong><br/>
                <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 5px;">
                  ${applicationData.venture_idea}
                </div>
              </div>
              <div>
                <strong style="color: #1f2937;">Target Customer & Problem:</strong><br/>
                <div style="background: white; padding: 10px; border-radius: 6px; margin-top: 5px;">
                  ${applicationData.target_problem}
                </div>
              </div>
            </div>
          </div>
          
          ${applicationData.leadProfile ? `
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">🎯 AI Profile Data</h3>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p><strong>AI Class:</strong> ${applicationData.leadProfile.aiClass || 'Not available'}</p>
              <p><strong>Readiness Score:</strong> ${applicationData.leadProfile.readinessScore || 'Not available'}/100</p>
            </div>
          </div>
          ` : ''}
          
          <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #15803d;">
              <strong>✅ Equity Agreement:</strong> Applicant has agreed to 20% equity terms if accepted.
            </p>
          </div>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #92400e;">
              <strong>⚡ Next Steps:</strong> Review application and schedule interview call within 48 hours if interested.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>AI TechStep Challenge Platform<br/>
            Dallas, Texas • Powered by iPS<br/>
            "Step into AI Success - One Click at a Time"</p>
          </div>
        </div>
      </div>
    `
  };
  
  console.log('📧 Equity application notification prepared for support team');
  
  return {
    success: true,
    message: 'Equity application notification prepared successfully',
    emailSent: false, // Set to true when using real email service
    recipientEmail: 'support@techstepfoundation.org'
  };
}

// AI Profile welcome email function
async function sendAIProfileWelcomeEmail(userEmail: string, userName: string, leadProfile: any) {
  const welcomeEmailData = {
    to: userEmail,
    subject: `🎉 Your AI Profile is Ready - ${leadProfile.aiClass}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 10px;">
              Your AI Profile is Ready! 🚀
            </h1>
            <p style="color: #7c3aed; font-size: 16px; font-weight: 600; margin: 0;">
              "Step into AI Success - One Click at a Time"
            </p>
          </div>
          
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: center;">
            <h2 style="margin: 0 0 10px 0; font-size: 22px;">Hi ${userName}! 👋</h2>
            <p style="margin: 0; font-size: 16px;">Your AI Class: <strong>${leadProfile.aiClass}</strong></p>
            <div style="margin-top: 15px;">
              <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 10px;">
                <div style="font-size: 14px; opacity: 0.9;">Readiness Score</div>
                <div style="font-size: 24px; font-weight: bold;">${leadProfile.readinessScore}/100</div>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin-bottom: 15px;">🎯 Your Top 3 Suggested Pathways</h3>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
              ${leadProfile.suggestedPathways.map((pathway: string, index: number) => `
                <div style="margin-bottom: ${index < leadProfile.suggestedPathways.length - 1 ? '10px' : '0'};">
                  <span style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px;">${index + 1}</span>
                  <strong style="color: #1f2937;">${pathway}</strong>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div style="text-align: center; margin-bottom: 25px;">
            <a href="https://your-domain.com/pricing" style="background: linear-gradient(135deg, #7c3aed, #ec4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              🚀 Unlock Your 28-Day AI Plan
            </a>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #374151; margin-bottom: 15px;">💡 Why Your Profile Matters</h3>
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="color: #1e40af; margin: 0; line-height: 1.6;">
                Your AI Profile reveals your unique strengths and the fastest path to AI income. 
                Don't let this momentum slip away - your personalized roadmap is waiting!
              </p>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="color: #92400e; margin: 0 0 10px 0;">⚡ Limited Time Offer</h4>
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              Complete your enrollment in the next 24 hours and get our exclusive AI Prompt Bank (valued at $299) absolutely FREE!
            </p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="margin: 5px 0;">Questions? Reply to this email or contact us at support@techstepfoundation.org</p>
            <p style="margin: 5px 0;">AI TechStep Challenge • Dallas, Texas • Powered by iPS</p>
          </div>
        </div>
      </div>
    `
  };
  
  console.log('📧 AI Profile welcome email prepared for:', userEmail);
  console.log('🎯 AI Class:', leadProfile.aiClass);
  console.log('📊 Readiness Score:', leadProfile.readinessScore);
  
  return {
    success: true,
    message: 'AI Profile welcome email prepared successfully',
    emailSent: false, // Set to true when using real email service
    recipientEmail: userEmail,
    aiClass: leadProfile.aiClass
  };
}

// Email notification function
async function sendEmailNotification(userEmail: string, userName: string, userGoal: string, scores: any) {
  const emailData = {
    to: 'support@techstepfoundation.org',
    subject: `New AI TechStep Challenge Signup - ${userName || 'New User'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h1 style="color: #1f2937; margin-bottom: 20px; text-align: center;">
            🎉 New AI TechStep Challenge Signup!
          </h1>
          
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px;">User Information</h2>
          </div>
          
          <div style="margin-bottom: 20px;">
            <p><strong>📧 Email:</strong> ${userEmail}</p>
            <p><strong>👤 Name:</strong> ${userName || 'Not provided'}</p>
            <p><strong>🎯 Goal:</strong> ${userGoal || 'Create passive income with AI'}</p>
            <p><strong>📅 Signup Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #374151; margin-top: 0;">Quiz Results & AI Track Scores:</h3>
            <ul style="color: #4b5563;">
              <li><strong>Digital Product Track:</strong> ${scores.digital_product || 0} points</li>
              <li><strong>Service Track:</strong> ${scores.service || 0} points</li>
              <li><strong>E-commerce Track:</strong> ${scores.ecommerce || 0} points</li>
              <li><strong>Consulting Track:</strong> ${scores.consulting || 0} points</li>
            </ul>
          </div>
          
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Next Steps:</strong> User will be redirected to scratch card page for 50% discount and then checkout for $19.99 one-time payment.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>AI TechStep Challenge Platform<br/>
            Dallas, Texas • Powered by iPS<br/>
            "Step into AI Success - One Click at a Time"</p>
          </div>
        </div>
      </div>
    `,
    text: `
New AI TechStep Challenge Signup!

User Information:
- Email: ${userEmail}
- Name: ${userName || 'Not provided'}
- Goal: ${userGoal || 'Create passive income with AI'}
- Signup Date: ${new Date().toLocaleString()}

Quiz Results & AI Track Scores:
- Digital Product Track: ${scores.digital_product || 0} points
- Service Track: ${scores.service || 0} points
- E-commerce Track: ${scores.ecommerce || 0} points
- Consulting Track: ${scores.consulting || 0} points

Next Steps: User will be redirected to scratch card page for 50% discount and then checkout for $19.99 one-time payment.

AI TechStep Challenge Platform
Dallas, Texas • Powered by iPS
"Step into AI Success - One Click at a Time"
    `
  };
  
  // In production, this would integrate with an email service like:
  // - SendGrid: await sgMail.send(emailData)
  // - Resend: await resend.emails.send(emailData)
  // - Mailgun: await mailgun.messages.create(domain, emailData)
  
  console.log('📧 Email notification prepared for:', emailData.to);
  console.log('📋 Email subject:', emailData.subject);
  console.log('👤 New user:', userEmail, '(', userName, ')');
  
  // For demo purposes, we'll log the email content
  // In production, replace this with actual email service integration
  return {
    success: true,
    message: 'Email notification prepared successfully',
    emailSent: false, // Set to true when using real email service
    recipientEmail: 'support@techstepfoundation.org'
  };
}

// API endpoint to create Stripe payment intent
app.post('/api/create-payment-intent', async (c) => {
  try {
    const { amount, currency, metadata } = await c.req.json();
    
    // Validate input
    if (!amount || amount !== 1999) { // Must be exactly $19.99
      return c.json({ success: false, error: 'Invalid amount' }, 400);
    }
    
    // In production, you'll need to set STRIPE_SECRET_KEY as Cloudflare secret
    const stripeSecretKey = c.env.STRIPE_SECRET_KEY;
    const stripePublishableKey = c.env.STRIPE_PUBLISHABLE_KEY;
    
    if (!stripeSecretKey || !stripePublishableKey) {
      console.log('⚠️ Stripe keys not configured. Using demo mode.');
      
      // Return demo keys for development
      return c.json({
        success: true,
        client_secret: 'pi_demo_client_secret_for_development',
        publishable_key: 'pk_test_demo_key_for_development',
        demo_mode: true,
        message: 'Demo mode - Configure Stripe keys for production'
      });
    }
    
    // Create payment intent with Stripe API
    const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'amount': amount.toString(),
        'currency': currency,
        'automatic_payment_methods[enabled]': 'true',
        'metadata[product]': metadata.product || 'AI TechStep Challenge',
        'metadata[session]': metadata.session || '',
        'metadata[email]': metadata.email || '',
        'metadata[name]': metadata.name || '',
        'metadata[goal]': metadata.goal || ''
      })
    });
    
    const paymentIntent = await paymentIntentResponse.json();
    
    if (!paymentIntentResponse.ok) {
      throw new Error(paymentIntent.error?.message || 'Failed to create payment intent');
    }
    
    return c.json({
      success: true,
      client_secret: paymentIntent.client_secret,
      publishable_key: stripePublishableKey
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to initialize payment' 
    }, 500);
  }
});

// API endpoint to handle successful payments
app.post('/api/process-payment-success', async (c) => {
  try {
    const { paymentIntentId, sessionId, email, name, goal } = await c.req.json();
    
    // Verify payment with Stripe (in production)
    const stripeSecretKey = c.env.STRIPE_SECRET_KEY;
    
    if (stripeSecretKey && paymentIntentId !== 'pi_demo_client_secret_for_development') {
      const paymentVerification = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        }
      });
      
      const paymentIntent = await paymentVerification.json();
      
      if (!paymentVerification.ok || paymentIntent.status !== 'succeeded') {
        return c.json({ success: false, error: 'Payment verification failed' }, 400);
      }
    }
    
    // Create or get user
    const userId = await createUser(c.env, email, name, 'en');
    
    // Create user progress (28-day challenge)
    await createUserProgress(c.env, userId);
    
    // Save payment record
    await c.env.DB.prepare(`
      INSERT INTO payments (user_id, amount, currency, plan_type, payment_method, status, payment_id, is_one_time)
      VALUES (?, ?, 'USD', 'ai-techstep-challenge', 'stripe', 'completed', ?, 1)
    `).bind(userId, 1999, paymentIntentId).run();
    
    // Send welcome email to user
    try {
      await sendWelcomeEmail(email, name);
      console.log(`✅ Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the payment if email fails
    }
    
    // Send notification email to support
    try {
      const dummyScores = { digital_product: 85, service: 72, ecommerce: 45, consulting: 63 };
      await sendEmailNotification(email, name, goal, dummyScores);
      console.log(`✅ Notification email sent to support@techstepfoundation.org`);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
    
    return c.json({ 
      success: true, 
      message: 'Payment processed successfully',
      userId: userId,
      accessGranted: true
    });
    
  } catch (error) {
    console.error('Payment processing error:', error);
    return c.json({ 
      success: false, 
      error: 'Payment processing failed' 
    }, 500);
  }
});

// API endpoint to process one-time payment
app.post('/api/process-payment', async (c) => {
  try {
    const paymentData = await c.req.json();
    const { email, name, amount, plan, isOneTime, noSubscription } = paymentData;
    
    // Validate payment data
    if (!email || !amount || !isOneTime || !noSubscription) {
      return c.json({ success: false, error: 'Invalid payment data' }, 400);
    }
    
    // Create or get user
    const userId = await createUser(c.env, email, name, 'en');
    
    // Create user progress (28-day challenge)
    await createUserProgress(c.env, userId);
    
    // Save payment record
    await c.env.DB.prepare(`
      INSERT INTO payments (user_id, amount, currency, plan_type, payment_method, status, payment_id, is_one_time)
      VALUES (?, ?, 'USD', '4-week-challenge', 'demo', 'completed', ?, 1)
    `).bind(userId, amount, paymentData.paymentId).run();
    
    // Deliver AI Parent challenge content
    await deliverAssets(c.env, userId, 'digital_product');
    
    // Send welcome email (in real app, integrate with email service)
    console.log(`Welcome email sent to ${email} for AI Parent Challenge`);
    
    return c.json({ 
      success: true, 
      message: 'Payment processed successfully',
      userId: userId,
      accessGranted: true
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return c.json({ success: false, error: 'Payment processing failed' }, 500);
  }
});

// API endpoint for email service integration (for production setup)
app.post('/api/configure-email', async (c) => {
  try {
    const { service, apiKey, fromEmail, testEmail } = await c.req.json();
    
    // Validate input
    if (!service || !apiKey || !fromEmail) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: service, apiKey, fromEmail' 
      }, 400);
    }
    
    const supportedServices = ['sendgrid', 'resend', 'mailgun', 'postmark'];
    if (!supportedServices.includes(service.toLowerCase())) {
      return c.json({ 
        success: false, 
        error: 'Unsupported email service. Supported: ' + supportedServices.join(', ')
      }, 400);
    }
    
    // In production, store these securely using Cloudflare secrets:
    // wrangler secret put EMAIL_SERVICE
    // wrangler secret put EMAIL_API_KEY  
    // wrangler secret put EMAIL_FROM_ADDRESS
    
    console.log('📧 Email service configuration received:');
    console.log('Service:', service);
    console.log('From Email:', fromEmail);
    console.log('API Key:', apiKey ? 'Provided (hidden)' : 'Not provided');
    
    // Test email if requested
    if (testEmail) {
      console.log('📨 Sending test email to:', testEmail);
      
      const testEmailData = {
        to: testEmail,
        subject: 'AI TechStep Email Service Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #3b82f6;">Email Service Test Successful! ✅</h1>
            <p>Your AI TechStep email integration is working correctly.</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>From:</strong> ${fromEmail}</p>
            <p><strong>To:</strong> support@techstepfoundation.org</p>
            <hr/>
            <p style="font-size: 12px; color: #666;">
              AI TechStep Challenge<br/>
              Dallas, Texas • Powered by iPS
            </p>
          </div>
        `,
        text: `
Email Service Test Successful!

Your AI TechStep email integration is working correctly.

Service: ${service}
From: ${fromEmail}  
To: support@techstepfoundation.org

AI TechStep Challenge
Dallas, Texas • Powered by iPS
        `
      };
      
      // Here you would integrate with the actual email service:
      /* 
      Example integrations:
      
      if (service === 'sendgrid') {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(apiKey);
        await sgMail.send({
          to: testEmail,
          from: fromEmail,
          subject: testEmailData.subject,
          html: testEmailData.html
        });
      }
      
      if (service === 'resend') {
        const { Resend } = require('resend');
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: fromEmail,
          to: testEmail,
          subject: testEmailData.subject,
          html: testEmailData.html
        });
      }
      */
    }
    
    return c.json({
      success: true,
      message: 'Email service configured successfully',
      service: service,
      fromEmail: fromEmail,
      testEmailSent: testEmail ? true : false,
      instructions: {
        production: 'Set EMAIL_SERVICE, EMAIL_API_KEY, and EMAIL_FROM_ADDRESS as Cloudflare secrets',
        commands: [
          `wrangler secret put EMAIL_SERVICE`,
          `wrangler secret put EMAIL_API_KEY`,  
          `wrangler secret put EMAIL_FROM_ADDRESS`
        ]
      }
    });
  } catch (error) {
    console.error('Email configuration error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to configure email service' 
    }, 500);
  }
});

// API endpoint to send test notification to support
app.post('/api/test-notification', async (c) => {
  try {
    const { email, name, goal } = await c.req.json();
    
    const testScores = {
      digital_product: 85,
      service: 72,
      ecommerce: 45,
      consulting: 63
    };
    
    const result = await sendEmailNotification(
      email || 'test@example.com',
      name || 'Test User',
      goal || 'Create passive income with AI',
      testScores
    );
    
    return c.json({
      success: true,
      message: 'Test notification prepared',
      result: result,
      note: 'In production, this would send email to support@techstepfoundation.org'
    });
  } catch (error) {
    console.error('Test notification error:', error);
    return c.json({ success: false, error: 'Failed to send test notification' }, 500);
  }
});

// API endpoint to save AI Profile lead data
app.post('/api/save-lead-profile', async (c) => {
  try {
    const { env } = c;
    const leadProfile = await c.req.json();

    console.log('Saving lead profile:', { email: leadProfile.email, aiClass: leadProfile.aiClass });

    // Validate required fields
    if (!leadProfile.email || !leadProfile.name) {
      return c.json({ 
        success: false, 
        message: 'Missing required fields: name and email' 
      }, 400);
    }

    // Create or get user
    const userId = await createUser(env, leadProfile.email, leadProfile.name, 'en');
    
    // Save lead profile data
    const profileResult = await env.DB.prepare(`
      INSERT INTO lead_profiles (user_id, profile_data, ai_class, readiness_score, created_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET 
        profile_data = ?,
        ai_class = ?,
        readiness_score = ?,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId,
      JSON.stringify(leadProfile),
      leadProfile.aiClass || 'Unknown',
      leadProfile.readinessScore || 0,
      JSON.stringify(leadProfile),
      leadProfile.aiClass || 'Unknown', 
      leadProfile.readinessScore || 0
    ).run();

    console.log('Lead profile saved:', profileResult);

    // Send welcome email with AI profile
    try {
      await sendAIProfileWelcomeEmail(leadProfile.email, leadProfile.name, leadProfile);
      console.log('AI Profile welcome email sent to:', leadProfile.email);
    } catch (emailError) {
      console.error('AI Profile welcome email failed:', emailError);
      // Don't fail the save for email issues
    }

    // Trigger email automation sequence for AI Profile completion
    try {
      await triggerEmailSequence(env, 'ai_profile_complete', leadProfile.email, leadProfile.name, {
        aiClass: leadProfile.aiClass,
        readinessScore: leadProfile.readinessScore
      });
      console.log('AI Profile email sequence triggered for:', leadProfile.email);
    } catch (sequenceError) {
      console.error('AI Profile email sequence failed:', sequenceError);
      // Don't fail the save for sequence issues
    }

    return c.json({
      success: true,
      message: 'Lead profile saved successfully',
      userId: userId,
      aiClass: leadProfile.aiClass,
      readinessScore: leadProfile.readinessScore
    });

  } catch (error) {
    console.error('Lead profile save error:', error);
    return c.json({ 
      success: false, 
      message: 'Failed to save lead profile' 
    }, 500);
  }
});

// API endpoint to create checkout session for pricing modal
app.post('/api/create-checkout-session', async (c) => {
  try {
    const { env } = c;
    const { tier, amount, email, name, leadProfile } = await c.req.json();

    console.log('Creating checkout session:', { tier, amount, email });

    // Validate input
    if (!tier || !amount || !email || !name) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: tier, amount, email, name' 
      }, 400);
    }

    // Validate tier amounts
    const validAmounts = {
      'starter': 49,
      'core_full': 499,
      'core_installment': 199
    };

    if (validAmounts[tier] !== amount) {
      return c.json({ 
        success: false, 
        error: 'Invalid tier/amount combination' 
      }, 400);
    }

    // Create or get user
    const userId = await createUser(env, email, name, 'en');

    // Create pending checkout record
    const checkoutId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    await env.DB.prepare(`
      INSERT INTO checkout_sessions (
        id, user_id, tier, amount, status, lead_profile_data, created_at, expires_at
      ) VALUES (?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP, ?)
    `).bind(
      checkoutId,
      userId,
      tier,
      amount * 100, // Store in cents
      JSON.stringify(leadProfile),
      expiresAt
    ).run();

    // For installment plans, create additional checkout info
    let checkoutUrl;
    let paymentDescription;

    if (tier === 'core_installment') {
      paymentDescription = 'AI TechStep Core Plan - First installment (1 of 3)';
      checkoutUrl = `/checkout/${checkoutId}?type=installment&amount=${amount}`;
    } else if (tier === 'starter') {
      paymentDescription = 'AI TechStep Starter Unlock';
      checkoutUrl = `/checkout/${checkoutId}?type=starter&amount=${amount}`;
    } else {
      paymentDescription = 'AI TechStep Core Plan - Full payment';
      checkoutUrl = `/checkout/${checkoutId}?type=full&amount=${amount}`;
    }

    console.log('Checkout session created:', checkoutId);

    return c.json({
      success: true,
      checkoutId: checkoutId,
      checkoutUrl: checkoutUrl,
      tier: tier,
      amount: amount,
      description: paymentDescription,
      expiresAt: expiresAt
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to create checkout session' 
    }, 500);
  }
});

// API endpoint to submit equity application
app.post('/api/submit-equity-application', async (c) => {
  try {
    const { env } = c;
    const applicationData = await c.req.json();

    console.log('Submitting equity application for:', applicationData.email);

    // Validate required fields
    const requiredFields = ['name', 'email', 'location', 'venture_idea', 'target_problem', 'time_commitment'];
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        return c.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, 400);
      }
    }

    // Validate equity agreement
    if (!applicationData.equity_agreement) {
      return c.json({ 
        success: false, 
        error: 'Equity agreement must be accepted' 
      }, 400);
    }

    // Create or get user
    const userId = await createUser(env, applicationData.email, applicationData.name, 'en');

    // Save equity application
    const applicationId = crypto.randomUUID();
    
    await env.DB.prepare(`
      INSERT INTO equity_applications (
        id, user_id, name, email, location, venture_idea, target_problem, 
        portfolio, time_commitment, equity_agreement, lead_profile_data, 
        status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `).bind(
      applicationId,
      userId,
      applicationData.name,
      applicationData.email,
      applicationData.location,
      applicationData.venture_idea,
      applicationData.target_problem,
      applicationData.portfolio || null,
      applicationData.time_commitment,
      applicationData.equity_agreement ? 1 : 0,
      JSON.stringify(applicationData.leadProfile || {})
    ).run();

    // Send confirmation email to applicant
    try {
      await sendEquityApplicationConfirmationEmail(applicationData.email, applicationData.name, applicationData);
      console.log('Equity application confirmation email sent to:', applicationData.email);
    } catch (emailError) {
      console.error('Equity application confirmation email failed:', emailError);
      // Don't fail the application for email issues
    }

    // Send notification to support team
    try {
      await sendEquityApplicationNotificationEmail(applicationData);
      console.log('Equity application notification sent to support team');
    } catch (emailError) {
      console.error('Equity application notification failed:', emailError);
      // Don't fail the application for notification issues
    }

    console.log('Equity application saved:', applicationId);

    return c.json({
      success: true,
      message: 'Equity application submitted successfully',
      applicationId: applicationId,
      status: 'pending'
    });

  } catch (error) {
    console.error('Equity application submission error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to submit equity application' 
    }, 500);
  }
});

// API endpoint to process PayPal payment
app.post('/api/process-paypal-payment', async (c) => {
  try {
    const { env } = c;
    const { sessionId, email, name, goal, paypalOrderId, paypalDetails, amount, currency } = await c.req.json();

    console.log('Processing PayPal payment:', { paypalOrderId, email, amount });

    // Validate required fields
    if (!sessionId || !email || !name || !paypalOrderId) {
      return c.json({ 
        success: false, 
        message: 'Missing required payment information' 
      }, 400);
    }

    // Create or get user
    const userId = await createUser(env, email, name, 'en');
    
    // Save payment record
    const paymentResult = await env.DB.prepare(`
      INSERT INTO payments (user_id, amount, currency, payment_method, payment_id, status, payment_data, created_at)
      VALUES (?, ?, ?, 'paypal', ?, 'completed', ?, CURRENT_TIMESTAMP)
    `).bind(
      userId,
      Math.round(amount * 100), // Store in cents
      currency || 'USD',
      paypalOrderId,
      JSON.stringify(paypalDetails)
    ).run();

    console.log('Payment record created:', paymentResult);

    // Calculate track scores if quiz responses exist
    let trackScores: TrackScores = {
      digital_product: 0,
      service: 0,
      ecommerce: 0,
      consulting: 0
    };

    try {
      trackScores = await calculateTrackScores(env, sessionId);
    } catch (error) {
      console.log('No quiz responses found, using default scores');
      // Use default scores for users who go directly to payment
      trackScores = {
        digital_product: 70,
        service: 60,
        ecommerce: 50,
        consulting: 40
      };
    }

    // Assign user track
    const assignedTrack = await assignUserTrack(env, userId, trackScores);
    console.log('Assigned track:', assignedTrack);

    // Create user progress
    await createUserProgress(env, userId);

    // Deliver assets
    await deliverAssets(env, userId, assignedTrack);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name);
      console.log('Welcome email sent to:', email);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Don't fail payment for email issues
    }

    // Send notification to support
    try {
      await sendEmailNotification(email, name, goal, trackScores);
      console.log('Support notification sent');
    } catch (notificationError) {
      console.error('Support notification failed:', notificationError);
      // Don't fail payment for notification issues
    }

    return c.json({
      success: true,
      message: 'Payment processed successfully',
      successUrl: `/success?email=${encodeURIComponent(email)}`,
      paymentId: paypalOrderId,
      userId: userId,
      assignedTrack: assignedTrack
    });

  } catch (error) {
    console.error('PayPal payment processing error:', error);
    return c.json({ 
      success: false, 
      message: 'Payment processing failed. Please contact support.' 
    }, 500);
  }
});

// API endpoint to process checkout payment from pricing modal
app.post('/api/process-checkout-payment', async (c) => {
  try {
    const { env } = c;
    const { checkoutId, paypalOrderId, paypalDetails, amount, currency } = await c.req.json();

    console.log('Processing checkout payment:', { checkoutId, paypalOrderId, amount });

    // Validate input
    if (!checkoutId || !paypalOrderId) {
      return c.json({ 
        success: false, 
        error: 'Missing required payment information' 
      }, 400);
    }

    // Get checkout session
    const checkoutSession = await env.DB.prepare(`
      SELECT cs.*, u.email, u.name 
      FROM checkout_sessions cs 
      JOIN users u ON cs.user_id = u.id 
      WHERE cs.id = ? AND cs.status = 'pending'
    `).bind(checkoutId).first();

    if (!checkoutSession) {
      return c.json({ 
        success: false, 
        error: 'Invalid or expired checkout session' 
      }, 400);
    }

    // Check if session expired
    const expiresAt = new Date(checkoutSession.expires_at);
    const now = new Date();
    if (now > expiresAt) {
      return c.json({ 
        success: false, 
        error: 'Checkout session has expired' 
      }, 400);
    }

    // Verify amount matches
    const expectedAmount = checkoutSession.amount / 100; // Convert from cents
    if (Math.abs(amount - expectedAmount) > 0.01) { // Allow for small rounding differences
      return c.json({ 
        success: false, 
        error: 'Payment amount mismatch' 
      }, 400);
    }

    // Update checkout session as completed
    await env.DB.prepare(`
      UPDATE checkout_sessions 
      SET status = 'completed', payment_intent_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(paypalOrderId, checkoutId).run();

    // Create payment record
    const paymentResult = await env.DB.prepare(`
      INSERT INTO payments (
        user_id, amount, currency, payment_method, payment_id, 
        status, payment_data, tier, checkout_session_id, created_at
      ) VALUES (?, ?, ?, 'paypal', ?, 'completed', ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      checkoutSession.user_id,
      checkoutSession.amount, // Store in cents
      currency || 'USD',
      paypalOrderId,
      JSON.stringify(paypalDetails),
      checkoutSession.tier,
      checkoutId
    ).run();

    console.log('Payment record created:', paymentResult);

    // For installment plans, create remaining installment records
    if (checkoutSession.tier === 'core_installment') {
      const installmentAmount = 199 * 100; // $199 in cents
      const installmentDates = [
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)  // 60 days from now
      ];

      for (let i = 0; i < 2; i++) {
        await env.DB.prepare(`
          INSERT INTO installment_payments (
            checkout_session_id, user_id, installment_number, 
            amount, due_date, created_at
          ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `).bind(
          checkoutId,
          checkoutSession.user_id,
          i + 2, // Installments 2 and 3
          installmentAmount,
          installmentDates[i].toISOString()
        ).run();
      }

      console.log('Created 2 future installments');
    }

    // Calculate track scores and assign track
    let trackScores: TrackScores = {
      digital_product: 70,
      service: 60,
      ecommerce: 50,
      consulting: 40
    };

    // Try to get scores from lead profile if available
    if (checkoutSession.lead_profile_data) {
      try {
        const leadProfile = JSON.parse(checkoutSession.lead_profile_data);
        // Use lead profile data to infer track preferences
        // This is a simplified version - you could make this more sophisticated
        if (leadProfile.readinessScore) {
          const bonus = Math.floor(leadProfile.readinessScore / 25); // 0-4 bonus points
          trackScores.digital_product += bonus;
        }
      } catch (error) {
        console.log('Could not parse lead profile data');
      }
    }

    const assignedTrack = await assignUserTrack(env, checkoutSession.user_id, trackScores);
    console.log('Assigned track:', assignedTrack);

    // Create user progress (28-day challenge)
    await createUserProgress(env, checkoutSession.user_id);

    // Deliver assets based on tier
    await deliverAssets(env, checkoutSession.user_id, assignedTrack);

    // Send purchase confirmation email
    try {
      await sendPurchaseConfirmationEmail(checkoutSession.email, checkoutSession.name, checkoutSession.tier, amount);
      console.log('Purchase confirmation email sent to:', checkoutSession.email);
    } catch (emailError) {
      console.error('Purchase confirmation email failed:', emailError);
      // Don't fail payment for email issues
    }

    // Trigger post-purchase email sequence
    try {
      await triggerEmailSequence(env, 'purchase_complete', checkoutSession.email, checkoutSession.name, {
        tier: checkoutSession.tier,
        amount: amount,
        checkoutId: checkoutId
      });
      console.log('Post-purchase email sequence triggered for:', checkoutSession.email);
    } catch (sequenceError) {
      console.error('Post-purchase email sequence failed:', sequenceError);
      // Don't fail payment for sequence issues
    }

    return c.json({
      success: true,
      message: 'Payment processed successfully',
      successUrl: `/success?checkout=${checkoutId}&email=${encodeURIComponent(checkoutSession.email)}&tier=${checkoutSession.tier}`,
      paymentId: paypalOrderId,
      userId: checkoutSession.user_id,
      tier: checkoutSession.tier,
      assignedTrack: assignedTrack
    });

  } catch (error) {
    console.error('Checkout payment processing error:', error);
    return c.json({ 
      success: false, 
      error: 'Payment processing failed. Please contact support.' 
    }, 500);
  }
});

// API endpoint to track checkout abandonment for email sequences
app.post('/api/track-checkout-abandonment', async (c) => {
  try {
    const { checkoutId, tier, abandonedAt } = await c.req.json();
    
    console.log('Tracking checkout abandonment:', { checkoutId, tier });

    // Update checkout session with abandonment info
    await c.env.DB.prepare(`
      UPDATE checkout_sessions 
      SET status = 'abandoned', updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pending'
    `).bind(checkoutId).run();

    // Trigger email sequence for abandoned checkouts
    try {
      // Get checkout session to get user info
      const checkoutSession = await c.env.DB.prepare(`
        SELECT cs.*, u.email, u.name 
        FROM checkout_sessions cs 
        JOIN users u ON cs.user_id = u.id 
        WHERE cs.id = ?
      `).bind(checkoutId).first();

      if (checkoutSession) {
        await triggerEmailSequence(c.env, 'checkout_abandonment', checkoutSession.email, checkoutSession.name, {
          checkoutId: checkoutId,
          tier: checkoutSession.tier
        });
        console.log(`Checkout abandonment email sequence triggered for ${checkoutSession.email}`);
      }
    } catch (sequenceError) {
      console.error('Checkout abandonment email sequence failed:', sequenceError);
    }

    return c.json({ success: true, message: 'Abandonment tracked' });

  } catch (error) {
    console.error('Abandonment tracking error:', error);
    return c.json({ success: false, error: 'Tracking failed' }, 500);
  }
});

// Checkout page for pricing modal tiers
app.get('/checkout/:checkoutId', async (c) => {
  const checkoutId = c.req.param('checkoutId');
  const type = c.req.query('type'); // 'starter', 'full', 'installment'
  const amount = c.req.query('amount');
  
  if (!checkoutId) {
    return c.redirect('/');
  }
  
  // Get checkout session
  let checkoutSession;
  try {
    checkoutSession = await c.env.DB.prepare(`
      SELECT cs.*, u.email, u.name 
      FROM checkout_sessions cs 
      JOIN users u ON cs.user_id = u.id 
      WHERE cs.id = ?
    `).bind(checkoutId).first();
    
    if (!checkoutSession) {
      return c.redirect('/');
    }
    
    // Check if expired
    const expiresAt = new Date(checkoutSession.expires_at);
    const now = new Date();
    if (now > expiresAt) {
      return c.redirect('/?error=checkout_expired');
    }
    
  } catch (error) {
    console.error('Checkout session lookup error:', error);
    return c.redirect('/');
  }
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-full font-bold mb-4 inline-block">
            🎯 SECURE CHECKOUT
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Complete Your AI Launch Plan
          </h1>
          <p className="text-lg text-gray-600">
            {checkoutSession.tier === 'starter' && 'Starter Unlock - Get started with AI basics'}
            {checkoutSession.tier === 'core_full' && 'Core Plan - Full access with live coaching'}
            {checkoutSession.tier === 'core_installment' && 'Core Plan - Pay in 3 installments'}
          </p>
        </div>

        {/* Checkout Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-300 p-6 sm:p-8 relative">
            
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                {checkoutSession.tier === 'starter' && 'Starter Unlock'}
                {checkoutSession.tier === 'core_full' && 'Core Plan'}  
                {checkoutSession.tier === 'core_installment' && 'Core Plan - Installments'}
              </h2>
              
              <div className="mb-6">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  ${Math.round(checkoutSession.amount / 100)}
                  {checkoutSession.tier === 'core_installment' && ' × 3'}
                </div>
                <div className="text-lg text-green-600 font-semibold">
                  {checkoutSession.tier === 'core_installment' ? 'First installment today' : 'One-time payment'}
                </div>
              </div>

              {/* Features based on tier */}
              <div className="text-left space-y-4 mb-8 bg-gray-50 rounded-lg p-6">
                {checkoutSession.tier === 'starter' && (
                  <>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>AI Profile & Readiness Score</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>Week-1 roadmap preview</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>Starter prompts & mini toolkit</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>Upgrade to Core anytime (credit $49)</div>
                    </div>
                  </>
                )}
                
                {(checkoutSession.tier === 'core_full' || checkoutSession.tier === 'core_installment') && (
                  <>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div><strong>Weekly live coaching</strong> with real entrepreneurs</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>Full 28-Day AI Launch Plan</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>AI Prompt Bank ($299 value)</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>Marketing Toolkit ($199 value)</div>
                    </div>
                    <div className="flex items-start">
                      <div className="text-green-500 mr-3">✅</div>
                      <div>Private community access</div>
                    </div>
                  </>
                )}
              </div>

              {/* Customer Information */}
              <div className="mb-6 space-y-4 text-left">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={checkoutSession.email}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input 
                    type="text" 
                    value={checkoutSession.name}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              {/* PayPal Payment */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Complete payment with PayPal</p>
                  <p className="text-xs text-gray-500">💳 Credit cards, debit cards, or PayPal balance</p>
                </div>
                
                <div id="paypal-checkout-container" className="min-h-[60px]">
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading PayPal...</p>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mb-6 text-center">
                🔒 Secure PayPal encryption • ✅ No subscription • 💳 All payment methods accepted
              </div>

              {/* Money-back guarantee */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💝 30-Day Money-Back Guarantee</h4>
                  <p className="text-sm text-green-700">
                    {checkoutSession.tier === 'core_full' || checkoutSession.tier === 'core_installment' 
                      ? 'Complete all 4 weeks; if you don\'t launch, 50% refund.' 
                      : 'Try risk-free. Full refund within 30 days if not satisfied.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Session info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Session expires: <span id="checkout-expires">{new Date(checkoutSession.expires_at).toLocaleString()}</span></p>
          <p className="mt-2">Need help? Contact support@techstepfoundation.org</p>
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          // Pass checkout data to JavaScript
          window.checkoutData = {
            checkoutId: '${checkoutId}',
            tier: '${checkoutSession.tier}',
            amount: ${checkoutSession.amount},
            email: '${checkoutSession.email}',
            name: '${checkoutSession.name}',
            expiresAt: '${checkoutSession.expires_at}'
          };
        `
      }}></script>
      <script src="/static/checkout-payment.js"></script>
    </div>,
    { title: `Secure Checkout - ${checkoutSession.tier === 'starter' ? 'Starter Unlock' : 'Core Plan'} | AI TechStep` }
  );
});

// Dashboard - Post-purchase member area with progress tracking
app.get('/dashboard', async (c) => {
  // In a real app, you'd have authentication middleware here
  // For demo, we'll accept email as query parameter
  const email = c.req.query('email') || 'demo@example.com';
  const demo = c.req.query('demo') === 'true';
  
  let userData = null;
  let userProgress = [];
  let userAssets = [];
  let paymentInfo = null;
  let leadProfile = null;
  
  try {
    // Get user data
    if (!demo) {
      const user = await getUserByEmail(c.env, email);
      if (!user) {
        return c.redirect(`/?error=user_not_found&email=${encodeURIComponent(email)}`);
      }
      
      userData = user;
      
      // Get user progress
      const progressResult = await c.env.DB.prepare(`
        SELECT * FROM user_progress 
        WHERE user_id = ? 
        ORDER BY day ASC
      `).bind(user.id).all();
      
      userProgress = progressResult.results || [];
      
      // Get user assets
      const assetsResult = await c.env.DB.prepare(`
        SELECT * FROM user_assets 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `).bind(user.id).all();
      
      userAssets = assetsResult.results || [];
      
      // Get payment info
      const paymentResult = await c.env.DB.prepare(`
        SELECT * FROM payments 
        WHERE user_id = ? AND status = 'completed'
        ORDER BY created_at DESC 
        LIMIT 1
      `).bind(user.id).first();
      
      paymentInfo = paymentResult;
      
      // Get lead profile
      const profileResult = await c.env.DB.prepare(`
        SELECT * FROM lead_profiles 
        WHERE user_id = ?
      `).bind(user.id).first();
      
      leadProfile = profileResult;
    }
  } catch (error) {
    console.error('Dashboard data loading error:', error);
    // Continue with demo data if database fails
  }
  
  // Use demo data if needed
  if (!userData || demo) {
    userData = {
      id: 1,
      email: email,
      name: 'Demo User',
      created_at: new Date().toISOString()
    };
    
    // Generate demo progress (28 days)
    userProgress = Array.from({ length: 28 }, (_, i) => ({
      day: i + 1,
      status: i === 0 ? 'completed' : i < 7 ? 'unlocked' : 'locked',
      phase: 'ai_mastery',
      completed_at: i === 0 ? new Date().toISOString() : null,
      unlocked_at: i < 7 ? new Date().toISOString() : null
    }));
    
    userAssets = [
      {
        asset_type: 'course',
        asset_name: 'Week 1: AI Foundation',
        asset_url: '/assets/week-1-foundation'
      },
      {
        asset_type: 'template',
        asset_name: 'AI Prompt Bank',
        asset_url: '/assets/ai-prompt-bank'
      }
    ];
    
    paymentInfo = {
      tier: demo ? 'demo' : 'core_full',
      amount: demo ? 0 : 49900,
      created_at: new Date().toISOString()
    };
    
    leadProfile = {
      ai_class: 'Digital Nomad Rogue',
      readiness_score: 85
    };
  }
  
  const currentWeek = Math.min(Math.ceil(userProgress.filter(p => p.status === 'completed').length / 7) + 1, 4);
  const completedDays = userProgress.filter(p => p.status === 'completed').length;
  const totalDays = userProgress.length;
  const progressPercentage = Math.round((completedDays / totalDays) * 100);
  
  return c.render(
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-xl font-bold text-blue-600 mr-8">AI TechStep</div>
              <nav className="hidden md:flex space-x-8">
                <a href="/dashboard" className="text-blue-600 font-medium">Dashboard</a>
                <a href="/dashboard?tab=progress" className="text-gray-600 hover:text-gray-900">Progress</a>
                <a href="/dashboard?tab=resources" className="text-gray-600 hover:text-gray-900">Resources</a>
                <a href="/dashboard?tab=community" className="text-gray-600 hover:text-gray-900">Community</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, {userData.name}</div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {userData.name}! 🚀</h1>
                <p className="text-blue-100 mb-4">You're on your way to AI mastery - let's continue your journey</p>
                
                {leadProfile && (
                  <div className="bg-white bg-opacity-20 rounded-lg p-3 inline-block">
                    <div className="text-sm font-medium">Your AI Class: <span className="font-bold">{leadProfile.ai_class}</span></div>
                    <div className="text-xs text-blue-100">Readiness Score: {leadProfile.readiness_score}/100</div>
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{progressPercentage}%</div>
                  <div className="text-sm text-blue-100">Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedDays}/{totalDays}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="text-green-600 text-xl">✅</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Week</p>
                <p className="text-2xl font-bold text-gray-900">Week {currentWeek}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-blue-600 text-xl">📅</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resources</p>
                <p className="text-2xl font-bold text-gray-900">{userAssets.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="text-purple-600 text-xl">📚</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Plan</p>
                <p className="text-lg font-bold text-gray-900">
                  {paymentInfo?.tier === 'starter' && 'Starter'}
                  {paymentInfo?.tier === 'core_full' && 'Core Plan'}  
                  {paymentInfo?.tier === 'core_installment' && 'Core (Installments)'}
                  {paymentInfo?.tier === 'demo' && 'Demo Access'}
                  {!paymentInfo?.tier && 'Free Access'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="text-yellow-600 text-xl">⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Daily Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">28-Day AI Launch Journey</h2>
                <p className="text-gray-600 mt-1">Track your daily progress and unlock new content</p>
              </div>
              
              <div className="p-6">
                {/* Week Navigation */}
                <div className="flex space-x-4 mb-6">
                  {[1, 2, 3, 4].map(week => (
                    <button 
                      key={week}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentWeek === week 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Week {week}
                    </button>
                  ))}
                </div>

                {/* Progress Timeline */}
                <div className="space-y-4">
                  {userProgress.slice((currentWeek - 1) * 7, currentWeek * 7).map((day, index) => (
                    <div key={day.day} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        day.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : day.status === 'unlocked'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {day.status === 'completed' ? '✓' : day.day}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Day {day.day}: {getDayTitle(day.day)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {getDayDescription(day.day)}
                            </p>
                            {day.completed_at && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed on {new Date(day.completed_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div>
                            {day.status === 'completed' && (
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Review
                              </button>
                            )}
                            {day.status === 'unlocked' && (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                                Start
                              </button>
                            )}
                            {day.status === 'locked' && (
                              <span className="text-gray-400 text-sm">Locked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium">
                  📺 Watch Today's Lesson
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium">
                  💬 Join Live Coaching
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium">
                  👥 Community Chat
                </button>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Resources</h3>
              <div className="space-y-3">
                {userAssets.slice(0, 5).map((asset, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div className="text-blue-600">
                      {asset.asset_type === 'course' && '🎓'}
                      {asset.asset_type === 'template' && '📝'}
                      {asset.asset_type === 'tool' && '🛠️'}
                      {asset.asset_type === 'video' && '📹'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{asset.asset_name}</p>
                    </div>
                  </div>
                ))}
                <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium py-2">
                  View All Resources →
                </button>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="font-bold mb-1">AI Pioneer</h3>
                <p className="text-xs text-yellow-100">You've started your AI journey!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <script src="/static/dashboard.js"></script>
    </div>,
    { title: `Dashboard - AI TechStep Challenge | ${userData.name}` }
  );
});

// Helper functions for dashboard
function getDayTitle(day: number): string {
  const titles = [
    "AI Foundations & Goal Setting",
    "Understanding AI Tools Landscape", 
    "Identifying Your AI Niche",
    "Market Research with AI",
    "Building Your First AI Prompt",
    "AI Content Creation Basics",
    "Week 1 Review & Planning",
    
    "AI Business Model Selection",
    "Setting Up Your AI Toolkit", 
    "Creating Your Brand with AI",
    "AI-Powered Market Analysis",
    "Product Development Strategy",
    "AI Marketing Fundamentals",
    "Week 2 Milestone Check",
    
    "Launch Preparation",
    "AI-Generated Content Strategy",
    "Building Your Online Presence", 
    "Customer Acquisition with AI",
    "Automation & Workflows",
    "Testing & Optimization",
    "Week 3 Progress Review",
    
    "Go-to-Market Strategy",
    "AI Sales & Conversion",
    "Scaling Your AI Business",
    "Advanced AI Applications", 
    "Performance Tracking",
    "Community Building",
    "Graduation & Next Steps"
  ];
  
  return titles[day - 1] || `Day ${day} Content`;
}

function getDayDescription(day: number): string {
  const descriptions = [
    "Set your AI goals and understand the fundamentals",
    "Explore the AI tools ecosystem and find your fit",
    "Discover your unique AI business opportunity", 
    "Use AI for market research and validation",
    "Create your first effective AI prompts",
    "Generate content using AI tools",
    "Consolidate learning and plan week 2",
    
    "Choose your AI business model",
    "Set up essential AI tools and workflows",
    "Build your brand identity with AI assistance", 
    "Conduct deep market analysis using AI",
    "Develop your AI-powered product/service",
    "Learn AI marketing strategies",
    "Assess progress and adjust strategy",
    
    "Prepare for your business launch",
    "Create content strategy using AI",
    "Build your digital presence with AI",
    "Acquire customers using AI tools", 
    "Automate processes and workflows",
    "Test and optimize your offering",
    "Review week 3 achievements",
    
    "Execute your go-to-market plan", 
    "Implement AI sales processes",
    "Scale your business with AI",
    "Explore advanced AI capabilities",
    "Track and measure performance",
    "Build your AI business community",
    "Celebrate success and plan future growth"
  ];
  
  return descriptions[day - 1] || "Continue your AI journey";
}

// Helper function to trigger email sequences
async function triggerEmailSequence(env: Bindings, trigger: string, userEmail: string, userName: string, metadata: any = {}) {
  try {
    // Get user
    const user = await getUserByEmail(env, userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    // Define email sequences
    let emailSequence = [];
    
    switch (trigger) {
      case 'ai_profile_complete':
        emailSequence = [
          { delay: 0, template: 'ai_profile_welcome' },
          { delay: 24, template: 'ai_profile_follow_up' },
          { delay: 72, template: 'ai_profile_special_offer' }
        ];
        break;
        
      case 'checkout_abandonment':
        emailSequence = [
          { delay: 1, template: 'checkout_reminder' },
          { delay: 24, template: 'checkout_urgency' },
          { delay: 72, template: 'checkout_final_chance' }
        ];
        break;
        
      case 'purchase_complete':
        emailSequence = [
          { delay: 0, template: 'purchase_welcome' },
          { delay: 24, template: 'getting_started_guide' },
          { delay: 168, template: 'week_one_check_in' } // 7 days
        ];
        break;
        
      case 'equity_application':
        emailSequence = [
          { delay: 0, template: 'equity_application_received' },
          { delay: 72, template: 'equity_application_under_review' }
        ];
        break;
        
      case 'affiliate_application':
        emailSequence = [
          { delay: 0, template: 'affiliate_application_received' },
          { delay: 1, template: 'affiliate_onboarding' }
        ];
        break;
        
      case 'institutional_inquiry':
        emailSequence = [
          { delay: 0, template: 'institutional_inquiry_received' },
          { delay: 24, template: 'institutional_partnership_proposal' }
        ];
        break;
        
      default:
        throw new Error(`Unknown email trigger: ${trigger}`);
    }

    // Save email sequence to database
    for (const email of emailSequence) {
      const scheduledAt = new Date(Date.now() + email.delay * 60 * 60 * 1000); // Convert hours to milliseconds
      
      await env.DB.prepare(`
        INSERT INTO email_sequences (
          user_id, trigger_type, template_name, scheduled_at, 
          status, metadata, created_at
        ) VALUES (?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)
      `).bind(
        user.id,
        trigger,
        email.template,
        scheduledAt.toISOString(),
        JSON.stringify(metadata)
      ).run();
    }

    console.log(`Scheduled ${emailSequence.length} emails for user ${userEmail} (trigger: ${trigger})`);
    
    return {
      success: true,
      emailsScheduled: emailSequence.length
    };

  } catch (error) {
    console.error('Error triggering email sequence:', error);
    throw error;
  }
}

// Email automation sequences
app.post('/api/send-email-sequence', async (c) => {
  try {
    const { env } = c;
    const { trigger, userEmail, userName, metadata } = await c.req.json();

    console.log('Triggering email sequence:', { trigger, userEmail });

    // Validate input
    if (!trigger || !userEmail) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: trigger, userEmail' 
      }, 400);
    }

    // Get user data
    const user = await getUserByEmail(env, userEmail);
    if (!user) {
      return c.json({ 
        success: false, 
        error: 'User not found' 
      }, 400);
    }

    // Schedule email sequence based on trigger
    let emailSequence = [];
    
    switch (trigger) {
      case 'ai_profile_complete':
        emailSequence = [
          { delay: 0, template: 'ai_profile_welcome' },
          { delay: 24, template: 'ai_profile_follow_up' },
          { delay: 72, template: 'ai_profile_special_offer' }
        ];
        break;
        
      case 'checkout_abandonment':
        emailSequence = [
          { delay: 1, template: 'checkout_reminder' },
          { delay: 24, template: 'checkout_urgency' },
          { delay: 72, template: 'checkout_final_chance' }
        ];
        break;
        
      case 'purchase_complete':
        emailSequence = [
          { delay: 0, template: 'purchase_welcome' },
          { delay: 24, template: 'getting_started_guide' },
          { delay: 168, template: 'week_one_check_in' } // 7 days
        ];
        break;
        
      default:
        return c.json({ 
          success: false, 
          error: 'Unknown email trigger' 
        }, 400);
    }

    // Save email sequence to database
    for (const email of emailSequence) {
      const scheduledAt = new Date(Date.now() + email.delay * 60 * 60 * 1000); // Convert hours to milliseconds
      
      await env.DB.prepare(`
        INSERT INTO email_sequences (
          user_id, trigger_type, template_name, scheduled_at, 
          status, metadata, created_at
        ) VALUES (?, ?, ?, ?, 'pending', ?, CURRENT_TIMESTAMP)
      `).bind(
        user.id,
        trigger,
        email.template,
        scheduledAt.toISOString(),
        JSON.stringify(metadata || {})
      ).run();
    }

    console.log(`Scheduled ${emailSequence.length} emails for user ${userEmail}`);

    return c.json({
      success: true,
      message: `Email sequence scheduled for ${trigger}`,
      emailsScheduled: emailSequence.length
    });

  } catch (error) {
    console.error('Email sequence scheduling error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to schedule email sequence' 
    }, 500);
  }
});

// Process pending email sequences (would be called by a cron job)
app.post('/api/process-email-queue', async (c) => {
  try {
    const { env } = c;
    const now = new Date().toISOString();

    console.log('Processing email queue at:', now);

    // Get pending emails that are due
    const pendingEmails = await env.DB.prepare(`
      SELECT es.*, u.email, u.name 
      FROM email_sequences es
      JOIN users u ON es.user_id = u.id
      WHERE es.status = 'pending' AND es.scheduled_at <= ?
      ORDER BY es.scheduled_at ASC
      LIMIT 50
    `).bind(now).all();

    let processedCount = 0;
    let errorCount = 0;

    for (const emailRecord of pendingEmails.results || []) {
      try {
        // Generate and send email based on template
        const emailContent = await generateEmailFromTemplate(
          emailRecord.template_name,
          {
            email: emailRecord.email,
            name: emailRecord.name,
            metadata: JSON.parse(emailRecord.metadata || '{}')
          }
        );

        // In production, send via email service
        console.log(`📧 Sending ${emailRecord.template_name} to ${emailRecord.email}`);
        
        // Mark as sent
        await env.DB.prepare(`
          UPDATE email_sequences 
          SET status = 'sent', sent_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(emailRecord.id).run();

        processedCount++;

      } catch (error) {
        console.error(`Failed to send email ${emailRecord.id}:`, error);
        
        // Mark as failed
        await env.DB.prepare(`
          UPDATE email_sequences 
          SET status = 'failed', error_message = ?
          WHERE id = ?
        `).bind(error.message, emailRecord.id).run();

        errorCount++;
      }
    }

    return c.json({
      success: true,
      message: 'Email queue processed',
      processed: processedCount,
      errors: errorCount,
      totalPending: pendingEmails.results?.length || 0
    });

  } catch (error) {
    console.error('Email queue processing error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to process email queue' 
    }, 500);
  }
});

// Generate email content from template
async function generateEmailFromTemplate(templateName: string, userData: any) {
  const templates = {
    // AI Profile completion sequence
    ai_profile_welcome: {
      subject: `🎯 Your AI Profile Results - ${userData.metadata.aiClass}!`,
      html: generateAIProfileWelcomeEmail(userData)
    },
    
    ai_profile_follow_up: {
      subject: '💡 Ready to turn your AI Profile into income?',
      html: generateAIProfileFollowUpEmail(userData)
    },
    
    ai_profile_special_offer: {
      subject: '⏰ Last Chance: 50% OFF AI TechStep (Expires Tonight)',
      html: generateAIProfileSpecialOfferEmail(userData)
    },
    
    // Checkout abandonment sequence
    checkout_reminder: {
      subject: 'Did you forget something? Your AI plan is waiting...',
      html: generateCheckoutReminderEmail(userData)
    },
    
    checkout_urgency: {
      subject: '🚨 Your discount expires in 24 hours',
      html: generateCheckoutUrgencyEmail(userData)
    },
    
    checkout_final_chance: {
      subject: 'This is your final chance (seriously)',
      html: generateCheckoutFinalChanceEmail(userData)
    },
    
    // Post-purchase sequence
    purchase_welcome: {
      subject: '🎉 Welcome to AI TechStep - Your journey starts now!',
      html: generatePurchaseWelcomeEmail(userData)
    },
    
    getting_started_guide: {
      subject: '📚 Your AI Success Roadmap (Day 1 starts here)',
      html: generateGettingStartedEmail(userData)
    },
    
    week_one_check_in: {
      subject: 'How\'s your AI journey going? (Week 1 check-in)',
      html: generateWeekOneCheckInEmail(userData)
    }
  };

  const template = templates[templateName];
  if (!template) {
    throw new Error(`Unknown email template: ${templateName}`);
  }

  return template;
}

// Email template generators
function generateAIProfileFollowUpEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1f2937;">Ready to Act on Your AI Profile? 🚀</h1>
      <p>Hi ${userData.name},</p>
      <p>You discovered your AI class: <strong>${userData.metadata.aiClass || 'AI Entrepreneur'}</strong></p>
      <p>But here's the thing - profiles are just the beginning. The real magic happens when you take action.</p>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>💡 What successful AI entrepreneurs do next:</h3>
        <ul>
          <li>✅ Turn insights into income-generating systems</li>
          <li>✅ Build AI-powered businesses that scale</li>
          <li>✅ Connect with other successful entrepreneurs</li>
        </ul>
      </div>
      
      <p><a href="/pricing" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">🎯 Start Your AI Business Journey</a></p>
      
      <p>Questions? Just reply to this email.</p>
      <p>Best regards,<br/>The AI TechStep Team</p>
    </div>
  `;
}

function generateAIProfileSpecialOfferEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0;">⏰ EXPIRES TONIGHT: 50% OFF</h1>
      </div>
      
      <p>Hi ${userData.name},</p>
      <p>This is it. Your last chance to join AI TechStep at 50% off.</p>
      
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
        <h3 style="color: #92400e;">⚡ Why tonight matters:</h3>
        <p style="color: #92400e; margin: 0;">After midnight, the price goes back to $499. This discount won't return.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 24px; font-weight: bold; color: #dc2626;">$499 → $249</p>
        <p><a href="/pricing?code=LAST50" style="background: #dc2626; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">🚨 CLAIM 50% OFF NOW</a></p>
      </div>
      
      <p>Don't let this slip away,<br/>The AI TechStep Team</p>
    </div>
  `;
}

function generateCheckoutReminderEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1f2937;">Did you forget something? 🤔</h1>
      <p>Hi ${userData.name},</p>
      <p>You were just one step away from starting your AI journey...</p>
      
      <div style="background: #dbeafe; border: 1px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af;">Your AI TechStep plan is still waiting:</h3>
        <p style="color: #1e40af; margin: 5px 0;">✅ 28-Day AI Launch Program</p>
        <p style="color: #1e40af; margin: 5px 0;">✅ Live Coaching with Real Entrepreneurs</p>
        <p style="color: #1e40af; margin: 5px 0;">✅ AI Prompt Bank ($299 value)</p>
        <p style="color: #1e40af; margin: 5px 0;">✅ Private Community Access</p>
      </div>
      
      <p>Complete your enrollment in the next 24 hours and your spot is secured.</p>
      
      <p><a href="/checkout/${userData.metadata.checkoutId}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">✅ Complete My Enrollment</a></p>
      
      <p>Still have questions? Just reply to this email.</p>
      <p>Best,<br/>The AI TechStep Team</p>
    </div>
  `;
}

function generateCheckoutUrgencyEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f59e0b; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0;">🚨 24 Hours Left</h1>
      </div>
      
      <p>Hi ${userData.name},</p>
      <p><strong>Your checkout session expires in 24 hours.</strong></p>
      
      <p>After that, you'll need to restart the entire process - and there's no guarantee the same pricing will be available.</p>
      
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e;">What you're missing out on:</h3>
        <ul style="color: #92400e;">
          <li>Weekly live sessions with entrepreneurs who've built 100+ businesses</li>
          <li>Step-by-step roadmap to your first $1K AI project</li>
          <li>Done-for-you templates and resources</li>
          <li>Private community of 700K+ members</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><a href="/checkout/${userData.metadata.checkoutId}" style="background: #dc2626; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">🔥 SECURE MY SPOT NOW</a></p>
        <p style="font-size: 12px; color: #6b7280;">This link expires in 24 hours</p>
      </div>
      
      <p>Don't wait,<br/>The AI TechStep Team</p>
    </div>
  `;
}

function generateCheckoutFinalChanceEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0; font-size: 28px;">This is your final chance</h1>
        <p style="margin: 10px 0 0 0;">(seriously)</p>
      </div>
      
      <p>Hi ${userData.name},</p>
      
      <p><strong>Your checkout session expires tonight at midnight.</strong></p>
      
      <p>I won't send another email about this. After tonight, this opportunity is gone.</p>
      
      <div style="background: #1f2937; color: white; padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <h2 style="color: white; margin-top: 0;">The Choice</h2>
        <p>👈 Close this email and stay where you are</p>
        <p style="margin: 20px 0;">OR</p>
        <p>👉 Take action and join 700K+ people building AI businesses</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><a href="/checkout/${userData.metadata.checkoutId}" style="background: #10b981; color: white; padding: 25px 50px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 18px;">I'M READY TO START</a></p>
      </div>
      
      <p>This is the last time you'll hear from me about this,</p>
      <p>The AI TechStep Team</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;"/>
      <p style="font-size: 12px; color: #6b7280;">You're receiving this because you started checkout but didn't complete it. You won't receive any more emails about this offer after tonight.</p>
    </div>
  `;
}

function generatePurchaseWelcomeEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #1f2937; font-size: 32px;">🎉 Welcome to AI TechStep!</h1>
        <p style="color: #3b82f6; font-size: 18px;">"Step into AI Success - One Click at a Time"</p>
      </div>
      
      <p>Hi ${userData.name},</p>
      <p><strong>You did it! You're officially part of the AI TechStep family.</strong></p>
      
      <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center;">
        <h2 style="color: white; margin-top: 0;">Your 28-Day Journey Starts NOW</h2>
        <p style="margin: 15px 0;">You're joining 700,000+ people who've transformed their lives with AI</p>
      </div>
      
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #0c4a6e;">🎯 What happens next:</h3>
        <ol style="color: #0c4a6e;">
          <li><strong>Check your dashboard:</strong> Your Day 1 content is ready</li>
          <li><strong>Join the community:</strong> Connect with other AI entrepreneurs</li>
          <li><strong>Mark your calendar:</strong> First live coaching session this week</li>
        </ol>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><a href="/dashboard?email=${userData.email}" style="background: #10b981; color: white; padding: 20px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">🚀 ACCESS MY DASHBOARD</a></p>
      </div>
      
      <p><strong>Remember:</strong> Success comes from taking action, not just consuming content. Your first lesson takes just 15 minutes.</p>
      
      <p>Questions? Just reply to this email - I read every response personally.</p>
      
      <p>Welcome to your AI future,<br/>The AI TechStep Team</p>
    </div>
  `;
}

function generateGettingStartedEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1f2937;">📚 Your AI Success Roadmap</h1>
      <p>Hi ${userData.name},</p>
      <p>Ready to start Day 1? Here's everything you need to know:</p>
      
      <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af;">🎯 Day 1: AI Foundations & Goal Setting</h3>
        <p style="color: #1e40af;"><strong>Time needed:</strong> 15-20 minutes</p>
        <p style="color: #1e40af;"><strong>What you'll learn:</strong></p>
        <ul style="color: #1e40af;">
          <li>What AI really is (in simple terms)</li>
          <li>How AI creates income opportunities</li>
          <li>Your first AI tool: ChatGPT basics</li>
          <li>Setting up your AI workspace</li>
        </ul>
      </div>
      
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #15803d;">💡 Pro Tips for Success:</h3>
        <ul style="color: #15803d;">
          <li><strong>Start small:</strong> Just 15 minutes today</li>
          <li><strong>Take notes:</strong> Knowledge compounds</li>
          <li><strong>Ask questions:</strong> Use the community</li>
          <li><strong>Apply immediately:</strong> Don't wait to implement</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><a href="/dashboard?email=${userData.email}" style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">📺 Start Day 1 Lesson</a></p>
      </div>
      
      <p>Remember: The only way to fail is to not start. You've got this!</p>
      
      <p>Cheering you on,<br/>The AI TechStep Team</p>
    </div>
  `;
}

function generateWeekOneCheckInEmail(userData: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1f2937;">How's your AI journey going? 🚀</h1>
      <p>Hi ${userData.name},</p>
      <p>It's been a week since you joined AI TechStep. How are you feeling?</p>
      
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #92400e;">📊 Week 1 Check-in Questions:</h3>
        <ul style="color: #92400e;">
          <li>Have you completed your first AI lesson?</li>
          <li>Did you set up your AI workspace?</li>
          <li>Are you clear on your AI goals?</li>
          <li>Have you joined the community yet?</li>
        </ul>
      </div>
      
      <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #047857;">🎯 If you're ahead of schedule:</h3>
        <p style="color: #047857;">Amazing! Share your progress in the community and help others who might be struggling.</p>
        
        <h3 style="color: #047857;">🤝 If you're feeling behind:</h3>
        <p style="color: #047857;">No worries! Everyone moves at their own pace. The key is to keep moving forward, even if it's just 10 minutes today.</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p><a href="/dashboard?email=${userData.email}" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">📈 Continue My Journey</a></p>
      </div>
      
      <p><strong>Need help?</strong> Just reply to this email. I personally read every response and will get back to you within 24 hours.</p>
      
      <p>Keep building your AI future,<br/>The AI TechStep Team</p>
      
      <hr style="margin: 30px 0;"/>
      <p style="font-size: 12px; color: #6b7280;">P.S. Next week we dive into building your first AI business model. Exciting stuff ahead!</p>
    </div>
  `;
}

// API endpoint to handle partnership applications
app.post('/api/submit-partnership-application', async (c) => {
  try {
    const { env } = c;
    const applicationData = await c.req.json();
    
    console.log('Partnership application received:', applicationData);

    // Validate required fields based on application type
    const requiredFields = ['type', 'first_name', 'last_name', 'email'];
    
    for (const field of requiredFields) {
      if (!applicationData[field]) {
        return c.json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        }, 400);
      }
    }

    // Create or get user
    const email = applicationData.email;
    const name = `${applicationData.first_name} ${applicationData.last_name}`;
    
    let userId;
    try {
      userId = await createUser(env, email, name, 'en');
    } catch (error) {
      // User might already exist
      const existingUser = await getUserByEmail(env, email);
      if (existingUser) {
        userId = existingUser.id;
      } else {
        throw error;
      }
    }

    // Save partnership application to database
    const insertResult = await env.DB.prepare(`
      INSERT INTO partnership_applications (
        user_id, application_type, application_data, 
        status, created_at, updated_at
      ) VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      userId,
      applicationData.type,
      JSON.stringify(applicationData)
    ).run();

    // Trigger appropriate email sequence
    switch (applicationData.type) {
      case 'equity':
        await triggerEmailSequence(env, 'equity_application', email, name, applicationData);
        break;
      case 'affiliate':
        await triggerEmailSequence(env, 'affiliate_application', email, name, applicationData);
        break;
      case 'institutional':
        await triggerEmailSequence(env, 'institutional_inquiry', email, name, applicationData);
        break;
    }

    console.log(`${applicationData.type} application saved for ${email}`);

    return c.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: insertResult.meta.last_row_id,
      type: applicationData.type
    });

  } catch (error) {
    console.error('Partnership application error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to submit application' 
    }, 500);
  }
});

// Privacy Policy page
app.get('/privacy', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last Updated: September 3, 2025</p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Policy is incorporated by reference in the Terms and Conditions of AI TechStep™ ("AI TechStep", or "us") and is part of the agreement between you, user of the Website ("Website" or "Service"), and AI TechStep.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Important Privacy Information</h2>
            <p className="text-gray-700 mb-4">
              To use the service on the Website, we may ask you to enter information about your age, gender, email address, name, current AI experience and ask other onboarding questions. We also automatically collect from your device: language settings, IP address, time zone, type and model of a device, device settings, operating system. We need this data to provide our services, analyze how our customers use the service and to measure ads.
            </p>

            <p className="text-gray-700 mb-6">
              For improving our service and serving ads, we use third party solutions. As a result, we may process data using solutions developed by Amazon Web Services, Meta, Google, TikTok, Hotjar, Amplitude, Apple, PayPal, FreshDesk, Solidgate, ActiveCampaign. Therefore, some of the data is stored and processed on servers of such third parties. This enables us to: (1) analyze different interactions (how often users make purchases, what is the most popular users' AI learning goal, what is the average time spent by users on the service); (2) serve ads (and are able to show them only to a particular group users, for example, to users interested in AI education). Consequently, we, in particular, better understand in what of our features and content you see the most value and are able to focus on them to enhance your experience and increase the quality of our products.
            </p>

            <p className="text-gray-700 mb-6">
              Please read our Privacy Policy below to know more about what we do with data (Section 3), what data privacy rights are available to you (Section 6) and who will be the data controller (Section 1). If any questions remain unanswered, please contact us through info@ipsglobalconsulting.com.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Privacy Policy</h2>
            <p className="text-gray-700 mb-6">
              This Privacy Policy explains what personal data is collected when you use the AI TechStep Website and the services and Digital products provided through it (the "Service"), how such personal data will be processed.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                BY USING THE SERVICE, YOU PROMISE US THAT (I) YOU HAVE READ, UNDERSTAND AND AGREE TO THIS PRIVACY POLICY, AND (II) YOU ARE OVER 16 YEARS OF AGE (OR HAVE HAD YOUR PARENT OR GUARDIAN READ AND AGREE TO THIS PRIVACY POLICY FOR YOU). If you do not agree, or are unable to make this promise, you must not use the Service. In such case, you must (a) contact us and request deletion of your data; and (b) cancel any purchases using the functionality provided by instructions on the Website; (c) leave the Website and not access or use it.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Personal Data Controller</h2>
            <p className="text-gray-700 mb-6">
              iPS Global Consulting, a company having its business address at 11133 Shady Trail, Dallas, TX 75229, United States of America, will be the controller of your personal data.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Categories of Personal Data We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect data you give us voluntarily (for example, when you enter your AI experience level, learning goals or email). We also collect data automatically (for example, your IP address) and use third-party service providers for such collection.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Data you give us</h3>
            <p className="text-gray-700 mb-4">
              You provide us information about yourself when you register for and/or use the Service. For example: age, gender, AI experience level, learning goals, email address.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Data we collect automatically:</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Data about how you found us.</strong> We collect data about your referring URL (that is, the place on the Web where you were when you tapped on our ad).</li>
              <li><strong>Device and Location data.</strong> We collect data from your device. Examples of such data include: language settings, IP address, time zone, type and model of a device, device settings, operating system and its version.</li>
              <li><strong>Usage data.</strong> We record how you interact with our Service. For example, we log your taps/clicks on certain areas of the interface, the features, and content you interact with, how often you use the Service, how long you are in the Service, and your purchase orders.</li>
              <li><strong>Transaction data.</strong> When you make payments through the Service, you need to provide financial account data, such as your credit card number, to our third-party service providers. We do not collect or store full credit card number data, though we may receive credit card-related data, data about the transaction, including: date, time and amount of the transaction, the type of payment method used.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. For what purposes we process your personal data</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">To provide our Service</h3>
                <p>This includes enabling you to use the Service in a seamless manner and preventing or addressing Service errors or technical issues. To host personal data and enable our Website to operate and be distributed we use Amazon Web Services, which are hosting and backend services provided by Amazon.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">To manage your account and provide you with customer support</h3>
                <p>We process your personal data to respond to your requests for technical support, service information or to any other communication you initiate. This includes accessing your account to address technical support requests.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">To communicate with you regarding your use of our Service</h3>
                <p>We communicate with you, for example, by emails, using the details you provide — including your name. These may include information about the Service, some critical changes, special offers.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">To research and analyze your use of the Service</h3>
                <p>This helps us to better understand our business, analyze our operations, maintain, improve, innovate, plan, design, and develop the Service and our new products. We also use such data for statistical analysis purposes, to test and improve our offers.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">To process your payments</h3>
                <p>We provide paid features and/or services within the Service. For this purpose, we use third-party services for payment processing (for example, payment processors). We use PayPal and other secure payment processors to handle your payments on the Website.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. How you can exercise your privacy rights</h2>
            <p className="text-gray-700 mb-4">To be in control of your personal data, you have the following rights:</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Accessing / reviewing / updating / correcting your personal data.</strong> You may request a copy of your personal data and request us to update/correct your personal data collected during your use of the Service through info@ipsglobalconsulting.com.</li>
              <li><strong>Deleting your personal data.</strong> You can request erasure of your personal data by sending us an email through info@ipsglobalconsulting.com.</li>
              <li><strong>Objecting to or restricting the use of your personal data.</strong> You can ask us to stop using all or some of your personal data or limit our use thereof by sending requests through info@ipsglobalconsulting.com.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Age Limitation</h2>
            <p className="text-gray-700 mb-6">
              We do not knowingly process personal data from persons under 16 years of age. If you learn that anyone younger than 16 has provided us with personal data, please contact us through info@ipsglobalconsulting.com.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-semibold">iPS Global Consulting</p>
              <p className="text-gray-700">11133 Shady Trail</p>
              <p className="text-gray-700">Dallas, TX 75229</p>
              <p className="text-gray-700">info@ipsglobalconsulting.com</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">← Back to AI TechStep</a>
        </div>
      </div>
    </div>,
    { title: 'Privacy Policy - AI TechStep | Your Data Protection Rights' }
  );
});

// Terms and Conditions page
app.get('/terms', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <p className="text-gray-600">Last Updated: September 3, 2025</p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Welcome to AI TechStep! We've simplified our Terms and Conditions to make them more user-friendly. Please take a moment to read these terms, as they form the agreement between you, as a user of AI TechStep, and us, as the provider of AI TechStep services.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Who We Are</h2>
            <p className="text-gray-700 mb-6">
              We AI TechStep™, iPS Global Consulting, a company registered at 11133 Shady Trail, Dallas, TX 75229, United States of America and/or its affiliates or its authorized representatives ("we", "us", "our" or the "Company"), aim is to provide you with valuable AI learning materials and related services through our website and designated platforms.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Agreement Overview</h2>
            <p className="text-gray-700 mb-6">
              By using our product AI TechStep ("Service"), you agree to abide by these Terms and Conditions (referred to as the "Terms" or the "Agreement"). Also our Privacy Policy and Payment Terms are incorporated to these Terms by reference, which means they are part of the Terms.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Eligibility</h2>
            <p className="text-gray-700 mb-6">
              If you do not agree with any part of these Terms and any related documents or you are not eligible to use our Services, please do not access any part of our Service. To use AI TechStep, you must be at least 16 years old and have the legal capacity to enter into an agreement. If you're under 18, you need your parent's permission. If you don't agree with these terms or you're not eligible, please do not use our Service.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. What We Offer</h2>
            <p className="text-gray-700 mb-4">
              AI TechStep provides a range of educational materials, including articles, reading materials, AI tools, templates, and interactive content focused on artificial intelligence education for work-from-home parents.
            </p>
            <p className="text-gray-700 mb-6">
              You will have access to the Digital Content and our product AI TechStep only after registering for the Service and completing payment for your chosen plan (Starter, Core, or Equity Track) depending on what you select at the time of purchase.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. AI Profile and Educational Content</h2>
            <p className="text-gray-700 mb-4">
              While using our Service you will have access to personalized AI education content based on your AI Profile assessment. Our AI Profile system is implemented for educational purposes only and is not intended to provide financial or career advice.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold">
                <strong>Important Educational Disclaimer:</strong> AI TechStep as an educational platform does not provide any financial or career advice. Please consult with your financial or career advisor first before making any career decisions. There is no any bias towards or against any stocks or companies mentioned in this platform.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Payment Plans</h2>
            <p className="text-gray-700 mb-4">Based on the option you select at the time of purchase we may offer you:</p>
            
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Starter Plan ($49):</strong> One-time payment providing access to basic AI education content and tools.</li>
              <li><strong>Core Plan ($499 or $199×3):</strong> Comprehensive AI education package with full access to all content, tools, and community features. Available as one-time payment or 3-installment payment option.</li>
              <li><strong>Founder Equity Track:</strong> Partnership opportunity for qualified applicants interested in equity participation.</li>
            </ul>

            <p className="text-gray-700 mb-6">
              <strong>Important note!</strong> All payments are one-time purchases with no recurring charges or subscription fees. There are no automatic renewals.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Billing and Payment</h2>
            <p className="text-gray-700 mb-4">
              We bill for our services through PayPal and other secure payment providers (Visa, Mastercard and others). Your payment method will be charged according to your selected plan.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Methods of payment</h3>
            <p className="text-gray-700 mb-4">
              Payment methods for the Services are billed by AI TechStep via PayPal or other payment providers. AI TechStep charges the applicable fees to the payment card you submit at the time of purchase.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Refunds</h3>
            <p className="text-gray-700 mb-6">
              Please refer to our Payment Terms to find out about our refund policy for one-time purchases.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Use of Information and Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All the information, text, images, graphics, marks, logos, compilations, data, other content, software and materials available through or at our Website constitutes our property or property of third parties.
            </p>
            <p className="text-gray-700 mb-6">
              You're granted a non-exclusive license to use our Service for personal, non-commercial purposes only. No other rights or use with regards to the Services is available to you unless otherwise expressly written in these Terms. Please don't infringe on our intellectual property rights.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Disclaimers of warranties and liabilities</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="space-y-3 text-red-800 text-sm">
                <p><strong>As for information on the Service.</strong> Any statement or information that may be posted on the Service is for informational and educational purposes only and is not intended to replace or substitute for any professional financial, legal, or other advice.</p>
                <p><strong>As for any advice.</strong> AI TechStep does not provide investment or financial advice or advocate the purchase or sale of any security or investment via the Service.</p>
                <p><strong>As for any results.</strong> We make no guarantees about the level of success you will have, and you accept the risk that results will vary from person to person.</p>
                <p><strong>As for capital risk.</strong> AI TechStep is an education platform, you cannot invest with us. You should acknowledge if you decide to invest yourself there is a risk of capital loss and income is not guaranteed.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Limitation of liability</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm font-semibold">
                IN NO EVENT SHALL WE BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY LOST PROFIT OR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES ARISING FROM THESE TERMS OR YOUR USE OF, OR INABILITY TO USE, THE SERVICE.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-semibold">iPS Global Consulting</p>
              <p className="text-gray-700">11133 Shady Trail</p>
              <p className="text-gray-700">Dallas, TX 75229</p>
              <p className="text-gray-700">info@ipsglobalconsulting.com</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">← Back to AI TechStep</a>
        </div>
      </div>
    </div>,
    { title: 'Terms and Conditions - AI TechStep | User Agreement' }
  );
});

// Payment Terms page
app.get('/payment-terms', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Terms</h1>
            <p className="text-gray-600">Last Updated: September 3, 2025</p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              These Payment Terms govern all purchases made through AI TechStep and are part of our Terms and Conditions.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Payment Plans Available</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-green-600 mb-2">Starter Plan</h3>
                <p className="text-2xl font-bold mb-2">$49</p>
                <p className="text-gray-600 text-sm">One-time payment</p>
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>• Basic AI education content</li>
                  <li>• Essential tools and templates</li>
                  <li>• Community access</li>
                </ul>
              </div>

              <div className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50">
                <h3 className="font-bold text-blue-600 mb-2">Core Plan</h3>
                <p className="text-2xl font-bold mb-2">$499</p>
                <p className="text-gray-600 text-sm">One-time payment or $199×3 installments</p>
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>• Complete AI curriculum</li>
                  <li>• All tools and templates</li>
                  <li>• Priority support</li>
                  <li>• Advanced features</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-purple-600 mb-2">Founder Equity</h3>
                <p className="text-lg font-bold mb-2">Equity Share</p>
                <p className="text-gray-600 text-sm">Partnership opportunity</p>
                <ul className="text-sm text-gray-600 mt-3 space-y-1">
                  <li>• 0.1% - 2.5% equity</li>
                  <li>• Revenue sharing</li>
                  <li>• Board participation</li>
                </ul>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Payment Processing</h2>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>Payment Methods:</strong> We accept PayPal, Visa, Mastercard, and other major credit cards through our secure payment processors.</li>
              <li><strong>Currency:</strong> All prices are listed in US Dollars (USD).</li>
              <li><strong>Security:</strong> We use industry-standard encryption and security measures to protect your payment information.</li>
              <li><strong>Third-Party Processing:</strong> Payments are processed by PayPal and other secure third-party payment processors. We do not store your complete payment card details.</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. One-Time Purchases</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold mb-2">No Recurring Charges</p>
              <p className="text-green-700 text-sm">
                All AI TechStep plans are one-time purchases. There are no monthly or yearly subscription fees, and no automatic renewals. Once you purchase a plan, you have lifetime access to your content.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Installment Payments</h2>
            <p className="text-gray-700 mb-4">
              The Core Plan offers an installment payment option:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li><strong>3 Installments:</strong> $199 charged every 30 days for 3 payments (total $597)</li>
              <li><strong>Automatic Charging:</strong> If you choose installments, your payment method will be automatically charged every 30 days until all 3 payments are complete</li>
              <li><strong>Access:</strong> You receive immediate access to all content upon first payment</li>
              <li><strong>Payment Failure:</strong> If a payment fails, you have 7 days to update your payment method before access is suspended</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Refund Policy</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">30-Day Money-Back Guarantee</h3>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Full refund available within 30 days of purchase</li>
                <li>• No questions asked for Starter and Core plans</li>
                <li>• Refunds processed within 5-7 business days</li>
                <li>• Refunds issued to original payment method</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How to Request a Refund</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-6 space-y-2">
              <li>Email us at info@ipsglobalconsulting.com within 30 days</li>
              <li>Include your purchase details and reason for refund</li>
              <li>We'll process your refund within 48 hours</li>
              <li>Refund will appear in your account within 5-7 business days</li>
            </ol>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Pricing Changes</h2>
            <p className="text-gray-700 mb-6">
              While we strive to keep our pricing stable, we reserve the right to change prices at any time. Price changes will not affect existing purchases or customers who have already enrolled in installment plans.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Failed Payments</h2>
            <p className="text-gray-700 mb-4">
              If your payment fails for any reason:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>You'll receive an email notification within 24 hours</li>
              <li>You have 7 days to update your payment method</li>
              <li>For installment plans, access may be suspended until payment is resolved</li>
              <li>We may retry the payment up to 3 times over 7 days</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Taxes</h2>
            <p className="text-gray-700 mb-6">
              Prices shown do not include applicable taxes. Taxes, if any, will be calculated and added at checkout based on your billing address and local tax regulations.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about payments, billing, or refunds, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-semibold">iPS Global Consulting</p>
              <p className="text-gray-700">11133 Shady Trail</p>
              <p className="text-gray-700">Dallas, TX 75229</p>
              <p className="text-gray-700">info@ipsglobalconsulting.com</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">← Back to AI TechStep</a>
        </div>
      </div>
    </div>,
    { title: 'Payment Terms - AI TechStep | Billing and Refund Policy' }
  );
});

// Disclaimer page
app.get('/disclaimer', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-gray-600">Last Updated: September 3, 2025</p>
          </div>

          <div className="prose max-w-none">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-red-800 mb-4">⚠️ Important Educational Disclaimer</h2>
              <p className="text-red-700 font-semibold">
                AI TechStep as an educational platform does not provide any financial or career advice. Please consult with your financial or career advisor first before making any career decisions. There is no any bias towards or against any stocks or companies mentioned in this platform.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Educational Purpose Only</h2>
            <p className="text-gray-700 mb-6">
              AI TechStep is designed exclusively for educational purposes. All content, including courses, articles, tools, templates, and AI-related materials, is intended to provide general information and education about artificial intelligence technologies and their applications. This content should not be considered as professional advice in any field.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. No Financial or Investment Advice</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <ul className="text-yellow-800 space-y-2">
                <li>• AI TechStep does not provide investment, financial, or trading advice</li>
                <li>• We do not recommend any specific investments, stocks, or financial products</li>
                <li>• Any mention of financial topics is for educational purposes only</li>
                <li>• Always consult with a qualified financial advisor before making investment decisions</li>
                <li>• Past performance does not guarantee future results</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. No Career or Professional Advice</h2>
            <p className="text-gray-700 mb-4">
              While AI TechStep provides education about AI technologies and their applications in various industries:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>We do not provide career counseling or professional guidance</li>
              <li>We do not guarantee job placement or career advancement</li>
              <li>Career decisions should be made in consultation with qualified career advisors</li>
              <li>Individual results may vary based on personal circumstances, effort, and market conditions</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. No Guaranteed Results</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-gray-700 font-semibold mb-2">Important Notice About Expectations:</p>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• AI TechStep makes no guarantees about income, success, or specific outcomes</li>
                <li>• Results vary significantly based on individual effort, circumstances, and market conditions</li>
                <li>• Success stories and testimonials represent individual experiences, not typical results</li>
                <li>• Learning outcomes depend on your commitment, prior knowledge, and application of the material</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Technology and AI Content Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              Regarding artificial intelligence and technology content:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              <li>AI technology is rapidly evolving, and information may become outdated</li>
              <li>We strive for accuracy but cannot guarantee all content is current or error-free</li>
              <li>AI tools and platforms mentioned may change their terms, pricing, or availability</li>
              <li>Users should verify information independently before making decisions</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Third-Party Content and Links</h2>
            <p className="text-gray-700 mb-6">
              AI TechStep may reference or link to third-party websites, tools, or services. We do not endorse, guarantee, or take responsibility for any third-party content, products, or services. Use of third-party resources is at your own risk and discretion.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Health and Safety Considerations</h2>
            <p className="text-gray-700 mb-6">
              When using AI TechStep's educational content, please maintain healthy learning habits. Take regular breaks, avoid excessive screen time, and seek medical advice if you experience any health issues related to prolonged computer use or stress from learning new technologies.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Legal and Compliance Matters</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Important:</strong> AI TechStep content is for educational purposes only and should not be considered legal advice. Laws regarding AI usage, data privacy, and business applications vary by jurisdiction. Consult with qualified legal professionals regarding compliance with applicable laws in your area.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              To the fullest extent permitted by law, AI TechStep, iPS Global Consulting, and its affiliates disclaim all liability for any damages arising from your use of our educational content, including but not limited to financial losses, career setbacks, or business decisions made based on the information provided.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Updates to This Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              This disclaimer may be updated from time to time to reflect changes in our services or applicable laws. Continued use of AI TechStep after any changes constitutes acceptance of the updated disclaimer.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">✅ What AI TechStep IS:</h3>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• A comprehensive AI education platform</li>
                <li>• A source of practical AI learning materials</li>
                <li>• A community for AI enthusiasts and learners</li>
                <li>• A provider of tools and templates for AI applications</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-red-800 mb-2">❌ What AI TechStep is NOT:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• A financial advisory service</li>
                <li>• A career counseling service</li>
                <li>• A guarantee of employment or income</li>
                <li>• A substitute for professional advice</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this disclaimer, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 font-semibold">iPS Global Consulting</p>
              <p className="text-gray-700">11133 Shady Trail</p>
              <p className="text-gray-700">Dallas, TX 75229</p>
              <p className="text-gray-700">info@ipsglobalconsulting.com</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">← Back to AI TechStep</a>
        </div>
      </div>
    </div>,
    { title: 'Disclaimer - AI TechStep | Educational Platform Notice' }
  );
});

// Partnerships page with 3 tabs (Equity, Affiliate, Institutional)
app.get('/partnerships', (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
                ← Back to AI TechStep
              </a>
            </div>
            <div className="text-sm text-gray-500">
              Join the Partnership Network
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            🤝 Partnership Opportunities
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Join forces with AI TechStep and build the future of AI education together
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              💰 Revenue Sharing
            </div>
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              🚀 Equity Opportunities
            </div>
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full">
              🎯 Strategic Alliances
            </div>
          </div>
        </div>
      </div>

      {/* Partnership Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center bg-white rounded-2xl shadow-lg p-2 mb-8">
          <button 
            className="partnership-tab active flex-1 min-w-0 text-center py-4 px-6 rounded-xl font-semibold transition-all"
            data-tab="equity"
          >
            <span className="block text-lg">🏆</span>
            <span className="block">Equity Partners</span>
          </button>
          <button 
            className="partnership-tab flex-1 min-w-0 text-center py-4 px-6 rounded-xl font-semibold transition-all"
            data-tab="affiliate"
          >
            <span className="block text-lg">💎</span>
            <span className="block">Affiliate Program</span>
          </button>
          <button 
            className="partnership-tab flex-1 min-w-0 text-center py-4 px-6 rounded-xl font-semibold transition-all"
            data-tab="institutional"
          >
            <span className="block text-lg">🏢</span>
            <span className="block">Institutional</span>
          </button>
        </div>

        {/* Tab Content */}
        
        {/* Equity Partners Tab */}
        <div id="equity-tab" className="tab-content active">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold mr-4">
                    🏆
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Founder Equity Track</h2>
                    <p className="text-gray-600">Own a piece of the AI education revolution</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Equity Percentage</h4>
                      <p className="text-gray-600 text-sm">0.1% - 2.5% based on contribution level</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Vesting Schedule</h4>
                      <p className="text-gray-600 text-sm">4-year vesting with 1-year cliff</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Board Participation</h4>
                      <p className="text-gray-600 text-sm">Advisory board seat for &gt;1% equity holders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Revenue Sharing</h4>
                      <p className="text-gray-600 text-sm">Quarterly distributions based on performance</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">💡 What We're Looking For</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>AI/ML Experts:</strong> Technical advisory and product development</li>
                  <li>• <strong>Education Leaders:</strong> Curriculum design and pedagogy expertise</li>
                  <li>• <strong>Marketing Pros:</strong> Growth marketing and user acquisition</li>
                  <li>• <strong>Business Development:</strong> Strategic partnerships and enterprise sales</li>
                  <li>• <strong>Operations Leaders:</strong> Scaling systems and processes</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Application Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Apply for Equity Partnership</h3>
              
              <form id="equity-application-form" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile</label>
                  <input 
                    type="url" 
                    name="linkedin"
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area of Expertise</label>
                  <select 
                    name="expertise"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select your expertise...</option>
                    <option value="ai-ml">AI/ML Technical</option>
                    <option value="education">Education & Curriculum</option>
                    <option value="marketing">Marketing & Growth</option>
                    <option value="business-dev">Business Development</option>
                    <option value="operations">Operations & Scaling</option>
                    <option value="finance">Finance & Strategy</option>
                    <option value="legal">Legal & Compliance</option>
                    <option value="other">Other (specify in message)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Commitment</label>
                  <select 
                    name="time_commitment"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select time commitment...</option>
                    <option value="5-10h">5-10 hours/month</option>
                    <option value="10-20h">10-20 hours/month</option>
                    <option value="20-40h">20-40 hours/month</option>
                    <option value="part-time">Part-time (20+ hours/week)</option>
                    <option value="full-time">Full-time commitment</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell Us About Yourself</label>
                  <textarea 
                    name="message"
                    rows={4}
                    placeholder="Share your background, relevant experience, and why you're interested in partnering with AI TechStep..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all"
                >
                  🚀 Submit Equity Application
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Affiliate Program Tab */}
        <div id="affiliate-tab" className="tab-content">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Commission Tiers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥉</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Bronze Affiliate</h3>
                <div className="text-3xl font-bold text-green-600 mt-2">25%</div>
                <p className="text-gray-600 text-sm">Commission Rate</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">$12.50 per Starter sale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">$125 per Core sale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">90-day cookie window</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm">Marketing materials provided</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">0-10 sales/month</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-300">
              <div className="text-center mb-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥈</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Silver Affiliate</h3>
                <div className="text-3xl font-bold text-blue-600 mt-2">35%</div>
                <p className="text-gray-600 text-sm">Commission Rate</p>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold mt-2">
                  Most Popular
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">$17.50 per Starter sale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">$175 per Core sale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">120-day cookie window</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Priority support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">✓</span>
                  <span className="text-sm">Custom landing pages</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">11-25 sales/month</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🥇</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Gold Affiliate</h3>
                <div className="text-3xl font-bold text-yellow-600 mt-2">50%</div>
                <p className="text-gray-600 text-sm">Commission Rate</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">✓</span>
                  <span className="text-sm">$25 per Starter sale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">✓</span>
                  <span className="text-sm">$250 per Core sale</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">✓</span>
                  <span className="text-sm">Lifetime cookie window</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">✓</span>
                  <span className="text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-600">✓</span>
                  <span className="text-sm">Revenue sharing bonuses</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">25+ sales/month</p>
              </div>
            </div>
          </div>
          
          {/* Affiliate Application */}
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Affiliate Program</h3>
                <p className="text-gray-600">Start earning commissions by promoting AI TechStep to your audience</p>
              </div>
              
              <form id="affiliate-application-form" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website/Blog URL</label>
                  <input 
                    type="url" 
                    name="website"
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Traffic Source</label>
                  <select 
                    name="traffic_source"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select your primary traffic source...</option>
                    <option value="blog">Blog/Website</option>
                    <option value="youtube">YouTube</option>
                    <option value="social-media">Social Media</option>
                    <option value="email-list">Email List</option>
                    <option value="podcast">Podcast</option>
                    <option value="paid-ads">Paid Advertising</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audience Size</label>
                  <select 
                    name="audience_size"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select your audience size...</option>
                    <option value="0-1k">0-1,000</option>
                    <option value="1k-5k">1,000-5,000</option>
                    <option value="5k-10k">5,000-10,000</option>
                    <option value="10k-50k">10,000-50,000</option>
                    <option value="50k-100k">50,000-100,000</option>
                    <option value="100k+">100,000+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tell Us About Your Audience</label>
                  <textarea 
                    name="audience_description"
                    rows={3}
                    placeholder="Describe your audience demographics, interests, and how they might benefit from AI TechStep..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all"
                >
                  💎 Apply for Affiliate Program
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Institutional Tab */}
        <div id="institutional-tab" className="tab-content">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Left Column - Partnership Types */}
            <div className="space-y-8">
              
              {/* Educational Institutions */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🎓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Educational Institutions</h3>
                    <p className="text-gray-600 text-sm">Universities, colleges, and schools</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Partnership Benefits:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• White-label AI curriculum integration</li>
                      <li>• Student licensing at 60% discount</li>
                      <li>• Instructor training and certification</li>
                      <li>• Custom learning management system</li>
                      <li>• Progress tracking and analytics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ideal Partners:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Business schools and MBA programs</li>
                      <li>• Computer science departments</li>
                      <li>• Continuing education programs</li>
                      <li>• Professional development centers</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Corporate Training */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Corporate Training</h3>
                    <p className="text-gray-600 text-sm">Enterprise AI education solutions</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Enterprise Solutions:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Custom AI training programs</li>
                      <li>• Executive AI literacy workshops</li>
                      <li>• Team-based learning tracks</li>
                      <li>• ROI measurement and reporting</li>
                      <li>• Ongoing support and consultation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Target Organizations:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Fortune 500 companies</li>
                      <li>• Technology consulting firms</li>
                      <li>• Digital transformation agencies</li>
                      <li>• HR and learning departments</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Strategic Alliances */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Strategic Alliances</h3>
                    <p className="text-gray-600 text-sm">Long-term partnership opportunities</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Alliance Types:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Technology integration partnerships</li>
                      <li>• Content co-creation agreements</li>
                      <li>• Cross-promotion and referral programs</li>
                      <li>• Joint research and development</li>
                      <li>• Market expansion partnerships</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Partner Profile:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• AI tool and platform providers</li>
                      <li>• Learning management systems</li>
                      <li>• Business coaching organizations</li>
                      <li>• Industry associations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 h-fit sticky top-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Partner With Us</h3>
                <p className="text-gray-600">Let's explore how we can work together to advance AI education</p>
              </div>
              
              <form id="institutional-partnership-form" className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                  <input 
                    type="text" 
                    name="organization_name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="first_name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="last_name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title/Position</label>
                  <input 
                    type="text" 
                    name="title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Type</label>
                  <select 
                    name="partnership_type"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select partnership type...</option>
                    <option value="educational">Educational Institution</option>
                    <option value="corporate">Corporate Training</option>
                    <option value="strategic">Strategic Alliance</option>
                    <option value="technology">Technology Integration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Organization Size</label>
                  <select 
                    name="organization_size"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select organization size...</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1,000 employees</option>
                    <option value="1000-5000">1,000-5,000 employees</option>
                    <option value="5000+">5,000+ employees</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partnership Goals</label>
                  <textarea 
                    name="goals"
                    rows={4}
                    placeholder="Describe your partnership goals, target audience, timeline, and any specific requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all"
                >
                  🏢 Submit Partnership Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <script src="/static/partnerships.js"></script>
    </div>,
    { title: 'Partnerships - AI TechStep | Equity, Affiliate & Institutional Programs' }
  );
});

export default app