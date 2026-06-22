# Job Tracker API

A backend REST API for a personal job application tracker. Users can sign up, log in, and save job listings they're applying to — including company, role, location, workload range, and personal notes — then update or delete entries as their application status changes.

Built to practice real authentication (JWT in httpOnly cookies), MongoDB/Mongoose schema design, and ownership-scoped CRUD operations — not mock data or in-memory arrays.

## Features

- **Authentication** — signup and login with bcrypt password hashing and JWT stored in httpOnly cookies (not localStorage, to reduce XSS risk)
- **Protected routes** — custom Express middleware verifies the JWT on every job-related request
- **Job CRUD** — create, read, update, and delete saved jobs, scoped so users can only ever touch their own data
- **Input validation** — required-field checks and a workload range check (minimum can't exceed maximum) on the server, not just the frontend
- **Rate limiting** — basic protection against brute-force/spam requests
- **Environment-aware security** — cookie `secure` flag and CORS origin are driven by environment variables, so the same code runs safely in both local development and production

## Tech Stack

- **Runtime:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (jsonwebtoken), bcrypt for password hashing, httpOnly cookies (cookie-parser)
- **Other:** cors, express-rate-limit, dotenv

## API Endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | `/api/signup` | No | Create a new user account |
| POST | `/api/login` | No | Log in and receive an auth cookie |
| POST | `/api/logout` | No | Clear the auth cookie |
| POST | `/api/save-jobs` | Yes | Save a new job listing |
| GET | `/api/save-jobs` | Yes | Get all jobs saved by the logged-in user |
| PATCH | `/api/save-jobs/:id` | Yes | Update a saved job (must be owned by the user) |
| DELETE | `/api/save-jobs/:id` | Yes | Delete a saved job (must be owned by the user) |

## Project Structure

```
.
├── index.js              # App entry point, middleware, route mounting
├── connection.js         # MongoDB connection logic
├── controller/           # Route handler logic
│   ├── signup.js
│   ├── login.js
│   ├── logout.js
│   └── saveJob.js
├── routes/                # Express routers
│   ├── signup.js
│   ├── login.js
│   ├── logout.js
│   └── savejob.js
├── middleware/
│   └── auth.js            # JWT verification middleware
└── model/                  # Mongoose schemas
    ├── signup.js           # User schema
    └── savejob.js          # SaveJob schema
```

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root:
   ```
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

3. Run the server:
   ```bash
   node index.js
   ```

The API will be available at `http://localhost:8080`.

## What I'd Improve Next

- Add a whitelist for which fields `PATCH /api/save-jobs/:id` is allowed to update, instead of passing the full request body straight to Mongoose
- Add automated tests (Jest + Supertest) for the auth flow and CRUD endpoints
- Add refresh tokens so users aren't logged out every 24 hours
- Add pagination to `GET /api/save-jobs` for users with a large number of saved jobs

## Author

Built by Maryam Sajjad as a personal project to practice full-stack authentication and MongoDB integration.