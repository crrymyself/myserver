const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const MongooseStore = require('koa-session-mongoose');
const session = require('koa-session');
const auth = require('./controller/auth')

const  app = new Koa();
app.keys = ['secret']
const  router = new Router();


// const Users = require('./libs/Users');
const db = require('./modules/db');
const subRouter = require('./routes/index')

let init = async (uri) => {
    const connect = await mongoose.connect(uri);
    app.use(session({
        store: new MongooseStore({
            collection: 'ss_ctx', //session
            connection: connect,
            expires: 86400, // 1 day is the default
            name: 'AppSession'
        })
    }, app));

    router.get('/checkLogin',auth.authUser)
    router.use(subRouter.routes(),subRouter.allowedMethods())

    app.use(bodyParser());
    app.use(router.routes());
    app.use(router.allowedMethods());
    app.listen(3100,()=>{
        console.log('react登录注册运行')
    })
}
init('mongodb://0.0.0.0:27017/session');


