const mongoose = require('mongoose')

// const connectDB = (url) => {
//   return mongoose.connect(url, {
//     // useNewUrlParser: true,
//     // useCreateIndex: true,
//     // useFindAndModify: false,
//     // useUnifiedTopology: true,
//   })
// }

// const closeDatabaseConnection = async () => {
//   try {
//     await mongoose.connection.close();
//     console.log('✅ Database connection closed successfully');
//   } catch (error) {
//     console.error('❌ Error while closing the database connection:', error.message || error);
//   }
// };

const connectDB = async () => {
  const DB_URL = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);
  try {
    await mongoose.connect(DB_URL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit the process if DB connection fails
  }
};
module.exports = connectDB ;
