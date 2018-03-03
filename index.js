var express        = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    //User           = require("./models/user"),
    Task           = require("./models/task");

mongoose.connect('mongodb://localhost/yelp_camp');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.get('/', function(req, res) {
    Task.find({}, function(err, tasks) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('home', {tasks: tasks});
        }
    });
});

app.get('/new', function(req, res) {
    res.render('new');
});

app.post('/new', function(req, res) {
    var newTask = req.body.task;
    Task.create(newTask, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
});

app.get('/:id/todo', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            task.status = 'To Do';
            task.save();
            res.redirect("/");
        }
    })
});

app.get('/:id/inprogress', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            task.status = 'In Progress';
            task.save();
            res.redirect("/");
        }
    })
});

app.get('/:id/completed', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            task.status = 'Completed';
            task.save();
            res.redirect("/");
        }
    })
});

app.get('/:id/stuck', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            task.status = 'Stuck';
            task.save();
            res.redirect("/");
        }
    })
});

app.get('/:id/delete', function(req, res) {
    Task.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/");
    })
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Yelp Camp Serve has Started!"); 
});
