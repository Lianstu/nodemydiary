/**
 * Created by lian on 16/9/6.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var Articleschema = new Schema({
    user:{type:ObjectId,ref:'User'}, //用户
    title: String, //标题
    content: String,// 内容
    createAt:{type: Date, default: Date.now()} ,//创建时间
    pv: {type:Number,default:0},
    comments: [{user:{type:ObjectId,ref:'User'},content:String,createAt:{type: Date, default: Date.now}}],
    createAt:{type: Date, default: Date.now}
})
Articleschema.methods={
    //定义方法
}
var Article = mongoose.model('Article', Articleschema);

module.exports = Article;

