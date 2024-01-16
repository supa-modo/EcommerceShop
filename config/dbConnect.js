const mongoose = require("mongoose");
const dotenv = require("dotenv");

//loading the environment variables from .env file
dotenv.config();

const dbConnect = () => {
  try {
 mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit with failure
  }
};


module.exports = dbConnect;
