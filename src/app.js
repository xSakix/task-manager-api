const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();

//enables processing of json in request
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get('/ping', (req, res) => {
  res.send('pong pong');
})

module.exports = app;