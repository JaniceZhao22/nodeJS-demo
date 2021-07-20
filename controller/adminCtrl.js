var formidable =  require("formidable");
var path = require("path");
var fs = require("fs");
var xlsx = require("node-xlsx");
var Student = require("../models/student.js")

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