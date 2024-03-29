const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { sendEmail } = require("./emailCtrl"); // Adjust the path as needed

// const { generateRefreshToken } = require("../config/refreshToken");

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
    // const refreshToken = await generateRefreshToken(user?.id);
    // user.refreshToken = refreshToken;
    res.json({
      _id: user?.id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,
      token: generateToken(user?.id),
      // refreshToken,
    });
  } else {
    throw new Error("Invalid Login credentials");
  }
});

//TODO - Add a refresh token functionality that stores the token as cookies to identify user on next login

//Log out functionality
const logout = asyncHandler(async (req, res) => {
  //TODO - Implement a logout function that clears login token from the saved cookies
});

//Updating a User
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming the user ID is passed as a route parameter
  const updatedData = req.body;

  validateMongodbId(userId);

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
  validateMongodbId(id);
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
  validateMongodbId(id);
  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({ deleteaUser });
  } catch (error) {
    throw new Error(error);
  }
});

//Blocking a user
const blockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongodbId(id);
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new Error("User not found");
  }

  res.json({ message: "User blocked successfully", user });
});

//Unblocking a user
const unblockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  validateMongodbId(id);
  const user = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true, runValidators: true }
  );
  if (!user) {
    throw new Error("User not found");
  }
  res.json({ message: "User unblocked successfully", user });
});

//Updating the user password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body; // Extract the password from the request body
  validateMongodbId(_id);
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    // Update the passwordChangedAt field to the current date and time
    user.passwordChangedAt = new Date();

    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

//reseting a user password
const resetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with this email not found");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hello, Please follow this link to reset your password. This link is valid for only 10 minutes. <a href='http://localhost:5000/api/user/resetPassword/${token}'>Click here</>`;
    const data = {
      to: email,
      subject: "Forgot Password Reset Link",
      text: `Hey user, Please follow this link to reset your password. This link is valid for only 10 minutes. <a href='http://localhost:5000/api/user/resetPassword/${token}'>Click here</>`,
      html: resetURL,
    };
    await sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// const resetPassword = asyncHandler(async (req, res) => {
//   const { password } = req.body;
//   const { token } = req.params;
//   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//   const user = User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   if (!user) throw new Error("Token Expired, Please try again later");
//   user.password = password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   res.json(user);
// });
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the token to compare with the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by the hashed token and check the token expiration
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token Expired, Please try again later");
    }

    // Reset user password and clear reset token fields
    user.password = password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user
    await user.save();

    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  logout,
  // refreshAccessToken,
  updateUser,
  getAllUsers,
  getaUser,
  deleteaUser,
  blockUser,
  unblockUser,
  updatePassword,
  resetPasswordToken,
  resetPassword,
};
