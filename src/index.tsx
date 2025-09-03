import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, QuizSession, TrackScores, User, QuizResult, Language, TrackType } from './types'
import { quizQuestions, trackDescriptions } from './quiz-data'
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
    const question = quizQuestions.find(q => q.id === response.question_id);
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
  // Create 5-day onboarding progress
  for (let day = 1; day <= 5; day++) {
    const status = day === 1 ? 'unlocked' : 'locked';
    const unlockedAt = day === 1 ? new Date().toISOString() : null;
    
    await env.DB.prepare(`
      INSERT INTO user_progress (user_id, day, phase, status, unlocked_at) VALUES (?, ?, 'onboarding', ?, ?)
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

// Main landing page with language selector
app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.render(
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white mb-16">
            <div className="mb-8">
              <div className="text-6xl mb-4">🚀💰🤖</div>
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                AI Income Builder v1.0
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
                Transform your skills into AI-powered income streams. Join our exclusive 4-week program and discover your perfect AI business model.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">🎯 What You'll Get</h2>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="text-3xl mb-3">🧪</div>
                  <h3 className="font-bold text-lg mb-2">Personalized AI Track</h3>
                  <p className="text-gray-300">Custom-matched to your skills: Digital Products, Services, E-commerce, or Consulting</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="text-3xl mb-3">🎮</div>
                  <h3 className="font-bold text-lg mb-2">5-Day Gamified Launch</h3>
                  <p className="text-gray-300">Daily unlocks, progress tracking, and milestone rewards</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="text-3xl mb-3">🧰</div>
                  <h3 className="font-bold text-lg mb-2">Complete Toolkit</h3>
                  <p className="text-gray-300">AI prompts, templates, checklists, and resource guides</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="text-3xl mb-3">🔴</div>
                  <h3 className="font-bold text-lg mb-2">Weekly Live Sessions</h3>
                  <p className="text-gray-300">Expert guidance, Q&A, and community support</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold text-yellow-400 mb-2">$499</div>
              <p className="text-gray-300 mb-6">One-time payment • No subscriptions • Lifetime access</p>
            </div>

            <div className="mb-12">
              <button 
                onclick="startQuiz()"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                🎯 Take The AI Income Quiz →
              </button>
              <p className="text-sm text-gray-400 mt-4">
                ⏱️ 2 minutes • Discover your perfect AI income track
              </p>
            </div>

            {/* Language selector */}
            <div className="mb-8">
              <select 
                onchange="changeLanguage(this.value)"
                className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2"
              >
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="de">🇩🇪 Deutsch</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="fa">🇮🇷 فارسی</option>
                <option value="ps">🇦🇫 پښتو</option>
              </select>
            </div>

            <div className="text-center text-gray-400 text-sm">
              <p>✅ 30-day partial refund policy • 🔒 Secure checkout • 🌍 Global access</p>
            </div>
          </div>
        </div>
      </div>

      <script>{`
        function startQuiz() {
          const lang = document.querySelector('select').value || 'en';
          window.location.href = '/quiz?lang=' + lang;
        }
        
        function changeLanguage(lang) {
          const url = new URL(window.location);
          url.searchParams.set('lang', lang);
          window.location.href = url.toString();
        }

        // Set initial language selector value
        document.addEventListener('DOMContentLoaded', function() {
          const urlParams = new URLSearchParams(window.location.search);
          const lang = urlParams.get('lang') || 'en';
          document.querySelector('select').value = lang;
        });
      `}</script>
    </>,
    { title: 'AI Income Builder v1.0 - Build Your AI-Powered Income Stream' }
  );
});

// Quiz page
app.get('/quiz', async (c) => {
  const lang = (c.req.query('lang') || 'en') as Language;
  const sessionId = crypto.randomUUID();
  
  // Store quiz session in KV
  const quizSession: QuizSession = {
    session_id: sessionId,
    current_question: 0,
    responses: [],
    language: lang
  };
  
  await c.env.KV.put(`quiz_session:${sessionId}`, JSON.stringify(quizSession), { expirationTtl: 3600 });
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white text-sm">Question <span id="current-q">1</span> of {quizQuestions.length}</span>
                <span className="text-white text-sm"><span id="progress-percent">0</span>% Complete</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div id="progress-bar" className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300" style="width: 0%"></div>
              </div>
            </div>

            {/* Question container */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white">
              <div id="question-container" data-session-id={sessionId} data-lang={lang}>
                <div className="text-center mb-8">
                  <div className="text-4xl mb-4">🎯</div>
                  <h2 id="question-text" className="text-2xl font-bold mb-6"></h2>
                </div>
                
                <div id="options-container" className="space-y-4">
                  {/* Options will be populated by JavaScript */}
                </div>
                
                <div className="flex justify-between mt-8">
                  <button id="back-btn" onclick="previousQuestion()" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    ← Back
                  </button>
                  <button id="next-btn" onclick="nextQuestion()" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    Next →
                  </button>
                </div>
              </div>

              {/* Results container (hidden initially) */}
              <div id="results-container" className="hidden">
                <div className="text-center">
                  <div className="text-6xl mb-6">🎉</div>
                  <h2 className="text-3xl font-bold mb-6">Your AI Income Track is...</h2>
                  <div id="track-result" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black p-6 rounded-xl mb-6">
                    <div className="text-4xl font-bold mb-2" id="track-name"></div>
                    <p id="track-description" className="text-lg"></p>
                  </div>
                  
                  <div id="email-form" className="mb-6">
                    <h3 className="text-xl font-bold mb-4">🔓 Unlock Your Personalized Business Plan</h3>
                    <div className="flex gap-4">
                      <input type="email" id="user-email" placeholder="Enter your email address" 
                        className="flex-1 px-4 py-3 rounded-lg text-black" required />
                      <button onclick="submitQuiz()" className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-bold">
                        Get My Plan →
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="font-bold mb-4">🎁 What happens next?</h4>
                    <div className="text-sm text-gray-300 space-y-2 text-left">
                      <p>✅ Get your personalized AI toolkit and templates</p>
                      <p>📧 Receive step-by-step launch guide via email</p>
                      <p>🎯 Unlock $499 program with exclusive quiz discount</p>
                      <p>🚀 Start building your AI income stream today</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
    { title: 'AI Income Quiz - Discover Your Perfect AI Business Track' }
  );
});

// API endpoint to get quiz data
app.get('/api/quiz-data', async (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.json({
    success: true,
    questions: quizQuestions,
    trackDescriptions: trackDescriptions
  });
});

// API endpoint to submit quiz results
app.post('/api/submit-quiz', async (c) => {
  try {
    const { sessionId, email, results, language } = await c.req.json();
    
    // Create or get user
    const userId = await createUser(c.env, email, undefined, language);
    
    // Save quiz responses
    for (let i = 0; i < results.selectedAnswers.length; i++) {
      const answer = results.selectedAnswers[i];
      if (answer) {
        await saveQuizResponse(c.env, userId, sessionId, i + 1, answer.value);
      }
    }
    
    // Assign track
    const trackType = await assignUserTrack(c.env, userId, results.scores);
    
    return c.json({ success: true, trackType, userId });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return c.json({ success: false, error: 'Failed to process quiz results' }, 500);
  }
});

// Checkout page (Stripe integration will be added here)
app.get('/checkout', async (c) => {
  const sessionId = c.req.query('session');
  const email = c.req.query('email');
  
  if (!sessionId || !email) {
    return c.redirect('/');
  }
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center text-white">
            <div className="text-6xl mb-6">💳</div>
            <h1 className="text-4xl font-bold mb-6">Secure Checkout</h1>
            <p className="text-xl mb-8">Complete your AI Income Builder program purchase</p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">📦 AI Income Builder v1.0</h2>
              <div className="text-left space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span>4-Week AI Income Program</span>
                  <span className="font-bold">$499.00</span>
                </div>
                <div className="flex justify-between items-center text-green-400">
                  <span>Quiz Completion Discount</span>
                  <span className="font-bold">-$50.00</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>$449.00</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-300 mb-6">
                <p>✅ One-time payment • No recurring charges</p>
                <p>🔒 Secure SSL encryption • 30-day partial refund</p>
              </div>
              
              <button 
                onclick="processCheckout()"
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-xl font-bold py-4 px-8 rounded-lg"
              >
                💳 Complete Purchase with Stripe
              </button>
            </div>
            
            <p className="text-sm text-gray-400">
              By purchasing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>,
    { title: 'Secure Checkout - AI Income Builder v1.0' }
  );
});

// Dashboard (will be implemented after payment)
app.get('/dashboard', async (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">🚀 Your AI Income Dashboard</h1>
        <p className="text-gray-600">Welcome to your personalized AI income building journey!</p>
        
        {/* Dashboard content will be built after payment integration */}
      </div>
    </div>,
    { title: 'Dashboard - AI Income Builder' }
  );
});

export default app