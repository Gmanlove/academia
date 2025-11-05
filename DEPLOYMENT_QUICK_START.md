# 🚀 Academia - Quick Deployment Guide

## Pre-Deployment Checklist

### ✅ 1. Environment Setup
```bash
# Create .env.local file with:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### ✅ 2. Database Setup
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/FINAL-MIGRATION.sql`
3. Execute the SQL
4. Verify all 24 tables are created
5. Verify RLS policies are active

### ✅ 3. Create Super Admin
```sql
-- First, register a user via the app at /auth
-- Then run this in Supabase SQL Editor:

UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'your-admin-email@example.com';
```

### ✅ 4. Build & Test Locally
```bash
# Build
npm run build

# Test production build
npm start

# Verify at http://localhost:3000
```

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

#### Step 1: Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (will be your-app.vercel.app)
5. Click "Deploy"

#### Step 3: Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your domain

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Self-Hosted (VPS/AWS/DigitalOcean)

```bash
# On your server
git clone your-repo
cd academia
npm install
npm run build

# Using PM2
npm install -g pm2
pm2 start npm --name "academia" -- start
pm2 save
pm2 startup
```

## Post-Deployment Steps

### 1. ✅ Verify Deployment
- [ ] Visit your deployed URL
- [ ] Test login/register
- [ ] Test logout
- [ ] Access admin dashboard
- [ ] Access teacher portal
- [ ] Access student portal
- [ ] Check all routes work

### 2. ✅ Create Initial Data

#### Create a School:
1. Login as super_admin
2. Go to `/admin/schools`
3. Click "Add School"
4. Fill in school details
5. Save

#### Create Teachers:
1. Go to `/admin/teachers`
2. Click "Add Teacher"
3. Fill in details
4. Invite via email

#### Create Students:
1. Go to `/admin/students`
2. Click "Add Student"
3. Fill in details
4. Or use bulk import

#### Create Classes:
1. Go to `/admin/classes`
2. Click "Add Class"
3. Assign class teacher
4. Add subjects

### 3. ✅ Configure School Settings
1. Go to school settings
2. Set grading scale
3. Set terms (First, Second, Third)
4. Set academic year
5. Configure result visibility

### 4. ✅ Test Complete Flow

#### Admin Flow:
- [ ] Create school
- [ ] Add teachers
- [ ] Add students
- [ ] Create classes
- [ ] Assign students to classes
- [ ] View analytics

#### Teacher Flow:
- [ ] Login as teacher
- [ ] View assigned classes
- [ ] Enter student scores
- [ ] Create CBT exam
- [ ] View class performance

#### Student Flow:
- [ ] Login as student
- [ ] View dashboard
- [ ] Take CBT exam
- [ ] Check results
- [ ] View notifications

### 5. ✅ Security Check
- [ ] HTTPS enabled (automatic on Vercel/Netlify)
- [ ] RLS policies active in Supabase
- [ ] Environment variables secure (not in code)
- [ ] Email verification working
- [ ] Session timeout reasonable
- [ ] Logout working properly

### 6. ✅ Performance Check
- [ ] Page load times < 3s
- [ ] Images optimized
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Works on all browsers

## Monitoring & Maintenance

### Set Up Monitoring (Optional):
```bash
# Sentry for error tracking
npm install @sentry/nextjs
```

### Regular Maintenance:
1. **Weekly**: Check for errors in logs
2. **Monthly**: Update dependencies
3. **Quarterly**: Review security
4. **As needed**: Add new features

## Troubleshooting

### Issue: Authentication Not Working
**Solution**:
1. Check Supabase URL and keys in environment variables
2. Verify email verification is set up
3. Check RLS policies are active

### Issue: Database Connection Failed
**Solution**:
1. Verify Supabase project is active
2. Check service role key is correct
3. Check RLS policies don't block access

### Issue: Logout Not Working
**Solution**:
1. Visit `/emergency-logout`
2. Follow instructions
3. Check console for errors

### Issue: Build Fails
**Solution**:
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Page Not Found
**Solution**:
1. Check middleware.ts is included
2. Verify route protection rules
3. Check auth guard is working

## Support Resources

### Documentation:
- README.md - Main documentation
- QUICK_START.md - Quick reference
- ARCHITECTURE.md - System design
- ACCESS_CONTROL_GUIDE.md - Access rules
- CBT_SYSTEM_README.md - CBT system
- DEPLOYMENT_GUIDE.md - Full deployment guide

### Help:
- Check console errors (F12 in browser)
- Check Supabase logs
- Check Vercel/Netlify logs
- Review TEST_REPORT.md for known issues

## Success Checklist

Before going live:
- [ ] Database migrated successfully
- [ ] Super admin created
- [ ] At least one school created
- [ ] Test teacher account works
- [ ] Test student account works
- [ ] Logout works correctly
- [ ] All core features tested
- [ ] SSL certificate active (HTTPS)
- [ ] Custom domain configured (if using)
- [ ] Backup strategy in place
- [ ] Monitoring set up (optional)

## Launch!

Once all checkboxes are complete:

🎉 **Your Academia school management system is LIVE!**

### Announce to Users:
1. Send email to teachers with login instructions
2. Send credentials to students
3. Provide quick start guide
4. Offer training session if needed
5. Set up support channel

### First Week:
- Monitor for any issues
- Gather user feedback
- Fix any bugs quickly
- Answer user questions
- Document common issues

---

**Congratulations on deploying your professional school management system! 🎓✨**

For support, refer to documentation or open an issue on GitHub.
