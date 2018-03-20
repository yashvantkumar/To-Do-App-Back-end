const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var userSchema = new Schema({
    first_name: { type: String, require: true },
    last_name: { type: String, require: true },
    mobile: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true }
})

var User = mongoose.model('User', userSchema);
module.exports.User = User;
