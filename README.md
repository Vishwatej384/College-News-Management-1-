# College News Management System

A professional, full-stack web application for managing college news, events, and announcements with a modern, attractive UI.

## 🚀 Features

### User Features
- **Authentication System**: Secure login/register with JWT tokens
- **Role-Based Access**: Admin, Editor, and Student roles with different permissions
- **News Browsing**: Browse news by categories, search functionality
- **News Details**: Full article view with images, comments, likes, and bookmarks
- **Interactive Features**: Like, comment, bookmark news articles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### Admin/Editor Features
- **Create News**: Rich text editor with image upload
- **Manage News**: Edit, delete, publish/draft news articles
- **Dashboard**: View statistics and manage all articles
- **Featured News**: Mark important news as featured
- **Category Management**: Organize news by categories

### Technical Features
- **Modern UI**: Built with React, TailwindCSS, and Lucide icons
- **RESTful API**: Express.js backend with proper error handling
- **MySQL Database**: Relational database with optimized queries
- **Image Upload**: Multer for handling image uploads
- **Security**: Helmet, CORS, bcrypt password hashing, JWT authentication
- **Real-time Updates**: Toast notifications for user feedback

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone or Download the Project

```bash
cd c:\Users\rvish\OneDrive\Documents\dbms
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Database Setup

1. Open MySQL and create a database:

```sql
CREATE DATABASE college_news_db;
```

2. The tables will be created automatically when you start the server.

### 4. Environment Configuration

1. Copy the `.env.example` file to `.env`:

```bash
copy .env.example .env
```

2. Edit the `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=college_news_db

JWT_SECRET=your_random_secret_key_here

PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173
```

**Important**: Change `JWT_SECRET` to a random, secure string!

### 5. Start the Application

```bash
# Start both backend and frontend (recommended)
npm run dev

# OR start them separately:

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👥 Default User Roles

You can register with any of these roles:

- **Student**: Can view, like, comment, and bookmark news
- **Editor**: Can create, edit, and delete their own news articles
- **Admin**: Full access to all features and all articles

## 📁 Project Structure

```
dbms/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, Footer, NewsCard)
│   │   ├── pages/         # Page components (Home, Login, NewsDetail, etc.)
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── config/           # Database configuration
│   ├── middleware/       # Auth, upload middleware
│   ├── routes/           # API routes (auth, news, comments, categories)
│   └── index.js          # Server entry point
├── uploads/              # Uploaded images (created automatically)
├── package.json
├── .env.example
└── README.md
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP logging

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### News
- `GET /api/news` - Get all published news (with filters)
- `GET /api/news/:slug` - Get single news by slug
- `POST /api/news` - Create news (auth required)
- `PUT /api/news/:id` - Update news (auth required)
- `DELETE /api/news/:id` - Delete news (auth required)
- `POST /api/news/:id/like` - Like/unlike news (auth required)
- `POST /api/news/:id/bookmark` - Bookmark/unbookmark (auth required)

### Comments
- `GET /api/comments/news/:newsId` - Get comments for news
- `POST /api/comments` - Add comment (auth required)
- `DELETE /api/comments/:id` - Delete comment (auth required)

### Categories
- `GET /api/categories` - Get all categories

## 🎯 Key Features Explained

### 1. Authentication & Authorization
- JWT-based authentication with 7-day token expiry
- Role-based access control (Admin, Editor, Student)
- Protected routes on both frontend and backend

### 2. News Management
- Create news with rich text content and images
- Draft/Published status
- Featured news highlighting
- Category organization
- View count tracking

### 3. User Interactions
- Like/unlike news articles
- Comment with threaded replies
- Bookmark favorite articles
- Real-time like/comment counts

### 4. Search & Filter
- Search news by title and content
- Filter by category
- View featured news separately

### 5. Responsive Design
- Mobile-first approach
- Beautiful gradient headers
- Card-based layouts
- Smooth transitions and hover effects

## 🚀 Deployment Tips

### Database
- Use environment variables for all sensitive data
- Enable MySQL connection pooling (already configured)
- Regular backups recommended

### Security
- Change JWT_SECRET to a strong random string
- Use HTTPS in production
- Set NODE_ENV=production
- Configure proper CORS origins

### Performance
- Enable gzip compression
- Optimize images before upload
- Use CDN for static assets
- Add database indexes (already included)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL is running
mysql --version

# Test connection
mysql -u root -p
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
cd client
rm -rf node_modules
npm install
```

## 📝 Sample Data

After starting the application, you can:

1. Register as an Admin/Editor
2. Create sample news articles
3. Add categories (default categories are auto-created)
4. Test all features

## 🤝 Contributing

This is a college project. Feel free to:
- Report bugs
- Suggest features
- Improve documentation
- Enhance UI/UX

## 📄 License

MIT License - Feel free to use this project for learning purposes.

## 👨‍💻 Developer

Created as a DBMS project for College News Management System.

---

**Happy Coding! 🎉**

For any issues or questions, please check the troubleshooting section or review the code comments.
