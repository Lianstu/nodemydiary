/**
 * Created by lian on 16/9/6.
 */
//var mongoose = require('mongoose'),
//    Schema = mongoose.Schema,
//    models = require('./models');
//
//var datasourceconfig = require('../config/production.config.js');
//mongoose.connect(datasourceconfig.url); //链接数据库
//
//mongoose.model('User', new Schema({
//    username:{type:String,required:true},//用户名
//    password:{type:String,required:true},//密码
//    email:{type:String,required:true},//邮箱
//    avatar:{type:String,required:true}//个性化头像
//}));
//
//global.Model = function (modelName) {
//    return mongoose.model(modelName);
//}
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var Userschema = new Schema({
    id:ObjectId,
    username:{type:String,required:true},//用户名
    password:{type:String,required:true},//密码
    email:{type:String,required:true},//邮箱
    avatar:{type:String,required:true}//个性化头像
})
Userschema.methods={
    //定义方法
}
var User = mongoose.model('User', Userschema);
module.exports = User;