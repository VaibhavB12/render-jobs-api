require('dotenv').config();
require('express-async-errors');
// security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
// connectDB
const connectDB = require('./db/connect');

// routers
const authenticateUser = require('./middleware/authentication');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 *1000,
  max: 100
}))
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Jobs API</title>
    </head>
    <body>
      <h1>VARSHA BAVLAT BADHIR</h1>
      <p>This is a simple example where we return HTML directly in the response.</p>
    </body>
    </html>
    `)
})
// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// Graceful shutdown function
const gracefulShutdown = async (signal, server) => {
  console.log(`${signal} received: Closing HTTP server and database connection.`);

  // Close database connection
  try {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  } catch (error) {
    console.error('Error disconnecting database:', error.message);
  }

  // Close HTTP server
  server.close(() => {
    console.log('Server shut down.');
    process.exit(0); // Exit the process after shutdown
  });

  // Force shutdown if cleanup takes too long (e.g., 10 seconds)
  setTimeout(() => {
    console.error('Forcing server shutdown due to delay.');
    process.exit(1);
  }, 10000);
};

// Start server and handle database connection
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database

    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });

    // Process signals and uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err.message);
      gracefulShutdown('uncaughtException', server);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection', server);
    });

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM', server));
    process.on('SIGINT', () => gracefulShutdown('SIGINT', server));

  } catch (error) {
    console.error('Server initialization failed:', error.message);
    process.exit(1); // Exit if server cannot be started
  }
};

// Initialize the server
startServer();



// const start = async () => {
//   try {
//     const DBString = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);
//     await connectDB(DBString);
//     app.listen(port, () =>
//       console.log(`Server is listening on port ${port}...`)
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// start();
