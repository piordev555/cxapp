const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    request_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notification_type: {
        type: String,
        enum: ['Accepted', 'Rejected', 'Friend', 'Subscribe', 'UnSubscribe', 'Not Selected'],
        default: 'Not Selected'
    },
    notification_status: {
        type: String,
        enum: ['Read', 'Unread'],
        default: 'Unread'
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    }

});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Notification', schema);