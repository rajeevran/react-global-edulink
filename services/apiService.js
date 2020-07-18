'use strict';
var config = require('../config');
var async = require("async");
var mongo = require('mongodb');
var jwt = require('jsonwebtoken');
var fs = require('fs')
var ObjectID = mongo.ObjectID;

var mailProperty = require('../modules/sendMail');

var ApiModels = require('../models/api/apiModel');
var apiService = {

        //register User
        register: (data, callback) => {
            // Phone Number: (Op੎onal Filed) ● Password: (Mandatory Filed)

            if (!data.fullName || typeof data.fullName === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide fullName",
                    response: []
                });
            } else if (!data.userName || typeof data.userName === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide userName",
                    response: []
                });
            } else if (!data.email || typeof data.email === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide email",
                    response: []
                });
            } else if (!data.password || typeof data.password === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide password",
                    response: []
                });
            } else {
    
                data._id = new ObjectID;
                data.email = String(data.email).toLowerCase();
    
                ApiModels.register(data, function (result) {
                    callback(result);
                });
            }
        },

        //login 
        login: (data, callback) => {
            if (!data.email || typeof data.email === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide email address",
                    response: []
                });
            } else if (!data.password || typeof data.password === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide password",
                    response: []
                });
            } else if (!data.deviceToken || typeof data.deviceToken === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide deviceToken",
                    response: []
                });
            } else if (!data.appType || typeof data.appType === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide appType",
                    response: []
                });
            } else {
                ApiModels.login(data, function (result) {
                    callback(result);
                });
            }
        },
        
        //Forgot password
        forgotPassword: (data, callback) => {
            if (!data.email || typeof data.email === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide email address",
                    response: []
                });
            } else {

                ApiModels.forgotPassword(data, function (result) {
                    callback(result);
                });
            }
        },        

        //reset password 
        resetPassword: (data, callback) => {
            if (!data.userId || typeof data.userId === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide user id",
                    response: []
                });
            } else if (!data.newPassword || typeof data.newPassword === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "please provide password",
                    response: []
                });
            } else {
                ApiModels.resetPassword(data, function (result) {
                    callback(result);
                });
            }
        },

        //listUser
        listUser: function (data, callback) {
            console.log("data",data); 
            ApiModels.listUser(data, function (result) {
                callback(result);
            });
        },
        //Edit User
        editUser: async (data, fileData, callback) => {

                if (!data.userId || typeof data.userId === undefined) {
                        callback({
                            success: false,
                            STATUSCODE: 4004,
                            message: "Please Provide User Id",
                            response: []
                        });
                } else {

                        ApiModels.editUser(data, fileData, function (result) {
                        callback(result)
                        });
                }
        },

        //Delete User
        deleteUser: async (data, callback) => {

            if (!data.userId || typeof data.userId === undefined) {
                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide User Id",
                        response: {}
                    });
            } else {
                    ApiModels.deleteUser(data, function (result) {
                    callback(result)
                    });
            }
        },

        //list Courses
        listCourses: async (data,  callback) => {

              ApiModels.listCourses(data,  function (result) {
                    callback(result)
                    });
        },

        //detail Courses
        detailCourses: async (data,  callback) => {

            ApiModels.detailCourses(data,  function (result) {
                  callback(result)
                  });
        },

        //Delete Courses
        deleteCourses: async (data, callback) => {

            if (!data.courseId || typeof data.courseId === undefined) {
                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Courses Id",
                        response: {}
                    });
            } else {
                    ApiModels.deleteCourses(data, function (result) {
                    callback(result)
                    });
            }
        },
        
        //Delete Courses
        deleteDetailCourse: async (data, callback) => {

            if (!data.detailCourseId || typeof data.detailCourseId === undefined) {
                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Detail Course Id",
                        response: {}
                    });
            } else {
                    ApiModels.deleteDetailCourse(data, function (result) {
                    callback(result)
                    });
            }
        },

        //list Courses-Category
        listCategory: async (data,  callback) => {

            ApiModels.listCategory(data,  function (result) {
                  callback(result)
                  });
          },
        //list Courses-Sub-Category
        listSubCategory: async (data,  callback) => {

            ApiModels.listSubCategory(data,  function (result) {
                  callback(result)
                  });
         },
         
        //listTerms
        listTerms: function (data, callback) {
            console.log("data",data); 
            ApiModels.listTerms(data, function (result) {
                callback(result);
            });
        },

        //Edit Terms
        editTerms: async (data,  callback) => {
            if (!data.termId || typeof data.termId === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Please Provide Term Id",
                    response: {}
                });
            } else {
                ApiModels.editTerms(data, function (result) {
                callback(result)
                });
            }
           
        },

        
        //listPrivacyPolicy
        listPrivacyPolicy: function (data, callback) {
            console.log("data",data); 
            ApiModels.listPrivacyPolicy(data, function (result) {
                callback(result);
            });
        },

        //Edit PrivacyPolicy
        editPrivacyPolicy: (data,  callback) => {
            
            if (!data.privacyId || typeof data.privacyId === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Please Provide Privacy Id",
                    response: {}
                });
            } else {
                ApiModels.editPrivacyPolicy(data, function (result) {
                callback(result)
                });
            }

        },

        //add To Cart
        addToCart: async (data,  callback) => {
            if (!data.userId || typeof data.userId === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Please Provide User Id",
                    response: {}
                });
            }else if (!data.courseDetailId || typeof data.courseDetailId === undefined) {
                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Course Detail Id",
                        response: {}
                    });
                
            } else {
                ApiModels.addToCart(data, function (result) {
                callback(result)
                });
            }
           
        },
        
        //buy Course Detail
        buyCourseDetail: async (data,  callback) => {
            if (!data.userId || typeof data.userId === undefined) {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Please Provide User Id",
                    response: {}
                });
            }else if (!data.courseDetailId || typeof data.courseDetailId === undefined) {
                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Course Detail Id",
                        response: {}
                    });
                
            } else {
                ApiModels.buyCourseDetail(data, function (result) {
                callback(result)
                });
            }
           
        },

        addReviewService: function (data, callback) {

            if (!data.userId || typeof data.userId === undefined) {

                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide User Id",
                        response: {}
                    });

            }else if (!data.courseDetailId || typeof data.courseDetailId === undefined) {

                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Course Detail Id",
                        response: {}
                    });
                
            }else if (!data.title || typeof data.title === undefined) {

                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Title",
                        response: {}
                    });
        
            }else if (!data.rating || typeof data.rating === undefined) {

                    callback({
                        success: false,
                        STATUSCODE: 4004,
                        message: "Please Provide Rating",
                        response: {}
                    });
            
            } else {
                    data._id = new ObjectID;

                    ApiModels.addReviewModel(data, function (res) {
                        callback(res);
                    })
            }
           
        },
    
        listReviewService: function (data, callback) {
                    ApiModels.listReviewModel(data, function (res) {
                        callback(res);
                    })
        }      

};
module.exports = apiService;