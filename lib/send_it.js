var nodemailer = require("nodemailer");
var sesTransport = require('nodemailer-ses-transport');
var cfg = require('../config');

// create reusable transport method (opens pool of SMTP connections)
var sendIt = function sendIt(subject, html, plainText){

    var options = {};
    var transporter = nodemailer.createTransport(sesTransport(options));

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: cfg.mail.from, // sender address
        to: cfg.mail.to, // list of receivers
        subject: subject, // Subject line
        text: html, // plaintext body
        html: html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.messageId);
        }

        transporter.close(); // shut down the connection pool, no more messages
    });
};

var Mailer = Function ;
Mailer.prototype.sendIt = sendIt;
module.exports = exports = Mailer;
