const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
require("dotenv").config();
const url = process.env.URL;
const dbConnect = () => {
  mongoose.connect(url);
};
module.exports = dbConnect;