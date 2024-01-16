const User = require("../models/userModel");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    // Check if the user with the provided email or mobile already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email or mobile already exists." });
    }

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password, // Note: In a production environment, you should hash the password before saving it to the database.
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { createUser };
