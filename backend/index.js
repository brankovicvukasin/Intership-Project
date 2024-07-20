const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const { ROUTES } = require("./routes");

const {
  checkForNewKeywords,
  checkForChanges,
  fetchGoogleSheet,
  fetchToken,
} = require("./script2");

const app = express();

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));

app.use(cookieParser());

app.use(cors({ origin: true, credentials: true }));

ROUTES.forEach((route) => {
  const middlewares = [];
  if (route.middleware) {
    middlewares.push(route.middleware);
  }
  if (route.restrict) {
    middlewares.push(route.restrict);
  }
  middlewares.push(route.func);

  app[route.method](route.url, ...middlewares);
});

mongoose
  .connect(process.env.DATABASE_MONGODB_ATLAS)
  .then(() => console.log("Successfully connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

//setInterval(checkForNewKeywords, process.env.DETECTION_INTERVAL * 1000);
//setInterval(checkForChanges, process.env.DETECTION_INTERVAL * 1000);
//setInterval(fetchGoogleSheet, process.env.DETECTION_INTERVAL * 1000);
//setInterval(fetchToken, process.env.DETECTION_INTERVAL * 1000 * 12);

//checkForNewKeywords();
//checkForChanges();
//fetchGoogleSheet();
//fetchToken();
