var mongoose    = require('mongoose');
var timestamps  = require('mongoose-time');
var Schema      = mongoose.Schema;
var RetroSchema = new Schema({retro_id: String, input: String, user_id: String}).plugin(timestamps());

module.exports = mongoose.model('Response', RetroSchema);
