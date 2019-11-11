const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    createTime:String,
    token:String,
    email:String,
    fans:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'user'
        }
    ],
    zan:Array,
    mie:Array,
    star:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'user'
        }
    ],
    articleStar:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'article'
        }
    ]
});
userSchema.statics = {
    getUserByName:function(username){
        return new Promise((resolve,reject)=>{
            User.findOne({username},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        })
    },
    getUserByToken:function(token){
        return new Promise((resolve,reject)=>{
            User.findOne({token:token},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        })
    },
    getUserById:function(Id){
        return new Promise((resolve,reject)=>{
            User.findOne({_id:Id},(err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        })
    },
    getAllUser:function(){
        return new Promise((resolve,reject)=>{
            User.find((err,doc)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(doc)
                }
            })
        })
    }
};

const User = mongoose.model('user',userSchema);

module.exports = User;