var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "TROLLEY-MANAGEMENTSYSTEM-76d0d4b457f7.json",
  databaseURL: "https://trolley-managementsystem.firebaseio.com/"
});

var express         = require('express');        // call express
var ServerInterface = express(); 

var bodyParser = require('body-parser');
var db = firebase.database();
//default, will be changed once the post request comes in with a store name
var StoreRef = db.ref("WOOLWORTHS");


//----Config-----

// configure app to use bodyParser()
// this will let us get the data from a POST
ServerInterface.use(bodyParser.urlencoded({ extended: true }));
ServerInterface.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

//-----------Express Setup-------------
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests, use this validate incoming requests, log requests, analytics maybe
router.use(function(req, res, next) {
    // do logging
    console.log("Request recived.");
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'The API is working and has recieved your request' });   
});

// more routes for our API will happen here
// Accessed at POST http://localhost:8080/api/save
router.route('/save').post(function(req, res) {
	//Here us where we'll save to firebase with a post request
	//This assumes the body of the text will have the transactions
	// req.body.transactions is the array of transactions from the mongoDB
	// sent here.
	if (!validateJSON(req.transactions))
	{
		//the JSON isn't valid or some records have missing fields
		console.log("The JSON recieved has missing fields:");
		console.log(req.transactions);
		res.status(400).send({ error: 'Some of the transactions were missing required fields,'+
									  'Refer to: https://gist.github.com/rayoz12/1487b66f0da4321e18713cc68a2f5475'});
		return;
	}
	
	for (i=0;i < req.body.transactions.length;i++)
	{
		StoreRef = db.ref(req.body.transactions[i].store);
		//delete store attribute, so it doesn't get saved in firebase.
		delete req.body.transactions[i].store;
		//delete _id, which is a remenant of mongodb. 
		delete req.body.transactions[i]._id;
		console.log(req.body.transactions[i]);
		//console.log(typeof req.body.transactions[i]);
		StoreRef.push().set(req.body.transactions[i]);
	}	
	res.json({ message: "Saved successfully" });
	
});

// more routes for our API will happen here
// Accessed at POST http://localhost:8080/api/save
router.route('/mocksave').post(function(req, res) {
	//Here us where we'll save to firebase with a post request
	//This assumes the body of the text will have the transactions
	// req.body.transactions is the array of transactions from the mongoDB
	// sent here.
	if (!validateJSON(req.transactions))
	{
		//the JSON isn't valid or some records have missing fields
		console.log("The JSON recieved has missing fields:");
		console.log(req.transactions);
		res.status(400).send({ error: 'Some of the transactions were missing required fields,'+
									  'Refer to: https://gist.github.com/rayoz12/1487b66f0da4321e18713cc68a2f5475'});
		return;
	}
	
	console.log("pushing to db");	
	res.json({ message: "Saved successfully" });
	
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
ServerInterface.use('/api', router);

// START THE SERVER
// =============================================================================
ServerInterface.listen(port);
console.log('Server started: Magic happens on port ' + port);

//return true when the JSON is valid, false otherwise
function validateJSON(JSONData)
{
	for (i=0;i < JSONData.transactions.length;i++)
	{
        //check if correct fields are in each JSON object
        var trans = JSONData.transactions[i];
        var boolValid = trans.hasOwnProperty('trollid') &&
						trans.hasOwnProperty('intime')  &&
						trans.hasOwnProperty('outtime') &&
						trans.hasOwnProperty('store');
		if (!boolValid)
		{
			//this object is invalid, thus the request could not be validated.
			return false;
		}
	}
	return true;
}
