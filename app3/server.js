var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    url = 'mongodb://localhost:27017/app3DB',
    ipport = '172.19.127.233:8080',
    master = 'master',
    request = require('request');

var firebase = require('firebase');

firebase.initializeApp({
    serviceAccount: "TROLLEY-MANAGEMENTSYSTEM-21213064b58a.json",
    databaseURL: "https://trolley-managementsystem.firebaseio.com/"
});

var db = firebase.database();
var StoreRef = db.ref("WOOLWORTHS");

function sendFB(data) {
    for (i=0;i < data.length;i++)
    {
        console.log(data[i]);
        delete data[i]._id;
        StoreRef.push().set(data[i]);
    }
    console.log("Saved Successfully");
}

app.get('/mongoadd', function(req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log("Connection Mongo failed: ", err);
            } else {
                console.log("MongoAdd: Connection established to: ", url);
                var collection = db.collection(master);
                var trolley1 = {
                    bay: 'pear',
                    trollid: 'hello',
                    intime: '',
                    outtime: 'x'
                };
                var trolley2 = {
                    bay: 'banana',
                    trollid: 'my',
                    intime: '',
                    outtime: 'x'
                };
                var trolley3 = {
                    bay: 'apple',
                    trollid: 'name',
                    intime: '',
                    outtime: 'x'
                };
                var trolley4 = {
                    bay: 'apple',
                    trollid: 'is',
                    intime: '',
                    outtime: 'x'
                };
                var trolley5 = {
                    bay: 'banana',
                    trollid: 'harambe',
                    intime: '',
                    outtime: 'yourtime'
                };
                var trolley6 = {
                    bay: 'apple',
                    trollid: 'harambe',
                    intime: '',
                    outtime: 'x'
                };
                var trolley7 = {
                    bay: 'pear',
                    trollid: 'harambe',
                    intime: '',
                    outtime: 'x'
                };
                collection.insert([trolley1, trolley2, trolley3, trolley4, trolley5, trolley6, trolley7], function(err, data) {
                    if (err) {
                        console.log("Error: ", err);
                    } else {
                        console.log("Inserted trolleys into the " + master + " collection.");
                    }
                });
            db.close();
            }
        });
    res.end();
});

app.get('/mongofind', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoFind: Connection established to: ", url);
            var collection = db.collection(master);
            collection.find({}).toArray(function(err, data) {
                if (err) {
                    console.log("Error: ", err);
                } else if (data.length) {
                    console.log("Found: ", data);
                } else {
                    console.log("No trolleys found");
                }
            });
            db.close();
        }
    });
    res.end();
});

app.get('/mongodelete', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoDelete: Connection established to: ", url);
            var collection = db.collection(master);
            collection.remove({});
            console.log("Removed all trolleys");
            db.close();
        }
    });
    res.end();
});

function updateFields() {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoUpdate: Connection established to: ", url);
            var collection = db.collection(master);
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
            db.close();
        }
    });
}

function sendData() {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoSend: Connection established to: ", url);
            var collection = db.collection(master);
            collection.find({
                outtime: {
                $ne: 'x'
                }
            }).toArray(function(err, data) {
                if (err) {
                    console.log("Error: ", err);
                } else {
                    console.log("Sent: ", data);
                    sendFB(data);
                }
            });
            db.close();
        }
    });
}

function deleteData() {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoDelete: Connection established to: ", url);
            var collection = db.collection(master);
            collection.remove({
                outtime: {
                $ne: 'x'
                }
            });
            console.log("Removed sent trolley transactions from collection.");
            db.close();
        }
    });
}

setInterval(function() {
    updateFields();
    sendData();
    deleteData();
}, 20000);

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App2 listening at http://%s:%s", host, port);
});
