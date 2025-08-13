# Email Configuration Guide for Academia App

## Supabase Email Setup Checklist

### 1. Authentication Settings
Go to Supabase Dashboard → Authentication → Settings:

- ✅ **Enable email confirmations**: ON
- ✅ **Enable email change confirmations**: ON  
- ✅ **Enable secure email change**: ON (recommended)
- ✅ **Double confirm email changes**: ON (optional)

### 2. Email Templates
Go to Authentication → Email Templates and customize:

#### Confirm signup
```html
<h2>Confirm your signup for Academia</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

#### Magic Link
```html
<h2>Your magic link for Academia</h2>
<p>Follow this link to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

#### Change Email Address
```html
<h2>Confirm email change for Academia</h2>
<p>Follow this link to confirm your new email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email change</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

#### Reset Password
```html
<h2>Reset your password for Academia</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

### 3. Site URL Configuration
In Authentication → Settings → Site URL:
- **Site URL**: `http://localhost:3000` (for development)
- **Redirect URLs**: Add `http://localhost:3000/auth/callback`

### 4. SMTP Configuration (Optional but Recommended)

For production, configure custom SMTP:
- **Host**: Your SMTP provider (e.g., SendGrid, Mailgun, etc.)
- **Port**: Usually 587 or 465
- **Username**: Your SMTP username
- **Password**: Your SMTP password
- **Sender name**: Academia App
- **Sender email**: noreply@yourdomain.com

### 5. Testing Email Delivery

#### Development Testing:
1. Use a real email address you can access
2. Check spam/junk folders
3. Try different email providers (Gmail, Outlook, etc.)

#### Production Testing:
1. Test with multiple email providers
2. Monitor email delivery logs in Supabase
3. Set up email reputation monitoring

### 6. Common Email Issues & Solutions

#### Emails not arriving:
- Check Supabase logs (Dashboard → Logs → Auth)
- Verify email templates are properly configured
- Check if emails are in spam folder
- Verify SMTP settings if using custom SMTP

#### Emails arriving but links don't work:
- Check Site URL and Redirect URLs configuration
- Verify your app is handling the auth callback properly
- Check browser console for errors

#### Rate limiting:
- Supabase has built-in rate limiting for emails
- Wait a few minutes between requests during testing

### 7. Email Flow Testing Steps

1. **Sign Up Flow**:
   - User registers with email/password
   - Confirmation email sent
   - User clicks link
   - Account confirmed
   - User can sign in

2. **Password Reset Flow**:
   - User requests password reset
   - Reset email sent
   - User clicks link
   - User sets new password
   - User can sign in with new password

3. **Email Change Flow**:
   - User requests email change
   - Confirmation email sent to new email
   - User clicks link
   - Email updated in system
