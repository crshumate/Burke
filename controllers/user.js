var mongoose = require('mongoose');
var UserModel = mongoose.model('users');
var passport = require('passport');

exports.index = function(req, res) {
    var message = req.flash('info');
    console.log('GET!!!');
    if (req.method === 'GET') {
        UserModel.find(function(err, users) {
            if (!err) {
                res.render('users/users', {
                    title: 'Users Index page!',
                    users: users,
                    message: message
                });
            } else {
                return console.log(err);
            }
        });

    } else if (req.method === 'POST') {
        console.log('METHOD POST');

        user = new UserModel({
            username: req.body.username,
            email: req.body.email
        });
        user.save(function(err) {
            if (!err) {
                req.flash('info', 'User created')
                res.redirect('/users');

            } else {
                return console.log(err);
            }
        });


    }



};

exports.delete = function(req, res) {
    UserModel.findById(req.params.id, function(err, user) {
        user.remove(function(err) {
            if (!err) {
                req.flash('info', 'User Deleted')
                res.redirect('/users');
            } else {
                console.log(err);
            }
        });
    });

};


exports.edit = function(req, res) {
    var message = req.flash('info');
    if (req.method === 'GET') {
        UserModel.findOne({
            "username": req.params.username
        }, function(err, user) {
            if (!err) {
                res.render('users/edit', {
                    title: 'Edit Page',
                    user: user,
                    message: message,
                    errors: false
                });
            } else {
                return console.log(err);
            }
        });


    }
    if (req.method === 'POST') {
        UserModel.findOne({
            "username": req.params.username
        }, function(err, user) {
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function(err) {
                if (!err) {
                    req.flash('info', 'User Updated');
                    res.redirect('/users');
                } else {
                    console.log(err);
                    res.render('users/edit', {
                        title: 'Edit Page',
                        user: user,
                        message: message,
                        errors: err
                    });

                }
            });
        });
    }


};

exports.login = function(req, res) {
    var message = req.flash('info');
    res.render('users/login', {
        title: 'Users Index page!',
        message: message
    });
};

exports.resetpw = function(req, res) {
    var message = req.flash('info');
    if (req.method === 'GET') {

        res.render('users/resetpw', {
            title: 'Password Recovery',
            message: message
        });

    } else if (req.method === 'POST') {
        var newpw = UserModel.resetpw();

        UserModel.findOne({
            'email': req.body.email
        }, function(err, user) {
           console.log('USER', user);
            user.password = newpw;
            if (!err) {
                //save user 
                user.save(function(err) {
                    if(!err){
                        //send email
                        var result = UserModel.emails.resetpw(res, user, newpw);
                        if (result === 'error') {
                            req.flash('info', 'There was an error sending the email');
                            res.redirect('/user/forgot_password');
                        }
                        req.flash('info', 'Email Sent');
                        res.redirect('/user/forgot_password');
                    }else{
                      console.log(err);
                        req.flash('info', 'Unable to Save User');
                        res.redirect('/user/forgot_password');
                    }
                });

            } else {
                req.flash('info', 'User could not be found');
                res.redirect('/user/forgot_password');
            }
        });

    }

};
