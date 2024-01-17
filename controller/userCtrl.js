// const User = require("../models/userModel");

// const createUser = async (req, res) => {
//   const email = req.body.email;
//   const findUser = await User.findOne({ email: email });
//   if (!findUser) {
//     // Create a new user
//     const newUser = await User.create(req.body);
//     res.json({ message: "User created successfully", user: newUser });
//   } else {
//     res.json({ message: "User with this email or mobile already exists." });
//   }
// };

// module.exports = { createUser };
// userCtrl.js
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const createUser = asyncHandler(async (req, res) => {
  // try {
  const { firstname, lastname, email, mobile, password } = req.body;

  // Check if the user with the provided email or mobile already exists
  const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

  if (existingUser) {
    // return res.status(400).json({ message: "User with this email or mobile already exists." });
    throw new Error("User Already exists");
  } else {
    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      email,
      mobile,
      password,
    });

    // Save the new user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  }

  // } catch (error) {
  //   console.error("Error creating user:", error.message);
  //   res.status(500).send("Internal Server Error");
  // }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
});

module.exports = { createUser, loginUser };
