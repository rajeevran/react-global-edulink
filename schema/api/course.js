var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;
var courseschema = new Schema({
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
    description: {
        type: String,
        default: ''
    },
    content: [{
        type: String,
        default: ''
    }],
    categoryId: [{
        type: String,
        ref:'Category',
    }]
}, {
    timestamps: true
});

courseschema.plugin(mongoosePaginate);
courseschema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Course', courseschema);