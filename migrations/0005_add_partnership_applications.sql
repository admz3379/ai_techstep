-- Migration 0005: Add partnership applications table
-- Stores equity, affiliate, and institutional partnership applications

CREATE TABLE IF NOT EXISTS partnership_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  application_type TEXT NOT NULL, -- 'equity', 'affiliate', 'institutional'
  application_data TEXT NOT NULL, -- JSON data with all form fields
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'under_review'
  notes TEXT, -- Internal notes for review process
  reviewed_by INTEGER, -- User ID of reviewer
  reviewed_at DATETIME, -- When application was reviewed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_partnership_applications_user_id ON partnership_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_partnership_applications_type ON partnership_applications(application_type);
CREATE INDEX IF NOT EXISTS idx_partnership_applications_status ON partnership_applications(status);
CREATE INDEX IF NOT EXISTS idx_partnership_applications_created ON partnership_applications(created_at);

-- Add partnership-related email templates to email sequences
-- These will be used for automated follow-up emails

INSERT OR IGNORE INTO email_templates (name, subject, html_content, category, created_at) VALUES 
-- Equity Application Templates
('equity_application_received', 'Your Equity Partnership Application - AI TechStep', '<h1>Application Received</h1><p>Thank you for your equity partnership application!</p>', 'partnership', CURRENT_TIMESTAMP),
('equity_application_approved', 'Welcome to the AI TechStep Founding Team! 🏆', '<h1>Application Approved!</h1><p>Congratulations! Your equity partnership has been approved.</p>', 'partnership', CURRENT_TIMESTAMP),
('equity_application_under_review', 'Your Equity Application is Under Review', '<h1>Under Review</h1><p>We are currently reviewing your equity application.</p>', 'partnership', CURRENT_TIMESTAMP),

-- Affiliate Application Templates  
('affiliate_application_received', 'Welcome to AI TechStep Affiliates! 💎', '<h1>Welcome Affiliate!</h1><p>Your affiliate application has been received and approved.</p>', 'partnership', CURRENT_TIMESTAMP),
('affiliate_application_approved', 'Your Affiliate Account is Ready!', '<h1>Account Ready!</h1><p>Your affiliate account is now active and ready to use.</p>', 'partnership', CURRENT_TIMESTAMP),
('affiliate_onboarding', 'Getting Started as an AI TechStep Affiliate', '<h1>Getting Started</h1><p>Here is everything you need to know to start earning commissions.</p>', 'partnership', CURRENT_TIMESTAMP),

-- Institutional Partnership Templates
('institutional_inquiry_received', 'Partnership Inquiry Received - AI TechStep', '<h1>Inquiry Received</h1><p>Thank you for your interest in partnering with AI TechStep.</p>', 'partnership', CURRENT_TIMESTAMP),
('institutional_partnership_proposal', 'Custom Partnership Proposal - AI TechStep', '<h1>Partnership Proposal</h1><p>We have prepared a custom partnership proposal for your organization.</p>', 'partnership', CURRENT_TIMESTAMP),
('institutional_meeting_scheduled', 'Partnership Meeting Scheduled', '<h1>Meeting Scheduled</h1><p>Your partnership meeting has been scheduled.</p>', 'partnership', CURRENT_TIMESTAMP);