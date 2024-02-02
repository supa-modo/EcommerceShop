const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { createBlog } = require("../controller/blogCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);

module.exports = router;
