var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://asad:Pass1234@ds121190.mlab.com:21190/todoapp');

module.exports = {mongoose};