const express = require('express');
require('dotenv').config();
const path = require("path");
const app = express();
const corsOptions = require("./coreOptions");
const cors = require("cors");

const port = process.env.PORT || 5555;
const host = process.env.HOST;


app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false, limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello Team Oddo");
});

app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use('/api/common', require('./routes/commonRouter'));
// app.use('/api/db_backup', require('./routes/backupRoutes'));
app.use("/user", require("./routes/user.routes"));



app.listen(port, host, () => {
  console.log(`server running on http://${host}:${port}/`);
});
