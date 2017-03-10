require('./config/config');
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

app.post('/todos', authenticate, (req, res) => {
        
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
        
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user.id

    }).then( (results) => {
        res.send({
            todos: results
        })
    }, (err) => {
        console.log('unable to retrieve todos - ', err.message);
    })
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    })
    .then( (result) => {
        if(result) {
            return res.send(result);
        }
        
        return res.status(404).send('did not find todo');
        
    }, (err) => {
        res.status(400).send('oops what happened here ? I only know that we crashed !');
    })
    
    
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('invalid id');
    }
    
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user.id

    }).then( (result) => {
        if(!result) {
            return res.status(404).send('did not find id to remove');
        }
        
        return res.status(200).send();
        
    }, (err) => {
        return res.status(400).send();
    })
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
    
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user.id
    }, {$set: body}, {new: true}).then( (doc) => {
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
    var body = _.pick(req.body, ['email', 'password']);
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
});

// POST /users/login 
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then( (user) => {
        user.generateAuthToken().then( (token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch( (err) => {
        res.status(400).send(err);
    })
});


app.get('/users/me', authenticate,   (req, res) => {
    res.send(req.user);    
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token)
    .then( () => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});


