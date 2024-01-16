const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoutes");

// Middleware to parse JSON in the request body
app.use(express.json());

//Connecting to MongoDB
dbConnect();

// Use the authRouter for '/api/user' routes
app.use("/api/user", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
