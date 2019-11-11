const CommentSecond = require('../modules/CommentSecond');
const moment = require('moment');
const User = require('../modules/User');
const Comment = require('../modules/Comment');
const mongoose = require('mongoose')

const pingLunSecond=async ctx=>{
    let date = new Date();
    ctx.request.body.createTime=moment(date).format('YYYY-MM-DD HH:mm:ss');
    ctx.request.body.updateTime=moment(date).format('YYYY-MM-DD HH:mm:ss');
    ctx.request.body.author = ctx.session.user._id;
    ctx.request.body.comment =  ctx.params.commentid;
    let commentId = ctx.params.commentid;
    let comment = await  Comment.getCommentByID(commentId);
    let username = ctx.session.user.username;
    if (!comment){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'该评论不存在'
        }
        return
    }
    ctx.request.body.article = comment.article;
    let user = await User.getUserByName(username);
    if (!user){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'该用户信息不存在'
        }
        return
    }
    let newCommentSecond= new CommentSecond(ctx.request.body);
    let CommentSecondInfo = await new Promise((resolve,reject)=>{
        newCommentSecond.save((err,doc)=>{
            if (err){
                reject(err)
            }
            resolve(doc)
        })
    })
    let comments = await  CommentSecond.getCommentByID(commentId)
    ctx.state = 200;
    ctx.body={
        success:true,
        message:'二级评论成功',
        comments
    }
}
const pingLuns=async ctx=>{
    let commentId = ctx.params.commentid;
    let comments = await  CommentSecond.getCommentByID(commentId);
    let comment = await  Comment.getCommentByID(commentId);
    if (!comment){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'该评论不存在'
        }
        return
    }
    ctx.state = 200;
    ctx.body={
        success:true,
        message:'获取二级评论成功',
        comments
    }
}





module.exports = {
    pingLunSecond,
    pingLuns
};