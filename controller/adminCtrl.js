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