# Access Control Rules - Role-Based Dashboard Access

## 🔐 Strict Role-Based Access Control

### Access Matrix

| User Role | Can Access | Cannot Access |
|-----------|------------|---------------|
| **super_admin** | ✅ Everything (all routes) | ❌ Nothing restricted |
| **school_admin** | ✅ Admin routes only (`/admin/*`) | ❌ Teacher routes (`/teacher/*`)<br>❌ Student routes (`/student/*`) |
| **teacher** | ✅ Teacher routes only (`/teacher/*`) | ❌ Admin routes (`/admin/*`)<br>❌ Student routes (`/student/*`) |
| **student** | ✅ Student routes only (`/student/*`) | ❌ Admin routes (`/admin/*`)<br>❌ Teacher routes (`/teacher/*`) |
| **parent** | ✅ Parent routes only (`/parent/*`) | ❌ Admin routes (`/admin/*`)<br>❌ Teacher routes (`/teacher/*`)<br>❌ Student routes (`/student/*`) |

---

## 📋 Redirect Rules

### After Login
```
super_admin    → /super-admin/dashboard
school_admin   → /admin/dashboard
teacher        → /teacher/dashboard
student        → /student/dashboard
parent         → /parent/dashboard
```

### Unauthorized Access Attempts
```
Example 1: Teacher tries to access /admin/dashboard
→ Redirected to /teacher/dashboard

Example 2: Student tries to access /teacher/cbt
→ Redirected to /student/dashboard

Example 3: Admin tries to access /teacher/dashboard
→ Redirected to /admin/dashboard

Example 4: Student tries to access /admin/students
→ Redirected to /student/dashboard
```

---

## 🧪 Testing Scenarios

### Test 1: Admin Login
```
1. Login as school_admin
2. Expected: Redirect to /admin/dashboard
3. Try to access /teacher/dashboard
4. Expected: Redirect back to /admin/dashboard
5. Try to access /student/cbt
6. Expected: Redirect back to /admin/dashboard
```

### Test 2: Teacher Login
```
1. Login as teacher
2. Expected: Redirect to /teacher/dashboard
3. Try to access /admin/dashboard
4. Expected: Redirect back to /teacher/dashboard
5. Try to access /student/dashboard
6. Expected: Redirect back to /teacher/dashboard
```

### Test 3: Student Login
```
1. Login as student
2. Expected: Redirect to /student/dashboard
3. Try to access /admin/dashboard
4. Expected: Redirect back to /student/dashboard
5. Try to access /teacher/cbt
6. Expected: Redirect back to /student/dashboard
```

### Test 4: Super Admin (Special Case)
```
1. Login as super_admin
2. Expected: Redirect to /super-admin/dashboard
3. Can access /admin/dashboard ✅
4. Can access /teacher/dashboard ✅
5. Can access /student/dashboard ✅
```

---

## 🔧 Implementation Details

### 1. Route Helper Function (`lib/routes.ts`)
```typescript
export function canAccessRoute(userRole: string, path: string): boolean {
  const routeRole = getRoleFromPath(path)
  
  if (!routeRole) return true // Public route
  
  // Super admin can access everything
  if (userRole === 'super_admin') return true
  
  // Strict role matching - no cross-role access
  if (userRole === 'school_admin' && routeRole === 'admin') return true
  if (userRole === 'teacher' && routeRole === 'teacher') return true
  if (userRole === 'student' && routeRole === 'student') return true
  if (userRole === 'parent' && routeRole === 'parent') return true
  
  return false // Deny by default
}
```

### 2. Auth Guard Component (`components/auth-guard.tsx`)
```typescript
// Checks on every route change
if (!canAccessRoute(userProfile.role, pathname)) {
  console.log(`🚫 Access denied: ${userProfile.role} cannot access ${pathname}`)
  router.push(getDefaultRoute(userProfile.role))
  return
}
```

### 3. Console Logging
When access is denied, you'll see in browser console:
```
🚫 Access denied: teacher cannot access /admin/dashboard
↪️ Redirecting to /teacher/dashboard
```

---

## 🎯 Key Changes Made

### Before ❌
```typescript
// School admin could access admin AND teacher routes
if (userRole === 'school_admin' && (routeRole === 'admin' || routeRole === 'teacher')) {
  return true
}

// Generic fallback
return userRole === routeRole
```

### After ✅
```typescript
// Strict per-role access only
if (userRole === 'school_admin' && routeRole === 'admin') return true
if (userRole === 'teacher' && routeRole === 'teacher') return true
if (userRole === 'student' && routeRole === 'student') return true
if (userRole === 'parent' && routeRole === 'parent') return true

// Deny everything else
return false
```

---

## 🚨 Important Notes

1. **Super Admin Exception**: Only `super_admin` role can access all routes
2. **Strict Isolation**: Each role can ONLY access their own routes
3. **Automatic Redirect**: Unauthorized attempts redirect to user's dashboard
4. **Console Logging**: Check browser console to debug access issues
5. **Public Routes**: Landing page (`/`) and auth page (`/auth`) are always accessible

---

## 🔍 Debugging Access Issues

### Problem: User can access wrong routes
**Check:**
1. User's role in database: `SELECT role FROM user_profiles WHERE id = 'user-id'`
2. Browser console for redirect logs
3. Make sure `lib/routes.ts` changes are saved
4. Clear browser cache and reload

### Problem: User stuck in redirect loop
**Check:**
1. User has valid profile with correct role
2. Dashboard route exists for user's role
3. Check middleware.ts is not interfering

### Problem: Admin can't access admin dashboard
**Check:**
1. User role is exactly `school_admin` or `super_admin`
2. Route path matches exactly `/admin/*`
3. Check console logs for actual role value

---

## 📊 Database Role Values

Make sure roles in database match exactly:

```sql
-- Check current roles
SELECT id, email, role FROM user_profiles;

-- Update if needed
UPDATE user_profiles 
SET role = 'school_admin' 
WHERE email = 'admin@school.com';

UPDATE user_profiles 
SET role = 'teacher' 
WHERE email = 'teacher@school.com';

UPDATE user_profiles 
SET role = 'student' 
WHERE email = 'student@school.com';
```

Valid role values:
- `super_admin`
- `school_admin` (use this for school administrators)
- `teacher`
- `student`
- `parent`

---

## ✅ Quick Verification Commands

### Test in Browser Console:
```javascript
// Check current user role
console.log('User role:', localStorage.getItem('userRole'))

// Check current path
console.log('Current path:', window.location.pathname)

// Manual test
import { canAccessRoute } from '@/lib/routes'
console.log(canAccessRoute('teacher', '/admin/dashboard')) // Should be false
console.log(canAccessRoute('teacher', '/teacher/dashboard')) // Should be true
```

---

## 🎓 Summary

✅ **Admin** (school_admin) → Can ONLY access `/admin/*` routes  
✅ **Teacher** → Can ONLY access `/teacher/*` routes  
✅ **Student** → Can ONLY access `/student/*` routes  
✅ **Automatic redirects** prevent unauthorized access  
✅ **Console logging** helps debug access issues  
✅ **Super admin** is the only exception with full access  

**Result**: Strict role-based access control with automatic redirects to appropriate dashboards!
