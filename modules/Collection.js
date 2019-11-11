const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
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
});
collectionSchema.statics = {
    getCollectionByAuthor(authorId){
        return new Promise((resolve,reject)=>{
            Collection.find({author:authorId}).populate('author').populate('article').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    deletCollectionById(id){
        return new Promise((resolve,reject)=>{
            Collection.deleteOne({_id:id}).exec((err,doc)=>{
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
            Collection.deleteMany({article:articleid}).exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
};
const Collection = mongoose.model('collection',collectionSchema);

module.exports = Collection;