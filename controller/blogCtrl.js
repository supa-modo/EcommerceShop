const Blog = require("../models/blogModel");
const validateMongodbId = require("../utils/validateMongodbId");
const user = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
        status: "Success",
        newBlog,
    })
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createBlog };
