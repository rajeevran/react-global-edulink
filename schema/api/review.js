var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;
var reviewschema = new Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        default: ''
    },
    courseDetailId: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

reviewschema.plugin(mongoosePaginate);
reviewschema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Review', reviewschema);