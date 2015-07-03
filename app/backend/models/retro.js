var mongoose    = require('mongoose');
var timestamps  = require('mongoose-time');
var Schema      = mongoose.Schema;
var RetroSchema = new Schema({title: String, form: String, user_id: String}).plugin(timestamps());

module.exports = mongoose.model('Retro', RetroSchema);

