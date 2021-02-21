const mongoose = require("mongoose");
const validator = require("validator");

var connectionUrl = process.env.MONGODB_URL;

mongoose.connect(connectionUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
