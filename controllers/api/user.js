exports.get=function (req, res){
  return UserModel.find(function (err, users) {
    if (!err) {
      return res.send(users);
    } else {
      return console.log(err);
    }
  });
};

exports.post=function (req, res){
  var user;
  console.log("POST: ");
  console.log(req.body);
  user = new UserModel({
    username: req.body.username,
    email: req.body.email
  });

  user.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(user);
};

exports.getUser=function (req, res){
	console.log(req.params.username);
  return UserModel.findOne({"username":req.params.username}, function (err, user) {
    if (!err) {
      return res.send(user);
    } else {
      return console.log(err);
    }
  });
};

exports.updateUser=function (req, res){
  return UserModel.findOne({"username":req.params.id}, function (err, user) {
    user.username = req.body.username;
    user.email = req.body.email;
    
    return user.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(user);
    });
  });
};

exports.delete=function (req, res){
  return UserModel.findById(req.params.id, function (err, user) {
    return user.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
};