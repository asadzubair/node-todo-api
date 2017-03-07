const {ObjectID} = require('mongodb');

var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');
var {User} = require('./../server/models/user');

var id = '48be60075fee2914c09fd85d';

//Todo.findOneAndRemove()
Todo.findByIdAndRemove('58be79728fb58c26681a9851').then( (result) => {
    if(!result) {
        return console.log('id not found');
    }
    console.log('remove doc', result);
}, (e) => {
    console.log('unable to remove doc', e);
})

