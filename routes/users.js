var router = require('express').Router(),
    passport = require('passport'),
    User = require('../models/user');

/////////////////////////////////////////////////
// user routes
/////////////////////////////////////////////////

router.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
        req.flash('error', 'You Are Already Logged In');
        return res.redirect('/dashboard');
    }
    res.render('users/login', {page: 'login'});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    successFlash: "Welcome Back",
    failureFlash: true
}));

/////////////////////////////////////////////////

router.get('/signup', function(req, res) {
    if (req.isAuthenticated()) {
        req.flash('error', 'You Are Already Logged In');
        return res.redirect('/dashboard');
    }
    res.render('users/signup', {page: 'signup'});
});

router.post('/signup', function(req, res) {
    if (req.body.password !== req.body.passwordConfirm) {
        return res.render("signup", {error: "Passwords Do Not Match", page: 'signup'});
    }
    
    var newUser = {
        username: req.body.username,
        currentTasks: [],
        archives: []
    };
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("signup", {error: err.message, page: 'signup'});
        }
        passport.authenticate('local')(req, res, function() {
            console.log("*** New User Signed Up: " + user.username);
            req.flash('success', 'Successfully Signed Up. Welcome to Simplicity ' + user.username);
            res.redirect('/dashboard');
        });
    });
})

/////////////////////////////////////////////////

router.get('/logout', function(req, res) {
    console.log("*** User Logged Out: " + req.user.username);
    req.logout();
    req.flash('success', 'Successfully Logged Out');
    res.redirect('/');
});

router.get('/user', function(req, res) {
    res.render('user', {page: 'user'});
});

module.exports = router;