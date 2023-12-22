require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/dbConn");
const corsOptions = require("./config/corsOptions");
const { reqLog, errLog } = require("./middleware/logEvents");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
const app = express();
const PORT = process.env.PORT || 3500;

// connect to database
connectDB();

// request logger middleware
app.use(reqLog);

// middlewares
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// auth verification
app.use(verifyJWT);

// protected routes
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// error logger middleware
app.use(errLog);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  // port listening
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
