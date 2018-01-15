var express = require('express'),
  app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'stephengoveia@spacetimeathleta.co',
    pass: 'pass4sA100M*'
  }
});

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

//Set/Get Port and IP of host server
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000,
  ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

// Routing
app.use(express.static('./'));

// Loading socket.io
//var io = require('socket.io').listen(app.listen(3000));
// When a client connects, we note it in the console
// io.sockets.on('connection', function (socket) {
//     console.log('A client is connected!');
// });



//Sending Message from Contact Form
app.post('/process_post', urlencodedParser, function(req, res) {
  // Prepare output in JSON format
  response = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  };

  const mailOptions = {
    from: 'stephengoveia@spacetimeathleta.co', // sender address
    to: 'stephengoveia@spacetimeathleta.co', // list of receivers
    subject: 'Message from: ' + 'Name:'+response.name+ ' Email:' + response.email, // Subject line
    html: '<p>' + response.message + '</p>' // plain text body
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });

  const mailOptions2 = {
    from: 'contact@spacetimeathleta.co', // sender address
    to: response.email, // list of receivers
    subject: 'Thanks for the Message!!', // Subject line
    html: '<p>Hello '+response.name+'!<br>Thank you so much for reaching out! Your note is very important to us, we will get back with you very soon! </p><p>Best Regards,<br>Steve Goveia - Founder/CEO<br> <a href="spacetimeathleta.co">spacetimeAthleta</a></p>' // plain text body
  };

  transporter.sendMail(mailOptions2, function(err, info) {
    if (err)
      console.log(err)
    else
      console.log(info);
  });

  res.redirect('./');
  //console.log(response);
  //res.end(JSON.stringify(response));
})


// Launch Server
app.listen(port, ip );//'10.0.0.235'
console.log('Server running on http://%s:%s', ip, port);
