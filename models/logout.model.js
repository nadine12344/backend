var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema

//Schema.plugin(require('mongoose-beautiful-unique-validation'));


var logout = new Schema({
 token:{type:String}
})

//locations.plugin(require('mongoose-beautiful-unique-validation'));

var logoutModel = mongoose.model('logout', logout)
module.exports = logoutModel