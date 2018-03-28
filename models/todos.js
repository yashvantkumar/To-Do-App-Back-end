const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var todoSchema = new Schema({
    todo_name: { type:String, require: true },
    details: { type: String, require: true },
    created_date: { type: Date, default: Date.now, required: true },
    // expiry_date: { type: Date, required: true },
    user_id: { type: Schema.ObjectId, ref: 'User'},
    status: { type: String, enum: ['completed', 'pending'], required: true, default: 'pending' },
    important: { type: Boolean, require: true, default: false }
});

var Todo = mongoose.model('Todo', todoSchema);
module.exports.Todo = Todo;