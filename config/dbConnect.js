const mongoose = require("mongoose");
const dotenv = require("dotenv");

//loading the environment variables from .env file to get the URI
dotenv.config(); 
const mongoURI = process.env.MONGODB_URI

const dbConnect = {} => {

}