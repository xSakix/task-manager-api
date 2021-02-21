const mongoose = require("mongoose");
const validator = require("validator");

var connectionUrl = process.env.MONGODB_URL;
console.log(connectionUrl);

mongoose.connect(connectionUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
