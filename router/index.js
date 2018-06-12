const express = require('express');
const passport = require('passport');
const router = express.Router();
const users = require('../db/UserModel');
const Friend = require('../db/FriendModel');

//로그인 상태 인지 체크
function loginCh(req,res){
    if(!req.user){
        res.redirect('/');
        return;
    }
}

//default page 로그인
router.get('/', (req,res) => {
    res.render('SignIn', {
        title : '로그인',
        message : req.flash('signin')
    });
});
//로그인
router.get('/signin', (req,res) => {
    res.render('SignIn', {
        title : '로그인',
        message : req.flash('signin')
    });
});
//회원가입
router.get('/signup', (req,res) => {
    res.render('SignUp', {
        title : '회원가입'
    });
});
//친구목록
router.get('/friendlist', (req,res) => {
    loginCh(req,res);
    if(req.user){
        Friend.find({'id' : req.user.id}, (err,user) => {
            if(err) throw err;

            res.render('FriendList', {
                title : '친구목록',
                list : user,
                user : req.user
            });

        });
    }
});
//친구 추가 목록
router.get('/addfriend', (req,res) => {
    loginCh(req,res);
    if(req.user){
    Friend.find({'id' : req.user.id}, (err,friends) => {
        if(err) throw err;
        if(friends){ //친구가 1명 이라도 있을 시
            let key = [];
            friends.forEach( friend => {
                key.push({'id' : friend.fid});
            });

            key.push({'id' : req.user.id});

            users.find({$nor : key}, (err, user) => {
                if(err) throw err;
                res.render('AddFriend', {
                    title : '친구추가',
                    list : user,
                    user : req.user
                });
            });
        }
        else{ //친구가 1명도 없을 시
            users.find({'id' : {$ne : req.user.id} }, (err, user) => {
                if(err) throw err;;
                res.render('AddFriend', {
                    title : '친구추가',
                    list : user,
                    user : req.user
                });
            });
        };
    });
};
});
//대화목록
router.get('/chatlist', (req,res) => {
    loginCh(req,res);
    if(req.user){
    res.render('ChatList', {
        title : '대화목록',
        user : req.user
    });
}
});
//1:1 채팅방
router.get('/chatting', (req,res) => {
    loginCh(req,res);
    if(req.user){
    res.render('Chatting', {
        title : '1:1 채팅',
        user : req.user,
        fuser : req.param('fname')
    });
}
});
//친구 추가 버튼
router.get('/insertFriend',(req,res) => {
  loginCh(req,res);
  if(req.user){
  let newFriend = new Friend;

  newFriend.id = req.user.id;
  newFriend.fid = req.param('id');
  newFriend.fname = req.param('name');

  newFriend.save(err => {
      if(err) throw err;
  });
   res.redirect('/AddFriend');
}
});
//유저 중복 체크
router.get('/checkId',function(req,res) {
  loginCh(req,res);
  if(req.user){
  var id = req.param('id');

  users.findOne({'id':id}, function(err,result) {
    if(err) throw err;
    res.send({result:result});
  });
}
});
//로그아웃
router.get('/logout', (req,res) => {
    loginCh(req,res);
    if(req.user){
    req.logout();
    res.redirect('/');
}
});
//로그인 post
router.post('/signin',passport.authenticate('local-signin',{
    successRedirect : '/friendlist',
    failureRedirect : '/signin',
    failureFlash : true
}));
//회원가입 post
router.post('/signup',passport.authenticate('local-signup',{
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
}));

module.exports = router;
