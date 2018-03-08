var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    currentTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }    
    ],
    archives: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }  
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);