/**
 * Created by lian on 16/9/8.
 */
var mongoose = require("mongoose")
var user = require("../models/user")
var article = require("../models/article")
//var comment = require("../models/comments")
//var pv = require("../models/pv")
var datasourceconfig = require('./production.config');
mongoose.connect(datasourceconfig.url); //链接数据库
console.log("mongoose connection");
global.Model = function (type) {
    return mongoose.model(type);
}