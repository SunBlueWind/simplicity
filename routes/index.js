var router = require('express').Router(),
    User   = require('../models/user'),
    middleware = require('../middleware');

/////////////////////////////////////////////////
// home routes
/////////////////////////////////////////////////

router.get('/', function(req, res) {
    console.log("*** New Visit!");
    res.render('landing');
});

router.get('/index', middleware.isLoggedIn, function(req, res) {
    var tab = req.query.tab ? req.query.tab : 'Personal';
    User.findById(req.user.id).populate('currentTasks archives').exec(function(err, user) {
        if (err) {
            req.flash('error', err);
            res.redirect('/');
        } else {
            res.render('home', {
                tasks: user.currentTasks, 
                archives: user.archives,
                tab: tab, 
                page: 'home'
            });
        }
    });
});

module.exports = router;