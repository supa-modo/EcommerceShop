const express = require("express");
const { createPCategory } = require("../controller/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createPCategory);

module.exports = router;
