import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, QuizSession, TrackScores, User, QuizResult, Language, TrackType } from './types'
import { aiChallengeQuizQuestions, aiChallengeTrackDescriptions } from './ai-challenge-quiz-data'
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
    const question = aiChallengeQuizQuestions.find(q => q.id === response.question_id);
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

// Redirect root to quiz (quiz-first approach like Coursiv)
app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  return c.redirect(`/quiz?lang=${lang}`);
});

// About page (minimal branding reference)
app.get('/about', (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">🚀 28-DAY AI CHALLENGE</h1>
          <p className="text-2xl mb-8">Join 700,000+ People Building Income with AI</p>
          <a href="/quiz" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-full text-xl transform hover:scale-105 transition-all shadow-lg">
            🎯 START YOUR AI JOURNEY NOW!
          </a>
        </div>
      </div>
    </div>,
    { title: '28-Day AI Challenge - Transform Your Income' }
  );
});

// 28-Day AI Challenge Quiz - Gamified B2C design
app.get('/quiz', async (c) => {
  const lang = (c.req.query('lang') || 'en') as Language;
  const sessionId = crypto.randomUUID();
  
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
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
            🚀 28-DAY AI CHALLENGE
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Discover Your Perfect AI Income Path!
          </h1>
          <p className="text-lg text-gray-600">Join 700,000+ people who've transformed their income with AI</p>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <div className="flex items-center text-green-600">
              <span className="text-2xl mr-2">🔥</span>
              <span className="font-semibold">2,847 people took this today!</span>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Question <span id="current-q">1</span> of 20</span>
            <span className="text-sm text-gray-500"><span id="progress-percent">5</span>%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div id="progress-bar" className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500" style="width: 5%"></div>
          </div>
        </div>

        {/* Question container */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <div id="question-container" data-session-id={sessionId} data-lang={lang}>
            <h2 id="question-text" className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed"></h2>
            
            <div id="options-container" className="space-y-3">
              {/* Options will be populated by JavaScript */}
            </div>
            
            <div className="flex justify-between mt-10">
              <button 
                id="back-btn" 
                onclick="previousQuestion()" 
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                disabled
              >
                ← Previous
              </button>
              <button 
                id="next-btn" 
                onclick="nextQuestion()" 
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold transform hover:scale-105" 
                disabled
              >
                Continue 🚀
              </button>
            </div>
          </div>

          {/* Results container (hidden initially) */}
          <div id="results-container" className="hidden">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-6 animate-pulse">
                <span className="text-4xl">🎆</span>
              </div>
              
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                🎉 Your Perfect AI Income Match!
              </h2>
              
              <div id="track-result" className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mb-8 shadow-lg">
                <h3 id="track-name" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3"></h3>
                <p id="track-description" className="text-gray-700 leading-relaxed text-lg"></p>
              </div>
              
              <div id="email-form" className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
                    🔥 LIMITED TIME OFFER!
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  Get Your FREE AI Income Roadmap + 🎁 Bonus Training!
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    id="user-email" 
                    placeholder="Enter your email address" 
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                    required 
                  />
                  <button 
                    onclick="submitQuiz()" 
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 font-bold transition-all duration-200 whitespace-nowrap transform hover:scale-105 shadow-lg"
                  >
                    🎁 GET MY FREE ROADMAP NOW!
                  </button>
                </div>
              </div>
              
              <div className="text-left bg-white border border-gray-200 rounded-xl p-6 shadow-md">
                <h4 className="font-bold text-gray-900 mb-4 text-center">🎁 Your FREE Package Includes:</h4>
                <div className="text-sm text-gray-700 space-y-3">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">🎯</span>
                    <span>Personalized AI income strategy based on your answers</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">🚀</span>
                    <span>Step-by-step 28-day action plan to start earning</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">📚</span>
                    <span>FREE AI tools and resources library ($297 value)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">🏆</span>
                    <span>Exclusive invite to our 700k+ AI community</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-500 mr-3">⚡</span>
                    <span>Bonus: "AI Income Secrets" masterclass ($197 value)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    { title: '28-Day AI Challenge - Find Your Perfect AI Income Path!' }
  );
});

// API endpoint to get quiz data
app.get('/api/quiz-data', async (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.json({
    success: true,
    questions: aiChallengeQuizQuestions,
    trackDescriptions: aiChallengeTrackDescriptions
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

// 28-Day AI Challenge enrollment page with B2C pricing
app.get('/checkout', async (c) => {
  const sessionId = c.req.query('session');
  const email = c.req.query('email');
  
  if (!sessionId || !email) {
    return c.redirect('/quiz');
  }
  
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            🔥 LIMITED TIME: 87% OFF!
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚀 Join the 28-Day AI Challenge
          </h1>
          <p className="text-xl text-gray-600">Transform your income with AI in just 28 days!</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-4 border-yellow-300">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-center mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full font-bold">
                  🏆 MOST POPULAR CHOICE
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">28-Day AI Challenge</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Complete 28-Day Program</span>
                  <span className="text-gray-500 line-through">$397</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">AI Tools & Resources Library</span>
                  <span className="text-gray-500 line-through">$297</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Private Community Access</span>
                  <span className="text-gray-500 line-through">$97</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Weekly Live Coaching Calls</span>
                  <span className="text-gray-500 line-through">$197</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Bonus: AI Income Blueprints</span>
                  <span className="text-gray-500 line-through">$497</span>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                  <div className="flex justify-between items-center text-red-600 font-semibold">
                    <span>87% OFF Launch Special</span>
                    <span>-$1,385</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 text-3xl font-bold bg-yellow-100 rounded-lg px-4">
                  <span>TODAY ONLY:</span>
                  <span className="text-green-600">$97</span>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">💰 30-Day Money-Back Guarantee</h3>
                <p className="text-sm text-green-700">If you don't see results in 30 days, get 100% of your money back - no questions asked!</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎯 What You'll Get</h3>
              
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">🚀</span>
                  <span>28-day step-by-step roadmap to your first AI income</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">🛠️</span>
                  <span>Complete toolkit of AI tools and software (worth $2,000+)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">👥</span>
                  <span>Access to private community of 700,000+ AI entrepreneurs</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">📹</span>
                  <span>Weekly live group coaching calls with AI experts</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">📚</span>
                  <span>Exclusive case studies of people earning $1K-$10K+ monthly</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 text-xl mr-3">⚡</span>
                  <span>Done-for-you templates and swipe files</span>
                </div>
              </div>
              
              <div className="mt-8 space-y-4">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  🎯 YES! START MY AI JOURNEY - $97
                </button>
                
                <div className="text-center">
                  <div className="text-red-600 font-bold mb-2">⏰ This offer expires in:</div>
                  <div id="countdown-timer" className="text-2xl font-bold text-red-600">23:59:42</div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                🔒 Secure payment • SSL encrypted • 30-day guarantee
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonials section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">🌟 Success Stories from Our Community</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <div className="font-semibold">Sarah M.</div>
                  <div className="text-sm text-gray-600">Marketing Assistant</div>
                </div>
              </div>
              <p className="text-sm text-gray-700">"I went from $0 to $3,200/month in just 6 weeks using AI to create digital products!"</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <div className="font-semibold">Mike R.</div>
                  <div className="text-sm text-gray-600">Teacher</div>
                </div>
              </div>
              <p className="text-sm text-gray-700">"The AI tools helped me start a tutoring service that now makes $5K/month!"</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <div className="font-semibold">Lisa T.</div>
                  <div className="text-sm text-gray-600">Stay-at-home Mom</div>
                </div>
              </div>
              <p className="text-sm text-gray-700">"I replaced my husband's income with my AI e-commerce store in 3 months!"</p>
            </div>
          </div>
        </div>
      </div>
      <script src="/static/countdown.js"></script>
    </div>,
    { title: 'Join the 28-Day AI Challenge - Transform Your Income!' }
  );
});

// Dashboard for 28-Day AI Challenge members
app.get('/dashboard', async (c) => {
  return c.render(
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🚀 Your AI Challenge Dashboard
          </h1>
          <p className="text-xl text-gray-600">Welcome to your 28-day transformation journey!</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <span className="text-3xl mb-2 block">📅</span>
              <h3 className="font-bold text-gray-900">Day 1</h3>
              <p className="text-gray-600">Getting Started</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <span className="text-3xl mb-2 block">👥</span>
              <h3 className="font-bold text-gray-900">700,000+</h3>
              <p className="text-gray-600">Community Members</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center">
              <span className="text-3xl mb-2 block">💰</span>
              <h3 className="font-bold text-gray-900">$0</h3>
              <p className="text-gray-600">Current Earnings</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">🎯 Your Next Steps</h2>
          <p className="text-gray-600 mb-4">Complete your personalized AI income roadmap and start building your future!</p>
          <a href="/quiz" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
            Continue Your Journey
          </a>
        </div>
      </div>
    </div>,
    { title: 'Dashboard - 28-Day AI Challenge' }
  );
});

export default app