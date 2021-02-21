const express = require("express");
const auth = require("../middleware/auth");
const Task = require("../models/tasks");

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send({error: e.message});
  }
});

//GET /tasks
//GET /tasks?completed=false|true
//GET /tasks?limit=10&skip=0
//skip means basically page...but by limit-fold. So if limit is 10, skip 0 gives first page, skip 10 second page, skip 20 third etc
//skip means skip first x items
//GET /tasks?sortBy=field&order=asc|desc
//GET /tasks?sortBy=field:asc|desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    //this will work
    match.completed = req.query.completed == "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    if (parts.length == 2) {
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    console.log("Internal error:", e);
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    console.log("Internal error:", e);
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) {
    return res.status(400).send({ error: "Invalid parameters for update" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();

    res.send(task);
  } catch (e) {
    //for now only if invalid data
    res.status(400).send({ error: e.message });
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
