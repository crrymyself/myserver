const mongoose = require('mongoose');

const commentSecondSchema = new mongoose.Schema({
    content:String,
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    createTime:String,
    updateTime:String,
    comment:{
        type:mongoose.Schema.ObjectId,
        ref:'comment'
    },
    article:{
        type:mongoose.Schema.ObjectId,
        ref:'article'
    }
})
commentSecondSchema.statics = {
    getCommentByID(ID){
        return new Promise((resolve,reject)=>{
            CommentSecond.find({comment:ID}).populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    deleteByArticleId:function(articleid){
        return new Promise((resolve,reject)=>{
            CommentSecond.deleteMany({article:articleid}).exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
};
const CommentSecond = mongoose.model('commentSecond',commentSecondSchema);

module.exports = CommentSecond;