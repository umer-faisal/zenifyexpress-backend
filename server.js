// 1. Import required packages
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 2. Load environment variables from config.env
dotenv.config({ path: './config.env' });

// 3. Import your main app file
const app = require('./app');

// 4. Get the Database URL from environment variables
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// 5. Connect to the MongoDB database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful! ✅'));

// 6. Define the port
const port = process.env.PORT || 3000;

// 7. Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


