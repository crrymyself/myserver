const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title:String,
    content:String,
    author:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    createTime:String,
    updateTime:String,
    readCount:{
        type:Number,
        default:0
    },
    comments:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'comment'
        }
    ],
    articleFocus:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'user'
        }
    ],
    up:{
        type:Number,
        default:0
    },
    down:{
        type:Number,
        default:0
    },
    redu:{
        type:Number,
        default:0
    },
    tags:Array
});
articleSchema.statics = {
    getAllArticles:function(){
        return new Promise((resolve,reject)=>{
            Article.find().populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    updateArticle:function(articleid,content){
        return new Promise((resolve,reject)=>{
            Article.updateOne({_id:articleid},content).exec((err,doc)=>{
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
            Article.deleteOne({_id:articleid}).exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getArticelByID(ID){
        return new Promise((resolve,reject)=>{
            Article.findOne({_id:ID}).populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getArticelByAuthor(authorId){
        return new Promise((resolve,reject)=>{
            Article.find({author:authorId}).populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getArticelsByregexTitle(title){
        return new Promise((resolve,reject)=>{
            Article.find({title:{$regex:title}}).populate('author').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
};

const Article = mongoose.model('article',articleSchema);

module.exports = Article;