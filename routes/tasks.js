var router = require('express').Router(),
    Task   = require('../models/task'),
    User   = require('../models/user'),
    middleware = require('../middleware');

/////////////////////////////////////////////////
// New Tasks routes
/////////////////////////////////////////////////
router.get('/new', middleware.isLoggedIn, function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if (err || !user) {
            req.flash('error', err.message);
            res.redirect('/dashboard');
        } else {
            res.render('tasks/new', {
                page: 'new',
                channels: user.channels
            });
        }
    });
});

router.post('/new', middleware.isLoggedIn, function(req, res) {
    var newTask = req.body.task;
    Task.create(newTask, function(err, task) {
        if (err || !task) {
            req.flash('error', err.message);
            res.redirect("/dashboard");
        } else {
            var currChannels = req.user.channels.map(ch => ch.name);
            if (!currChannels.includes(task.channel)) {
                var newChannel = {
                    name: task.channel,
                    count: 1
                };
                req.user.channels.push(newChannel);
            } else {
                req.user.channels.find(ch => ch.name === task.channel).count += 1;
            }
            req.user.currentTasks.push(task.id);
            req.user.save();
            console.log("*** " + req.user.username + ' Created New Task "' + task.name + '" in Channel "' + task.channel + '"');
            req.flash("success", 'Successfully Created New Task "' + task.name + '" in Channel "' + task.channel + '"');
            res.redirect("/charts?tab=" + task.channel);
        }
    });
});

/////////////////////////////////////////////////
// Delete route
/////////////////////////////////////////////////
router.delete('/:id', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err.message);
            return res.redirect('/charts');
        }
        
        var channel = task.channel;
        var name = task.name;
        
        var channelIndex = req.user.channels.findIndex(ch => ch.name === channel);
        if (channelIndex < 0) {
            req.flash('error', 'Cannot find channel ' + channel);
            return res.redirect('/dashboard');
        }
        
        if (req.user.channels[channelIndex].count === 1) {
            req.user.channels.splice(channelIndex, 1);
        } else {
            req.user.channels[channelIndex].count -= 1;
        }
        req.user.save();
        task.remove();
        console.log("*** " + req.user.username + ' Deleted Task "' + name + '"');
        req.flash('success', 'Successfully Deleted "' + name +'"');
        res.redirect("/charts?tab=" + channel);
    });
});

/////////////////////////////////////////////////
// Edit routes
/////////////////////////////////////////////////
router.get('/:id/edit', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err.message);
            res.redirect('/dashboard');
        } else {
            res.render('tasks/edit', {
                task: task,
                channels: req.user.channels
            });
        }
    });
});

router.put('/:id', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err.message);
            return res.redirect('/dashboard');
        }
        // check if we need to update channel
        if (task.channel !== req.body.task.channel) {
            // update old channel
            var oldChannelIndex = req.user.channels.findIndex(ch => ch.name === task.channel);
            if (oldChannelIndex < 0) {
                req.flash('error', 'Cannot find channel ' + task.channel);
                return res.redirect('/dashboard');
            }
            if (req.user.channels[oldChannelIndex].count === 1) {
                req.user.channels.splice(oldChannelIndex, 1);
            } else {
                req.user.channels[oldChannelIndex].count -= 1;
            }
            // update new channel
            var newChannelIndex = req.user.channels.findIndex(ch => ch.name === req.body.task.channel);
            if (newChannelIndex < 0) {
                // need to create new channel
                var newChannel = {
                    name: req.body.task.channel,
                    count: 1
                };
                req.user.channels.push(newChannel);
            } else {
                req.user.channels[newChannelIndex].count += 1;
            }
            req.user.save();
        }
        
        task.name = req.body.task.name;
        task.channel = req.body.task.channel;
        task.due = req.body.task.due;
        task.notes = req.body.task.notes;
        task.save();
        
        console.log("*** " + req.user.username + ' Updated Task "' + task.name + '"');
        // console.log(task.due);
        // console.log(new Date());
        // console.log(moment(task.due));
        // console.log(moment());
        req.flash('success', 'Successfully Updated "' + task.name + '"');
        res.redirect('/charts?tab=' + task.channel);
    });
});

router.get('/:id/archive', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err.message);
            return res.redirect('/dashboard');
        }
        
        var channelIndex = req.user.channels.findIndex(ch => ch.name === task.channel);
        if (channelIndex < 0) {
            req.flash('error', 'Cannot find channel' + task.channel);
            return res.redirect('/dashboard');
        }
        
        if (req.user.channels[channelIndex].count === 1) {
            req.user.channels.splice(channelIndex, 1);
        } else {
            req.user.channels[channelIndex].count -= 1;
        }
        
        req.user.currentTasks.pull(task.id);
        req.user.archives.push(task.id);
        req.user.save();
        console.log("*** " + req.user.username + ' Archived Task "' + task.name + '"');
        req.flash('success', 'Successfully Archived "' + task.name + '"');
        res.redirect('/charts?tab=' + task.channel);
    });
});


/////////////////////////////////////////////////
// Change status routes NEED TO GO LAST
/////////////////////////////////////////////////
router.get('/:id/:status', middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, task) {
        if (err || !task) {
            req.flash('error', err.message);
            res.redirect("/dashboard");
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
            res.redirect("/charts?tab=" + task.channel);
        }
    });
});

module.exports = router;