require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Require route modules
const authRoutes = require('./src/routes/authRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const intentRoutes = require('./src/routes/intentRoutes');
const decisionRoutes = require('./src/routes/decisionRoutes');
const taskRoutes = require('./src/routes/taskRoutes');

// Register routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/intents', intentRoutes);
app.use('/decisions', decisionRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/releases', require('./src/routes/releaseRoutes'));
app.use('/dashboard', require('./src/routes/dashboardRoutes'));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Safe Server Error Handler
server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
        process.exit(1);
    }
});
