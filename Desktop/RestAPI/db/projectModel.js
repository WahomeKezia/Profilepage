const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true
  },
  teamlead: {
    type: String,
    required: true
  },
  members: [String],
  datestarted: {
    type: Date,
    required: true
  },
  tools: {
    type: [String],
    required: true
  }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;