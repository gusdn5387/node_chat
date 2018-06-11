const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req,res) => {
    res.render('SignIn', {
        title : '로그인',
        message : req.flash('signin')
    });
});

router.get('/signin', (req,res) => {
    res.render('SignIn', {
        title : '로그인',
        message : req.flash('signin')
    });
});

router.get('/signup', (req,res) => {
    res.render('SignUp', {
        title : '회원가입',
        message : req.flash('signup')
    });
});

router.get('/test', (req,res) => {
    res.render('test', {
        title : 'test'
    });
});

router.get('/logout', (req,res) => {
    res.logout();
    res.redirect('/');
});

router.post('/signin',passport.authenticate('local-signin',{
    successRedirect : '/test',
    failureRedirect : '/signin',
    failureFlash : true
}));

router.post('/signup',passport.authenticate('local-signup',{
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
}));


module.exports = router;
