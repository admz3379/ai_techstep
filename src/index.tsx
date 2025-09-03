import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import type { Bindings, QuizSession, TrackScores, User, QuizResult, Language, TrackType } from './types'
import { executiveQuizQuestions, executiveTrackDescriptions } from './executive-quiz-data'
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

// Redirect root to quiz (quiz-first approach like Coursiv)
app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  return c.redirect(`/quiz?lang=${lang}`);
});

// About page (minimal branding reference)
app.get('/about', (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.render(
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-gray-900">
          <h1 className="text-4xl font-bold mb-6">Executive Edge Academy</h1>
          <p className="text-xl text-gray-600 mb-8">Premium business transformation platform</p>
          <a href="/quiz" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
            Take Business Assessment
          </a>
        </div>
      </div>
    </div>,
    { title: 'Executive Edge Academy - About' }
  );
});

// Executive Business Assessment - Clean, professional quiz design
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Executive Business Assessment</h1>
          <p className="text-lg text-gray-600">Discover your optimal AI-powered business model</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-500">Question <span id="current-q">1</span> of 6</span>
            <span className="text-sm text-gray-500"><span id="progress-percent">17</span>%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div id="progress-bar" className="bg-blue-600 h-2 rounded-full transition-all duration-500" style="width: 17%"></div>
          </div>
        </div>

        {/* Question container */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
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
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" 
                disabled
              >
                Continue →
              </button>
            </div>
          </div>

          {/* Results container (hidden initially) */}
          <div id="results-container" className="hidden">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Recommended Business Model</h2>
              
              <div id="track-result" className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 id="track-name" className="text-xl font-bold text-blue-900 mb-3"></h3>
                <p id="track-description" className="text-blue-800 leading-relaxed"></p>
              </div>
              
              <div id="email-form" className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Your Personalized 47-Page Business Blueprint</h3>
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors whitespace-nowrap"
                  >
                    Get My Blueprint
                  </button>
                </div>
              </div>
              
              <div className="text-left bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Your Blueprint Includes:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>✓ Custom AI business model recommendation with revenue projections</p>
                  <p>✓ 90-day implementation roadmap with specific milestones</p>
                  <p>✓ Resource requirements and investment timeline analysis</p>
                  <p>✓ Competitive landscape and market opportunity assessment</p>
                  <p>✓ Invitation to exclusive Executive Edge Academy program ($4,997 value)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Executive Business Assessment - Executive Edge Academy' }
  );
});

// API endpoint to get quiz data
app.get('/api/quiz-data', async (c) => {
  const lang = c.req.query('lang') || 'en';
  
  return c.json({
    success: true,
    questions: executiveQuizQuestions,
    trackDescriptions: executiveTrackDescriptions
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

// Executive program enrollment page
app.get('/checkout', async (c) => {
  const sessionId = c.req.query('session');
  const email = c.req.query('email');
  
  if (!sessionId || !email) {
    return c.redirect('/quiz');
  }
  
  return c.render(
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Executive Edge Academy</h1>
          <p className="text-lg text-gray-600">Complete your enrollment in the premier business transformation program</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Executive Transformation Program</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">12-Week Intensive Program</span>
                  <span className="font-semibold text-gray-900">$4,997</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Personal Success Manager</span>
                  <span className="text-gray-500">Included</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Custom AI Toolkit ($50K+ value)</span>
                  <span className="text-gray-500">Included</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Mastermind Network Access</span>
                  <span className="text-gray-500">Included</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-700">Assessment Completion Bonus</span>
                  <span className="font-semibold text-green-600">-$500</span>
                </div>
                <div className="flex justify-between items-center py-4 text-xl font-bold">
                  <span>Investment Total</span>
                  <span>$4,497</span>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-2">90-Day Revenue Guarantee</h3>
                <p className="text-sm text-green-700">Achieve your first $10K month within 90 days or receive a full refund plus $1,000 for your time.</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll Achieve</h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Build a $10K-$100K+ monthly AI-powered business</span>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Access proven systems used by Fortune 500 executives</span>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Join network of 2,847+ successful Academy graduates</span>
                </div>
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Receive personal mentorship from industry experts</span>
                </div>
              </div>
              
              <button className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Secure Your Spot - Enroll Now
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Secure enrollment • SSL encrypted • 14-day satisfaction guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    { title: 'Enroll - Executive Edge Academy' }
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