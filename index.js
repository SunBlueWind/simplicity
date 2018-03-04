var express        = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    // passport       = require("passport"),
    // LocalStrategy  = require("passport-local"),
    // flash          = require("connect-flash"),
    // User           = require("./models/user"),
    Task           = require("./models/task");
    
app.locals.moment = require("moment");

// app config
mongoose.connect('mongodb://localhost/starterHacks');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// app.use(flash());

// // PASSPORT configuration
// app.use(require("express-session")({
//     secret: "Just got one more than Shaq. You can take that to the bank",
//     resave: false,
//     saveUninitialized: false
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // common middleware
// app.use(function(req, res, next) {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// });

/////////////////////////////////////////////////
// home routes
/////////////////////////////////////////////////

app.get('/', function(req, res) {
    res.render('landing');
})

app.get('/index', function(req, res) {
    Task.find({}, function(err, tasks) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            var tab = req.query.tab ? req.query.tab : 'Personal';
            res.render('home', {tasks: tasks, tab: tab});
        }
    });
});

/////////////////////////////////////////////////
// New Tasks routes
/////////////////////////////////////////////////
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
            res.redirect("/index?tab=" + task.channel);
        }
    });
});

/////////////////////////////////////////////////
// Delete route
/////////////////////////////////////////////////
app.get('/:id/delete', function(req, res) {
    var channel;
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err)
        } else {
            channel = task.channel;
        }
    });
    Task.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect('/')
        }
        res.redirect("/index?tab=" + channel);
    })
});

/////////////////////////////////////////////////
// Edit routes
/////////////////////////////////////////////////
app.get('/:id/edit', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('edit', {task: task});
        }
    });
});

app.put('/:id', function(req, res) {
    var newTask = req.body.task;
    Task.findByIdAndUpdate(req.params.id, newTask, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/index');
        }
    })
});


/////////////////////////////////////////////////
// Change status routes
/////////////////////////////////////////////////
app.get('/:id/:status', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            switch(req.params.status) {
                case 'todo':
                    task.status = 'To Do';
                    break;
                case 'inprogress':
                    task.status = 'In Progress';
                    break;
                case 'completed':
                    task.status = 'Completed';
                    break;
                case 'stuck':
                    task.status = 'Stuck';
                    break;
                default:
                    task.status = 'To Do';
                    break;
            }
            if (req.params.status === 'Completed') {
                task.completionDate = new Date();
            } else {
                task.completionDate = new Date(10000000);
            }
            task.save();
            res.redirect("/index?tab=" + task.channel);
        }
    })
});

/////////////////////////////////////////////////
// user routes
/////////////////////////////////////////////////

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/signup', function(req, res) {
    res.render('signup');
});

app.get('/user', function(req, res) {
    res.render('user');
});

app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Yelp Camp Serve has Started!"); 
});
