const mongoose = require('mongoose');

<<<<<<< HEAD
let friendSchema = mongoose.Schema({ //friends collection Schema
=======
let friendSchema = mongoose.Schema({
>>>>>>> hw
    id : String,
    fid : String,
    fname : String
});

module.exports = mongoose.model('friend', friendSchema, 'friends');
