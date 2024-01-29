const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoute");
const { notFound, errorHandler } = require("./middleware/errorHandler");

// Middleware to parse JSON in the request body
app.use(express.json());

//Connecting to MongoDB
dbConnect();

app.use("/api/user", authRouter); // Use the authRouter for '/api/user' routes
app.use("/api/product", productRouter); // Use the productRouter for '/api/product' routes

//Handling scenarios where a route is not found or when an error occurs
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
