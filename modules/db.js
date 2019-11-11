const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/session');

var db = mongoose.connection;

db.once('open',(err)=>{
    if (err){
        console.log('数据库开启失败')
    }
    else{
        console.log('数据库开启成功')
    }
})

module.exports = db;