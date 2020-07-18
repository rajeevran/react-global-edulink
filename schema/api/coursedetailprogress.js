var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;
var courseDetailProgressSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    courseDetailId: {
        type: String
    },
    userId: {
        type: String
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
        },
        progress: {
            type: String,
            enum: ['done', 'underway'],
            default: 'underway' 
        }
    }]
}, {
    timestamps: true
});

courseDetailProgressSchema.plugin(mongoosePaginate);
courseDetailProgressSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('CourseDetailProgress', courseDetailProgressSchema);