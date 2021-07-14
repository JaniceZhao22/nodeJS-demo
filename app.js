// 创建express
var express = reuqire("express");
var app = express();

// 模版引擎
app.set("view engine", 'ejs');

// 中间件， 路由清单
app.get("/", function(req, res){
    res.send("")
})

// 静态资源
app.use(express.static("public"))

// 设置一个404
app.use(function(req, res){
    res.send("页面不存在");
})