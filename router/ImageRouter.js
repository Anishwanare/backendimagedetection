const express = require("express");
const multer = require("multer");
const Image = require("../models/ImageModel.js");
const router = express.Router();
//for csv file
const csv = require("csv-writer").createObjectCsvStringifier;


//from multer documentation
const storage = multer.diskStorage({
  //where we have to upload image his is syntax
  //cb(anyError,"filename") cb is call back function which have attribute error, filename
  destination: function (req, file, cb) {
    cb(null, "../client/src/images");
    // cb(null, "uploads/"); this will save image into upload
  },
  //creating a unique file name for each imagae
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now(); // this provide ans unique file name
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });


//endpoint to upload image
router.post("/uploadimage", upload.single("image"), async (req, res) => {
  const imageName = req.file.filename;
  const { annotation } = req.body;
  try {
    await Image.create({ image: imageName, annotations: annotation });
    res.json({ message: "Image Uploaded Successfully", status: true });
  } catch (error) {
    res.json({ status: error });
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
