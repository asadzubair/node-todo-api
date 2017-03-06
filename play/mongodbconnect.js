//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('unable to connect to mongo db server');
    }
    console.log('connected to mongo db server');
    
//    db.collection('Todos').insertOne({
//        text: 'something to do',
//        completed: false
//    }, (err, res) => {
//        if(err) {
//            return console.log('unable to add todo', err);
//        }
//        
//        console.log(JSON.stringify(res.ops, undefined, 2));
//    });
    
    db.collection('Users').insertOne({
       name: 'asad',
       age: 35,
       location: 'karachi'
    }, (err, res) => {
        if(err) {
            return console.log('unable to add user', err);
        }
        
        console.log(JSON.stringify(res.ops, undefined, 2));
    }); 
    
    db.close();
});
