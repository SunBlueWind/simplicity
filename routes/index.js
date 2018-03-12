var router = require('express').Router(),
    User   = require('../models/user'),
    middleware = require('../middleware');

/////////////////////////////////////////////////
// home routes
/////////////////////////////////////////////////

router.get('/', function(req, res) {
    console.log("*** New Visit!");
    res.render('UI/landing');
});

router.get('/dashboard', middleware.isLoggedIn, function(req, res) {
    User.findById(req.user.id).populate('currentTasks').exec(function(err, user) {
        if (err || !user) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            res.render('UI/dashboard', {
            page: 'dashboard',
            username: user.username,
            tasks: user.currentTasks
        });
        }
    });
})

router.get('/charts', middleware.isLoggedIn, function(req, res) {
    User.findById(req.user.id).populate('currentTasks archives').exec(function(err, user) {
        if (err || !user) {
            req.flash('error', err.message);
            res.redirect('/dashboard');
        } else {
            var tab = req.query.tab ? req.query.tab : 'Default';
            res.render('UI/charts', {
                tasks: user.currentTasks, 
                archives: user.archives,
                tab: tab, 
                page: 'charts',
                channels: user.channels
            });
        }
    });
});

module.exports = router;