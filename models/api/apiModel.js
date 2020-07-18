
var UserSchema = require('../../schema/api/users');
var CourseSchema = require('../../schema/api/course');
var CourseDetailSchema = require('../../schema/api/coursedetail');
var CategorySchema = require('../../schema/api/category');
var SubCategorySchema = require('../../schema/api/subcategory');
var TermsSchema = require('../../schema/api/terms');
var PrivacySchema = require('../../schema/api/privacy');
var ReviewSchema = require('../../schema/api/review');
var CourseDetailProgressSchema = require('../../schema/api/coursedetailprogress');

var config = require('../../config');
var async = require("async");
var bcrypt = require('bcrypt-nodejs');
var mailProperty = require('../../modules/sendMail');

var jwt = require('jsonwebtoken');
var fs = require('fs');

var mongoose = require('mongoose');

var ObjectID = mongoose.Types.ObjectId;
var secretKey = config.secretKey;

//create auth token
createToken = (admin) => {
    var tokenData = {
        id: admin._id
    };
    var token = jwt.sign(tokenData, secretKey, {
        expiresIn: 86400
    });
    return token;
};

var apiModel = {

    authenticate: function (jwtData, callback) {
        if (jwtData["x-access-token"]) {
            jwt.verify(jwtData["x-access-token"], config.secretKey, function (err, decoded) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 4200,
                        message: "Session timeout! Please login again.",
                        response: err
                    });
                } else {
                    callback({
                        success: true,
                        STATUSCODE: 2000,
                        message: "Authenticate successfully.",
                        response: decoded
                    });
                }
            });
        }
    },

    //register employee
    register: function (data, callback) {
        if (data) {
            UserSchema.findOne({
                    email: data.email
                }, {
                    _id: 1,
                    email: 1,
                },
                function (err, result) {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: []
                        });
                    } else {
                        if (result !== null) {
                            callback({
                                success: false,
                                STATUSCODE: 4004,
                                message: "Email address already exist",
                                response: result
                            });
                        } else {

                            new UserSchema(data).save(function (err, result) {
                                if (err) {
                                    callback({
                                        success: false,
                                        STATUSCODE: 5005,
                                        message: "INTERNAL DB ERROR",
                                        response: []
                                    });
                                } else {

                                    mailProperty('emailVerificationMail')(data.email, {
                                        name: data.fullName,
                                        email: data.email,
                                        verification_code: config.liveUrl+'verifyEmail/'+result._id,
                                        site_url: config.liveUrl,
                                        date: new Date()
                                    }).send();

                                    callback({
                                        success: true,
                                        STATUSCODE: 2000,
                                        message: "Registered Successfully.",
                                        response: "Registered Successfully.Please Check Your Registered Email For Verification."
                                    });
                                }
                            });
                        }
                    }
                });
        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: []
            });
        }
    },

    //login
    login: async function (data, callback) {

        let email = data.email
        let phoneNumber = data.phoneNumber
        let query = {}
        if(data.email)
        {
            query["email"] = email
        }

        if(data.phoneNumber)
        {
            query["phoneNumber"] = phoneNumber
        }

        if ( (data.email || data.phoneNumber) ) {

           UserSchema.findOne(query, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "INTERNAL DB ERROR",
                        response: []
                    });

                } else {
                    if (result === null) {

                        callback({
                            success: false,
                            STATUSCODE: 4004,
                            message: "Wrong password or email. Please provide registered details.",
                            response: []
                        });


                    } else {

                        if (result.email_verify == 'no') {
                            var all_result = {
                                authtoken: '',
                                _id: result._id,
                                fullName: result.fullName ,
                                email: result.email
                            }
                            callback({
                                success: false,
                                STATUSCODE: 4004,
                                message: "Your account is not activated. Please activate your account.",
                                response: all_result
                            });
                        } else if (result.status == 'no') {
                            var all_result = {
                                authtoken: '',
                                _id: result._id,
                                fullName: result.fullName ,
                                email: result.email
                            }
                            callback({
                                
                                success: false,
                                STATUSCODE: 4004,
                                message: "Your account is temporarily blocked. Please contact admin.",
                                response: all_result
                            });
                        } else {

                            bcrypt.compare(data.password.toString(), result.password, function (err, response) {
                                // result == true
                                if (response == true) {

                                    var token = createToken(result);
                                    UserSchema.update({
                                        _id: result._id
                                    }, {
                                        $set: {
                                            deviceToken: data.deviceToken,
                                            appType: data.appType
                                        }
                                    }, function (err, resUpdate) {
                                        if (err) {
                                            callback({
                                                success: false,
                                                STATUSCODE: 5005,
                                                message: "INTERNAL DB ERROR",
                                                response: []
                                            });
                                        } else {

                                            let profile_image = result.profileImage;

                                            if (!profile_image || profile_image == '') {
                                                profile_image = config.liveUrl + config.userDemoPicPath;
                                            } else {
                                                profile_image = config.liveUrl + result.profileImage;
                                            }
                                            var all_result = {
                                                authtoken: token,
                                                _id: result._id,
                                                fullName: result.fullName,
                                                email: result.email,
                                                profileImage: profile_image
                                            }
                                            callback({
                                                success: true,
                                                STATUSCODE: 2000,
                                                message: "Logged your account",
                                                response: all_result
                                            });
                                        }
                                    });
                                } else {
                                    callback({
                                        
                                        success: false,
                                        STATUSCODE: 4004,
                                        message: "Wrong password or email. Please provide registered details.",
                                        response: []
                                    });
                                }
                            });
                        }


                    }
                }
            })



        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },

    // forget password
    forgotPassword: function (data, callback) {
        console.log('data----',data)
        if (data.email) {
            UserSchema.findOne({
                email: data.email
            }, function (err, resDetails) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "INTERNAL DB ERROR",
                        response: err
                    });
                } else {
                    if (resDetails == null) {
                        callback({
                            success: false,
                            STATUSCODE: 5002,
                            message: "User does not exist",
                            response: {}
                        });
                    } else {

                        mailProperty('forgotPasswordMail')(data.email, {
                            name: resDetails.fullName,
                            email: resDetails.email,
                            reset_password_link: config.liveUrl+'resetPassword/'+resDetails._id,
                            site_url: config.liveUrl,
                            date: new Date()
                        }).send();

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Mail Sent Successfully for Resetting Password.",
                            response: "Mail Sent Successfully.Please Check Your Registered Email To Reset Password."
                        });
                    }
                }
            });
        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "User email id not provided",
                response: {}
            });
        }
    },

    // reset password
    resetPassword: function (data, callback) {
        console.log('data----',data)
        if (data.userId) {
            UserSchema.findOne({
                _id: data.userId
            }, function (err, resDetails) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "INTERNAL DB ERROR",
                        response: err
                    });
                } else {
                    if (resDetails == null) {
                        callback({
                            success: false,
                            STATUSCODE: 5002,
                            message: "User does not exist",
                            response: {}
                        });
                    } else {
                        bcrypt.hash(data.newPassword, null, null, function (err, hash) {
                            if (err) {
                                callback({
                                    success: false,
                                    STATUSCODE: 5005,
                                    message: "INTERNAL DB ERROR",
                                    response: err
                                });
                            } else {
                                UserSchema.update({
                                    _id: resDetails._id
                                }, {
                                    $set: {
                                        "password": hash
                                    }
                                }, function (err, result) {
                                    if (err) {
                                        callback({
                                            success: false,
                                            STATUSCODE: 5005,
                                            message: "INTERNAL DB ERROR",
                                            response: err
                                        });
                                    } else {
                            
                                        mailProperty('resetPasswordMail')(resDetails.email, {
                                            name: resDetails.fullName,
                                            email: resDetails.email,
                                            reset_password: data.newPassword,
                                            site_url: config.liveUrl,
                                            date: new Date()
                                        }).send();

                                        callback({
                                            success: true,
                                            STATUSCODE: 2000,
                                            message: "Password changed Successfully.Please check your registered email.",
                                            response: { _id: resDetails._id, password:data.newPassword }
                                        });
                                    }
                                });
                            }
                        });

                    }
                }
            });
        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "User Id not provided",
                response: {}
            });
        }
    },

    // List User
    listUser: function (data, callback) {
        console.log('data----',data)

        var page = 1,
        limit = 3,
        query = {},
        queryName = {};

        if (data.page) {
            page = parseInt(data.page);
        }

        if (data.limit) {
            limit = parseInt(data.limit);
        }

        if(data.userId){
            query['_id'] = data.userId
        }           

        if(data.fullName){
            query['fullName'] = data.fullName
        }   

        if(data.userName){
            query['userName'] = data.userName
        } 

        if(data.email){
            query['email'] = data.email
        } 

        if (data.searchName) {
            query['userName'] = new RegExp(data.searchName, 'i')
        }

        var aggregate = UserSchema.aggregate();
        aggregate.match(query);
        aggregate.sort({
            'updatedAt': -1
        })

        var options = {
            page: page,
            limit: limit
        }

        UserSchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: err,
                    response: {}
                });

            } else {

                
                results.map( (result) => {

                    let profile_image = result.profileImage;

                    if (!profile_image || profile_image == '') {
                        profile_image = config.userDemoPicPath;
                    } else {
                        profile_image = result.profileImage;
                    }
                    result.profileImage = profile_image

                } )


                var data = {
                    docs:results,
                    pages: pageCount,
                    total: count,
                    limit: limit,
                    page: page
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "User List",
                    response: data
                });

            }
        });
     },

    // Edit User Information
    editUser: async function (data, fileData, callback) {
        if (data) {

            let user = await UserSchema.findOne({
                _id: data.userId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing user",
                        response: err
                    });
                }
            });

            if (user !== null) {

                UserSchema.update({
                    _id: data.userId
                }, {
                    $set: {
                        fullName: data.fullName !== undefined ? data.fullName : user.fullName,
                        userName: data.userName !== undefined ? data.userName : user.userName,
                        profileImage: data.profileImage !== undefined ? data.profileImage : user.profileImage,
                        phoneNumber: data.phoneNumber !== undefined ? data.phoneNumber : user.phoneNumber,
                        email: data.email !== undefined ? data.email : user.email,
                        address: data.address !== undefined ? data.address : user.address,
                        dob: data.dob !== undefined ? data.dob : user.dob,
                        status: data.status !== undefined ? data.status : user.status
                    }
                }, async (err, resUpdate) => {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                    } else {

                        console.log('fileData-------->',fileData);
                        
                        if( fileData && fileData !== null){

                            if (user.profileImage !== undefined && user.profileImage != '')
                            {

                                let pf_image = `./public/${user.profileImage}`;
                                fs.unlink(pf_image, (err) => {
                                    if (err) {
                                        console.log('err', err);
                                    } else {
                                        console.log(user.profileImage + ' was deleted');
                                    }
                                });
                            }

                            let imageUploaded = new Promise( (resolve,reject) => { 

                                var pic = fileData.profileImage;
                                var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                var fileName = Date.now() + ext;
                                var folderpath = config.UploadUserProfilePath;
                                pic.mv(folderpath + fileName,  (err) => {
                                    if (err) {
                                        reject(err)
                                        callback({
                                            "success": false,
                                            "STATUSCODE": 5005,
                                            "message": "INTERNAL DB ERROR",
                                            "response": err
                                        })
                                    } else {
                                        //data._id = new ObjectID;
                                        if(data.profileImage == (config.UserProfilePath + fileName) )
                                        {

                                        }else{
                                            data.profileImage = config.UserProfilePath + fileName;
                                        }
                                        resolve(data.profileImage)
                                        console.log('image upload')
                                    }
                                })

                        })

                        data.profileImage = await imageUploaded

                        await UserSchema.update({_id: user._id}, {
                                        $set: {"profileImage": data.profileImage}           
                                        });
                      }

                      let userUpdatedDetails = await UserSchema.findOne({_id: data.userId})
                      if(userUpdatedDetails !== null)
                      {
                          userUpdatedDetails.profileImage = userUpdatedDetails.profileImage !== undefined ?
                                                           userUpdatedDetails.profileImage:''
                      }
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Personal information has been updated.",
                            response: userUpdatedDetails
                           
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "User is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },

    // Delete User Information
    deleteUser: async function (data,  callback) {
        if (data) {

            let admin = await UserSchema.findOne({
                _id: data.userId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while removing admin",
                        response: err
                    });
                }
            });

            if (admin !== null) {


                if (admin.profileImage !== undefined && admin.profileImage != '')
                {

                    let pf_image = `./public/${admin.profileImage}`;
                    fs.unlink(pf_image, (err) => {
                        if (err) {
                            console.log('err', err);
                        } else {
                            console.log(admin.profileImage + ' was deleted');
                        }
                    });
                }

                UserSchema.remove({
                    _id: data.userId
                }, async (err, resRemoved) => {

                if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                } else {

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "User removed Successfully.",
                            response: {}
                        
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "User is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },

    //list Courses
    listCourses: function (data, callback) {
        console.log('data----',data)
        var page = 1,
            limit = 10,
            query = {};

        if (data.page) {
            page = parseInt(data.page);
        }
        if (data.limit) {
            limit = parseInt(data.limit);
        }
        if (data.courseId) {
            query['_id'] = data.courseId;
        }

        if (data.searchName) {
            query['courseName'] = new RegExp(data.searchName, 'i')
        }

        var aggregate = CourseSchema.aggregate();
        aggregate.match(query);

        aggregate.lookup({
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'Category'
        });


        aggregate.unwind({
            path: "$Category",
            preserveNullAndEmptyArrays: true
        });

        aggregate.lookup({
            from: 'subcategories',
            localField: 'Category.subcategoryId',
            foreignField: '_id',
            as: 'SubCategory'
        });

        aggregate.unwind({
            path: "$SubCategory",
            preserveNullAndEmptyArrays: true
        });

        aggregate.group({
            "_id": "$_id",
            createdAt: {
                "$first": "$createdAt"
            },
            courseName: {
                "$first": "$courseName"
            },
            description: {
                "$first": "$description"
            },
            courseImage: {
                "$first": "$courseImage"
            },
            updatedAt: {
                "$first": "$updatedAt"
            },
            Category: {
                "$addToSet": "$Category"
            },
            SubCategory: {
                "$addToSet": "$SubCategory"
            }
            // "$push": {
            //     "_id": "$albums._id",
            //     "title": "$albums.title",
            //     "released": "$albums.released",
            //     "type": "$albums.type",
            //     "songs": "$albums.songs"
            //   }
        });

        aggregate.project({
            _id: 1,
            courseName: 1,
            courseImage: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            employeeId: 1,
            Category: 1,
            // Category:  {
            //     '$arrayElemAt': [
            //         [{
            //             _id: "$_id",
            //             categoryName: {
            //                 '$arrayElemAt': ['$Category.categoryName', 0]
            //             },
            //             description: {
            //                 '$arrayElemAt': ['$Category.description', 0]
            //             },
            //             content: {
            //                 '$arrayElemAt': ['$Category.content', 0]
            //             },
            //             createdAt: {
            //                 '$arrayElemAt': ['$Category.createdAt', 0]
            //             },
            //             updatedAt: {
            //                 '$arrayElemAt': ['$Category.updatedAt', 0]
            //             },
            //             category: "$Category",
            //             subCategory: "$SubCategory",
            //         }], 0
            //     ]
            // }
        });
        aggregate.sort({
            '_id': 1
        })
        var options = {
            page: page,
            limit: limit
        }

        CourseSchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: "INTERNAL SERVER ERROR",
                    response: err
                });

            } else {

                var data = {
                    docs: results,
                    pages: pageCount,
                    total: count,
                    limit: limit,
                    page: page
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Courses List",
                    response: data
                });

            }
        });
    },

    //detail Courses
    detailCourses: function (data, callback) {
        console.log('data----',data)
        var page = 1,
            limit = 10,
            query = {};

        if (data.page) {
            page = parseInt(data.page);
        }
        if (data.limit) {
            limit = parseInt(data.limit);
        }
        if (data.detailCourseId) {
            query['_id'] = data.detailCourseId;
        }

        if (data.courseName) {
            query['courseName'] = data.courseName;
        }

        if (data.courseId) {
            query['courseId'] = data.courseId;
        }

        if (data.categoryId) {
            query['categoryId'] = data.categoryId;
        }

        if (data.subCategoryId) {
            query['subCategoryId'] = data.subCategoryId;
        }

        if (data.searchName) {
            query['courseName'] = new RegExp(data.searchName, 'i')
        }

        var aggregate = CourseDetailSchema.aggregate();
        aggregate.match(query);

        aggregate.lookup({
            from: 'courses',
            localField: 'courseId',
            foreignField: '_id',
            as: 'Courses'
        });

        aggregate.unwind({
            path: "$Courses",
            preserveNullAndEmptyArrays: true
        });

        aggregate.lookup({
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'Category'
        });

        aggregate.unwind({
            path: "$Category",
            preserveNullAndEmptyArrays: true
        });

        aggregate.lookup({
            from: 'subcategories',
            localField: 'subCategoryId',
            foreignField: '_id',
            as: 'SubCategory'
        });

        aggregate.unwind({
            path: "$SubCategory",
            preserveNullAndEmptyArrays: true
        });

        aggregate.group({
            "_id": "$_id",
            createdAt: {
                "$first": "$createdAt"
            },
            courseName: {
                "$first": "$courseName"
            },
            overview: {
                "$first": "$overview"
            },
            learningElement: {
                "$first": "$learningElement"
            },
            actualprice: {
                "$first": "$actualprice"
            },
            price: {
                "$first": "$price"
            },
            currency: {
                "$first": "$currency"
            },
            curriculum: {
                "$first": "$curriculum"
            },
            relatedCourseDetailId: {
                "$first": "$relatedCourseDetailId"
            },
            noOfStudent: {
                "$first": "$noOfStudent"
            },
            courseImage: {
                "$first": "$courseImage"
            },
            updatedAt: {
                "$first": "$updatedAt"
            },
            Courses: {
                "$first": "$Courses"
            },
            Category: {
                "$first": "$Category"
            },
            SubCategory: {
                "$first": "$SubCategory"
            }
        });

        aggregate.project({
            _id: 1,
            courseName: 1,
            courseImage: 1,
            noOfStudent: 1,
            relatedCourseDetailId: 1,
            curriculum: 1,
            currency: 1,
            price: 1,
            actualprice: 1,
            learningElement: 1,
            overview: 1,
            createdAt: 1,
            updatedAt: 1,
            Courses: 1,
            Category: 1,
            SubCategory: 1,
        });
        aggregate.sort({
            '_id': 1
        })
        var options = {
            page: page,
            limit: limit
        }

        CourseDetailSchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: "INTERNAL SERVER ERROR",
                    response: err
                });

            } else {

                var data = {
                    docs: results,
                    pages: pageCount,
                    total: count,
                    limit: limit,
                    page: page
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Course Detail List",
                    response: data
                });

            }
        });
    },

    // Delete Detail Course  Information
    deleteDetailCourse: async function (data,  callback) {
        if (data) {

            let admin = await CourseDetailSchema.findOne({
                _id: data.detailCourseId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while removing admin",
                        response: err
                    });
                }
            });

            if (admin !== null) {


                if (admin.courseImage !== undefined && admin.courseImage != '')
                {

                    let pf_image = `./public/${admin.courseImage}`;
                    fs.unlink(pf_image, (err) => {
                        if (err) {
                            console.log('err', err);
                        } else {
                            console.log(admin.courseImage + ' was deleted');
                        }
                    });
                }

                CourseDetailSchema.remove({
                    _id: data.detailCourseId
                }, async (err, resRemoved) => {

                if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                } else {

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Course removed Successfully.",
                            response: {}
                        
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Course is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },

    // Delete Course Information
    deleteCourses: async function (data,  callback) {
        if (data) {

            let admin = await CourseSchema.findOne({
                _id: data.courseId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while removing admin",
                        response: err
                    });
                }
            });

            if (admin !== null) {


                if (admin.courseImage !== undefined && admin.courseImage != '')
                {

                    let pf_image = `./public/${admin.courseImage}`;
                    fs.unlink(pf_image, (err) => {
                        if (err) {
                            console.log('err', err);
                        } else {
                            console.log(admin.courseImage + ' was deleted');
                        }
                    });
                }

                CourseSchema.remove({
                    _id: data.courseId
                }, async (err, resRemoved) => {

                if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                } else {

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Course removed Successfully.",
                            response: {}
                        
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Course is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },

    //list Courses-Category
    listCategory: function (data, callback) {
        console.log('data----',data)
        var page = 1,
        limit = 3,
        query = {};

        if (data.page) {
            page = parseInt(data.page);
        }
        if (data.limit) {
            limit = parseInt(data.limit);
        }
        if (data.categoryId) {
            query['_id'] = data.categoryId;
        }

        if (data.searchName) {
            query['categoryName'] = new RegExp(data.searchName, 'i')
        }
        var aggregate = CategorySchema.aggregate();
        aggregate.match(query);

        aggregate.lookup({
            from: 'subcategories',
            localField: 'subcategoryId',
            foreignField: '_id',
            as: 'SubCategory'
        });


        aggregate.unwind({
            path: "$SubCategory",
            preserveNullAndEmptyArrays: true
        });

        aggregate.group({
            "_id": "$_id",
            createdAt: {
                "$first": "$createdAt"
            },
            description: {
                "$first": "$description"
            },
            updatedAt: {
                "$first": "$updatedAt"
            },
            categoryName: {
                "$first": "$categoryName"
            },
            SubCategory: {
                "$addToSet": "$SubCategory"
            }
        });
        aggregate.project({
            _id: 1,
            createdAt: 1,
            updatedAt: 1,
            content: 1,
            description: 1,
            categoryName:1,
            SubCategory:  1
        });
        aggregate.sort({
            'categoryName': 1
        })
        var options = {
            page: page,
            limit: limit
        }

        CategorySchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: "INTERNAL SERVER ERROR",
                    response: err
                });

            } else {

                var data = {
                    docs: results,
                    pages: pageCount,
                    total: count,
                    limit: limit,
                    page: page
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Category List",
                    response: data
                });

            }
        });

    },      
    //list Courses-Sub-Category

    listSubCategory: function (data, callback) {
    console.log('data----',data)


    var page = 1,
    limit = 10,
    query = {};

    if (data.page) {
        page = parseInt(data.page);
    }
    if (data.limit) {
        limit = parseInt(data.limit);
    }
    if (data.subCategoryId) {
        query['_id'] = data.subCategoryId;
    }
    if (data.searchName) {
        query['subcatoryName'] = new RegExp(data.searchName, 'i')
    }
    var aggregate = SubCategorySchema.aggregate();
    aggregate.match(query);

    var options = {
        page: page,
        limit: limit
    }

    SubCategorySchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
        if (err) {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL SERVER ERROR",
                response: err
            });

        } else {

            var data = {
                docs: results,
                pages: pageCount,
                total: count,
                limit: limit,
                page: page
            }
            callback({
                success: true,
                STATUSCODE: 2000,
                message: "Sub Category List",
                response: data
            });

        }
    });

    },
    
    // List Terms
    listTerms: function (data, callback) {
        console.log('data----',data)

        var page = 1,
        limit = 3,
        query = {},
        queryName = {};

        if (data.page) {
            page = parseInt(data.page);
        }

        if (data.limit) {
            limit = parseInt(data.limit);
        }

        if(data.termId){
            query['_id'] = data.termId
        }           

        var aggregate = TermsSchema.aggregate();
        aggregate.match(query);
        aggregate.sort({
            'updatedAt': -1
        })

        var options = {
            page: page,
            limit: limit
        }

        TermsSchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: err,
                    response: {}
                });

            } else {

                var data = {
                    docs:results,
                    pages: pageCount,
                    total: count,
                    limit: limit,
                    page: page
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Terms List",
                    response: data
                });

            }
        });
     },

    // Edit Terms Information
    editTerms: async function (data,  callback) {
        if (data) {

            let term = await TermsSchema.findOne({
                _id: data.termId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing term",
                        response: err
                    });
                }
            });

            if (term !== null) {

                TermsSchema.update({
                    _id: data.termId
                }, {
                    $set: {
                        description: data.description !== undefined ? data.description : term.description
                    }
                }, async (err, resUpdate) => {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                    } else {


                      let termUpdatedDetails = await TermsSchema.findOne({_id: data.termId})
                 
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Term information has been updated.",
                            response: termUpdatedDetails
                           
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Terms is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },  

    // List PrivacyPolicy
    listPrivacyPolicy: function (data, callback) {
        console.log('data----',data)

        var page = 1,
        limit = 3,
        query = {},
        queryName = {};

        if (data.page) {
            page = parseInt(data.page);
        }

        if (data.limit) {
            limit = parseInt(data.limit);
        }

        if(data.privacyId){
            query['_id'] = data.privacyId
        }           

        var aggregate = PrivacySchema.aggregate();
        aggregate.match(query);
        aggregate.sort({
            'updatedAt': -1
        })

        var options = {
            page: page,
            limit: limit
        }

        PrivacySchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
            if (err) {
                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: err,
                    response: {}
                });

            } else {

                var data = {
                    docs:results,
                    pages: pageCount,
                    total: count,
                    limit: limit,
                    page: page
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Privacy List",
                    response: data
                });

            }
        });
    },

    // Edit PrivacyPolicy Information
    editPrivacyPolicy: async function (data, callback) {
        if (data) {

            let term = await PrivacySchema.findOne({
                _id: data.privacyId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing term",
                        response: err
                    });
                }
            });

            if (term !== null) {

                PrivacySchema.update({
                    _id: data.privacyId
                }, {
                    $set: {
                        description: data.description !== undefined ? data.description : term.description
                    }
                }, async (err, resUpdate) => {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                    } else {


                        let termUpdatedDetails = await PrivacySchema.findOne({_id: data.privacyId})
                    
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Privacy information has been updated.",
                            response: termUpdatedDetails
                            
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Privacy is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    } ,
    
    // add To Cart
    addToCart: async function (data,  callback) {
        if (data) {

            let user = await UserSchema.findOne({
                _id: data.userId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing user",
                        response: err
                    });
                }
            });

            if (user !== null) {
                let definedusercart = user.cart ? user.cart : []
                if(data.courseDetailId )
                {
                    data.courseDetailId.map((value) => {

                        if(user.cart.includes(value))
                        {
                            console.log('mached--->');

                        }else{
                            console.log('new item--->');

                            definedusercart.push(value)
                        }

                    });
                }

                UserSchema.update({
                    _id: data.userId
                }, {
                    $set: {
                        cart: definedusercart
                    }
                }, async (err, resUpdate) => {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                    } else {


                      let userUpdatedDetails = await UserSchema.findOne({_id: data.userId})
                 
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "User information has been updated.",
                            response: userUpdatedDetails
                           
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "User is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    }, 

    // Buy Course Detail
    buyCourseDetail: async function (data,  callback) {
        if (data) {

            let user = await UserSchema.findOne({
                _id: data.userId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing user",
                        response: err
                    });
                }
            });

            if (user !== null) {
                let defineduserbuycoursedetail = user.buyProduct ? user.buyProduct : []
                let definedusercart            = user.cart ? user.cart : []
                
                if(data.courseDetailId)
                {

                    if(!user.buyProduct.includes(data.courseDetailId))
                    {
                            console.log('new item--->');

                            defineduserbuycoursedetail.push(data.courseDetailId)
                        

                        let findCourseDetail = await CourseDetailSchema.findOne({
                            _id: data.courseDetailId
                        })
                        console.log('findCourseDetail-------->',findCourseDetail);
    
                        if(findCourseDetail !== null)
                        {
                            let definedNoOfStudent = findCourseDetail.noOfStudent ? findCourseDetail.noOfStudent : 0
                            
                            await CourseDetailSchema.update({
                            _id: data.courseDetailId
                            },{
                                $set : {
                                    noOfStudent: definedNoOfStudent +1
                                }
                            })

                            await CourseDetailProgressSchema.create(
                                {
                                    _id             : new ObjectID,
                                    userId          : data.userId,
                                    courseDetailId  : data.courseDetailId,
                                    curriculum      : findCourseDetail.curriculum
                                }
                            )

                        }
                    }
                   
                }

                UserSchema.update({
                    _id: data.userId
                }, {
                    $set: {
                        buyProduct: defineduserbuycoursedetail,
                        cart      : definedusercart
                    }
                }, async (err, resUpdate) => {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                    } else {
                        
                      let userUpdatedDetails = await UserSchema.findOne({_id: data.userId})
                 
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "User information has been updated.",
                            response: userUpdatedDetails
                           
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "User is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },     

    // add Review Model
    addReviewModel: async function (data,  callback) {
        if (data) {

            let user = await UserSchema.findOne({
                _id: data.userId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing user",
                        response: err
                    });
                }
            });

            if (user !== null) {

                
                new ReviewSchema(data).save( async (err, result) => {
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: err
                        });
                    } else {

                        let findCourseDetail = await CourseDetailSchema.findOne({
                            _id: data.courseDetailId
                        })

                        if(findCourseDetail !== null)
                        {
                            let findReviewDetail = await ReviewSchema.find({
                                courseDetailId: data.courseDetailId
                            })

                            let averageRating = 0

                            if(findReviewDetail.length > 0)
                            {

                               let sum =  findReviewDetail.reduce( (acc, review) => {
                                    return acc + review.rating
                                }, 0)
                                
                                console.log('sum----',sum);

                                averageRating = (sum+data.rating)/(findReviewDetail.length+1)
                            }

                            let definedCourseDetailreviewId = findCourseDetail.reviewId ? findCourseDetail.reviewId : []
                            
                            definedCourseDetailreviewId.push(result._id)
                            
                            await CourseDetailSchema.update({
                            _id: data.courseDetailId
                            },{
                                $set : {
                                    reviewId: definedCourseDetailreviewId,
                                    rating  : averageRating
                                }
                            })
                        }
                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Rating information has been added Successfully.",
                            response: result
                            
                        });

                    }
                })
               

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "User is not valid.",
                    response: {}
                });
            }

        } else {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL DB ERROR",
                response: {}
            });
        }
    },

    //list Review Model
    listReviewModel: function (data, callback) {
    console.log('data----',data)
    var page = 1,
        limit = 10,
        query = {};

    if (data.page) {
        page = parseInt(data.page);
    }

    if (data.limit) {
        limit = parseInt(data.limit);
    }

    if (data.rating) {
        query['rating'] = data.rating;
    }

    if (data.reviewId) {
        query['_id'] = data.reviewId;
    }

    if (data.userId) {
        query['userId'] = data.userId;
    }

    if (data.courseDetailId) {
        query['courseDetailId'] = data.courseDetailId;
    }
    
    if (data.title) {
        query['title'] = data.title;
    }

    var aggregate = ReviewSchema.aggregate();
    aggregate.match(query);

    aggregate.lookup({
        from: 'coursedetails',
        localField: 'courseDetailId',
        foreignField: '_id',
        as: 'CourseDetail'
    });

    aggregate.unwind({
        path: "$CourseDetail",
        preserveNullAndEmptyArrays: true
    });

    aggregate.lookup({
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'User'
    });

    aggregate.unwind({
        path: "$User",
        preserveNullAndEmptyArrays: true
    });

    aggregate.group({
        "_id": "$_id",
        createdAt: {
            "$first": "$createdAt"
        },
        updatedAt: {
            "$first": "$updatedAt"
        },
        CourseDetail: {
            "$first": "$CourseDetail"
        },
        User: {
            "$first": "$User"
        },
        rating: {
            "$first": "$rating"
        },
        title: {
            "$first": "$title"
        },
        description: {
            "$first": "$description"
        }
    });

    aggregate.project({
        _id: 1,
        CourseDetail: 1,
        User: 1,
        rating: 1,
        createdAt: 1,
        updatedAt: 1,
        title: 1,
        description: 1,

    });
    aggregate.sort({
        '_id': 1
    })
    var options = {
        page: page,
        limit: limit
    }

    ReviewSchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
        if (err) {
            callback({
                success: false,
                STATUSCODE: 5005,
                message: "INTERNAL SERVER ERROR",
                response: err
            });

        } else {

            var data = {
                docs: results,
                pages: pageCount,
                total: count,
                limit: limit,
                page: page
            }
            callback({
                success: true,
                STATUSCODE: 2000,
                message: "Review List",
                response: data
            });

        }
    });
    },
}
module.exports = apiModel;