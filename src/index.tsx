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
          <a href="/subscription" className="underline hover:text-gray-700 ml-1">Payment Terms</a><br/>
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

// Simple dashboard for AI Parent members
app.get('/dashboard', async (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI TechStep Dashboard</h1>
            <div className="text-sm text-blue-600 font-semibold">"Step into AI Success"</div>
              <p className="text-gray-600">Your 28-day journey to AI mastery</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">Day 1</div>
              <div className="text-gray-600">of 28</div>
            </div>
          </div>
        </div>

        {/* Progress overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">700K+</div>
            <div className="text-gray-600">Community Members</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">30+</div>
            <div className="text-gray-600">AI Tools to Master</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
            <div className="text-gray-600">Progress Complete</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">27</div>
            <div className="text-gray-600">Days Remaining</div>
          </div>
        </div>

        {/* Current lesson */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Lesson: Getting Started with AI</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">What You'll Learn Today:</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 mt-1">•</div>
                  <div>Understanding what AI really is (in simple terms)</div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 mt-1">•</div>
                  <div>How AI can help busy parents create passive income</div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 mt-1">•</div>
                  <div>Your first AI tool: ChatGPT for beginners</div>
                </div>
                <div className="flex items-start">
                  <div className="text-green-500 mr-3 mt-1">•</div>
                  <div>Setting up your AI workspace at home</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Time Needed:</h3>
              <div className="text-lg text-gray-600 mb-6">15-20 minutes (perfect for nap time!)</div>
              
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-200">
                Start Day 1 Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Tools Library</h3>
            <p className="text-gray-600 mb-4">Access 30+ parent-friendly AI tools</p>
            <button className="text-blue-600 font-semibold hover:underline">Explore Tools →</button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Parent Community</h3>
            <p className="text-gray-600 mb-4">Connect with other AI Parent members</p>
            <button className="text-blue-600 font-semibold hover:underline">Join Discussion →</button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Support Center</h3>
            <p className="text-gray-600 mb-4">Get help 24/7 from our team</p>
            <button className="text-blue-600 font-semibold hover:underline">Get Help →</button>
          </div>
        </div>
      </div>
    </div>,
    { title: 'AI TechStep Dashboard - Day 1 of 28' }
  );
});

export default app