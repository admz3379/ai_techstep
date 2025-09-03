# 🗄️ Database Setup Guide

## Database Configuration
- **Database Name**: `ai-techstep-production`
- **Database ID**: `292edfb4-22d8-4dcd-9f0d-cddbf3711820`
- **Status**: ✅ Created and configured in wrangler.jsonc

## 🚀 Apply Database Schema

### Method 1: Cloudflare Dashboard (Recommended)
1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **D1 SQL Database**
3. Click on **ai-techstep-production** database
4. Go to **Console** tab
5. Copy and paste the SQL commands below:

### SQL Schema Commands (Execute in Cloudflare Console)

```sql
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
  track_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  plan_type TEXT NOT NULL,
  payment_method TEXT DEFAULT 'stripe',
  status TEXT NOT NULL,
  payment_id TEXT UNIQUE NOT NULL,
  is_one_time INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User progress (28-day challenge progress)
CREATE TABLE IF NOT EXISTS user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  day INTEGER NOT NULL,
  phase TEXT DEFAULT 'ai_mastery',
  status TEXT DEFAULT 'locked',
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
  asset_type TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  asset_url TEXT,
  track_type TEXT,
  delivered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  accessed_at DATETIME,
  UNIQUE(user_id, asset_name),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Admin assets (content library)
CREATE TABLE IF NOT EXISTS admin_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  track_type TEXT,
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
```

### Method 2: Using API Token (Alternative)
If you create a proper Cloudflare API Token:
```bash
# Set your API token
export CLOUDFLARE_API_TOKEN=your-api-token-here

# Apply migrations
npx wrangler d1 migrations apply ai-techstep-production
```

## 🧪 Test Database Setup

After applying the schema, test with these queries in Cloudflare Console:

```sql
-- Check if tables were created
SELECT name FROM sqlite_master WHERE type='table';

-- Test insert a user
INSERT INTO users (email, name) VALUES ('test@example.com', 'Test User');

-- Check user was created
SELECT * FROM users WHERE email = 'test@example.com';

-- Clean up test data
DELETE FROM users WHERE email = 'test@example.com';
```

## 📊 Database Tables Overview

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | email, name, created_at |
| `quiz_sessions` | Quiz attempts | session_id, user_id |
| `quiz_responses` | Individual answers | question_id, answer_value |
| `user_tracks` | AI business track | track_type, score |
| `payments` | Stripe payments | amount, payment_id, status |
| `user_progress` | 28-day challenge | day, status, unlocked_at |
| `user_assets` | Delivered content | asset_type, asset_name |
| `admin_assets` | Content library | name, file_url, track_type |

## ✅ Verification Checklist

After setup:
- [ ] All 8 tables created successfully
- [ ] Indexes created for performance
- [ ] Test user insertion works
- [ ] wrangler.jsonc updated with database ID
- [ ] Ready for production deployment

## 🚀 Next Steps

1. ✅ Apply SQL schema in Cloudflare Console
2. ⏳ Commit and deploy updated wrangler.jsonc
3. ⏳ Test complete payment flow
4. ⏳ Verify email notifications
5. ⏳ Monitor database records

The database is now ready to store:
- User registrations and quiz results
- Stripe payment records
- 28-day progress tracking
- Content delivery and access logs