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



io.on('connection',(socket) => {
    console.log(socket.id);
    socket.on('send message', (users,msg) => {
        console.log(users.fuser);
        io.emit('alert message',msg);
    });
});
