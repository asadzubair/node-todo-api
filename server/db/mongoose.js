var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var dbconn = process.env.NODE_ENV ? 'mongodb://asad:Pass1234@ds121190.mlab.com:21190/todoapp' : 'mongodb://localhost:27017/TodoApp'

//mongoose.connect('mongodb://localhost:27017/TodoApp');
//mongoose.connect('mongodb://asad:Pass1234@ds121190.mlab.com:21190/todoapp');
mongoose.connect(dbconn);

module.exports = {mongoose};