const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateUser,
} = require("../controller/userCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/allUsers", getAllUsers);
router.get("/:id", getaUser);
router.delete("/:id", deleteaUser);
router.put("/:id", updateUser);

module.exports = router;
