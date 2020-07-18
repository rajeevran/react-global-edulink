
var AdminSchema = require('../../schema/admin/admin');
var UserSchema = require('../../schema/api/users');
var CourseSchema = require('../../schema/api/course');
var CategorySchema = require('../../schema/api/category');
var SubCategorySchema = require('../../schema/api/subcategory');
var CourseDetailSchema = require('../../schema/api/coursedetail');

var config = require('../../config');
var async = require("async");
var bcrypt = require('bcrypt-nodejs');
var mailProperty = require('../../modules/sendMail');
var jwt = require('jsonwebtoken');
var jwtOtp = require('jwt-otp');
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

var commonModel = {

    authenticate: function (jwtData, callback) {
        if (jwtData["x-access-token"]) {
            jwt.verify(jwtData["x-access-token"], config.secretKey, function (err, decoded) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 4000,
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

    changePassword: async function (data, callback) {
        console.log('data----',data)
    
            //====JWT Token verification
            var decoded = await jwt.verify(data.token, secretKey);

            console.log('decoded---->',decoded)
            data.adminId = decoded.adminId
            console.log('data after decoded---->',data)

            if (decoded !== null) {

                    AdminSchema.findOne({
                        _id: data.adminId
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
                                    message: "Admin does not exist",
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
                                        AdminSchema.update({
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
                                                    name: resDetails.firstName +' '+resDetails.lastName,
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
                
            }else{

                callback({
                    success: false,
                    STATUSCODE: 5005,
                    message: "Token not provided",
                    response: {}
                }); 

            }
        
    },

    forgotpassword: function (data, callback) {
        console.log('data----',data)

            AdminSchema.findOne({
                email: data.email.toLowerCase()
            }, {
                fullname: 1
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
                        bcrypt.hash(data.password, null, null, function (err, hash) {
                            if (err) {
                                callback({
                                    success: false,
                                    STATUSCODE: 5005,
                                    message: "INTERNAL DB ERROR",
                                    response: err
                                });
                            } else {
                                AdminSchema.update({
                                    _id: resDetails._id
                                }, {
                                    $set: {
                                        password: hash
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
                                        callback({
                                            success: true,
                                            STATUSCODE: 2000,
                                            message: "Password changed.Please check your registered email.",
                                            response: resDetails
                                        });
                                    }
                                });
                            }
                        });

                    }
                }
            });
        
    },

    listAdmin: function (data, callback) {
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

        if(data.adminId){
            query['_id'] = data.adminId
        }           

        if(data.firstName){
            query['firstName'] = data.firstName
        }   

        if (data.searchName) {
            queryName = {
                "$or": [{
                    "firstName": new RegExp(data.searchName, 'i')
                }, {
                    "lastName": new RegExp(data.searchName, 'i')
                }]
            }
        }


        query = ( data.searchName !== undefined || data.searchName !== '' ) ? { ...query ,...queryName} : query

        //searchArray.push({'description': new RegExp(data.searchTerm, 'i')});

        var aggregate = AdminSchema.aggregate();
        aggregate.match(query);
        aggregate.sort({
            'updatedAt': -1
        })

        var options = {
            page: page,
            limit: limit
        }

        AdminSchema.aggregatePaginate(aggregate, options, function (err, results, pageCount, count) {
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
                    message: "Admin List",
                    response: data//[...results]
                });

            }
        });
            // AdminSchema.find(query)
            //     .sort(sortRecord)
            //     .limit(limitRecord)
            //     .skip(skipRecord)
            //     .then(function (loginRes) {
            //         console.log("loginRes",loginRes);
                    
            //         if (loginRes === null) {

            //             callback({
            //                 success: false,
            //                 STATUSCODE: 4000,
            //                 message: "Admin doesn't exist",
            //                 response: []
            //             });
                        
            //         } else {
    
            //             loginRes.map( (result) => {

            //                 let profile_image = result.profileImage;

            //                 if (!profile_image || profile_image == '') {
            //                     profile_image = config.liveUrl + config.userDemoPicPath;
            //                 } else {
            //                     profile_image = config.liveUrl + result.profileImage;
            //                 }
            //                 result.profileImage = profile_image

            //             } )


            //             callback({
            //                 success: true,
            //                 STATUSCODE: 2000,
            //                 message: "Admin List",
            //                 response: loginRes
            //             })
            //         }
    
            //     });
     },

    addAdmin: async function (data, fileData, callback) { 
        
    console.log('data----',data)

        if (data) {
            AdminSchema.findOne({
                    email: data.email
                }, {
                    _id: 1,
                    email: 1,
                },
                  (err, result) =>{
                    if (err) {
                        callback({
                            success: false,
                            STATUSCODE: 5005,
                            message: "INTERNAL DB ERROR",
                            response: []
                        });
                    } else {
                        if (result != null) {
                            callback({
                                success: false,
                                STATUSCODE: 4004,
                                message: "Email address already exist",
                                response: result
                            });
                        } else {

                                new AdminSchema(data).save( async (err, result) => {
                                    if (err) {
                                        callback({
                                                success: false,
                                                STATUSCODE: 5005,
                                                message: "INTERNAL DB ERROR",
                                                response: []
                                        });
                                    } else {
                                        console.log('fileData-------->',fileData);

                                        if( fileData && fileData !== null){
                                    
                                                let imageUploaded = new Promise( (resolve,reject) => { 

                                                    var pic = fileData.profileImage;
                                                    var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                    var fileName = Date.now() + ext;
                                                    var folderpath = config.UploadAdminProfilePath;
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
                                                            if(data.profileImage == (config.AdminProfilePath + fileName) )
                                                            {

                                                            }else{
                                                                data.profileImage = config.AdminProfilePath + fileName;
                                                            }
                                                            resolve(data.profileImage)
                                                            console.log('image upload')
                                                        }
                                                    })

                                            })

                                            data.profileImage = await imageUploaded

                                            let updateResponse = await AdminSchema.update({_id: result._id}, {
                                                            $set: {"profileImage": data.profileImage}           
                                                            });
                                        }

                                    let findAdminResponse = await AdminSchema.findOne({_id: result._id})
                                    if(findAdminResponse !== null)
                                    {
                                        findAdminResponse.profileImage = findAdminResponse.profileImage !== undefined ?
                                                                         config.liveUrl+findAdminResponse.profileImage:''
                                    }

                                    callback({
                                            success: true,
                                            STATUSCODE: 2000,
                                            message: "You have registered successfully.",
                                            response: findAdminResponse
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

    // Edit Admin Information
    editAdmin: async function (data, fileData, callback) {

        console.log('edit data-------->', data);
        
        if (data) {

            let admin = await AdminSchema.findOne({
                _id: data.adminId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing admin",
                        response: err
                    });
                }
            });

            if (admin !== null) {

                AdminSchema.update({
                    _id: data.adminId
                }, {
                    $set: {
                        firstName: data.firstName !== undefined ? data.firstName : admin.firstName,
                        lastName: data.lastName !== undefined ? data.lastName : admin.lastName,
                        profileImage: data.profileImage !== undefined ? data.profileImage : admin.profileImage,
                        email: data.email !== undefined ? data.email : admin.email,
                        status: data.status !== undefined ? data.status : admin.status
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

                            let imageUploaded = new Promise( (resolve,reject) => { 

                                var pic = fileData.profileImage;
                                var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                var fileName = Date.now() + ext;
                                var folderpath = config.UploadAdminProfilePath;
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
                                        if(data.profileImage == (config.AdminProfilePath + fileName) )
                                        {

                                        }else{
                                            data.profileImage = config.AdminProfilePath + fileName;
                                        }
                                        resolve(data.profileImage)
                                        console.log('image upload')
                                    }
                                })

                        })

                        data.profileImage = await imageUploaded

                        await AdminSchema.update({_id: admin._id}, {
                                        $set: {"profileImage": data.profileImage}           
                                        });
                      }

                      let adminUpdatedDetails = await AdminSchema.findOne({_id: data.adminId})
                      if(adminUpdatedDetails !== null)
                      {
                          adminUpdatedDetails.profileImage = adminUpdatedDetails.profileImage !== undefined ?
                                                           config.liveUrl+adminUpdatedDetails.profileImage:''
                      }

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Personal information has been updated.",
                            response: adminUpdatedDetails
                           
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Admin is not valid.",
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
    
    // Delete Admin Information
    deleteAdmin: async function (data,  callback) {
        if (data) {

            let admin = await AdminSchema.findOne({
                _id: data.adminId
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

                AdminSchema.remove({
                    _id: data.adminId
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
                            message: "Admin removed Successfully.",
                            response: {}
                        
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Admin is not valid.",
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

    addUser: async function (data, fileData, callback) {
        console.log('data----',data)
    
            if (data) {
                UserSchema.findOne({
                        email: data.email
                    }, {
                        _id: 1,
                        email: 1,
                    },
                      (err, result) =>{
                        if (err) {
                            callback({
                                success: false,
                                STATUSCODE: 5005,
                                message: "INTERNAL DB ERROR",
                                response: []
                            });
                        } else {
                            if (result != null) {
                                callback({
                                    success: false,
                                    STATUSCODE: 4004,
                                    message: "Email address already exist",
                                    response: result
                                });
                            } else {
    
                                    new UserSchema(data).save( async (err, result) => {
                                        if (err) {
                                            callback({
                                                    success: false,
                                                    STATUSCODE: 5005,
                                                    message: "INTERNAL DB ERROR",
                                                    response: []
                                            });
                                        } else {
                                            console.log('fileData-------->',fileData);
    
                                            if( fileData && fileData !== null){
                                        
                                                    let imageUploaded = new Promise( (resolve,reject) => { 
    
                                                        var pic = fileData.profileImage;
                                                        var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                        var fileName = Date.now() + ext;
                                                        var folderpath = config.UploadAdminProfilePath;
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
                                                                if(data.profileImage == (config.AdminProfilePath + fileName) )
                                                                {
    
                                                                }else{
                                                                    data.profileImage = config.AdminProfilePath + fileName;
                                                                }
                                                                resolve(data.profileImage)
                                                                console.log('image upload')
                                                            }
                                                        })
    
                                                })
    
                                                data.profileImage = await imageUploaded
    
                                                let updateResponse = await UserSchema.update({_id: result._id}, {
                                                                $set: {"profileImage": data.profileImage}           
                                                                });
                                            }
    
                                        let findUserResponse = await UserSchema.findOne({_id: result._id})
                                        if(findUserResponse !== null)
                                        {
                                            findUserResponse.profileImage = findUserResponse.profileImage !== undefined ?
                                                                             findUserResponse.profileImage:''
                                        }
    
                                        callback({
                                                success: true,
                                                STATUSCODE: 2000,
                                                message: "You have registered successfully.",
                                                response: findUserResponse
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

    //list Courses
    listCourses: async function (data, callback) {
        console.log('data admin----',data)
        var 
            query = {};
            if(data.courseId)
            {
                query['_id'] = data.courseId
            }
            if (data.searchName) {
                query['courseName'] = new RegExp(data.searchName, 'i')
            }
        var aggregate = await CourseSchema.find(query)
                                           .populate('categoryId');

                var data = {
                    docs: aggregate,
                    total:aggregate.length
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Courses List",
                    response: data
                });
            
    },
    
    //add Courses
    addCourses: async function (data, fileData, callback) { 
        
        console.log('data----',data)
    
            if (data) {
                CourseSchema.findOne({
                        courseName: data.courseName
                    }, {
                        _id: 1,
                        courseName: 1,
                    },
                      (err, result) =>{
                        if (err) {
                            callback({
                                success: false,
                                STATUSCODE: 5005,
                                message: "INTERNAL DB ERROR",
                                response: []
                            });
                        } else {
                            if (result != null) {
                                callback({
                                    success: false,
                                    STATUSCODE: 4004,
                                    message: "Course Name already exist",
                                    response: result
                                });
                            } else {
                                    if(data.categoryId)
                                    {
                                        console.log('data.categoryId----->',data.categoryId);
                                        
                                        data.categoryId = data.categoryId != '' ? JSON.parse(data.categoryId) : []
                    
                                    }
                                    new CourseSchema(data).save( async (err, result) => {
                                        if (err) {
                                            callback({
                                                    success: false,
                                                    STATUSCODE: 5005,
                                                    message: "INTERNAL DB ERROR",
                                                    response: []
                                            });
                                        } else {
                                            console.log('fileData-------->',fileData);
    
                                            if( fileData && fileData !== null){
                                        
                                                    let imageUploaded = new Promise( (resolve,reject) => { 
    
                                                        var pic = fileData.courseImage;
                                                        var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                        var fileName = Date.now() + ext;
                                                        var folderpath = config.UploadCourseProfilePath;
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
                                                                if(data.courseImage == (config.CourseProfilePath + fileName) )
                                                                {
    
                                                                }else{
                                                                    data.courseImage = config.CourseProfilePath + fileName;
                                                                }
                                                                resolve(data.courseImage)
                                                                console.log('image upload')
                                                            }
                                                        })
    
                                                })
    
                                                data.courseImage = await imageUploaded
    
                                                let updateResponse = await CourseSchema.update({_id: result._id}, {
                                                                $set: {"courseImage": data.courseImage}           
                                                                });
                                            }
    
                                        let findCoursesResponse = await CourseSchema.findOne({_id: result._id})
                                        if(findCoursesResponse !== null)
                                        {
                                            findCoursesResponse.courseImage = findCoursesResponse.courseImage !== undefined ?
                                                                             findCoursesResponse.courseImage:''
                                        }
    
                                        callback({
                                                success: true,
                                                STATUSCODE: 2000,
                                                message: "Course has been registered successfully.",
                                                response: findCoursesResponse
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
    
    // Edit Courses Information
    editCourses: async function (data, fileData, callback) {

        console.log('edit data-------->', data);
        
        if (data) {

            let admin = await CourseSchema.findOne({
                _id: data.courseId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing course",
                        response: err
                    });
                }
            });

            if (admin !== null) {
                let definedCategory = admin.categoryId ? admin.categoryId : []
                if(data.categoryId && !admin.categoryId.includes(data.categoryId))
                {
                    definedCategory= JSON.parse(data.categoryId)

                }
                CourseSchema.update({
                    _id: data.courseId
                }, {
                    $set: {
                        courseName: data.courseName !== undefined ? data.courseName : admin.courseName,
                        description: data.description !== undefined ? data.description : admin.description,
                        categoryId: definedCategory
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

                            let imageUploaded = new Promise( (resolve,reject) => { 

                                var pic = fileData.courseImage;
                                var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                var fileName = Date.now() + ext;
                                var folderpath = config.UploadCourseProfilePath;
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
                                        if(data.courseImage == (config.CourseProfilePath + fileName) )
                                        {

                                        }else{
                                            data.courseImage = config.CourseProfilePath + fileName;
                                        }
                                        resolve(data.courseImage)
                                        console.log('image upload')
                                    }
                                })

                        })

                        data.courseImage = await imageUploaded

                        await CourseSchema.update({_id: admin._id}, {
                                        $set: {"courseImage": data.courseImage}           
                                        });
                        }

                        let adminUpdatedDetails = await CourseSchema.findOne({_id: data.courseId})
                        if(adminUpdatedDetails !== null)
                        {
                            adminUpdatedDetails.courseImage = adminUpdatedDetails.courseImage !== undefined ?
                                                            adminUpdatedDetails.courseImage:''
                        }

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Courses information has been updated.",
                            response: adminUpdatedDetails
                            
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Courses is not valid.",
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
    listCategory: async function (data, callback) {

        console.log('data admin----',data)
        var 
            query = {};
            if(data.categoryId)
            {
                query['_id'] = data.categoryId
            }

            if (data.searchName) {
                query['categoryName'] = new RegExp(data.searchName, 'i')
            }

        var aggregate = await CategorySchema.find(query)
                                           .populate('subcategoryId');

                var data = {
                    docs: aggregate,
                    total:aggregate.length
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Category List",
                    response: data
                });
    },      

    //add Category
    addCategory: async function (data,  callback) { 
        
        console.log('data----',data)
    
            if (data) {
                CategorySchema.findOne({
                        categoryName: data.categoryName
                    }, {
                        _id: 1,
                        categoryName: 1,
                    },
                      (err, result) =>{
                        if (err) {
                            callback({
                                success: false,
                                STATUSCODE: 5005,
                                message: "INTERNAL DB ERROR",
                                response: []
                            });
                        } else {
                            if (result != null) {
                                callback({
                                    success: false,
                                    STATUSCODE: 4004,
                                    message: "Category Name already exist",
                                    response: result
                                });
                            } else {
                                    if(data.subcategoryId)
                                    {
                                        console.log('data.subcategoryId----->',data.subcategoryId);
                                        
                                        data.subcategoryId = data.subcategoryId != '' ? JSON.parse(data.subcategoryId) : []
                    
                                    }
                                    new CategorySchema(data).save( async (err, result) => {
                                        if (err) {
                                            callback({
                                                    success: false,
                                                    STATUSCODE: 5005,
                                                    message: "INTERNAL DB ERROR",
                                                    response: []
                                            });
                                        } else {
                                           
    
                                        let findCategoryResponse = await CategorySchema.findOne({_id: result._id})
                                        
                                        callback({
                                                success: true,
                                                STATUSCODE: 2000,
                                                message: "Category has been registered successfully.",
                                                response: findCategoryResponse
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
    
    // Edit Category Information
    editCategory: async function (data,  callback) {

        console.log('edit data-------->', data);
        
        if (data) {

            let admin = await CategorySchema.findOne({
                _id: data.categoryId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing course",
                        response: err
                    });
                }
            });

            if (admin !== null) {
                let definedCategory = admin.subcategoryId ? admin.subcategoryId : []
                if(data.subcategoryId && !admin.subcategoryId.includes(data.subcategoryId))
                {
                    definedCategory= JSON.parse(data.subcategoryId)

                }
                CategorySchema.update({
                    _id: data.categoryId
                }, {
                    $set: {
                        categoryName: data.categoryName !== undefined ? data.categoryName : admin.categoryName,
                        description: data.description !== undefined ? data.description : admin.description,
                        subcategoryId: definedCategory
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
                        let findCategoryResponse = await CategorySchema.findOne({_id: data.categoryId})

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "Category information has been updated.",
                            response: findCategoryResponse
                            
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "Category is not valid.",
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

    //list Courses-Sub-Category
    listSubCategory: async function (data, callback) {
        console.log('data----',data)
        var 
        query = {};
        if(data.subcategoryId)
        {
            query['_id'] = data.subcategoryId
        }

        if (data.searchName) {
            query['subcatoryName'] = new RegExp(data.searchName, 'i')
        }
        var aggregate = await SubCategorySchema.find(query)

            var data = {
                docs: aggregate,
                total:aggregate.length
            }
            callback({
                success: true,
                STATUSCODE: 2000,
                message: "Sub Category List",
                response: data
            });

    },    

    //add SubCategory
    addSubCategory: async function (data,  callback) { 
        
        console.log('data----',data)
    
            if (data) {
                SubCategorySchema.findOne({
                        subcategoryName: data.subcategoryName
                    }, {
                        _id: 1,
                        subcategoryName: 1,
                    },
                      (err, result) =>{
                        if (err) {
                            callback({
                                success: false,
                                STATUSCODE: 5005,
                                message: "INTERNAL DB ERROR",
                                response: []
                            });
                        } else {
                            if (result != null) {
                                callback({
                                    success: false,
                                    STATUSCODE: 4004,
                                    message: "SubCategory Name already exist",
                                    response: result
                                });
                            } else {
                                    new SubCategorySchema(data).save( async (err, result) => {
                                        if (err) {
                                            callback({
                                                    success: false,
                                                    STATUSCODE: 5005,
                                                    message: "INTERNAL DB ERROR",
                                                    response: []
                                            });
                                        } else {
                                           
    
                                        let findSubCategoryResponse = await SubCategorySchema.findOne({_id: result._id})
                                        
                                        callback({
                                                success: true,
                                                STATUSCODE: 2000,
                                                message: "SubCategory has been registered successfully.",
                                                response: findSubCategoryResponse
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
    
    // Edit SubCategory Information
    editSubCategory: async function (data,  callback) {

        console.log('edit data-------->', data);
        
        if (data) {

            let admin = await SubCategorySchema.findOne({
                _id: data.subcategoryId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing course",
                        response: err
                    });
                }
            });

            if (admin !== null) {
              
                SubCategorySchema.update({
                    _id: data.subcategoryId
                }, {
                    $set: {
                        subcategoryName: data.subcategoryName !== undefined ? data.subcategoryName : admin.subcategoryName,
                        description: data.description !== undefined ? data.description : admin.description
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
                        let findSubCategoryResponse = await SubCategorySchema.findOne({_id: data.subcategoryId})

                        callback({
                            success: true,
                            STATUSCODE: 2000,
                            message: "SubCategory information has been updated.",
                            response: findSubCategoryResponse
                            
                        });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "SubCategory is not valid.",
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

    //list Course Detail
    listCourseDetail: async function (data, callback) {

        console.log('data admin----',data)
        var query = {};
        if(data.detailCourseId)
        {
            query['_id'] = data.detailCourseId
        }

        if (data.searchName) {
            query['courseName'] = new RegExp(data.searchName, 'i')
        }

        var aggregate = await CourseDetailSchema.find(query)

                var data = {
                    docs: aggregate,
                    total:aggregate.length
                }
                callback({
                    success: true,
                    STATUSCODE: 2000,
                    message: "Course Detail List",
                    response: data
                });
    },

    //add Courses Detail
    addDetailCourse: async function (data, fileData, callback) { 
        
        console.log('data----',data)
    
            if (data) {
                CourseDetailSchema.findOne({
                        courseName: data.courseName
                    }, {
                        _id: 1,
                        courseName: 1,
                    },
                      (err, result) =>{
                        if (err) {
                            callback({
                                success: false,
                                STATUSCODE: 5005,
                                message: "INTERNAL DB ERROR",
                                response: []
                            });
                        } else {
                            if (result != null) {
                                callback({
                                    success: false,
                                    STATUSCODE: 4004,
                                    message: "Course Detail already exist",
                                    response: result
                                });
                            } else {
                                let definedCurriculum = data.curriculum
                                    if(data.relatedCourseDetailId)
                                    {
                                        console.log('data.relatedCourseDetailId----->',data.relatedCourseDetailId);
                                        
                                        data.relatedCourseDetailId = JSON.parse(data.relatedCourseDetailId)
                                        
                                    }

                                    if(data.curriculum)
                                    {
                                        console.log('data.curriculum----->',data.curriculum);
                                        
                                        data.curriculum = []
                                        
                                    }

                                    new CourseDetailSchema(data).save( async (err, result) => {
                                        if (err) {
                                            callback({
                                                    success: false,
                                                    STATUSCODE: 5005,
                                                    message: "INTERNAL DB ERROR",
                                                    response: err
                                            });
                                        } else {
                                            console.log('fileData-------->',fileData);
                                            let uploadedFiles = [];
                                            let updatedUploadedFiles = []
                                            let updatedPushUploadedFiles = []
                                            data.curriculum = definedCurriculum
                                           Object.keys(data).forEach(async (datakey, datai) => {
                                            
                                            if( datakey.startsWith("curriculumTitle"))
                                            {
                                                console.log('curriculumdata.datakey--->',data[datakey]);
                                                let fetchKey = datakey.replace(/curriculumTitle/g, '');
                                                updatedUploadedFiles = uploadedFiles.filter( filterData => filterData._id == fetchKey)
                                              // console.log('updatedUploadedFiles---',updatedUploadedFiles);
                                               updatedPushUploadedFiles.push(...updatedUploadedFiles)
                                               console.log('updatedUploadedFiles---',updatedPushUploadedFiles);
                                                
                                            }
                                           })
                                           console.log('updatedUploadedFiles data----->', updatedPushUploadedFiles);
                                           uploadedFiles = updatedPushUploadedFiles
                                           
                                            console.log('curriculum data----->', data.curriculum);
                                            let count = 0
                
                                            uploadedFiles.map( (upfile) => {
                
                                                let title =`curriculumTitle${upfile._id}`
                                                console.log('upfile---->', data[title]);
                                                
                                                upfile.title = data[title]
                                                
                                            })
                
                                            await CourseDetailSchema.update({_id: result._id}, {
                                                $set: {"curriculum": uploadedFiles}           
                                                });
                
                
                                            if( fileData && fileData !== null){
                                                let lengthOfCurriculum = Object.keys(fileData).length
                
                                                console.log('lengthOfCurriculum---',lengthOfCurriculum);
                                                let curriculumArray = []
                                                new Promise( (resol) => {
                
                                                    Object.keys(fileData).map(async (key, i) => {
                
                                                        console.log(`key: ${key}, value: ${fileData[key]}`)
                                                        let updatedKey = key.replace(/curriculum/g, '');
                                                        console.log(`updatedKey: ${updatedKey}`)
                
                                                       if( key.startsWith("curriculum")){
                                                           let titleObject =`curriculumTitle${updatedKey}`
                                                      
                                                            console.log('titleObject---',titleObject);
                    
                                                            let pic = fileData[key]
                                                            let imageUploaded = new Promise(  (resolve,reject) => { 
                                                                console.log('pic------>',pic);
                                                                var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                                var fileName = Date.now() + ext;
                                                                
                                                                var folderpath = config.uploadCurriculumDocPath  + result._id ;
                                                            
                                                                if (!fs.existsSync(folderpath)) {
                                                                    fs.mkdirSync(folderpath);
                                                                }
                    
                                                                pic.mv(`${folderpath}/` + fileName,  (err) => {
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
                                                                        if(data.curriculum == (config.CourseCurriculumDocPath + fileName) )
                                                                        {
                    
                                                                        }else{
                                                                            data.curriculum = config.CourseCurriculumDocPath + fileName;
                                                                        }
                                                                        console.log('titleObject[count]-----',titleObject);
                                                                        console.log('titleObject[data]-----',data[titleObject]);
                                                                        console.log('[count]-----',count);
                    
                                                                        if(uploadedFiles.length > 0)
                                                                        {
                                                                            uploadedFiles.map( (upfile) => {
                                                                                console.log(upfile);
                                                                                
                                                                                if(upfile._id == updatedKey)
                                                                                {
                                                                                    console.log('id found--->', upfile._id);
                                                                                    upfile.media = data.curriculum
                                                                                    upfile.mediaType = ext
                                                                                    upfile.title = data[titleObject]
                                                                                }
                                                                            
                                                                            })
                
                                                                            if( !isNaN(updatedKey) )
                                                                            {
                                                                                uploadedFiles.push({
                                                                                    "media" : data.curriculum,
                                                                                    "mediaType" : ext,
                                                                                    "title" : data[titleObject]
                                                                                })
                                                                                
                                                                            }
                
                
                                                                        }else{
                
                                                                            uploadedFiles.push({
                                                                                "media" : data.curriculum,
                                                                                "mediaType" : ext,
                                                                                "title" : data[titleObject]
                                                                            })
                                                                        }
                
                                                                        count++
                    
                                                                        resolve(uploadedFiles)
                                                                    
                    
                                                                        console.log('file uploaded')
                                                                    }
                                                                })
                                                                 console.log('uploadedFiles 1----',uploadedFiles);
                                                                
                                                            })
                                                            console.log('uploadedFiles 2----',await imageUploaded);
                                                            curriculumArray = await imageUploaded
                                                            //data.curriculum = await imageUploaded
                                                            let updateResponse = await CourseDetailSchema.update({_id: result._id}, {
                                                                $set: {"curriculum": curriculumArray}           
                                                                });
                                                        
                                                        }
                                                        })
                
                                                })
                                                
                                                    console.log('uploadedFiles----',curriculumArray);
                                                    console.log('data.curriculum----',data.curriculum);
                                                    
                                                    let courseImage   = fileData.courseImage
                
                                                    if(courseImage)
                                                    {
                                                                                
                                                                let imageUploaded = new Promise( (resolve,reject) => { 
                
                                                                    var pic = fileData.courseImage;
                                                                    var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                                    var fileName = Date.now() + ext;
                                                                    var folderpath = config.uploadCourseImagePath ;
                                                                    
                                                                    if (!fs.existsSync(folderpath)) {
                                                                        fs.mkdirSync(folderpath);
                                                                    }
                
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
                                                                            if(data.courseImage == (config.CourseCourseImagePath + fileName) )
                                                                            {
                
                                                                            }else{
                                                                                data.courseImage = config.CourseCourseImagePath + fileName;
                                                                            }
                                                                            resolve(data.courseImage)
                                                                            console.log('file uploaded')
                                                                        }
                                                                    })
                  
                                                                })
                                                                data.courseImage = await imageUploaded
                    
                                                                 await CourseDetailSchema.update({_id: result._id}, {
                                                                    $set: {"courseImage": data.courseImage}           
                                                                    });
                                                        
                                                    }
                                            }
    
                                        let findDetailCoursesResponse = await CourseDetailSchema.findOne({_id: result._id})
                                       
                                        callback({
                                                success: true,
                                                STATUSCODE: 2000,
                                                message: "Course Detail has been registered successfully.",
                                                response: findDetailCoursesResponse
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

    // Edit DetailCourse Information
    editDetailCourse: async function (data, fileData,  callback) {

        console.log('edit data-------->', data);
        console.log('edit fileData-------->', fileData);
        
        if (data) {

            let admin = await CourseDetailSchema.findOne({
                _id: data.detailCourseId
            }, function (err, result) {
                if (err) {
                    callback({
                        success: false,
                        STATUSCODE: 5005,
                        message: "Error Occur while editing course",
                        response: err
                    });
                }
            });

            if (admin !== null) {
                let definedrelatedCourseDetailId = admin.relatedCourseDetailId ? admin.relatedCourseDetailId : []
                if(data.relatedCourseDetailId && !admin.relatedCourseDetailId.includes(data.relatedCourseDetailId))
                {
                    definedrelatedCourseDetailId= JSON.parse(data.relatedCourseDetailId)

                }
                let definedreviewId = admin.reviewId ? admin.reviewId : []
                if(data.reviewId && !admin.reviewId.includes(data.reviewId))
                {
                    definedreviewId= JSON.parse(data.reviewId)

                }

                CourseDetailSchema.update({
                    _id: data.detailCourseId
                }, {
                    $set: {
                        courseName: data.courseName !== undefined ? data.courseName : admin.courseName,
                        courseId: data.courseId !== undefined ? data.courseId : admin.courseId,
                        categoryId: data.categoryId !== undefined ? data.categoryId : admin.categoryId,
                        subCategoryId: data.subCategoryId !== undefined ? data.subCategoryId : admin.subCategoryId,
                        reviewId: definedreviewId,
                        relatedCourseDetailId: definedrelatedCourseDetailId,
                        actualprice: data.actualprice !== undefined ? data.actualprice : admin.actualprice,
                        price: data.price !== undefined ? data.price : admin.price,
                        currency: data.currency !== undefined ? data.currency : admin.currency,
                        overview: data.overview !== undefined ? data.overview : admin.overview,
                        learningElement: data.learningElement !== undefined ? data.learningElement : admin.learningElement,
                        noOfStudent: data.noOfStudent !== undefined ? data.noOfStudent : admin.noOfStudent
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


                            let uploadedFiles = admin.curriculum.length > 0 ? admin.curriculum :  [];
                            let updatedUploadedFiles = []
                            let updatedPushUploadedFiles = []

                           Object.keys(data).forEach(async (datakey, datai) => {
                            
                            if( datakey.startsWith("curriculumTitle"))
                            {
                                //console.log('curriculumdata.datakey--->',data[datakey]);
                                let fetchKey = datakey.replace(/curriculumTitle/g, '');
                                updatedUploadedFiles = uploadedFiles.filter( filterData => filterData._id == fetchKey)
                              // console.log('updatedUploadedFiles---',updatedUploadedFiles);
                               updatedPushUploadedFiles.push(...updatedUploadedFiles)
                               //console.log('updatedUploadedFiles---',updatedPushUploadedFiles);
                                
                            }
                           })
                           console.log('updatedUploadedFiles data----->', updatedPushUploadedFiles);
                           uploadedFiles = updatedPushUploadedFiles

                            console.log('curriculum data----->', data.curriculum);
                            let count = 0

                            uploadedFiles.map( (upfile) => {

                                let title =`curriculumTitle${upfile._id}`
                                console.log('upfile---->', data[title]);
                                
                                upfile.title = data[title]
                                
                            })

                            await CourseDetailSchema.update({_id: data.detailCourseId}, {
                                $set: {"curriculum": uploadedFiles}           
                                });


                            if( fileData && fileData !== null){
                                let lengthOfCurriculum = Object.keys(fileData).length

                                console.log('lengthOfCurriculum---',lengthOfCurriculum);
                                let curriculumArray = []
                                new Promise( (resol) => {

                                    Object.keys(fileData).map(async (key, i) => {

                                        console.log(`key: ${key}, value: ${fileData[key]}`)
                                        let updatedKey = key.replace(/curriculum/g, '');
                                        console.log(`updatedKey: ${updatedKey}`)

                                       if( key.startsWith("curriculum")){
                                           let titleObject =`curriculumTitle${updatedKey}`
                                      
                                            console.log('titleObject---',titleObject);
    
                                            let pic = fileData[key]
                                            let imageUploaded = new Promise(  (resolve,reject) => { 
                                                console.log('pic------>',pic);
                                                var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                var fileName = Date.now() + ext;
                                                
                                                var folderpath = config.uploadCurriculumDocPath  + data.detailCourseId ;
                                            
                                                if (!fs.existsSync(folderpath)) {
                                                    fs.mkdirSync(folderpath);
                                                }
    
                                                pic.mv(`${folderpath}/` + fileName,  (err) => {
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
                                                        if(data.curriculum == (config.CourseCurriculumDocPath + fileName) )
                                                        {
    
                                                        }else{
                                                            data.curriculum = config.CourseCurriculumDocPath + fileName;
                                                        }
                                                        console.log('titleObject[count]-----',titleObject);
                                                        console.log('titleObject[data]-----',data[titleObject]);
                                                        console.log('[count]-----',count);
    
                                                        if(uploadedFiles.length > 0)
                                                        {
                                                            uploadedFiles.map( (upfile) => {
                                                                console.log(upfile);
                                                                
                                                                if(upfile._id == updatedKey)
                                                                {
                                                                    console.log('id found--->', upfile._id);
                                                                    upfile.media = data.curriculum
                                                                    upfile.mediaType = ext
                                                                    upfile.title = data[titleObject]
                                                                }
                                                            
                                                            })

                                                            if( !isNaN(updatedKey) )
                                                            {
                                                                uploadedFiles.push({
                                                                    "media" : data.curriculum,
                                                                    "mediaType" : ext,
                                                                    "title" : data[titleObject]
                                                                })
                                                                
                                                            }


                                                        }else{

                                                            uploadedFiles.push({
                                                                "media" : data.curriculum,
                                                                "mediaType" : ext,
                                                                "title" : data[titleObject]
                                                            })
                                                        }

                                                        count++
    
                                                        resolve(uploadedFiles)
                                                    
    
                                                        console.log('file uploaded')
                                                    }
                                                })
                                                 console.log('uploadedFiles 1----',uploadedFiles);
                                                
                                            })
                                            console.log('uploadedFiles 2----',await imageUploaded);
                                            curriculumArray = await imageUploaded
                                            //data.curriculum = await imageUploaded
                                            let updateResponse = await CourseDetailSchema.update({_id: data.detailCourseId}, {
                                                $set: {"curriculum": curriculumArray}           
                                                });
                                        
                                        }
                                        })

                                })
                                
                                    console.log('uploadedFiles----',curriculumArray);
                                    console.log('data.curriculum----',data.curriculum);
                                    
                                    let courseImage   = fileData.courseImage

                                    if(courseImage)
                                    {
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

                                                let imageUploaded = new Promise( (resolve,reject) => { 

                                                    var pic = fileData.courseImage;
                                                    var ext = pic.name.slice(pic.name.lastIndexOf('.'));
                                                    var fileName = Date.now() + ext;
                                                    var folderpath = config.uploadCourseImagePath ;
                                                    
                                                    if (!fs.existsSync(folderpath)) {
                                                        fs.mkdirSync(folderpath);
                                                    }

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
                                                            if(data.courseImage == (config.CourseCourseImagePath + fileName) )
                                                            {

                                                            }else{
                                                                data.courseImage = config.CourseCourseImagePath + fileName;
                                                            }
                                                            resolve(data.courseImage)
                                                            console.log('file uploaded')
                                                        }
                                                    })

                                                })
                                                data.courseImage = await imageUploaded
    
                                                 await CourseDetailSchema.update({_id: data.detailCourseId}, {
                                                    $set: {"courseImage": data.courseImage}           
                                                    });
                                        
                                    }
                            }
                          
                            let findDetailCourseResponse = await CourseDetailSchema.findOne({_id: data.detailCourseId})

                            callback({
                                success: true,
                                STATUSCODE: 2000,
                                message: "DetailCourse information has been updated.",
                                response: findDetailCourseResponse
                                
                            });
                    }
                });

            } else {
                callback({
                    success: false,
                    STATUSCODE: 4004,
                    message: "DetailCourse is not valid.",
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

}

module.exports = commonModel;