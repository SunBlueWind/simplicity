var router = require('express').Router(),
    Task   = require('../models/task'),
    middleware = require('../middleware');

/////////////////////////////////////////////////
// New Tasks routes
/////////////////////////////////////////////////
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('new', {page: 'new'});
});

router.post('/new', function(req, res) {
    var newTask = req.body.task;
    Task.create(newTask, function(err, task) {
        if (err) {
            req.flash('error', err);
            res.redirect("/");
        } else {
            req.user.currentTasks.push(task.id);
            req.user.save();
            console.log("*** " + req.user.username + ' Created New Task "' + task.name + '"');
            req.flash("success", 'Successfully Created New Task "' + task.name + '"');
            res.redirect("/index?tab=" + task.channel);
        }
    });
});

/////////////////////////////////////////////////
// Delete route
/////////////////////////////////////////////////
router.get('/:id/delete', middleware.isLoggedIn, function(req, res) {
    
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
        } else {
            var channel = task.channel;
            var name = task.name;
            task.remove();
            console.log("*** " + req.user.username + ' Deleted Task "' + name + '"');
            req.flash('success', 'Successfully Deleted "' + name +'"');
            res.redirect("/index?tab=" + channel);
        }
    });
});

/////////////////////////////////////////////////
// Edit routes
/////////////////////////////////////////////////
router.get('/:id/edit', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err);
            res.redirect('/');
        } else {
            res.render('edit', {task: task});
        }
    });
});

router.put('/:id', middleware.isLoggedIn, function(req, res) {
    var newTask = req.body.task;
    Task.findByIdAndUpdate(req.params.id, newTask, function(err, task) {
        if (err || !task) {
            req.flash('error', err);
            res.redirect('/');
        } else {
            console.log("*** " + req.user.username + ' Updated Task "' + task.name + '"');
            req.flash('success', 'Successfully Updated "' + task.name + '"');
            res.redirect('/index?tab=' + task.channel);
        }
    });
});

router.get('/:id/archive', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err);
            res.redirect('/');
        } else {
            req.user.currentTasks.pull(task.id);
            req.user.archives.push(task.id);
            req.user.save();
            console.log("*** " + req.user.username + ' Archived Task "' + task.name + '"');
            req.flash('success', 'Successfully Archived "' + task.name + '"');
            res.redirect('/index?tab=' + task.channel);
        }
    });
});


/////////////////////////////////////////////////
// Change status routes NEED TO GO LAST
/////////////////////////////////////////////////
router.get('/:id/:status', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err);
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
                    break;
            }
            if (task.status === 'Completed') {
                task.completionDate = new Date();
            } else {
                task.completionDate = new Date(3000,1,1);
            }
            task.save();
            console.log("*** " + req.user.username + ' Updated Task "' + task.name + '" to "' + task.status + '"');
            req.flash('success', 'Successfully Updated "' + task.name + '" to "' + task.status + '"');
            res.redirect("/index?tab=" + task.channel);
        }
    });
});

module.exports = router;