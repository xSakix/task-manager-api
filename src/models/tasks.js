const mongoose = require("mongoose");

const taksSchema = new mongoose.Schema({
  description: {
    type: String,
    required : true,
    trim: true,
  },
  completed: {
    type: Boolean,
    required : false,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectID,
    required: true,
    ref: 'User'

  }
},
{
  timestamps: true
});

const Task = mongoose.model("Task", taksSchema);

module.exports=Task;