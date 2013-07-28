var nodemailer = require("nodemailer");
var cfg = require('../config');

// create reusable transport method (opens pool of SMTP connections)

var sendIt = function sendIt(subject, html, plainText){
    // var smtpTransport = nodemailer.createTransport("SMTP",{
    //     service: "Gmail",
    //     auth: {
    //         user: cfg.mail.user,
    //         pass: cfg.mail.password
    //     }
    // });

    var smtpTransport = nodemailer.createTransport("Sendmail", "/usr/sbin/sendmail");

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: cfg.mail.from, // sender address
        to: cfg.mail.to, // list of receivers
        subject: subject, // Subject line
        text: html, // plaintext body
        html: html // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close(); // shut down the connection pool, no more messages
    });
};

var Mailer = Function ;
Mailer.prototype.sendIt = sendIt;
module.exports = exports = Mailer;