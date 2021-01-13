var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);

var Schema = mongoose.Schema

//Schema.plugin(require('mongoose-beautiful-unique-validation'));


var locations = new Schema({
 name:{type:String,required:true,unique:true},
type: {type:String,enum:['tutorial room','lecture halls','offices']},
 capacity: {type: Number},
 officeOccupants:{type:Number,default:0}
})

//locations.plugin(require('mongoose-beautiful-unique-validation'));

var locationModel = mongoose.model('locations', locations)
module.exports = locationModel