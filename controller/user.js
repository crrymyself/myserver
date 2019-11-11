const User = require('../modules/User');
//密码加密模块
const sha1 = require('sha1');
//格式化日期的moment模块
const moment = require('moment')
//引入token
const createToken = require('../token/createToken');
const Article = require('../modules/Article')
// import ArrayFun from '../untils/array'
const ArrayFun= require('../untils/array');
const Collection = require('../modules/Collection')



//根据token获取用户信息
const UserByToken = async ctx=>{
    let token = ctx.params.token;
    let user = await User.getUserByToken(token);
    if (user){
        ctx.status = 200;
        ctx.body={
            success:true,
            user
        }
        return
    }
    ctx.status = 400;
    ctx.body = {
        success:false
    }
}
//注册
const register = async ctx=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let email = ctx.request.body.email;
    let doc = await User.getUserByName(username);
    if (doc){
        ctx.status = 200;
        ctx.body={
            success:false,
            message:'用户名不允许重复'
        }
    }else{
        password = sha1(password)
        let date = new Date();
        let createTime = moment(date).format('YYYY-MM-DD HH:mm:ss')
        let token = createToken(username);
        let newUser = new User({
            username,
            password,
            token,
            createTime,
            email
        })
        //将新用户保存在User集合中
        let userInfo = await new Promise((resolve,reject)=>{
            newUser.save((err,doc)=>{
                if (err){
                    reject(err)
                }
                resolve(doc)
            })
        })
        ctx.status = 200;
        ctx.body={
            success:true,
            message:'注册成功',
            data:userInfo //有些网站是注册后就直接登录了，所以，这里，把用户的信息也返回了，就是为了兼容那些注册后就直接登录的网站.
        }
    }
};
//登录
const login = async ctx=>{
    let username = ctx.request.body.username;
    let password = ctx.request.body.password;
    let doc = await User.getUserByName(username);
    if (doc){
        if (doc.password == sha1(password)){
            let token = createToken(username);
            //赋值给doc新的token值
            doc.token = token
            //重新保存下该用户的信息值
            await new Promise((resolve,reject)=>{
                doc.save((err,doc)=>{
                    if (err){
                        reject(err);
                    } else {
                        resolve()
                    }
                })
            })
            ctx.status = 200;
            ctx.session.user = doc;
            ctx.body={
                success:true,
                message:'登录成功',
                token:doc.token,
                userId:doc._id
            }
        }else {
            ctx.status = 200;
            ctx.body={
                success:false,
                message:'密码错误,请重新输入'
            }
        }
    }else{
        ctx.status = 200;
        ctx.body={
            success:false,
            message:'用户名不存在'
        }
    }
};
//退出
const out = async ctx=>{
    ctx.session.user  = null;
    ctx.body={
        success:true,
        message:'退出账号成功',
        token:'',
        userId:''
    }
};
//关注作者
const guanZhu = async ctx=>{
    let userId = ctx.session.user._id;
    let star = ctx.params.authorId;
    let user = await User.getUserById(userId);
    let userStar = await User.getUserById(star);
    if (user && userStar){
        user.star.push(userStar._id);
        user.save();
        userStar.fans.push(user._id);
        userStar.save();
        ctx.state = 200;
        ctx.body={
            success:true,
            message:'关注成功',
            userStar
        }
    }else{
        ctx.state = 400;
        ctx.body={
            success:true,
            message:'服务器错误',
        }
    }

}
//取消关注作者
const UnguanZhu = async ctx=>{
    let userId = ctx.session.user._id;
    let starId = ctx.params.authorId;
    let user = await User.getUserById(userId);
    let userStar = await User.getUserById(starId);
    if (user && userStar){
        const userIndex = ArrayFun.reMoveByItem(userStar.fans, userId)
        const userStarIndex = ArrayFun.reMoveByItem(user.star,starId);
        if ((userIndex >= 0) && (userStarIndex >= 0)){
            user.star.splice(userStarIndex,1);
            user.save();
            userStar.fans.splice(userIndex,1);
            userStar.save();
            ctx.state = 200;
            ctx.body={
                success:true,
                message:'取消关注成功',
                userStar
            }
            return
        }
        ctx.state = 400;
        ctx.body={
            success:true,
            message:'服务器错误',
        }

    }else{
        ctx.state = 400;
        ctx.body={
            success:true,
            message:'服务器错误',
        }
    }
}
//关注文章
const guanzhuArticle = async ctx=>{
    let userId = ctx.session.user._id;
    let ArticleId = ctx.params.articleId;
    let user = await User.getUserById(userId);
    let ArticleStar = await Article.getArticelByID(ArticleId);
    if (user && ArticleStar){
        user.articleStar.push(ArticleStar._id);
        user.save();
        ArticleStar.articleFocus.push(user._id);
        ArticleStar.save();
        ctx.state = 200;
        ctx.body={
            success:true,
            message:'关注成功',
            ArticleStar,
        }
    }else{
        ctx.state = 400;
        ctx.body={
            success:true,
            message:'服务器错误',
        }
    }
}
//取消关注文章
const UnguanzhuArticle = async ctx=>{
    let userId = ctx.session.user._id;
    let ArticleId = ctx.params.articleId;
    let user = await User.getUserById(userId);
    let ArticleStar = await Article.getArticelByID(ArticleId);
    if (user && ArticleStar){
        const userIndex = ArrayFun.reMoveByItem(ArticleStar.articleFocus, userId)
        const ArticleIndex = ArrayFun.reMoveByItem(user.articleStar,ArticleId);
        if ((userIndex >= 0) && (ArticleIndex >= 0)){
            user.articleStar.splice(ArticleIndex,1);
            user.save();
            ArticleStar.articleFocus.splice(userIndex,1);
            ArticleStar.save();
            ctx.state = 200;
            ctx.body={
                success:true,
                message:'取消关注成功',
                ArticleStar
            }
            return
        }
        ctx.state = 400;
        ctx.body={
            success:true,
            message:'服务器错误',
        }

    }else{
        ctx.state = 400;
        ctx.body={
            success:true,
            message:'服务器错误',
        }
    }
}
//获取用户信息
const getAuthor = async ctx=>{
    let userId = ctx.params.userid;
    // console.log(userId)
    let user  =  await  User.getUserById(userId);
    let userArticles = await Article.getArticelByAuthor(userId);
    let userShoucangs = await Collection.getCollectionByAuthor(userId);
    if (!user){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'服务器错误'
        }
        return
    }
    console.log(userShoucangs)
    ctx.state = 200;
    ctx.body={
        success:true,
        message:'获取个人信息成功',
        user,
        userArticles,
        userShoucangs
    }
}
//获取个人收藏个数与关注文章个数
const getUserslider = async ctx=>{
    let token = ctx.params.token;
    let user = await User.getUserByToken(token);
    if (!user){
        ctx.state = 400;
        ctx.body={
            success:false,
            message:'服务器错误'
        }
        return
    }
    let userid = user._id;
    let shoucang = await Collection.getCollectionByAuthor(userid);
    let guanNum = user.articleStar.length;
    let shouNum = shoucang.length;
    ctx.state = 200;
    ctx.body={
        success:true,
        message:'获取用户收藏关注数目成功',
        guanNum,
        shouNum
    }

}

module.exports = {
    register,
    UserByToken,
    login,
    out,
    guanZhu,
    UnguanZhu,
    guanzhuArticle,
    UnguanzhuArticle,
    getAuthor,
    getUserslider
};