var mongoose = require("mongoose");


var TaskSchema = new mongoose.Schema({
    name: String,
    chanel: { type:String, default: "basic" },
    status: { type:String, default: 'To Do' },
    due: Date
});

module.exports = mongoose.model("User", TaskSchema);