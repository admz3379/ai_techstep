-- Seed data for AI Income Builder v1.0

-- Insert sample zoom sessions
INSERT OR IGNORE INTO zoom_sessions (session_date, zoom_link, week_number) VALUES 
  ('2024-01-15', 'https://zoom.us/j/sample123', 1),
  ('2024-01-22', 'https://zoom.us/j/sample124', 2),
  ('2024-01-29', 'https://zoom.us/j/sample125', 3),
  ('2024-02-05', 'https://zoom.us/j/sample126', 4);

-- Insert sample admin assets for each track
INSERT OR IGNORE INTO admin_assets (name, description, asset_type, track_type, file_url, file_type) VALUES 
  -- Digital Product Track
  ('ChatGPT Prompt Bank - Digital Products', 'Complete collection of prompts for creating digital products', 'prompt_bank', 'digital_product', '/assets/digital-product-prompts.pdf', 'pdf'),
  ('Canva Template - Course Cover', 'Professional course cover templates', 'template', 'digital_product', 'https://canva.com/templates/digital-course', 'link'),
  ('Product Launch Checklist', 'Step-by-step checklist for launching digital products', 'checklist', 'digital_product', '/assets/product-launch-checklist.pdf', 'pdf'),
  ('Free Tools Resource List', 'Curated list of free tools for digital product creation', 'resource_list', 'digital_product', '/assets/digital-tools-list.pdf', 'pdf'),
  
  -- Service Track
  ('Service Business Prompts', 'AI prompts for service-based businesses', 'prompt_bank', 'service', '/assets/service-prompts.pdf', 'pdf'),
  ('Service Proposal Template', 'Professional service proposal templates', 'template', 'service', 'https://docs.google.com/document/service-proposal', 'link'),
  ('Service Marketing Checklist', 'Marketing strategies for service businesses', 'checklist', 'service', '/assets/service-marketing-checklist.pdf', 'pdf'),
  ('Service Tools & Resources', 'Essential tools for service providers', 'resource_list', 'service', '/assets/service-tools-list.pdf', 'pdf'),
  
  -- E-commerce Track  
  ('E-commerce Product Prompts', 'AI prompts for e-commerce optimization', 'prompt_bank', 'ecommerce', '/assets/ecommerce-prompts.pdf', 'pdf'),
  ('Product Listing Template', 'Optimized product listing templates', 'template', 'ecommerce', 'https://docs.google.com/document/ecommerce-listing', 'link'),
  ('E-commerce Launch Checklist', 'Complete e-commerce setup checklist', 'checklist', 'ecommerce', '/assets/ecommerce-checklist.pdf', 'pdf'),
  ('E-commerce Platforms Guide', 'Guide to choosing the right platform', 'resource_list', 'ecommerce', '/assets/ecommerce-platforms.pdf', 'pdf'),
  
  -- Consulting Track
  ('Consulting Expertise Prompts', 'AI prompts for positioning as an expert', 'prompt_bank', 'consulting', '/assets/consulting-prompts.pdf', 'pdf'),
  ('Consulting Package Template', 'Templates for packaging consulting services', 'template', 'consulting', 'https://docs.google.com/document/consulting-package', 'link'),
  ('Client Acquisition Checklist', 'Steps to acquire consulting clients', 'checklist', 'consulting', '/assets/consulting-checklist.pdf', 'pdf'),
  ('Consulting Resources', 'Tools and platforms for consultants', 'resource_list', 'consulting', '/assets/consulting-resources.pdf', 'pdf');

-- Insert test users
INSERT OR IGNORE INTO users (email, name, language) VALUES 
  ('test.digital@example.com', 'Test Digital User', 'en'),
  ('test.service@example.com', 'Test Service User', 'en'),
  ('test.ecommerce@example.com', 'Test Ecommerce User', 'es'),
  ('test.consulting@example.com', 'Test Consulting User', 'ru');

-- Assign tracks to test users
INSERT OR IGNORE INTO user_tracks (user_id, track_type, score) VALUES 
  (1, 'digital_product', 85),
  (2, 'service', 78),
  (3, 'ecommerce', 92),
  (4, 'consulting', 88);

-- Create sample payments for test users
INSERT OR IGNORE INTO payments (user_id, stripe_payment_id, amount, status, completed_at) VALUES 
  (1, 'pi_test_digital_001', 49900, 'completed', datetime('now', '-2 days')),
  (2, 'pi_test_service_002', 49900, 'completed', datetime('now', '-1 day')),
  (3, 'pi_test_ecommerce_003', 49900, 'completed', datetime('now')),
  (4, 'pi_test_consulting_004', 49900, 'completed', datetime('now'));

-- Set up progress for test users (simulate different completion stages)
INSERT OR IGNORE INTO user_progress (user_id, day, phase, status, unlocked_at, completed_at) VALUES 
  -- User 1: Completed all onboarding
  (1, 1, 'onboarding', 'completed', datetime('now', '-2 days'), datetime('now', '-2 days', '+2 hours')),
  (1, 2, 'onboarding', 'completed', datetime('now', '-1 day'), datetime('now', '-1 day', '+3 hours')),
  (1, 3, 'onboarding', 'completed', datetime('now'), datetime('now', '+1 hour')),
  (1, 4, 'onboarding', 'unlocked', datetime('now', '+1 hour'), NULL),
  (1, 5, 'onboarding', 'locked', NULL, NULL),
  
  -- User 2: Mid onboarding
  (2, 1, 'onboarding', 'completed', datetime('now', '-1 day'), datetime('now', '-1 day', '+4 hours')),
  (2, 2, 'onboarding', 'completed', datetime('now'), datetime('now', '+2 hours')),
  (2, 3, 'onboarding', 'unlocked', datetime('now', '+2 hours'), NULL),
  (2, 4, 'onboarding', 'locked', NULL, NULL),
  (2, 5, 'onboarding', 'locked', NULL, NULL),
  
  -- User 3: Just started
  (3, 1, 'onboarding', 'unlocked', datetime('now'), NULL),
  (3, 2, 'onboarding', 'locked', NULL, NULL),
  (3, 3, 'onboarding', 'locked', NULL, NULL),
  (3, 4, 'onboarding', 'locked', NULL, NULL),
  (3, 5, 'onboarding', 'locked', NULL, NULL),
  
  -- User 4: Fresh account
  (4, 1, 'onboarding', 'unlocked', datetime('now'), NULL),
  (4, 2, 'onboarding', 'locked', NULL, NULL),
  (4, 3, 'onboarding', 'locked', NULL, NULL),
  (4, 4, 'onboarding', 'locked', NULL, NULL),
  (4, 5, 'onboarding', 'locked', NULL, NULL);

-- Deliver assets to users based on their tracks
INSERT OR IGNORE INTO user_assets (user_id, asset_type, asset_name, asset_url, track_type) 
SELECT 
  ut.user_id,
  aa.asset_type,
  aa.name,
  aa.file_url,
  aa.track_type
FROM user_tracks ut
JOIN admin_assets aa ON ut.track_type = aa.track_type
WHERE ut.user_id IN (1, 2, 3, 4);