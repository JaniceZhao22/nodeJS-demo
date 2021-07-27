// 创建express
var express = require("express");
var mongoose = require("mongoose");
var session = require("express-session");

var adminCtrl = require('./controller/adminCtrl.js');
// 创建app
var app = express();

// 链接数据库 /electiveCourse 为数据库的名字
mongoose.connect("mongodb://localhost/electiveCourse")

// 使用session
app.use(session({
    secret: 'kaola',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: true
}))


// 模版引擎
app.set('view engine', 'ejs');

// 中间件， 路由清单 都是页面
app.get("/", adminCtrl.showAdminDashbord);
app.get("/admin", adminCtrl.showAdminDashbord);
app.get("/admin/student", adminCtrl.showAdminStudent);
app.get("/admin/students/import", adminCtrl.adminImportStudent);
app.post("/admin/students/import", adminCtrl.doImportStudent);
app.get("/admin/course", adminCtrl.showAdminStudent);
app.get("/admin/report", adminCtrl.showAdminStudent); 



//ajax接口
app.post("/studentsList", adminCtrl.getAllStudents); 


// 静态资源
app.use(express.static("public"))

// 设置一个404
app.use(function(req, res){
    res.send("页面不存在");
})

app.listen(3000);
console.log("start run at port 3000");