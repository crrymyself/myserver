const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content:String,
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    createTime:String,
    updateTime:String,
    article:{
        type:mongoose.Schema.ObjectId,
        ref:'article'
    }
})
commentSchema.statics = {
    getArticelByID(ID){
        return new Promise((resolve,reject)=>{
            Comment.find({article:ID}).populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getCommentByID(ID){
        return new Promise((resolve,reject)=>{
            Comment.findOne({_id:ID}).populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getCommentByAuthorId(ID){
        return new Promise((resolve,reject)=>{
            Comment.find({author:ID},(err,doc)=>{
                if (err){
                    reject(err)
                } else {
                    resolve(doc)
                }
            })
        })
    },
    deleteByArticleId:function(articleid){
        return new Promise((resolve,reject)=>{
            Comment.deleteMany({article:articleid}).exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
};
const Comment = mongoose.model('comment',commentSchema);

module.exports = Comment;