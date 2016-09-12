//用于测试时的环境
module.exports = {
    cookieSecret:'diarykey', //用于 Cookie 加密与数据库无关
    url:"mongodb://localhost:27017/diary",
    db:"diary",
    port:27017,
    host:"localhost"
}