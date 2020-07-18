var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var subcategory = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    subcatoryName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    content: [{
        type: String,
        default: ''
    }],
}, {
    timestamps: true
});

subcategory.plugin(mongoosePaginate);
subcategory.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('SubCategory', subcategory);