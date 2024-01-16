const User = require("../models/userModel");

const createUser = async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    // Create a new user
    const newUser = await User.create(req.body);
    res.json({ message: "User created successfully", user: newUser });
  } else {
    res.json({ message: "User with this email or mobile already exists." });
  }
};

module.exports = { createUser };
