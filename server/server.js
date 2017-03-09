const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
        
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('invalid id');
    }
    
    Todo.findByIdAndRemove(id).then( (result) => {
        if(!result) {
            return res.status(404).send('did not find id to remove');
        }
        
        return res.status(200).send();
        
    }, (err) => {
        return res.status(400).send();
    })
})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    
    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (doc) => {
        if(!doc) {
            return res.status(404).send();
        }
        res.status(200).send(doc);
    }, (err) => {
        res.status(400).send(err);
    }).catch( (e) => {
        res.status(400).send(e);
    })
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then( () => {
        return user.generateAuthToken();
    }).then( (token) => {
        res.status(200).header('x-auth', token).send(user);
    })
    
    .catch( (err) => {
        res.status(404).send(err);
    });
})



app.get('/users/me', authenticate,   (req, res) => {
    res.send(req.user);    
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
})


