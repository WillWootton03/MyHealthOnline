require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const { logger } = require('./app_server/utils/logger.js'); 

// Route connections
const usersRouter = require('./app_server/routes/userRoutes');
const foodTrackerRouter = require('./app_server/routes/foodTrackerRoutes');
const dailyLogsRouter = require('./app_server/routes/dailyLogsRoutes');
const mealsRouter = require('./app_server/routes/mealsRoutes');
const mealItemsRouter = require('./app_server/routes/mealItemsRoutes');
const exercisesRouter = require('./app_server/routes/exercisesRoutes');

// Set up app init
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use('/api/users', usersRouter);
app.use('/api/foods', foodTrackerRouter);
app.use('/api/daily_logs', dailyLogsRouter);
app.use('/api/meals', mealsRouter);
app.use('/api/meal_items', mealItemsRouter);
app.use('/api/exercises', exercisesRouter);


// catch 404 and forware to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// Base Error Handler
app.use(function(err, req, res, next) {
    console.error(err ?? 'error');
    console.error(err?.stack ?? 'error');

    logger.error(`Unhandled server error occured ${err}`);

    // Handle any incoming server errors
    res.status(err.status || 500)
    .json({
        success: false,
        message: err?.message ?? 'error message',
        stack: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? err?.stack ?? 'error_stack' : undefined,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

module.exports = app