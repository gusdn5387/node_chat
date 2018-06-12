const User = require('./UserModel');
const Friend = require('./FriendModel');

let loadList = {
    getFriendList : (id) => {
        Friend.find({'id' : id}, (err,user) => {
            if(err) throw err;
            return user;
        });
    },
    getAddFriendList : (id) => {
        let friends = null;
        let addList = null;
        
        Friend.find({'id' : id}, (err,user) => {
            if(err) throw err;
            friends = user;
        });

        let key = [];
        if(friends != undefined){
            friends.forEach( friend => {
                key.push({'id' : friend.id});
            });

            User.find({$nor : key}, (err, user) => {
                if(err) throw err;
                addList = user;
            });
            return addList;
        }
        else{
            User.find({'id' : {$ne : id} }, (err, user) => {
                if(err) throw err;;
                addList = user;
            })
            return addList;
        }
    }
}
module.exports = loadList;
