const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const mongoose = require("mongoose");
const Image = require("../models/ImageModel.js");
const router = express.Router();
//for csv file
const csv = require("csv-writer").createObjectCsvStringifier;

// MongoDB connection
const mongoURI =
  "mongodb+srv://dnyanankur:11111@cluster0.5slqu7t.mongodb.net/dnyanankur";
const conn = mongoose.createConnection(process.env.MONGOOSE_URL || mongoURI);



//from multer documentation
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname
    };
  }
});
const upload = multer({ storage });

//endpoint to upload image
router.post("/uploadimage", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageName = req.file.filename;
    const { annotation } = req.body;

    // Create a new Image document
    const newImage = new Image({
      image: imageName,
      annotations: annotation,
      status: "pending", // Assuming initial status is "pending"
    });

    // Save the Image document to the database
    await newImage.save();

    res.json({ message: "Image uploaded successfully", status: true });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});




// endpoint for pending images
router.get("/pendingimages", async (req, res) => {
  try {
    const pendingImages = await Image.find({ status: "pending" });
    res.json(pendingImages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending images" });
  }
});



// endpoint for download images as CSV
router.get("/downloadimagecsv", async (req, res) => {
  try {
    const downloadImages = await Image.find({ status: "approved" });

    const getDataIntoCsv = csv({
      header: [
        { id: "image", title: "Image" },
        { id: "annotations", title: "Annotations" },
      ],
    });

    //fetched images and then converted into CSV records
    const csvData =
      getDataIntoCsv.getHeaderString() +
      getDataIntoCsv.stringifyRecords(downloadImages);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=approved_images.csv"
    );
    res.send(csvData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to download approved images as CSV" });
  }
});


// Endpoint to approve image
router.put("/approveimage/:id", async (req, res) => {
  try {
    await Image.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Image approved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve image" });
  }
});

// Endpoint to reject image
router.put("/rejectimage/:id", async (req, res) => {
  try {
    await Image.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Image rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject image" });
  }
});


module.exports = router;
