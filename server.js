const express = require("express");
const cors = require("cors");
const path = require("path");
const corsOptions = require("./config/corsOptions");
const { reqLog, errLog } = require("./middleware/logEvents");
const app = express();
const PORT = process.env.PORT || 3500;

// request logger middleware
app.use(reqLog);

// middlewares
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/root"));

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

// port listening
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
