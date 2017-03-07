var {mongoose} = require('./../server/db/mongoose');
var {Todo} = require('./../server/models/todo');

var id = '48be60075fee2914c09fd85d';

Todo.find({
    _id : id
}).then( (results) => {
    console.log('Todos ', results)
}, (err) => {
    console.log('unable to find todos', err.message);
})


Todo.findOne({
    _id : id
}).then( (result) => {
    if(!result) {
        return console.log('unable to find todo');
    }
    console.log('Todo ', result)
}, (err) => {
    console.log('unable to find todos', err.message);
})

Todo.findById(id)
.then( (results) => {
    console.log('Todo By ID ', results)
}, (err) => {
    console.log('unable to find todos', err.message);
})