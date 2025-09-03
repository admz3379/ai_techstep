# AI TechStep Email Configuration

## Overview
When users complete the AI TechStep quiz, two emails are triggered:
1. **Notification to support@techstepfoundation.org** - New signup details
2. **Welcome email to user** - Challenge start instructions

## Current Status
✅ **Email templates created and tested**  
✅ **API endpoints configured**  
⏳ **Email service integration needed for production**

## Email Flow
```
User completes quiz → Email to support@techstepfoundation.org
User makes payment → Welcome email to user
```

## Production Setup

### 1. Choose Email Service
**Recommended services:**
- **Resend** - Modern, developer-friendly ($0.40/1000 emails)
- **SendGrid** - Popular, reliable ($14.95/month)
- **Mailgun** - Powerful for developers ($35/month)
- **Postmark** - High deliverability ($15/month)

### 2. Configure Environment Variables
```bash
# Set these as Cloudflare secrets
wrangler secret put EMAIL_SERVICE
# Enter: resend (or sendgrid, mailgun, postmark)

wrangler secret put EMAIL_API_KEY  
# Enter your service API key

wrangler secret put EMAIL_FROM_ADDRESS
# Enter: noreply@techstepfoundation.org
```

### 3. Install Email Service Package
```bash
# For Resend
npm install resend

# For SendGrid  
npm install @sendgrid/mail

# For Mailgun
npm install mailgun.js

# For Postmark
npm install postmark
```

### 4. Update Email Functions
Replace the console.log calls in `sendEmailNotification()` and `sendWelcomeEmail()` with actual service calls:

#### Example for Resend:
```typescript
import { Resend } from 'resend';

const resend = new Resend(c.env.EMAIL_API_KEY);

await resend.emails.send({
  from: c.env.EMAIL_FROM_ADDRESS,
  to: 'support@techstepfoundation.org',
  subject: emailData.subject,
  html: emailData.html
});
```

## Testing

### Test Configuration Endpoint
```bash
curl -X POST http://localhost:3000/api/configure-email \
  -H "Content-Type: application/json" \
  -d '{
    "service": "resend",
    "apiKey": "your-api-key",
    "fromEmail": "noreply@techstepfoundation.org",
    "testEmail": "your-test@email.com"
  }'
```

### Test Notification Endpoint
```bash
curl -X POST http://localhost:3000/api/test-notification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Parent",
    "goal": "Create passive income with AI"
  }'
```

## Email Templates

### Notification Email (to support@techstepfoundation.org)
- **Subject:** New AI TechStep Challenge Signup - [User Name]
- **Content:** User details, quiz scores, next steps
- **Styling:** Professional HTML with AI TechStep branding

### Welcome Email (to user)
- **Subject:** 🎉 Welcome to AI TechStep Challenge - Your 28-Day Journey Starts Now!
- **Content:** Welcome message, next steps, dashboard link
- **Styling:** Friendly HTML with parent-focused messaging

## Email Content Details

### Support Notification Includes:
- User email and name
- Selected goal (passive income type)
- Quiz results and track scores
- Signup timestamp
- Next steps in user journey

### User Welcome Includes:
- Personal welcome with name
- Challenge overview
- Dashboard access link
- Support contact info
- Parent-friendly messaging

## Production Checklist
- [ ] Choose email service provider
- [ ] Set up email service account
- [ ] Configure domain authentication (SPF, DKIM)
- [ ] Set Cloudflare environment variables
- [ ] Install email service package
- [ ] Update email functions with service calls
- [ ] Test email delivery
- [ ] Monitor email deliverability
- [ ] Set up email analytics/tracking

## Support Contact
For email setup issues, contact: support@techstepfoundation.org