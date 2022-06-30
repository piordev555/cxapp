// const mongoose = require("mongoose");

// const Friend = mongoose.model(
//     "Friend",
//     new mongoose.Schema({
//         user_id: { type: String, required: true },
//         friendrequest_id: { type: String, required: true },
//         status: { type: Boolean},
//         createdDate: { type: Date, default: Date.now }
//     })
// )

// module.exports = Friend;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    friendrequest_id: {
        type: String,
        required: true
    },
    status: {
        type: Boolean
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    friends: {
        type: Boolean,
        default: false
    },
    friend_req_status: {
        type: String,
        enum: ['Accepted', 'Rejected','Not Selected'],
        default: 'Not Selected'
    },

});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('Friend', schema);