exports.checkLogin = function(req, res, next) {
    if (!req.session.user) {
        req.flash('error', 'not login!');
        return res.redirect('/users/login');
    }
    next();
}

exports.checkNotLogin = function(req, res, next) {
    if (req.session.user) {
        req.flash('error', 'you have login!');
        return res.redirect('back');//返回之前的页面
    }
    next();
}
//作用: 设置页面权限,--已登陆的不再访问到注册和登陆界面
//                 --未注册登陆不能访问 publish 和logout页面
//如果有indexjs 没有 exports 也能过把模块倒出来
