var express        = require('express'),
    app            = express(),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    flash          = require("connect-flash"),
    User           = require("./models/user");

app.locals.moment = require('moment');

// app config
mongoose.connect('mongodb://localhost/starterHacks');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT configuration
app.use(require("express-session")({
    secret: "Just got one more than Shaq. You can take that to the bank",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// common middleware
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// setup routes
var taskRoutes  = require('./routes/tasks'),
    userRoutes  = require('./routes/users'),
    indexRoutes = require('./routes/index');
    
app.use('/', taskRoutes);
app.use('/', userRoutes);
app.use('/', indexRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
   console.log("Simplicity has Started!"); 
});
