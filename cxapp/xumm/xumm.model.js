const mongoose = require("mongoose")

const xumm = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token_id: {
        type: String
    },
    wallet_id: {
        type: String
    },
    uuid: {
        type: String
    },
    createdDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    }
})

module.exports = mongoose.model('Xumm', xumm);
