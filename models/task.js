var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
    name: String,
    channel: String,
    status: { type:String, default: 'To Do' },
    due: Date,
    notes: String
});

module.exports = mongoose.model("Task", TaskSchema);