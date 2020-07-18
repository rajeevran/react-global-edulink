var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var contactschema = new Schema({
    _id: { type: String,required: true},
    userId: { type: String,default: ''},
    contact: [{
        _id: { type: String,default: ''},
        display_name: { type: String, default: '' },
        mobile_no: { type: String, default: '' },
        display_mobile_no: { type: String, default: '' },
        image: { type: String, default: '' },
        quickblox_id: { type: String, default: '' },
        cbc_id: { type: String, default: '' },
        twilio_id: { type: String, default: '' },
        is_cbc_backedup: { type: Boolean, enum: [true, false], default: true}
        
    }]
}, {
        timestamps: true
    });
module.exports = mongoose.model('Contact', contactschema);