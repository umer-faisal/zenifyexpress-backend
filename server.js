const mongoose = require('mongoose');
const dotenv = require('dotenv');

/* Handle uncaught exceptions */
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  console.log(err.name, err.message);
  process.exit(1);
});

/* Load environment variables from config.env */
dotenv.config({ path: './config.env' });


/* Import your main app file */
const { app, http } = require('./app');


/* Get the Database URL from environment variables */
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

/* Connect to the MongoDB database */
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful! ✅'));

  
/* Define the port */
const port = process.env.PORT || 3000;

/* Start the server */
const server = http.listen(port, () => {
  console.log(`🚀 Your App is running on port ${port}...`);
});



/* Handle unhandled promise rejections */
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

/* Handle graceful shutdown */
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

