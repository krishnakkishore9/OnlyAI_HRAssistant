# 📧 Phase 5: Automation & Email Flow

## 🎯 Goal
Connect the AI's creativity with actual business outcomes (emails).

## 📋 Tasks
1. **Email Drafting Logic**:
   - Update Chat API to detect "leave request" intent.
   - Generate structured email drafts via Groq.
2. **Email Preview UI**:
   - Build a modal/component to display and edit drafts.
3. **SMTP Integration**:
   - Set up `lib/email/sender.ts` (using Resend or Nodemailer).
   - Trigger email send on user confirmation.

## ✅ Completion Criteria
- User can confirm an AI-drafted email.
- Email is successfully delivered to the recipient.
- Delivery status is logged.
