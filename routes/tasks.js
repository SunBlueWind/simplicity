var router = require('express').Router(),
    Task   = require('../models/task');

/////////////////////////////////////////////////
// New Tasks routes
/////////////////////////////////////////////////
router.get('/new', function(req, res) {
    res.render('new');
});

router.post('/new', function(req, res) {
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
router.get('/:id/delete', function(req, res) {
    var channel;
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
        } else {
            channel = task.channel;
        }
    });
    Task.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        res.redirect("/index?tab=" + channel);
    });
});

/////////////////////////////////////////////////
// Edit routes
/////////////////////////////////////////////////
router.get('/:id/edit', function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.render('edit', {task: task});
        }
    });
});

router.put('/:id', function(req, res) {
    var newTask = req.body.task;
    Task.findByIdAndUpdate(req.params.id, newTask, function(err, task) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            res.redirect('/index');
        }
    });
});


/////////////////////////////////////////////////
// Change status routes
/////////////////////////////////////////////////
router.get('/:id/:status', function(req, res) {
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
            if (task.status === 'Completed') {
                task.completionDate = new Date();
            } else {
                task.completionDate = new Date(3000,1,1);
            }
            task.save();
            res.redirect("/index?tab=" + task.channel);
        }
    });
});

module.exports = router;