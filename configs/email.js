var mailer = require('express-mailer');

exports.config = function(app) {
    return mailer.extend(app, {
        from: 'no-reply@example.com',
        host: 'localhost', // hostname
        secureConnection: true, // use SSL
        transportMethod: 'Sendmail' // default is SMTP. Accepts anything that nodemailer accepts
        
    });
}
