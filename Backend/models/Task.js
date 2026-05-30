const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Task', taskSchema);