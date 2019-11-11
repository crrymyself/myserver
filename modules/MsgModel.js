

const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    receiver:{
        type:mongoose.Schema.ObjectId,
        ref:'user'
    },
    article:{
        type:mongoose.Schema.ObjectId,
        ref:'article'
    },
    isRead: Boolean,
    createTime:String,
});
msgSchema.statics = {
    getMsgByreceiver(receiverId){
        return new Promise((resolve,reject)=>{
            MsgModel.find({receiver:receiverId,isRead:false}).populate('article').populate('sender').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getMsgByread(receiverId){
        return new Promise((resolve,reject)=>{
            MsgModel.find({receiver:receiverId,isRead:true}).populate('article').populate('sender').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getMsgByAuthor(receiverId){
        return new Promise((resolve,reject)=>{
            MsgModel.find({receiver:receiverId}).populate('article').populate('sender').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
    getMsgById(Id){
        return new Promise((resolve,reject)=>{
            MsgModel.findOne({_id:Id}).populate('article').populate('sender').exec((err,doc)=>{
                if (err){
                    reject(err)
                } else{
                    resolve(doc)
                }
            })
        })
    },
};
const MsgModel = mongoose.model('msg',msgSchema);

module.exports = MsgModel;