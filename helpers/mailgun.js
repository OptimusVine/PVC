var api_key = 'key-54b95ce6a573eae1fef95cac1213524e';
var domain = 'sandboxe381a57b24024fc59b69346eb4c9bf47.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'Excited User <me@samples.mailgun.org>',
  to: 'kjiel.carlson@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomness!'
};

exports.sendMail = function(req, res, next){
	console.log('Im in the function')
	var b = req.body
	console.log(b)

	var data = {
  		from: 'Excited User <me@samples.mailgun.org>',
  		to: 'kjiel.carlson@gmail.com',
  		subject: 'Hello',
 		 text: 'Testing some Mailgun awesomness!'
	};

	data.subject = b.name;
	data.text = b.summary;

	mailgun.messages().send(data, function (error, body) {
  		console.log(body);
		});
	console.log('hello!?')
	res.end()
}