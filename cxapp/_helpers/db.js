const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(process.env.MONGODB_URI || config.connectionString, connectionOptions);

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.User = require("../users/user.model");
db.Friend = require("../friends/friend.model");
db.Subscription = require("../subscribes/subscribe.model");
db.Block = require("../blocks/block.model");
db.Chat = require("../chats/chat.model");
db.Notification = require("../notifications/notification.model");


module.exports = db;