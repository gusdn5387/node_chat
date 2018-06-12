const mongoose = require('mongoose');
const bcrybt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
    name : String,
    id : String,
    pw : String
});

userSchema.methods.Hash = pw => {
    return bcrybt.hashSync(pw,bcrybt.genSaltSync(8), null);
};

userSchema.methods.Match = function(pw) {
    return bcrybt.compareSync(pw, this.pw);
};

module.exports = mongoose.model('user',userSchema, 'users');
