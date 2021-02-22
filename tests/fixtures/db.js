const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/users");
const Task = require("../../src/models/tasks");

const userOneID = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneID,
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoID = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoID,
  name: "Mike2",
  email: "mike2@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
    _id: mongoose.Types.ObjectId(),
    description: 'first task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: mongoose.Types.ObjectId(),
    description: 'second task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: mongoose.Types.ObjectId(),
    description: 'third task',
    completed: true,
    owner: userTwo._id
}


const setupDatabase = async () => {
  await Task.deleteMany();
  await User.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneID,
  userOne,
  setupDatabase,
  userTwo,
  taskOne
};
