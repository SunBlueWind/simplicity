var router = require('express').Router(),
    Task   = require('../models/task.js'),
    middleware = require('../middleware');

/////////////////////////////////////////////////
// home routes
/////////////////////////////////////////////////

router.get('/', function(req, res) {
    res.render('landing');
})

router.get('/index', middleware.isLoggedIn, function(req, res) {
    Task.find({}, function(err, tasks) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            var tab = req.query.tab ? req.query.tab : 'Personal';
            res.render('home', {tasks: tasks, tab: tab, page: 'home'});
        }
    });
});

module.exports = router;