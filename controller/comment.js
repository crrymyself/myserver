const Comment = require('../modules/Comment');
const moment = require('moment');
const User = require('../modules/User');
const Article = require('../modules/Article');
const Msg = require('../modules/MsgModel')
const mongoose = require('mongoose')

const pingLun=async ctx=>{
    let date = new Date();
    ctx.request.body.createTime=moment(date).format('YYYY-MM-DD HH:mm:ss');
    ctx.request.body.updateTime=moment(date).format('YYYY-MM-DD HH:mm:ss');
    ctx.request.body.author = ctx.session.user._id;
    ctx.request.body.article =  ctx.params.articleid;
    ctx.request.body.content = ctx.request.body.content1;
    let username = ctx.session.user.username;
    let newComment= new Comment(ctx.request.body);
    let articleId = ctx.params.articleid;
    let article = await  Article.getArticelByID(articleId);
    if (!article){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'该文章不存在'
        }
        return
    }
    let user = await User.getUserByName(username);
    if (!user){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'该用户信息不存在'
        }
        return
    }
    let CommentInfo = await new Promise((resolve,reject)=>{
        newComment.save((err,doc)=>{
            if (err){
                reject(err)
            }
            resolve(doc)
        })
    });

    let msg={
        sender:ctx.session.user._id,
        receiver:article.author._id,
        article:article._id,
        isRead:false,
        createTime:moment(date).format('YYYY-MM-DD HH:mm:ss')
    }
    let newMsg= new Msg(msg);
    let MsgInfo = await new Promise((resolve,reject)=>{
        newMsg.save((err,doc)=>{
            if (err){
                reject(err)
            }
            resolve(doc)
        })
    });
    article.comments.push(CommentInfo._id);
    article.save();
    let comments = await Comment.getArticelByID(articleId);
    ctx.state = 200;
    ctx.body={
        success:true,
        message:'评论成功',
        article,
        comments
    }
}





module.exports = {
    pingLun
};