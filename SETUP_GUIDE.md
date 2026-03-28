# Hostel Management System - MERN Auth Implementation

A complete MERN stack authentication system for a Hostel Management Platform with role-based access control (Admin and User).

## 🎯 Features

### Backend
- **Express.js Server** running on port 5000
- **MongoDB** database with Mongoose ODM
- **User Authentication** with bcrypt password hashing
- **Role-Based Access Control** (Admin & User roles)
- **RESTful API** for registration and login
- **Error Handling** middleware
- **CORS** support for frontend communication
- **Environment Variables** configuration

### Frontend
- **React 19** with Vite build tool
- **React Router v6** for navigation
- **Tailwind CSS** for responsive styling
- **Axios** for API calls
- **Context API** for state management
- **Protected Routes** with role-based redirection

## 📁 Project Structure

```
Hostel-Management-System/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Register & login logic
│   ├── middleware/
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   └── User.js              # User schema with validation
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   ├── .env                      # Environment variables
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx      # Route protection wrapper
    │   ├── context/
    │   │   └── AuthContext.jsx         # Auth state management
    │   ├── pages/
    │   │   ├── Login.jsx               # Login form
    │   │   ├── Register.jsx            # Registration form
    │   │   ├── AdminDashboard.jsx      # Admin dashboard
    │   │   ├── UserProfile.jsx         # User profile page
    │   │   └── Unauthorized.jsx        # Access denied page
    │   ├── services/
    │   │   └── authService.js          # API client
    │   ├── App.jsx                     # Main app with routing
    │   ├── main.jsx                    # React entry point
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables** in `.env`:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hostel-management
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

   **If using MongoDB Atlas**, replace `MONGODB_URI` with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-management
   ```

4. **Start the server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📌 API Endpoints

### Authentication Routes

#### **Register User**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### **Login User**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### **Health Check**
```
GET /health

Response:
{
  "status": "ok",
  "environment": "development",
  "database": "connected",
  "uptime": 1234.56
}
```

## 🔐 User Roles & Access

### Admin Account
- **Login and access:** `/admin-dashboard`
- **Features:**
  - Dashboard with statistics
  - User management
  - Payment management
  - Complaint management
  - Sidebar navigation

### User Account
- **Login and access:** `/user-profile`
- **Features:**
  - View profile information
  - Room information
  - Payment history
  - File complaints
  - Account settings

## 🧪 Test Credentials

After running the application, you can create test accounts:

1. **Create Admin Account:**
   - Register with `role: "admin"`
   - Email: `admin@example.com`
   - Password: `admin123`

2. **Create User Account:**
   - Register with `role: "user"`
   - Email: `user@example.com`
   - Password: `user123`

## 🔑 Key Features Explained

### User Model
- **name**: User's full name (min 3 characters)
- **email**: Unique email address with validation
- **password**: Hashed using bcryptjs (min 6 characters)
- **role**: Either "admin" or "user"
- **timestamps**: Auto-created/updated fields

### Authentication Flow
1. User registers with name, email, password, and role
2. Password is hashed using bcryptjs before storing
3. On login, password is compared with stored hash
4. User data is stored in localStorage (without password)
5. Protected routes check user role and redirect accordingly

### Route Protection
- `ProtectedRoute` component checks if user is logged in
- Validates user role for admin-specific routes
- Redirects to `/unauthorized` if role doesn't match
- Shows loading state while checking authentication

## 🛠️ Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

### Frontend
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Dependencies

### Backend
- express: Web framework
- mongoose: MongoDB ORM
- bcryptjs: Password hashing
- jsonwebtoken: JWT for future enhancements
- cors: Cross-origin requests
- dotenv: Environment variables
- helmet: Security headers

### Frontend
- react: UI library
- react-router-dom: Routing
- axios: HTTP client
- tailwindcss: CSS framework
- vite: Build tool

## 🔍 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check if MONGODB_URI in `.env` is valid
- Verify network access if using MongoDB Atlas

### CORS Errors
- Ensure backend is running on port 5000
- Check ALLOWED_ORIGINS in `.env` includes frontend URL

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Add environment variables
2. Change MONGODB_URI if needed
3. Update ALLOWED_ORIGINS with frontend URL
4. Deploy using provided Git URL

### Frontend Deployment (Vercel/Netlify)
1. Update API_BASE_URL in authService.js
2. Build: `npm run build`
3. Deploy the `dist` folder

## 📝 Future Enhancements

- [ ] JWT token-based authentication
- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile update
- [ ] Admin user management
- [ ] Payment processing integration
- [ ] Real-time notifications
- [ ] File uploads

## 📄 License

MIT License - Feel free to use this project for learning and development

## 💡 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
