var mongoose = require("mongoose");

var TaskSchema = new mongoose.Schema({
    name: String,
    channel: String,
    status: { type:String, default: 'To Do' },
    due: Date,
    notes: String,
    completionDate: { type: Date, default: new Date(3000,1,1) }
});

module.exports = mongoose.model("Task", TaskSchema);