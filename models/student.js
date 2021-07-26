var mongoose = require("mongoose");

// 创建schema
var studentSchema = new mongoose.Schema({
    "sid": Number,
    "name": String,
    "grade": String,
});
var gradeArr = ['初一','初二','初三','高一','高一','高一',]

studentSchema.statics.importStudent = function(workSheets) {
    var sheetsLength = workSheets.length;
    // 先删除全表
    mongoose.connection.collection("students").drop(function() {
         // 再添加全部数据表
        for(var i = 0; i < sheetsLength; i++) {
            for(var j = 1; j < workSheets[i].data.length; j++) { // 遍历表格的每一行
                var s = new Student({
                    "sid": workSheets[i].data[j][0],
                    "name": workSheets[i].data[j][1],
                    "grade": gradeArr[i],
                })
                s.save();
            }
        }
    });
}

// 创建模型
var Student = mongoose.model("Student", studentSchema);

module.exports = Student;