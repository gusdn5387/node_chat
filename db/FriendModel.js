const mongoose = require('mongoose');

let friendSchema = mongoose.Schema({ //friends collection Schema
    id : String,
    fid : String,
    fname : String
});

module.exports = mongoose.model('friend', friendSchema, 'friends');
