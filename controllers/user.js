var mongoose = require('mongoose');
var UserModel = mongoose.model('users');
var passport = require('passport');

exports.users = function(req, res) {

    
        UserModel.find(function(err, users) {
            if (!err) {
                res.send({"status":"success","data":users});
            } else {
                return console.log(err);
            }
        });
};

exports.create=function(req,res){
     user = new UserModel({
            username: req.body.username,
            email: req.body.email
        });
        user.save(function(err) {
            if (!err) {
                
                res.send({"status":"success","data":req.body});

            } else {
                res.send({"status":"error", "data":err});
            }
        });

}

exports.delete = function(req, res) {
    UserModel.findById(req.params.id, function(err, user) {
        user.remove(function(err) {
            if (!err) {
                res.send({"status":"success","data":null});
            } else {
                res.send({"status":"error", "data":err});
            }
        });
    });

};

exports.findUser=function(){
    UserModel.findOne({
            "username": req.params.username
        }, function(err, user) {
            if (!err) {
                res.send({"status":"success", "data":user});
            } else {
                res.send({"status":"err", "data":err});
            }
        });
};
exports.updateUser = function(req, res) {
    
        UserModel.findOne({
            "username": req.params.username
        }, function(err, user) {
            user.username = req.body.username;
            user.email = req.body.email;
            user.password = req.body.password;

            user.save(function(err) {
                if (!err) {
                    res.send({"status":"success", "data":user});
                } else {
                   res.send({"status":"error", "data":err});

                }
            });
        });
    


};


exports.resetpw = function(req, res) {
        var newpw = UserModel.resetpw();

        UserModel.findOne({
            'email': req.body.email
        }, function(err, user) {
            user.password = newpw;
            if (!err) {
                //save user 
                user.save(function(err) {
                    if(!err){
                        //send email
                        var result = UserModel.emails.resetpw(res, user, newpw);
                        if (result === 'error') {
                            
                            res.send({"message":"unable to reset password"});
                        }
                       res.send({"status":"success"});
                    }else{
                      console.log(err);
                        res.send({"status":"error","data":err});
                    }
                });

            } else {
                
                res.send({"message":"user not found"});
            }
        });

    

};
