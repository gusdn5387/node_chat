const express = require('express');
const passport = require('passport');
const router = express.Router();
const users = require('../db/UserModel');

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
        title : '회원가입'
    });
});
//친구목록, 친구추가, 대화목록 , 1:1채팅 페이지 추가
router.get('/friendlist', (req,res) => {
    res.render('FriendList', {
        title : '친구목록'
    });
});

router.get('/addfriend', (req,res) => {
    res.render('AddFriend', {
        title : '친구추가'
    });
});

router.get('/chatlist', (req,res) => {
    res.render('ChatList', {
        title : '대화목록'
    });
});

router.get('/chatting', (req,res) => {
    res.render('Chatting', {
        title : '1:1 채팅'
    });
});

router.get('/checkId',function(req,res) {
  var id = req.param('id');

  users.findOne({'id':id}, function(err,result) {
    if(err) throw err;
    res.send({result:result});
  });
});

router.get('/test', (req,res) => {
    res.render('test', {
        title : 'test'
    });
});

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
});

router.post('/signin',passport.authenticate('local-signin',{
    successRedirect : '/friendlist',
    failureRedirect : '/signin',
    failureFlash : true
}));

router.post('/signup',passport.authenticate('local-signup',{
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
}));


module.exports = router;
