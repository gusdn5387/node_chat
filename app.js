const express = require('express');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const socket = require('socket.io');

const router = require('./router');
const app = express();
const port = process.env.PORT || 3000;

let db = null;

let server = app.listen(port, () => {
    console.log("Server Start");
});

let io = socket.listen(server);

require('./db/passport')(passport);

app.set('views',path.join(__dirname, 'public'));
app.set('view engine', 'ejs'); // view engine 을 ejs 로

mongoose.connect('mongodb://sw7190:sw7190@ds147420.mlab.com:47420/sw7190') //mlab mongodb 연결

db = mongoose.connection;

db.on('error',
console.error.bind(console,'connection error:')
);
db.once('open', () => {
    console.log('DB connect');
});

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

app.use(session({
    secret : 'sw',
    resave : true,
    saveUninitialized : true,
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname,'public')));
app.use('/',router); // 라우터 분리

const Chat = require('./db/ChatModel');
const ChatLog = require('./db/ChatLogModel');

io.on('connection',(socket) => {
    socket.on('send message', (users,msg) => { //메시지가 오면은 
        let data = {
            users : users,
            msg : msg
        };
        Chat.find({   //마지막 채팅 기록이 하나도 없을 시 추가
                $or: [
                    {$and : [{'id' : data.users.user},{'fid' : data.users.fuser}]},
                    {$and : [{'id' : data.users.fuser},{'fid' : data.users.user}]}
                ]},(err,list) => {

            if(err) throw err;
            if(list.length <= 0){
                let newChat = new Chat;
                newChat.id = data.users.user;
                newChat.name = data.users.name;
                newChat.fid = data.users.fuser;
                newChat.fname = data.users.fname;
                newChat.msg = data.msg;
                newChat.save(err => {
                    if(err) throw err;
                });
            }else{ //마지막 채팅 기록이 하나라도 있을 시 마지막 기록 업데이트
                Chat.update(
                    {
                        $or: [
                            {$and : [{'id' : data.users.user},{'fid' : data.users.fuser}]},
                            {$and : [{'id' : data.users.fuser},{'fid' : data.users.user}]}
                        ]}
                    , {$set : {
                    'id' : data.users.user,
                    'name' : data.users.name,
                    'fid' : data.users.fuser,
                    'fname' : data.users.fname,
                    'msg' : data.msg
                }},(err,res) => {
                    if(err) throw err;
                });
            }
            //채팅 기록 저장
            let newChatLog = new ChatLog;
            newChatLog.id = data.users.user;
            newChatLog.name = data.users.name;
            newChatLog.fid = data.users.fuser;
            newChatLog.fname = data.users.fname;
            newChatLog.msg = data.msg;
            newChatLog.save(err => {
                if(err) throw err;
            });

        })

            io.emit('alert message',data);
            io.emit('receive message',data); // 메시지 전달
    });

});
