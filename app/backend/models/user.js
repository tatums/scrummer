var mongoose    = require('mongoose');
var timestamps  = require('mongoose-time');
var Schema      = mongoose.Schema;
var UserSchema = new Schema({provider: String, providerId: String, _raw: String}).plugin(timestamps());

module.exports = mongoose.model('User', UserSchema);
