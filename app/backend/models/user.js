var mongoose    = require('mongoose');
var timestamps  = require('mongoose-time');
var Schema      = mongoose.Schema;
var UserSchema = new Schema({name: String}).plugin(timestamps());

module.exports = mongoose.model('User', UserSchema);
