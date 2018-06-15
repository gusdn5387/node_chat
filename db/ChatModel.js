const mongoose = require('mongoose');

let chatSchema = mongoose.Schema({ //friends collection Schema
    id : String,
    name : String,
    fid : String,
    fname : String,
    msg : String,
    date : Date
});

module.exports = mongoose.model('chat', chatSchema, 'chat');
