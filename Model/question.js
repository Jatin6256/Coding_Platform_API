const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    id: Number,
    description: String
  });

  module.exports = mongoose.model("Question",questionSchema)