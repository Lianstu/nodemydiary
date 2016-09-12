/**
 * Created by lian on 16/9/12.
 */
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var Pvschema = new Schema({
    pv:{type:Number,default:0}
})
Pvschema.methods={
    //定义方法
}
var Pv = mongoose.model('Pv', Pvschema);

module.exports = Pv;