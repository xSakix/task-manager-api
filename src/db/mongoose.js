const mongoose = require("mongoose");
const validator = require("validator");

const username = encodeURIComponent(process.env.MONGO_USER);
const password = encodeURIComponent(process.env.MONGO_PASSW);
const dbName = process.env.DB_NAME;

var connectionUrl = `mongodb://${username}:${password}@${process.env.MONGODB_URL}/${dbName}?authSource=admin&w=1`;
console.log(connectionUrl);

mongoose.connect(connectionUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});
