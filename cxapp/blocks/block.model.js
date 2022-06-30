const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
        user_id: { type: String, required: true },
        blockrequest_id: { type: String, required: true },
        status: { type: Boolean},
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

module.exports = mongoose.model('Block', schema);