const MsgModel = require('../modules/MsgModel');

const getMsg =async ctx=>{
    let receiverid = ctx.params.userid;
    let news = await MsgModel.getMsgByreceiver(receiverid);
    if (news.length === 0){
        ctx.status = 200;
        ctx.body={
            success:false,
        }
        return
    }
    ctx.status = 200;
    ctx.body={
        success:true,
        news
    }
}
const getMsgPage = async ctx=>{
    let receiverid = ctx.params.userid;
    let noRnews = await MsgModel.getMsgByreceiver(receiverid);
    let Rnews = await MsgModel.getMsgByread(receiverid);
    let allnews = await MsgModel.getMsgByAuthor(receiverid);
    ctx.status = 200;
    ctx.body={
        success:true,
        newNews:noRnews,
        oldNews:Rnews,
        allnews
    }
}
const changeMsg = async ctx=>{
    let id = ctx.params.userid;
    let msg = await MsgModel.getMsgById(id);
    if (!msg){
        ctx.status = 400;
        ctx.body={
            success:false
        }
        return
    }
    msg.isRead = true;
     await msg.save();
    let userid = ctx.session.user._id;
    let isReadNews = await MsgModel.getMsgByreceiver(userid);
    let ReadNews = await MsgModel.getMsgByread(userid);
    let allNews = await MsgModel.getMsgByAuthor(userid);
    ctx.status = 200;
    ctx.body={
        success:true,
        newNews:isReadNews,
        oldNews:ReadNews,
        allnews:allNews
    }
}


module.exports={
    getMsg,
    getMsgPage,
    changeMsg
}