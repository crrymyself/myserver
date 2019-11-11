const jwt = require('jsonwebtoken');
module.exports=function (user_id) {
    const token = jwt.sign({
        user_id:user_id  //使用用户名字符串作为token的凭证
    },'secret',{
        expiresIn:'60s'
    })
    return token;
}