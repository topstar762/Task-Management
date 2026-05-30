const express = require('express');

const Task = require('../models/Task');

const auth = require('../middleware/authMiddleware');

const router = express.Router();


// ================= GET TASKS =================

router.get('/', auth, async (req, res) => {

  try {

    const tasks = await Task.find({
      userId: req.userId
    }).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

});


// ================= ADD TASK =================

router.post('/', auth, async (req, res) => {

  try {

    const { title, description, priority } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      userId: req.userId
    });

    await task.save();

    res.json(task);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

});


// ================= DELETE TASK =================

router.delete('/:id', auth, async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Task Deleted Successfully'
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

});

module.exports = router;