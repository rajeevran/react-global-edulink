'use strict';
var express = require("express");
var adminService = require('../services/adminService');

var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var config = require('../config');
var secretKey = config.secretKey;

var admin = express.Router();
admin.use(bodyParser.json());
admin.use(bodyParser.urlencoded({
    extended: false
}));

admin.post('/adminSignup', function (req, res) {
    var adminData = req.body;
    adminService.adminSignup(adminData, function (response) {
        res.send(response);
    });
});
admin.post('/adminLogin', function (req, res) {
    var adminData = req.body;
    adminService.adminLogin(adminData, function (response) {
        res.send(response);
    });
});
admin.post('/adminForgotPassword', function (req, res) {
    var adminData = req.body;
    adminService.adminForgotPassword(adminData, function (response) {
        res.send(response);
    });
});

/******************************
 *  Middleware to check token
 ******************************/
admin.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.send({
                    success: false,
                    STATUSCODE: 4000,
                    message: "Session timeout! Please login again.",
                    response: err
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            success: false,
            error: true,
            message: "Please provide token",
            response: []
        });
    }
});
/******************************
 *  Middleware to check token
 ******************************/

admin.get('/listAdmin', function (req, res) {

    adminService.listAdmin(req.query, function (response) {
        res.send(response);
    });
});

admin.post('/addAdmin', function (req, res) {
    adminService.addAdmin( req.body, req.files, function (response) {
        res.send(response);
    });
});

admin.post('/editAdmin', function (req, res) {
    adminService.editAdmin( req.body, req.files, function (response) {
        res.send(response);
    });
});

// Delete Admin
admin.post('/deleteAdmin', function (req, res) {
    adminService.deleteAdmin(req.body, function (result) {
        res.send(result);
    });
});


admin.post('/addUser', function (req, res) {
    adminService.addUser( req.body, req.files, function (response) {
        res.send(response);
    });
});

admin.post('/changePassword', function (req, res) {
    adminService.changePassword(req.body, function (response) {
        res.send(response);
    });
});

//list Courses
admin.get('/listCourses', function (req, res) {
    adminService.listCourses(req.query, function (response) {
        res.send(response);
    });
});

//add Courses
admin.post('/addCourse', function (req, res) {
    adminService.addCourses( req.body, req.files, function (response) {
        res.send(response);
    });
});

//edit Courses
admin.post('/editCourse', function (req, res) {
    adminService.editCourses( req.body, req.files, function (response) {
        res.send(response);
    });
});

//list Courses-Category
admin.get('/listCategory', function (req, res) {
    adminService.listCategory(req.query, function (response) {
        res.send(response);
    });
});


//add Category
admin.post('/addCategory', function (req, res) {
    adminService.addCategory( req.body, function (response) {
        res.send(response);
    });
});

//edit Category
admin.post('/editCategory', function (req, res) {
    adminService.editCategory( req.body, function (response) {
        res.send(response);
    });
});


//list Courses-Sub-Category
admin.get('/listSubCategory', function (req, res) {
    adminService.listSubCategory(req.query, function (response) {
        res.send(response);
    });
});


//add SubCategory
admin.post('/addSubCategory', function (req, res) {
    adminService.addSubCategory( req.body, function (response) {
        res.send(response);
    });
});

//edit SubCategory
admin.post('/editSubCategory', function (req, res) {
    adminService.editSubCategory( req.body, function (response) {
        res.send(response);
    });
});

//list Course Detail
admin.get('/listCourseDetail', function (req, res) {
    adminService.listCourseDetail(req.query, function (response) {
        res.send(response);
    });
});


//add Detail Course
admin.post('/addDetailCourse', function (req, res) {
    adminService.addDetailCourse( req.body, req.files, function (response) {
        res.send(response);
    });
});

//edit DetailCourse
admin.post('/editDetailCourse', function (req, res) {
    adminService.editDetailCourse( req.body, req.files, function (response) {
        res.send(response);
    });
});

//Admin Notification List
admin.get('/admin-notification-list', function (req, res) {
    adminService.listAdminNotification(req.query, function (result) {
        res.send(result);
    })
});

module.exports = admin;