var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    
    todo.save().then( (doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then( (results) => {
        res.send({
            todos: results
        })
    }, (err) => {
        console.log('unable to retrieve todos - ', err.message);
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id
    console.log(id);
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    
    Todo.findById(id)
    .then( (result) => {
        if(result) {
            return res.send(result);
        }
        
        return res.status(404).send('did not find id');
        
    }, (err) => {
        res.status(400).send('holy');
    })
    
    
})

app.listen(3000, () => {
    console.log('started on port 3000');
})


