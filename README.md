# JobTracker

JobTracker is a full-stack web application that helps users manage and track their job applications in one place. Users can create an account, log in, save job details, organize applications by status, and manage their job search through a clean and responsive dashboard.

This project was built to practice real-world full-stack development using React, TypeScript, Node.js, Express, MongoDB, authentication, protected routes, and deployment.

---

## Live Demo

 https://job-tracker-api-smoky.vercel.app


Note: The backend is deployed on Render free plan, so the first request may take a few seconds if the server is sleeping.

---

## Features

* User signup and login
* JWT-based authentication
* Protected routes for logged-in users
* Add new job applications
* View saved job applications
* Delete job applications
* Track job status by columns:

  * Wishlist
  * Applied
  * Interviewing
  * Offered
  * Accepted
* Drag and drop jobs between status columns
* Optional job description and personal notes
* Responsive design for desktop and mobile
* Clean dashboard UI
* Separate frontend and backend deployment

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Axios
* React Router DOM
* @hello-pangea/dnd
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt
* cookie-parser
* cors
* dotenv
* express-rate-limit

---

## Project Structure

```bash
JobTracker/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── connection.js
│   └── app.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## Frontend Pages

* Signup page
* Login page
* Home page
* Job tracker dashboard
* Save job form page

---

## API Endpoints

### Auth Routes

| Method | Endpoint  | Description         |
| ------ | --------- | ------------------- |
| POST   | `/signup` | Register a new user |
| POST   | `/login`  | Login user          |
| POST   | `/logout` | Logout user         |

### Job Routes

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| POST   | `/savejob`     | Add a new job              |
| GET    | `/savejob`     | Get jobs of logged-in user |
| DELETE | `/savejob/:id` | Delete a saved job         |

---

## Environment Variables

### Frontend `.env`

```env
VITE_API_URL=https://job-tracker-jmf6.onrender.com
```

### Backend `.env`

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://job-tracker-api-smoky.vercel.app
```


## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Mariam-sajjad/job-tracker-api
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Start backend server

```bash
npm start
```

Or if using nodemon:

```bash
npm run dev
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
```

### 5. Start frontend development server

```bash
npm run dev
```

---

## Authentication

This project uses JWT-based authentication. After login, the user receives an authentication token, which is used to access protected routes. Only logged-in users can create, view, and delete their own job applications.

---

## Deployment

The frontend is deployed on Vercel.

The backend is deployed on Render.

MongoDB Atlas is used as the cloud database.

---

## What I Learned

While building this project, I practiced:

* Creating REST APIs with Express.js
* Connecting Node.js with MongoDB using Mongoose
* Creating schemas and controllers
* User authentication with JWT
* Password hashing with bcrypt
* Protecting routes with middleware
* Connecting React frontend with backend APIs
* Handling forms in React with TypeScript
* Using Axios for API requests
* Using environment variables
* Deploying frontend on Vercel
* Deploying backend on Render
* Fixing CORS and production API issues

---

## Future Improvements

* Add update job functionality
* Add search and filter options
* Add email reminder feature
* Add job application analytics
* Add forgot password feature
* Add Google login
* Improve dashboard UI
* Add loading and error states

---

## Author

Maryam Sajjad

BS Information Technology Student
MERN Stack Learner
GitHub: https://github.com/Mariam-sajjad

