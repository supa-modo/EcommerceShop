const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createBlog,
  updateBlog,
  getaBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
} = require("../controller/blogCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getaBlog);
router.get("/", getAllBlogs);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
module.exports = router;
