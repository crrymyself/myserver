const auth = {
    authUser:(ctx,next)=>{
        if (ctx.session.user){
            ctx.body={
                code:0,
                msg:'已登录'
            };
            next()
        } else{
            ctx.body={
                code:1,
                msg:'未登陆'
            }
        }
    }
}
module.exports=auth;