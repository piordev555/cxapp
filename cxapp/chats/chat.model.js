const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        user_id: { type: String, required: true },
        chatrequest_id: { 
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: { type: Number, default: 2},
        createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Chat', schema);