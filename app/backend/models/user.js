var mongoose    = require('mongoose');
var timestamps  = require('mongoose-time');
var Schema      = mongoose.Schema;
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    provider: String,
    providerId: String,
    photos: Array
}).plugin(timestamps());

module.exports = mongoose.model('User', UserSchema);
