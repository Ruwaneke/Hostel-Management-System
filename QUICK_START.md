# Quick Start Guide - Hostel Management System

## ✅ What's Been Created

Your MERN stack authentication system is ready! Here's what was set up:

### Backend Components Created:
✓ User Model (`backend/models/User.js`) - With bcrypt hashing & validation
✓ Auth Controller (`backend/controllers/authController.js`) - Register & login logic
✓ Auth Routes (`backend/routes/authRoutes.js`) - `/api/auth/register` & `/api/auth/login`
✓ Database Config (`backend/config/database.js`) - MongoDB connection
✓ Environment File (`backend/.env`) - Configuration variables
✓ Express Setup Updated (`backend/app.js`) - Routes integrated
✓ Server Port Changed to 5000

### Frontend Components Created:
✓ Auth Service (`frontend/src/services/authService.js`) - API client with Axios
✓ Auth Context (`frontend/src/context/AuthContext.jsx`) - Global user state
✓ Login Page (`frontend/src/pages/Login.jsx`) - Email/password form
✓ Register Page (`frontend/src/pages/Register.jsx`) - Full form with role selection
✓ Admin Dashboard (`frontend/src/pages/AdminDashboard.jsx`) - Sidebar & stats
✓ User Profile (`frontend/src/pages/UserProfile.jsx`) - User dashboard
✓ Unauthorized Page (`frontend/src/pages/Unauthorized.jsx`) - Access denied
✓ Protected Route (`frontend/src/components/ProtectedRoute.jsx`) - Route protection
✓ React Router Setup (`frontend/src/App.jsx`) - Complete routing configuration
✓ Package.json Updated - Added react-router-dom & axios

## 🚀 Next Steps to Run

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Start Backend Server
```bash
npm run dev
```
✓ Server runs on http://localhost:5000

### Step 3: Install Frontend Dependencies (in new terminal)
```bash
cd frontend
npm install
```

### Step 4: Start Frontend Dev Server
```bash
npm run dev
```
✓ App runs on http://localhost:5173

## 📌 Important Notes

1. **MongoDB Setup Required:**
   - Local MongoDB: Ensure MongoDB is running (`mongod`)
   - OR MongoDB Atlas: Update `.env` with your connection string
   
2. **Default MONGODB_URI in .env:**
   ```
   MONGODB_URI=mongodb://localhost:27017/hostel-management
   ```

3. **To Reset .env for Atlas:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-management
   ```

## 🧪 Test the System

1. Go to http://localhost:5173/register
2. Create an Admin account:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: Admin
   - Click Register → Redirects to /admin-dashboard

3. Go back to register and create a User account:
   - Name: Regular User
   - Email: user@example.com
   - Password: user123
   - Role: User
   - Click Register → Redirects to /user-profile

4. Test Login:
   - Go to http://localhost:5173/login
   - Login with either account
   - Verify role-based redirect works

## 📊 Architecture Overview

```
User Registers/Logs In
        ↓
Frontend (React + Axios)
        ↓
Backend (Express + Mongoose)
        ↓
MongoDB (User Data)
        ↓
Response with User Info
        ↓
AuthContext (Store User)
        ↓
Protected Routes (Check Role)
        ↓
Render Dashboard/Profile
```

## 🔐 Routing Summary

| Route | Access | Redirect To |
|------|--------|-------------|
| `/register` | Public | Admin→/admin-dashboard, User→/user-profile |
| `/login` | Public | Admin→/admin-dashboard, User→/user-profile |
| `/admin-dashboard` | Admin Only | Non-admin→/unauthorized |
| `/user-profile` | User Only | Non-user→/unauthorized |
| `/unauthorized` | All | Shows access denied message |

## 📝 Sample Request/Response

### Register Request
```json
POST http://localhost:5000/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

### Register Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-03-07T10:30:00.000Z",
    "updatedAt": "2024-03-07T10:30:00.000Z"
  }
}
```

## 🐛 Common Issues & Fixes

### Error: "MongoDB connection failed"
→ Start MongoDB: `mongod` (or check connection string in .env)

### Error: "CORS error"
→ Ensure backend is running on port 5000

### Error: "Cannot POST /api/auth/register"
→ Verify routes are imported in backend/app.js ✓ (Already done)

### Registration form not visible
→ Ensure frontend dependencies are installed: `npm install` in frontend folder

## ✨ Features Demonstration

### Admin Dashboard Features:
- Sidebar with navigation
- Dashboard statistics (48 rooms, 35 occupied, etc.)
- User management section
- Payment management section
- Complaints management section
- Logout functionality
- Responsive collapse/expand sidebar

### User Profile Features:
- User profile card with avatar
- Account information display
- Quick action cards (Room, Payments, Complaints, Settings)
- Status indicators (Active room, Paid status, Pending issues)
- Logout button

## 🎨 UI Styling

- **Frontend Framework**: Tailwind CSS
- **Responsive Design**: Mobile-first approach
- **Color Scheme**:
  - Login: Blue gradient
  - Register: Green gradient
  - Sidebar: Dark gray

## 📚 Additional Resources

For more details, see `SETUP_GUIDE.md` in project root.

---

🎉 Your MERN authentication system is ready to use!

💡 Next Step: Run the backend and frontend servers to see it in action.
