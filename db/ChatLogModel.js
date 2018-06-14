const mongoose = require('mongoose');

let chatLogSchema = mongoose.Schema({ //friends collection Schema
    id : String,
    name : String,
    fid : String,
    fname : String,
    msg : String
});

module.exports = mongoose.model('chatlog', chatLogSchema, 'chatlog');
