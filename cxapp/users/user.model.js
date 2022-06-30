const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    chash: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    hobbies: [{
        type: String,
    }],
    country: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    role:  [{
        type: Object
    }],
    about: {
        type: String,
        required: false
    },
    // loc: {
    //     type: {
    //         type: String
    //     },
    //     coordinates: []
    // },
    lat: {
        type: String,
        required: true
    },
    lng: {
        type: String,
        required: true
    },
    open: {
        type: Boolean,
        required: true,
        default: false
    },
    img: {
        type: String,
        required: false
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    profile: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    friend_req_status: {
        type: String,
        enum: ['Accepted', 'Rejected','Not Selected'],
        default: 'Not Selected'
    },
    friends:{
        type:Boolean,
        default:false
    }
});
schema.index({
    loc: '2dsphere'
});
schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);