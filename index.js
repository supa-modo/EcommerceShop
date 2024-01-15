const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send('Hello, this is your e-commerce server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})