const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//Register a User function
const createUser = asyncHandler(async (req, res) => {
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
});

// Log in a User function
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Find the user by email
  const user = await User.findOne({ email });

  //checking if passwords match if user is found
  if (user && (await user.isPasswordMatched(password))) {
    res.json({
      _id: user?.id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,
      token: generateToken(user?.id),
    });
  } else {
    throw new Error("Invalid email or password");
  }
});

//Updating a User
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is passed as a route parameter
  const updatedData = req.body;

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    updatedData,
    { new: true, runValidators: true }
  );
  if (!updatedUser) {
    throw new Error("User not found");
  }
  res.json({ message: "User updated successfully", user: updatedUser });
});

//Get all Users Function
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a single User
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getaUser = await User.findById(id);
    res.json({ getaUser });
  } catch (error) {
    throw new Error(error);
  }
});

//Delete a User
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({ deleteaUser });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
   try {
    const block = User.findByIdAndUpdate(
      id, {isBlocked: true,},
      
    )
  } catch (error) {
    throw new Error(error)
  }
});

const unBlockUser = asyncHandler(async (req, res) => {});

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getAllUsers,
  getaUser,
  deleteaUser,
  blockUser,
  unBlockUser,
};
