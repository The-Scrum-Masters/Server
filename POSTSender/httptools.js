var request = require('request');

module.exports = {
	printMsg: function () 
	{
		console.log("This is a message from the demo package");
	};
	
	post: function(ip, JSONData)
		request.post(
			ip,//IP address
			{ json: JSONData },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
				    console.log("200 OK|" + body)
				}
		 	}
		);
};
