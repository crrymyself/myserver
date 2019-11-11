const nodemailer = require('nodemailer');
// const zhuce = require('../public/zhuce.png');

const sendeEail = async ctx=>{
    if(ctx.query[0]){
        let num = ctx.query[0];
        console.log(num)
        let verifyNum = '';
        for(i=0;i<6;i++){
            verifyNum += Math.floor(Math.random()*10);
        }
        let transporter = nodemailer.createTransport({
          host: 'smtp.126.com',
          port: 465,
          secure: true, // 如果是 true 则port填写465, 如果 false 则可以填写其它端口号
          auth: {
              user: "qaz1101102007@126.com", // 发件人邮箱
              pass: "wsyb110qaz" // 发件人密码(用自己的...)
          }
        });
        let mailOptions = {
            from:'qaz1101102007@126.com',
            to:num,
            cc: 'qaz1101102007@126.com',
            subject: '一封来自Node Mailer的邮件',
            text: '一封来自Node Mailer的邮件',
            html: '<h1>你好，这是一封来自NodeMailer的邮件！</h1><p>验证码是:'+verifyNum+'</p>',
            // attachments : 
            // [
            //     {
            //         filename: 'img1.png',            // 改成你的附件名
            //         path: '../public/zhuce.png',  // 改成你的附件路径
            //         cid : '00000001'                 // cid可被邮件使用
            //     },
            // ]
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
        });
        console.log(verifyNum)
        ctx.body={
            success:true,
            message:'发送邮件成功',
            verifyNum
        }
    }
}

module.exports = {
    sendeEail
};
