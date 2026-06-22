require("dotenv").config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectToMongoDb = require("./connection");

const userRegistration = require("./routes/signup");
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const saveJobRoutes = require("./routes/savejob");

const app = express();
const port = process.env.PORT || 8000;

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

app.use(limiter);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/signup", userRegistration);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/save-jobs", saveJobRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong on the server"
    });
});

// Start server after DB connection
(async () => {
    try {
        await connectToMongoDb(process.env.MONGO_URL);
        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Error occurred while connecting to MongoDB:", error);
        process.exit(1);
    }
})();