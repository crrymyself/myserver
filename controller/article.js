const Article = require("../modules/Article");
const moment = require("moment");
const Comment = require("../modules/Comment");
const User = require("../modules/User");
const ArrayFun = require("../untils/array");
const Collection = require("../modules/Collection");
const CommentSecond = require("../modules/CommentSecond");

//发布文章
const fabu = async ctx => {
  let date = new Date();
  ctx.request.body.author = ctx.session.user._id;
  ctx.request.body.createTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
  ctx.request.body.updateTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
  ctx.request.body.tags = [
    ctx.request.body.tag1,
    ctx.request.body.tag2,
    ctx.request.body.tag3
  ];
  let newArticle = new Article(ctx.request.body);
  let ArticleInfo = await new Promise((resolve, reject) => {
    newArticle.save((err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
  let articles = await Article.getAllArticles();
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "发布文章成功",
    articles: articles
  };
};
//收藏文章
const shouCang = async ctx => {
  let date = new Date();
  ctx.request.body.author = ctx.session.user._id;
  ctx.request.body.createTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
  ctx.request.body.updateTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
  ctx.request.body.article = ctx.params.id;
  let newCollection = new Collection(ctx.request.body);
  let CollectionInfo = await new Promise((resolve, reject) => {
    newCollection.save((err, doc) => {
      if (err) {
        reject(err);
      }
      resolve(doc);
    });
  });
  let collectionId = CollectionInfo._id;
  console.log(CollectionInfo);
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "收藏成功",
    collection: collectionId
  };
};
//取消收藏文章
const UnshouCang = async ctx => {
  let collectionid = ctx.params.id;
  let delet = Collection.deletCollectionById(collectionid);
  if (!delet) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "取消收藏失败"
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "取消收藏成功",
      collection: ""
    };
  }
};
//获取所有文章信息
const getArticles = async ctx => {
  let doc = await Article.getAllArticles();
  ctx.body = {
    success: true,
    message: "获取文章成功",
    data: doc
  };
};
//获取文章详情
const getArticle = async ctx => {
  let comMan = ctx.session.user ? ctx.session.user.username : "";
  let Id = ctx.params.id;
  let doc = await Article.getArticelByID(Id);
  if (!doc) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "服务器错误"
    };
    return;
  }
  let comments = await Comment.getArticelByID(Id);
  if (!comments) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "获取评论失败"
    };
  }
  let articleByAuthor = await Article.getArticelByAuthor(doc.author);
  let commentByAuthor = await Comment.getCommentByAuthorId(doc.author);
  let isguanAuthor = false;
  let isguanArticle = false;
  if (ctx.session.user) {
    let userId = ctx.session.user._id;
    let user = await User.getUserById(userId);

    let userAuthorStar = user.star;
    let AuthorId = doc.author;
    let starIndex = ArrayFun.isBol(userAuthorStar, AuthorId._id);
    if (starIndex) {
      isguanAuthor = false;
    } else {
      isguanAuthor = true;
    }
    let userArticleStar = user.articleStar;
    let ArticleStarIndex = ArrayFun.isBol(userArticleStar, Id);

    if (ArticleStarIndex) {
      isguanArticle = false;
    } else {
      isguanArticle = true;
    }
  }

  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "获取文章信息成功",
    data: doc,
    comMan: comMan,
    comments,
    articleByAuthor,
    commentByAuthor,
    isguanArticle,
    isguanAuthor
  };
};
//赞文章
const zanUpArticle = async ctx => {
  let ArticleId = ctx.params.id;
  let userId = ctx.session.user._id;
  let article = await Article.getArticelByID(ArticleId);
  let user = await User.getUserById(userId);
  if (article) {
    article.up = article.up + 1;
    user.zan.push(article);
    user.save();
    article.save();
    ctx.state = 200;
    ctx.body = {
      success: true,
      message: "已赞",
      article
    };
  } else {
    ctx.state = 400;
    ctx.body = {
      success: true,
      message: "服务器错误"
    };
  }
};
//取消赞文章
const noUpArticle = async ctx => {
  let ArticleId = ctx.params.id;
  let userId = ctx.session.user._id;
  let article = await Article.getArticelByID(ArticleId);
  let user = await User.getUserById(userId);
  if (article) {
    article.up = article.up - 1;
    article.save();
    let articleIndex = ArrayFun.arryByMongoId(user.zan, ArticleId);
    user.zan.splice(articleIndex, 1);
    user.save();
    ctx.state = 200;
    ctx.body = {
      success: true,
      message: "取消赞",
      article
    };
  } else {
    ctx.state = 400;
    ctx.body = {
      success: true,
      message: "服务器错误"
    };
  }
};
//点灭文章
const zanDownArticle = async ctx => {
  let ArticleId = ctx.params.id;
  let userId = ctx.session.user._id;
  let article = await Article.getArticelByID(ArticleId);
  let user = await User.getUserById(userId);
  if (article) {
    article.down = article.down + 1;
    article.save();
    user.mie.push(article);
    user.save();
    ctx.state = 200;
    ctx.body = {
      success: true,
      message: "点灭成功",
      article
    };
  } else {
    ctx.state = 400;
    ctx.body = {
      success: true,
      message: "服务器错误"
    };
  }
};
//取消灭
const noDownArticle = async ctx => {
  let ArticleId = ctx.params.id;
  let userId = ctx.session.user._id;
  let article = await Article.getArticelByID(ArticleId);
  let user = await User.getUserById(userId);
  if (article) {
    article.down = article.down - 1;
    article.save();
    let articleIndex = ArrayFun.arryByMongoId(user.mie, ArticleId);
    user.mie.splice(articleIndex, 1);
    user.save();
    ctx.state = 200;
    ctx.body = {
      success: true,
      message: "取消点灭",
      article
    };
  } else {
    ctx.state = 400;
    ctx.body = {
      success: true,
      message: "服务器错误"
    };
  }
};
//判断是否点赞点灭
const isDownUpArticle = async ctx => {
  let ArticleId = ctx.params.id;
  let userId = ctx.session.user._id;
  let user = await User.getUserById(userId);
  let userCollection = await Collection.getCollectionByAuthor(userId);
  if (user) {
    let isZan = ArrayFun.isBolarryByMongoId(user.zan, ArticleId);
    let isMie = ArrayFun.isBolarryByMongoId(user.mie, ArticleId);
    let isShou = ArrayFun.isBolarryByArticleId(userCollection, ArticleId);
    let CollectionIndex = ArrayFun.arryByArticleId(userCollection, ArticleId);
    let collection = userCollection[CollectionIndex];
    // console.log(collection)
    if (isShou) {
      let id = collection._id;
      ctx.state = 200;
      ctx.body = {
        success: true,
        message: "获取是否点赞成功",
        isZan,
        isMie,
        isShou,
        collection: id
      };
    } else {
      ctx.state = 200;
      ctx.body = {
        success: true,
        message: "获取是否点赞成功",
        isZan,
        isMie,
        isShou,
        collection: ""
      };
    }
  } else {
    ctx.state = 400;
    ctx.body = {
      success: true,
      message: "服务器错误"
    };
  }
};
//修改文章
const UpDateArticle = async ctx => {
  let date = new Date();
  let articleId = ctx.params.id;
  ctx.request.body.updateTime = moment(date).format("YYYY-MM-DD HH:mm:ss");
  ctx.request.body.tags = [
    ctx.request.body.tag1,
    ctx.request.body.tag2,
    ctx.request.body.tag3
  ];
  let lastArticle = await Article.getArticelByID(articleId);
  if (!lastArticle) {
    ctx.status = 200;
    ctx.body = {
      success: false,
      message: "文章不存在"
    };
    return;
  }
  let content = ctx.request.body;
  let doc = await Article.updateArticle(articleId, content);
  if (!doc) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      message: "系统错误"
    };
    return;
  }
  let newArticle = await Article.getArticelByID(articleId);
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "文章修改成功",
    article: newArticle
  };
};
//删除文章
const DeleteArticle = async ctx => {
  let articleId = ctx.params.id;
  let article = await Article.getArticelByID(articleId);
  if (!article) {
    ctx.status = 200;
    ctx.body = {
      success: false,
      message: "文章不存在"
    };
    return;
  }
  //删除文章
  let deletarticle = await Article.deleteByArticleId(articleId);
  //删除评论
  let comments = await Comment.deleteByArticleId(articleId);
  //删除二级评论
  let commentSecond = await CommentSecond.deleteByArticleId(articleId);
  //删除收藏
  let collections = await Collection.deleteByArticleId(articleId);
  //删除关注该文章的用户的关注文章里关于该文章信息
  let articleFocuss = article.articleFocus;
  for (var i = 0; i < articleFocuss.length; i++) {
    let articleFans = await User.getUserById(articleFocuss[i]);
    let fansStar = articleFans.articleStar;
    let articleindex = ArrayFun.reMoveByItem(fansStar, articleId);
    fansStar.splice(articleindex, 1);
    articleFans.save();
  }
  //删除点赞该文章的用户的关注文章里关于该文章信息
  let allUser = await User.getAllUser();
  for (var j = 0; j < allUser.length; j++) {
    let user = allUser[j];
    let userZan = user.zan;
    let userMie = user.mie;
    let index = ArrayFun.arryByMongoId2(userZan, articleId);
    let mieindex = ArrayFun.arryByMongoId2(userMie, articleId);
    if (index >= 0) {
      userZan.splice(index, 1);
    }
    if (mieindex >= 0) {
      userMie.splice(mieindex, 1);
    }
    user.save();
  }
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "文章删除成功"
  };
};
//搜索文章
const SearchArticle = async ctx => {
  let title = ctx.params.title;
  let articles = await Article.getArticelsByregexTitle(title);
  if (articles.length === 0) {
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "没有相关信息"
    };
    return;
  }
  ctx.status = 200;
  ctx.body = {
    success: true,
    message: "搜索结果如下",
    articles
  };
};
module.exports = {
  fabu,
  getArticles,
  getArticle,
  zanUpArticle,
  noUpArticle,
  zanDownArticle,
  noDownArticle,
  isDownUpArticle,
  shouCang,
  UnshouCang,
  UpDateArticle,
  DeleteArticle,
  SearchArticle
};
