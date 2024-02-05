const PCategory = require("../models/prodCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createPCategory = asyncHandler(async (req, res) => {
  try {
    const newPCategory = await PCategory.create(req.body);
    res.json(newPCategory);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createPCategory };
