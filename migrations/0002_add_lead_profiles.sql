-- Add lead profiles table for AI Profile Quiz data
-- This supports the new gamified quiz system

-- Lead profiles table (AI Profile Quiz results)
CREATE TABLE IF NOT EXISTS lead_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  profile_data TEXT NOT NULL, -- JSON data with all quiz answers
  ai_class TEXT NOT NULL, -- Calculated AI class (e.g., 'Digital Nomad Rogue')
  readiness_score INTEGER NOT NULL, -- 0-100 score
  suggested_pathways TEXT, -- JSON array of suggested career paths
  source TEXT DEFAULT 'ai_profile_quiz',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add payment_data column to payments table for PayPal integration
ALTER TABLE payments ADD COLUMN payment_data TEXT; -- JSON data from payment provider

-- Create indexes for lead profiles
CREATE INDEX IF NOT EXISTS idx_lead_profiles_user ON lead_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_class ON lead_profiles(ai_class);
CREATE INDEX IF NOT EXISTS idx_lead_profiles_score ON lead_profiles(readiness_score);