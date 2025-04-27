# 🌍 Beyond Borders - Travel Listing Website
Discover and share beautiful destinations around the world!
This project allows users to create, explore, review, and manage listings of travel destinations with authentication and admin panel features.

## Project Structure
```
Travel_Beyond_Borders/
├── models/
│   ├── user.js
│   ├── listing.js
│   └── review.js
│
├── routes/
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
│   └── admin.js
│
├── controller/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── views/
│   ├── layouts/
│   ├── listings/
│   ├── users/
│   └── partials/
│
├── public/
│   ├── stylesheets/
│   ├── images/
│   ├── assets/
│   └── scripts/
│
├── cloudConfig.js
├── app.js
├── readme.md
├── utilities/
│   ├── ExpressError.js
│   └── wrapAsync.js
└── .env

```
## ⚙️ Technologies Used
```
- Node.js (backend server)
- Express.js (framework)
- MongoDB Atlas (cloud database)
- Mongoose (MongoDB ODM)
- EJS (templating engine)
- Bootstrap 5 (UI styling)
- Passport.js (authentication)
- Multer & Cloudinary (image upload & storage)
- SweetAlert2 (pop-up notifications)
- connect-mongo (session store in DB)
```

## 🚀 How to Run Locally

### 1. Clone Repository
```
git clone https://github.com/Rohit-Codess/Travel-Beyond-Borders.git
cd travel-beyond-borders
```

### 2. Install Dependencies
```
npm install
```
### 3. Configure Environment Variables
Create a .env file in the root:
```
ATLAS_DB_URL=your_mongodb_atlas_url
SECRET=your_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL=your_email@example.com
EMAIL_PASSWORD=your_app_password
```

### 4. Run the Server
```
npm start
```
Server will start at:
```
http://localhost:8080
```

## 🛠️ Key Features
```
- ✨ User Authentication (SignUp / Login / Logout)
- 🛡️ Admin Panel (Manage users, promote/demote admin)
- 🏔️ Create Listings (Add Title, Description, Category, Image, Price)
- 📝 Reviews (Create, Delete your reviews)
- 📧 Forgot Password (Reset password via email link)
- 📦 Secure Session Store with MongoDB
- 📸 Image Uploads using Multer and Cloudinary
- 💬 Flash Messages for UX feedback
- 📱 Responsive UI with Bootstrap
- 🔎 Category Filter & Search functionality
- 📈 Error Handling (custom ExpressError class)
```

## 🧠 Important Tips
```
- Always use wrapAsync() to avoid async/await errors in Express.
- Always validate inputs using middleware.
- Protect routes (admin/user authentication) using isLoggedIn and isAdmin checks.
- Use SweetAlert2 for user-friendly popups instead of boring alerts.
- Optimize images before uploading to Cloudinary.
```