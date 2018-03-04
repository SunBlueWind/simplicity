var router = require('express').Router();

/////////////////////////////////////////////////
// user routes
/////////////////////////////////////////////////

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.get('/user', function(req, res) {
    res.render('user');
});

module.exports = router;