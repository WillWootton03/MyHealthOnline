const createError = require('http-errors');
const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Route connections
var usersRouter = require('./app_server/routes/userRoutes');

// Set up app init
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/users', usersRouter);

// catch 404 and forware to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Base Error Handler
app.use(function(err, req, res, next) {
    console.error(err);
    console.error(err.stack);

    // Handle any incoming server errors
    res.status(err.status || 500)
    .json({
        success: false,
        message: err.message,
        stack: process.env.ENV === 'development' ? err.stack : undefined,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app