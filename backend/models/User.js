const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    password: { type: String, required: true },
    issuedBook: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    fine: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);
module.exports= User;

