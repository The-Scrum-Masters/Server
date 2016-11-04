var config = require("./config.json"),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    url = config.url,
    master = config.collname;

var firebase = require('firebase');

firebase.initializeApp({
    serviceAccount: config.serviceAcc,
    databaseURL: config.databaseURL
});

var db = firebase.database();
var StoreRef = db.ref(config.collname);

console.log("Server Started");

function sendFB(data) {
    for (i=0;i < data.length;i++)
    {
        console.log(data[i]);
        delete data[i]._id;
        StoreRef.push().set(data[i]);
    }
    console.log("Saved Successfully");
}

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
