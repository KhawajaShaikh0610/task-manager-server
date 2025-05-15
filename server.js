const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/taskRoute.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/task", taskRoutes);

const PORT = 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () =>
    console.log(`DB is connected and server running on port : ${PORT}`)
  );
});
