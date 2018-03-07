var router = require('express').Router(),
    passport = require('passport'),
    User = require('../models/user'),
    middleware = require('../middleware');

/////////////////////////////////////////////////
// user routes
/////////////////////////////////////////////////

router.get('/login', function(req, res) {
    if(req.isAuthenticated()) {
        req.flash('error', 'You Are Already Logged In');
        return res.redirect('back');
    }
    res.render('login', {page: 'login'});
});

router.post('/login', passport.authenticate('local', {
    successRedirect: "/index",
    failureRedirect: "/login",
    successFlash: "Welcome Back",
    failureFlash: true
}));

/////////////////////////////////////////////////

router.get('/signup', function(req, res) {
    if (req.isAuthenticated()) {
        req.flash('error', 'You Are Already Logged In');
        return res.redirect('back');
    }
    res.render('signup', {page: 'signup'});
});

router.post('/signup', function(req, res) {
    if (req.body.password !== req.body.passwordConfirm) {
        return res.render("signup", {error: "Passwords Do Not Match", page: 'signup'});
    }
    
    var newUser = {
        username: req.body.username,
        tasks: []
    };
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            return res.render("signup", {error: err.message, page: 'signup'});
        }
        passport.authenticate('local')(req, res, function() {
            req.flash('success', 'Successfully Signed Up. Welcome to Simplicity ' + user.username);
            res.redirect('/index');
        });
    });
})

/////////////////////////////////////////////////

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'Successfully Logged Out');
    res.redirect('/index');
});

router.get('/user', function(req, res) {
    res.render('user', {page: 'user'});
});

module.exports = router;