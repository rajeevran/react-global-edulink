var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;
var courseDetailschema = new Schema({
    _id: {
        type: String,
        required: true
    },
    courseName: {
        type: String,
        default: ''
    },
    courseImage: {
        type: String,
        default: ''
    },
    courseId: {
        type: String,
        default: ''
    },
    categoryId: {
        type: String,
        default: ''
    },
    subCategoryId: {
        type: String,
        default: ''
    },
    reviewId: [{
        type: String
    }],
    actualprice: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: '£'
    }, 
    curriculum: [{
        media: {
            type: String,
            default: ''
        },
        mediaType: {
            type: String
        },
        title: {
            type: String,
            default: ''
        }
    }],
    relatedCourseDetailId: [{
        type: String,
        default: ''
    }],
    overview: {
        type: String,
        default: ''
    },
    learningElement: {
        type: String,
        default: ''
    },
    noOfStudent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

courseDetailschema.plugin(mongoosePaginate);
courseDetailschema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('CourseDetail', courseDetailschema);