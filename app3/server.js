var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient
    url = 'mongodb://testuser:password@ds041924.mlab.com:41924/store',
    ultimo = 'ultimo',
    httptools = require('./httptools'),
    ipport = process.env.PORT || 3000;

app.get('/mongoadd', function(req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log("Connection Mongo failed: ", err);
            } else {
                console.log("MongoAdd: Connection established to: ", url);
                var collection = db.collection(ultimo);
                var trolley1 = {
                    trollid: 'hello',
                    intime: '',
                    outtime: 'good'
                };
                var trolley2 = {
                    trollid: 'my',
                    intime: '',
                    outtime: 'help'
                };
                var trolley3 = {
                    trollid: 'name',
                    intime: '',
                    outtime: 'goodtime'
                };
                var trolley4 = {
                    trollid: 'is',
                    intime: '',
                    outtime: 'mytime'
                };
                var trolley5 = {
                    trollid: 'harambe',
                    intime: '',
                    outtime: 'yourtime'
                };
                var trolley6 = {
                    trollid: 'harambe',
                    intime: '',
                    outtime: 'x'
                };
                var trolley7 = {
                    trollid: 'harambe',
                    intime: '',
                    outtime: 'x'
                };
                collection.insert([trolley1, trolley2, trolley3, trolley4, trolley5, trolley6, trolley7], function(err, data) {
                    if (err) {
                        console.log("Error: ", err);
                    } else {
                        console.log("Inserted trolleys into the " + ultimo + " collection.");
                    }
                    db.close();
                });
            };
        });
    res.end();
});

app.get('/mongofind', function(req, res) {

    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoFind: Connection established to: ", url);
            var collection = db.collection(ultimo);
            collection.find({}).toArray(function(err, data) {
                if (err) {
                    console.log("Error: ", err);
                } else if (data.length) {
                    console.log("Found: ", data);
                } else {
                    console.log("No trolleys found");
                };
                db.close();
            });
        };
    });
    res.end();
});

function updateFields() {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoUpdate: Connection established to: ", url);
            var collection = db.collection(ultimo);
            collection.updateMany({
                store: {
                    $exists: false
                }
            }, {
                $set: {
                    store: 'Woolworths'
                }
            });
            console.log("Updated fields.");
        };
        db.close();
    });
};

// setInterval(function() {
app.get('/mongosend', function(req, res) {
    updateFields();
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoSend: Connection established to: ", url);
            var collection = db.collection(ultimo);
            collection.find({
                outtime: {
                $ne: 'x'
                }
            }).toArray(function(err, data) {
                if (err) {
                    console.log("Error: ", err);
                } else {
                    var sendData = {
                        transactions: data
                    };
                    console.log("Sent: ", sendData);
                    httptools.post('http://' + ipport + '/api/save', sendData);
                };
            });
            collection.remove({
                outtime: {
                $ne: 'x'
                }
            });
            console.log("Removed sent trolley transactions from collection.");
        };
    });
    res.end();
});
// }, 5000);

app.get('/mongodelete', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoDelete: Connection established to: ", url);
            var collection = db.collection(ultimo);
            collection.remove({});
            console.log("Removed all trolleys");
        };
        db.close();
    });
    res.end();
});

var server = app.listen(ipport, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App2 listening at http://%s:%s", host, port);
});
