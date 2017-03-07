//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('unable to connect to mongo db server');
    }
    console.log('connected to mongo db server');

//    db.collection('Todos').findOneAndUpdate({
//        _id: new ObjectID('58bd5feee07446e112db9527')
//    }, {
//        $set: {
//            completed: true
//        }
//    }, {
//        returnOriginal: false
//    }).then( (result) => {
//        console.log(result);
//    })
    
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('58bd6139e07446e112db95e4')
    }, {
        $set: { name: 'kaab'},
        $inc: { age: 2 }        
    }, {
        returnOriginal: false
    }).then( (result) => {
        console.log(result);
    })

//    db.close();
});
