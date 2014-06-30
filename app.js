var flash = require('connect-flash')
    express = require('express'),
    MongoStore = require('connect-mongo')(express),
    http = require('http'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mailer = require('express-mailer');

//Database configs
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cshu');
//add node-validator funcitonaltiy to mongoose
var validate = require('mongoose-validator').validate;

//models
require('./models/models');

//passport configs
require('./configs/passport');

//controller loading...
var routes = require('./controllers');
var users = {};
users.api = require('./controllers/api/user');
users.pages = require('./controllers/user');

//load app
var app = express();

//email configs
var email = require('./configs/email');
app = email.config(app);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//if using express.session cookieparser needs a salt...
app.use(cookieParser('d46ts27g'));
//Flash messaging needs express.session...
app.use(express.session({
    secret: "d46ts27g",
    key: "app.sess",
    maxAge: 24 * 360000 * 7,
    store: new MongoStore({
        db: 'cshu',
        host: 'localhost',
        collection: 'sessions'
    })
}));
app.use(flash());
//Passport config
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//check if user is logged in middelware

function authenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
/*---Page Routes---*/
app.get('/', routes.index);
app.get('/users', authenticated, users.pages.index);
app.post('/users', authenticated, users.pages.index);
app.get('/user/delete/:id', authenticated, users.pages.delete);
app.get('/user/edit/:username', authenticated, users.pages.edit);
app.post('/user/edit/:username', authenticated, users.pages.edit);
app.get('/user/forgot_password', users.pages.resetpw);
app.post('/user/forgot_password', users.pages.resetpw);

//Login Routes
app.get('/login', users.pages.login);
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*---API Routes---*/
app.get('/api', routes.api);
app.get('/api/users', users.api.get);
app.post('/api/users', users.api.post);
app.get('/api/users/:name', users.api.getUser);
app.put('/api/users/:name', users.api.updateUser);
app.delete('/api/users/:id', users.api.delete);



module.exports = app;
