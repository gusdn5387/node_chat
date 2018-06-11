const Local = require('passport-local').Strategy;
const User = require('./UserModel');


module.exports = passport => {
    passport.serializeUser( (user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser( (user, done) => {

            done(null, user);

    });


    //회원가입
    passport.use('local-signup', new Local({
        usernameField : 'id',
        passwordField : 'pw',
        passReqToCallback : true
    }, (req, id, pw, done) =>{
        User.findOne({'id' : id}, (err, user) =>{
            if(err) return done(null);
            if(user) return done(null, false, req.flash('signup', '중복된 아이디 입니다.'));

            let newUser = new User();
            newUser.id = id;
            newUser.pw = newUser.Hash(pw);
            newUser.name = req.body.name;

            newUser.save( err => {
                if(err) throw err;
                console.log(newUser);
            });
            return done(null, newUser);
        });
    }));

    //로그인
    passport.use('local-signin', new Local({
        usernameField : 'id',
        passwordField : 'pw',
        passReqToCallback : true
    }, (req, id, pw, done) =>{
        User.findOne({'id' : id}, (err, user) =>{
            if(err) return done(null);

            if(!user || !user.Match(pw))
                return done(null, false, req.flash('signin', '아이디 또는 비밀번호가 틀렸습니다.'));

            console.log(user);
            return done(null, user);
        });
    }));
};
