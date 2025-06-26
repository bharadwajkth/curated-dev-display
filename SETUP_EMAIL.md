# Email Setup Guide for Portfolio Contact Form

This guide will help you set up EmailJS to enable real email functionality for your portfolio's contact form.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Add Email Service
1. In your EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (recommended for personal use)
   - **Outlook/Hotmail**
   - **Yahoo**
   - Or any other SMTP service
4. Follow the setup instructions for your chosen provider
5. **Copy the Service ID** (you'll need this later)

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use this template content:

```html
Subject: New Contact Form Message from {{from_name}}

Hello Bharadwaj,

You have received a new message from your portfolio contact form:

From: {{from_name}}
Email: {{from_email}}
Sent: {{timestamp}}

Message:
{{message}}

---
This message was sent from your portfolio website.
Reply directly to this email to respond to {{from_name}}.
```

4. **Copy the Template ID** (you'll need this later)
5. Save the template

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Find your **Public Key** (starts with something like "user_...")
3. Copy this key

### Step 5: Configure Environment Variables
1. Open your `.env` file (create one if it doesn't exist)
2. Add these lines with your actual values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 6: Test the Contact Form
1. Restart your development server (`npm run dev`)
2. Go to your contact form
3. Fill out and submit a test message
4. Check your email inbox!

## 📧 Template Variables

Your email template can use these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{message}}` - The message content
- `{{timestamp}}` - When the message was sent

## 🔧 Troubleshooting

### "Email service not configured" error
- Check that all three environment variables are set correctly
- Make sure variable names start with `VITE_`
- Restart your development server after adding variables

### Emails not being received
- Check your spam/junk folder
- Verify your email service is properly connected in EmailJS
- Test with a different email address

### "Network error" or "Service error"
- Check your internet connection
- Verify your EmailJS service is active
- Try again in a few minutes (rate limiting)

## 🎯 Free Plan Limits

EmailJS free plan includes:
- **200 emails per month**
- **2 email services**
- **2 email templates**

This is perfect for a portfolio contact form!

## 🔒 Security Notes

- EmailJS keys are safe to expose in frontend code
- They're designed for client-side use
- Rate limiting prevents abuse
- No sensitive data is exposed

## 📞 Support

If you need help:
1. Check the [EmailJS Documentation](https://www.emailjs.com/docs/)
2. Contact EmailJS support
3. Or reach out to me directly!

---

Once set up, your contact form will send real emails directly to your inbox! 🎉