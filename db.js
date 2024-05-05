const mongoose = require("mongoose");

const connectToDatabase = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to database");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

module.exports = connectToDatabase;
