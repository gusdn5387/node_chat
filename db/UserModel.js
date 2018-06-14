const mongoose = require('mongoose');
const bcrybt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({   //users collection schema
    name : String,
    id : String,
    pw : String
});

userSchema.methods.Hash = pw => { //hash 코드 생성
    return bcrybt.hashSync(pw,bcrybt.genSaltSync(8), null);
};

userSchema.methods.Match = function(pw) { //hash 코드와 password 비교
    return bcrybt.compareSync(pw, this.pw);
};

<<<<<<< HEAD
module.exports = mongoose.model('user',userSchema, 'users');
=======
module.exports = mongoose.model('user',userSchema,'users');
>>>>>>> hw
