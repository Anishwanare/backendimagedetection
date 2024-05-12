const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectToDatabase = require("./db");
const ImageRouter = require("./router/ImageRouter");
const UserRouter = require("./router/UserRouter");
const AdminRouter = require("./router/AdminRouter");

dotenv.config();

const port = process.env.PORT || 5000;
const URI =
  process.env.MONGOOSE_URL ||
  "mongodb+srv://dnyanankur:11111@cluster0.5slqu7t.mongodb.net/dnyanankur";

//middlewares ,app.use use to mount middle ware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://imageannotationapplication.vercel.app",
    ],
    methods: "GET,POST,PUT,PATCH,HEAD,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Connection to database
connectToDatabase(URI);

// Routes middle
app.use("/api", ImageRouter);
app.use("/api", UserRouter);
app.use("/api", AdminRouter);

//root router 
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

// Start server
app.listen(port, () => {
  console.log("Server is running at port", port);
});
