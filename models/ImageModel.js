const mongoose = require("mongoose");

const imageDetailsSchema = new mongoose.Schema(
  {
    image: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    annotations:[] // created an array to store annotation
  },
  {
    colllection: "ImageDetails",
  }
);

const Image = mongoose.model("ImageDetails", imageDetailsSchema);

module.exports = Image;
