var formidable =  require("formidable");
var path = require("path");
var querystring = require('querystring');//这个模块是请求丶数据转换为字符串形式
var fs = require("fs");
var xlsx = require("node-xlsx");
var Student = require("../models/student.js");
const { count } = require("../models/student.js");

exports.showAdminDashbord = function(req, res) {
    res.render("admin/index", {
        page: 'index'
    })
}

exports.showAdminStudent = function(req, res) {
    res.render("admin/students", {
        page: 'student'
    })
}

exports.adminImportStudent = function(req, res) {
    res.render("admin/student/import")
}
// 表格上传的同步接口
exports.doImportStudent = function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = "./upload";
    form.keepExtensions = true; // 文件拓展名
    form.parse(req, function(err, fields, files){
        if(!files.studenFile) {
            return;
        }
        // 检查拓展名
        if(path.extname(files.studenFile.name) !== '.xlsx'){   
            // 删除不正确的文件
            fs.unlink("./" + files.studenFile.path, function(err){
                if(err) {
                    console.log('删除文件错误');
                    return;
                }
                res.send("文件类型不正确， 请上传xlsx");
            })
            return;
        }
        // 正确的， 读取excel数据, 这个是同步的
        var workSheets = xlsx.parse("./" + files.studenFile.path);
        // 检查数组是否符合规范
        if( workSheets[0].data[0][0] !== '学号' || 
            workSheets[0].data[0][1] !== '姓名' ) {
            res.send("表头不正确");
            return;
        }

        //  写入数据库
         Student.importStudent(workSheets);
       
        console.log(2222, workSheets);
        res.send("上传成功");
    })
}

// ajax 请求数据列表； 加上分页的功能
exports.getAllStudents = function(req, res) {
    let postData='';
    req.on('data',(chunk,)=>{//意思为绑定一个data事件，这个为事件体
        //   将数据累加到容器里，// 这个事件里面就把这些小块的数据拼接起来
           postData+=chunk;
    });
    // 3.给req对象一个end事件(这个事件只会执行一 -次)
    req.on('end',()=>{
        //4利用解析这个传递过来的参数数据，形成一个对象
        let postObj=querystring.parse(postData);
        var pageIndex = postObj.pageIndex ;
        var pageLimit = postObj.pagelimit - 0; // 传过来的是字符串，需要转一下 number
        // 分页功能
        Student.count({}, function(err, count){ // count是总total number
            Student.find({}).skip(pageLimit*pageIndex).limit(pageLimit).exec(function(err, resultes){
                res.json({"data": resultes, count});
            });
        })
        
        // 这是返回全部的数据
        // Student.find({}, function(err, resultes){
        //     res.json({"data": resultes});
        // })
    })
}