-- Add email automation sequences table
-- Supports automated email campaigns and nurture sequences

-- Email sequences table (for automated email campaigns)
CREATE TABLE IF NOT EXISTS email_sequences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  trigger_type TEXT NOT NULL, -- 'ai_profile_complete', 'checkout_abandonment', 'purchase_complete'
  template_name TEXT NOT NULL, -- Email template identifier
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'cancelled'
  scheduled_at DATETIME NOT NULL, -- When email should be sent
  sent_at DATETIME, -- When email was actually sent
  metadata TEXT, -- JSON data for email personalization
  error_message TEXT, -- Error message if sending failed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Email templates table (for storing reusable templates)
CREATE TABLE IF NOT EXISTS email_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL, -- Template identifier
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables TEXT, -- JSON array of required variables
  category TEXT, -- 'welcome', 'nurture', 'abandonment', etc.
  active INTEGER DEFAULT 1, -- Boolean: is template active
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Email campaign stats table (for tracking performance)
CREATE TABLE IF NOT EXISTS email_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_sequence_id INTEGER NOT NULL,
  event_type TEXT NOT NULL, -- 'sent', 'opened', 'clicked', 'bounced', 'unsubscribed'
  event_data TEXT, -- JSON data about the event
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (email_sequence_id) REFERENCES email_sequences(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_sequences_user ON email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_scheduled ON email_sequences(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_sequences_trigger ON email_sequences(trigger_type);

CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

CREATE INDEX IF NOT EXISTS idx_email_stats_sequence ON email_stats(email_sequence_id);
CREATE INDEX IF NOT EXISTS idx_email_stats_event ON email_stats(event_type);

-- Insert default email templates
INSERT OR IGNORE INTO email_templates (name, subject, html_content, category, variables) VALUES 
(
  'ai_profile_welcome',
  '🎯 Your AI Profile Results - {{aiClass}}!',
  '<div>Welcome email for AI Profile completion</div>',
  'welcome',
  '["name", "email", "aiClass", "readinessScore"]'
),
(
  'checkout_reminder',
  'Did you forget something? Your AI plan is waiting...',
  '<div>Reminder email for abandoned checkout</div>',
  'abandonment',
  '["name", "email", "checkoutId", "tier"]'
),
(
  'purchase_welcome',
  '🎉 Welcome to AI TechStep - Your journey starts now!',
  '<div>Welcome email after purchase</div>',
  'welcome',
  '["name", "email", "tier", "amount"]'
);