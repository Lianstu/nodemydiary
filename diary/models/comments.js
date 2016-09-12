/**
 * Created by lian on 16/9/12.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var Commentschema = new Schema({
    user:{type:ObjectId,ref:'User'},
    content:String,
    createAt:{type: Date, default: Date.now}
})
Commentschema.methods={
    //定义方法
}
var Comment = mongoose.model('Comment', Commentschema);

module.exports = Comment;