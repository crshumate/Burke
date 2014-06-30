var mailer = require('express-mailer');

exports.config = function(app) {
    return mailer.extend(app, {
        from: 'no-reply@example.com',
        host: 'smtp.gmail.com', // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
            user: 'example.email@gmail.com',
            pass: 'password'
        }
    });
}
