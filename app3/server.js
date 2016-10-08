var express = require('express'),
    app = express(),
    mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient
    url = 'mongodb://localhost:27017/app3DB',
    master = 'master',
    httptools = require('./httptools'),
    ipport = '10.0.0.104:8080';
// const readline = require('readline');

// var rule = new schedule.RecurrenceRule();
// rule.second = 10;

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

// app.get('/mongonewcoll', function(req, res) {
//     MongoClient.connect(url, function(err, db) {
//         if (err) {
//             console.log("Connection Mongo failed: ", err);
//         } else {
//             console.log("MongoAdd: Connection established to: ", url);
//             rl.question("New collection: name>", function(answer) {
//                 db.createCollection(answer);
//                 console.log("Made new collection: ", answer);
//                 rl.close();
//             });
//         };
//     });
//     res.end();
// });

// app.get('/changebay', function(req, res) {
//     rl.question("Change bay: bay>", function(answer) {
//         bay = answer.toString();
//         console.log("Changed to bay: ", answer);
//         rl.close();
//     });
//     res.end();
// });

app.get('/mongoadd', function(req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                console.log("Connection Mongo failed: ", err);
            // } else if (master == '') {
            //     console.log("No bay specified.");
            } else {
                console.log("MongoAdd: Connection established to: ", url);
                var collection = db.collection(master);
                var trolley1 = {
                    trollid: 'asdasd',
                    intime: '',
                    outtime: 'x'
                };
                var trolley2 = {
                    trollid: 'cba321',
                    intime: '',
                    outtime: 'x'
                };
                var trolley3 = {
                    trollid: '123abc',
                    intime: '',
                    outtime: '123'
                };
                collection.insert([trolley1, trolley2, trolley3], function(err, data) {
                    if (err) {
                        console.log("Error: ", err);
                    } else {
                        console.log("Inserted trolleys into the " + master + " collection.");
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
        // } else if (bay == '') {
        //     console.log("No bay specified.");
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
                };
                db.close();
            });
        };
    });
    res.end();
});

// setInterval(function() {
// app.get('/mongoupdate', function(req, res) {
// function updateFields() {
//     MongoClient.connect(url, function(err, db) {
//         if (err) {
//             console.log("Connection Mongo failed: ", err);
//         // } else if (bay == '') {
//         //     console.log("No bay specified.");
//         } else {
//             console.log("MongoUpdate: Connection established to: ", url);
//             // var collectionNames = ['bay001', 'bay002', 'bay003'];
//             // db.listCollections().toArray(function(err, collections) {
//             //     collectionNames = JSON.parse(JSON.stringify(collections));
//             // });
//             // for (i = 0; i < collectionNames.length; i++) {
//             var collection = db.collection(master);
//             collection.updateMany({
//                 store: {
//                     $exists: false
//                 }
//             }, {
//                 $set: {
//                     store: 'Woolworths'
//                 }
//             });
//             console.log("Updated fields.");
//         };
//         db.close();
//     });
// };
    // res.end();
// });
// }, 5000);

app.get('/mongosend', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoSend: Connection established to: ", url);
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

app.get('/mongodelete', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Connection Mongo failed: ", err);
        } else {
            console.log("MongoDelete: Connection established to: ", url);
            var collection = db.collection(master);
            collection.remove({});
            console.log("Removed all trolleys");
        };
        db.close();
    });
    res.end();
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App2 listening at http://%s:%s", host, port);
});
