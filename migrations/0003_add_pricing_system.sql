-- Add pricing system tables for 3-tier pricing modal
-- Supports checkout sessions and equity applications

-- Checkout sessions table (for Starter and Core tiers)
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  tier TEXT NOT NULL, -- 'starter', 'core_full', 'core_installment'
  amount INTEGER NOT NULL, -- Amount in cents
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'expired', 'cancelled'
  lead_profile_data TEXT, -- JSON data from AI Profile Quiz
  payment_intent_id TEXT, -- Stripe/PayPal payment ID when completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME, -- Checkout session expiration
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Equity applications table (for Founder Equity Track)
CREATE TABLE IF NOT EXISTS equity_applications (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT NOT NULL,
  venture_idea TEXT NOT NULL,
  target_problem TEXT NOT NULL,
  portfolio TEXT, -- Optional portfolio/proof URL
  time_commitment TEXT NOT NULL, -- Hours per day commitment
  equity_agreement INTEGER DEFAULT 0, -- Boolean: agreed to 20% equity terms
  lead_profile_data TEXT, -- JSON data from AI Profile Quiz
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewing', 'interview_scheduled', 'accepted', 'rejected'
  review_notes TEXT, -- Internal notes for review process
  interview_scheduled_at DATETIME, -- When interview is scheduled
  decision_made_at DATETIME, -- When final decision was made
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Installment payments table (for Core tier installments)
CREATE TABLE IF NOT EXISTS installment_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  checkout_session_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  installment_number INTEGER NOT NULL, -- 1, 2, or 3
  amount INTEGER NOT NULL, -- Amount in cents
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  payment_intent_id TEXT, -- Stripe/PayPal payment ID
  due_date DATETIME NOT NULL,
  paid_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (checkout_session_id) REFERENCES checkout_sessions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add tier column to existing payments table for better tracking
ALTER TABLE payments ADD COLUMN tier TEXT; -- 'starter', 'core_full', 'core_installment', 'equity'
ALTER TABLE payments ADD COLUMN checkout_session_id TEXT; -- Link to checkout session

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_user ON checkout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_status ON checkout_sessions(status);
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_expires ON checkout_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_equity_applications_user ON equity_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_equity_applications_status ON equity_applications(status);
CREATE INDEX IF NOT EXISTS idx_equity_applications_email ON equity_applications(email);

CREATE INDEX IF NOT EXISTS idx_installment_payments_checkout ON installment_payments(checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_user ON installment_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_installment_payments_due ON installment_payments(due_date);