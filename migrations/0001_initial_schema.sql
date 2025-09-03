-- AI TechStep Challenge Database Schema
-- Initial schema for user management, quiz responses, and payments

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quiz sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT UNIQUE NOT NULL,
  user_id INTEGER,
  language TEXT DEFAULT 'en',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  answer_value INTEGER NOT NULL,
  answer_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User tracks (AI business track assignment)
CREATE TABLE IF NOT EXISTS user_tracks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  track_type TEXT NOT NULL, -- 'digital_product', 'service', 'ecommerce', 'consulting'
  score INTEGER NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'USD',
  plan_type TEXT NOT NULL, -- 'ai-techstep-challenge'
  payment_method TEXT DEFAULT 'stripe',
  status TEXT NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
  payment_id TEXT UNIQUE NOT NULL, -- Stripe payment intent ID
  is_one_time INTEGER DEFAULT 1, -- 1 for one-time, 0 for subscription
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User progress (28-day challenge progress)
CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  day INTEGER NOT NULL, -- 1-28
  phase TEXT DEFAULT 'ai_mastery',
  status TEXT DEFAULT 'locked', -- 'locked', 'unlocked', 'completed'
  unlocked_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, day, phase),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User assets (delivered content/templates)
CREATE TABLE IF NOT EXISTS user_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  asset_type TEXT NOT NULL, -- 'template', 'guide', 'video', 'tool'
  asset_name TEXT NOT NULL,
  asset_url TEXT,
  track_type TEXT, -- Optional: specific to user's track
  delivered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accessed_at DATETIME,
  UNIQUE(user_id, asset_name),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Admin assets (content library)
CREATE TABLE IF NOT EXISTS admin_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL, -- 'template', 'guide', 'video', 'tool'
  description TEXT,
  file_url TEXT,
  track_type TEXT, -- 'digital_product', 'service', 'ecommerce', 'consulting'
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session ON quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_user ON quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assets_user ON user_assets(user_id);