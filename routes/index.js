const Router = require('koa-router');
const UserController = require('../controller/user');
const ArticleController = require('../controller/article')
const CommentController = require('../controller/comment');
const CommentSecondController = require('../controller/commentSecond')
const EmailController = require('../controller/sendEmail')
const MsgController = require('../controller/msg')
const subRouter = new Router();
//获取验证码
subRouter.get('/zhuce/getNum',EmailController.sendeEail);
//注册用户信息
subRouter.post('/user/zhuce',UserController.register);
//登录用户信息
subRouter.post('/user/login',UserController.login);
//用户退出
subRouter.post('/user/out',UserController.out);
//发布文章
subRouter.post('/article/fabu',ArticleController.fabu);
//修改文章
subRouter.post('/article/:id/update',ArticleController.UpDateArticle);
//删除文章
subRouter.post('/article/:id/delete',ArticleController.DeleteArticle);
//收藏文章
subRouter.get('/article/:id/shoucang',ArticleController.shouCang);
//取消收藏文章
subRouter.get('/article/:id/noshoucang',ArticleController.UnshouCang);
//获取所有文章信息
subRouter.get('/getDate',ArticleController.getArticles);
//获取文章详情页
subRouter.get('/article/:id',ArticleController.getArticle);
//文章一级评论
subRouter.post('/article/:articleid/comment',CommentController.pingLun);
//文章二级评论
subRouter.post('/comment/:commentid/commentsecond',CommentSecondController.pingLunSecond);
//获取文章二级评论
subRouter.get('/comment/:commentid/comments',CommentSecondController.pingLuns);
//点赞文章信息
subRouter.get('/article/:id/zanup',ArticleController.zanUpArticle);
//取消赞文章信息
subRouter.get('/article/:id/noup',ArticleController.noUpArticle);
//点灭文章信息
subRouter.get('/article/:id/zandown',ArticleController.zanDownArticle);
//取消灭文章信息
subRouter.get('/article/:id/nodown',ArticleController.noDownArticle);
//判断是否点赞点灭
subRouter.get('/article/:id/isdownUp',ArticleController.isDownUpArticle);
//关注用户
subRouter.get('/user/:authorId/guanzhu',UserController.guanZhu);
//取消关注用户信息
subRouter.get('/user/:authorId/unguanzhu',UserController.UnguanZhu);
//关注文章信息
subRouter.get('/user/:articleId/article',UserController.guanzhuArticle);
//取消关注文章信息
subRouter.get('/user/:articleId/article/cancle',UserController.UnguanzhuArticle);
//获取作者信息
subRouter.get('/author/:userid',UserController.getAuthor);
//获取侧边栏用户收藏关注书面
subRouter.get('/userslider/:token',UserController.getUserslider);
//获取搜索内容
subRouter.get('/search/:title',ArticleController.SearchArticle);
//获取消息提醒
subRouter.get('/msg/:userid',MsgController.getMsg);
//消息页面获取具体消息
subRouter.get('/msg/:userid/page',MsgController.getMsgPage);
//消息改为已读
subRouter.post('/msg/:userid/change',MsgController.changeMsg);


module.exports = subRouter;

///userToken/