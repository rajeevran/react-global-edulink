var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
var Schema = mongoose.Schema;
var categoryschema = new Schema({
    _id: {
        type: String,
        required: true
    },
    categoryName: {
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
    subcategoryId: [{
        type: String,
        ref:'SubCategory',
    }]
    
}, {
    timestamps: true
});

categoryschema.plugin(mongoosePaginate);
categoryschema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Category', categoryschema);