const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateUser,
  unblockUser,
  blockUser,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/allUsers", getAllUsers);
router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id", deleteaUser);
router.put("/updateUser", authMiddleware, updateUser);
router.put("/block/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
