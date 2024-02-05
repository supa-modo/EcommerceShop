const Blog = require("../models/blogModel");
const validateMongodbId = require("../utils/validateMongodbId");
const user = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//Creating a new Blog
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      status: "Success",
      newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Updating an existing blog
const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      status: "Success",
      updateBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Getting a single blog
const getaBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getaBlog = await Blog.findById(id);
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    res.json({
      status: "Success",
      getaBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//Getting all the blogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const getAllBlogs = await Blog.find();
    res.json(getAllBlogs);
  } catch (error) {
    throw new Error(error);
  }
});

//Deleting an existing blog
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id, req.body);
    res.json({
      status: "Deleted successfully",
      deletedBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);

  //Find the blog to like
  const blog = await Blog.findById(blogId);
  const loginUserId = req?.user?._id;

  const isLiked = blog?.isLiked;
  //find if user disliked the blog
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  if (alreadyDisliked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(blog);
  }

  if (isLiked) {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isliked: false,
      },
      { new: true }
    );
    res.json(blog);
  } else {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isliked: true,
      },
      { new: true }
    );
    res.json(blog);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  getaBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
};
