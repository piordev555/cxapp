require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const base64Img = require('base64-img')
const path = require("path")

// const multer =  require('multer');
// const upload = multer();

// app.use(upload.array());
// app.use(express.static('./uploads'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(bodyParser.json({
    limit: '100mb'
}));



app.use(cors({
    origin: '*'
}));
// use JWT auth to secure the api
// app.use(jwt());

// global error handler
app.use(errorHandler);
// start server
const port = process.env.PORT || 4000;
// const server = app.listen(port, function () {
//     console.log('Server listening on port ' + port);
// });

const {uniq} = require('lodash')
const server = require('http').createServer(app)
const io = require('socket.io').listen(server);
server.listen(port, function () {
    console.log('Server listening on port ' + port);
})
const usersMap = {};
const connections = [];
let onlineIds = [];
let typingIds = [];
// const io = socket(server);

// const index = require("./routes/index");

io.on('connection', socket => {

    // connection 
    connections.push(socket)
    console.log('Connected : %s socket connected', connections.length);

    // Disconnection
    socket.on('disconnect', function(data) {
        // update onlineIds when disconnect
        if(!socket.userId) return;
        onlineIds.splice(onlineIds.indexOf(socket.userId), 1);
        updateUserIds();
        // End here......

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected : %s socket disconnected', connections.length);
    })
    socket.on('logout', function(data) {
        // update onlineIds when disconnect
        if(!socket.userId) return;
        onlineIds.splice(onlineIds.indexOf(socket.userId), 1);
        updateUserIds();
        // End here......

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected : %s socket disconnected', connections.length);
    })
    function updateUserIds() {
        io.emit('get_online_ids', onlineIds)
    }
    socket.on('online', function(data) {
        socket.userId = data;
        let temp = onlineIds;
        temp.push(socket.userId);
        onlineIds = uniq(temp)
        updateUserIds();
    }),

    socket.on('start_typing', function(data) {
        socket.typingId = data;
        let temp = typingIds;
        temp.push(socket.typingId)
        typingIds = uniq(temp);
        io.emit('get_typing_ids', typingIds)

    }),
    socket.on('stop_typing', function(data) {
        if(!data) return;
        let recordInd = typingIds.findIndex((d) => d.self === data.self && d.partner === d.partner)
        typingIds.splice(recordInd, 1);
        // updateTypingIds();
        io.emit('get_typing_ids', typingIds)
    }),
   

socket.on('xumm', async (data) => {
    if(data.uuid){
        const xumm = require("./xumm/xumm.model")
        const wallet = await xumm.findOne({uuid: data.uuid})
        if(!wallet){
            socket.emit("xumm", {message: 'disconnected'})
        }
        else if(!wallet.token_id){
            socket.emit("xumm", {message: 'waiting'})
        }
        else{
            socket.emit("xumm", {message: 'connected', wallet_id: wallet.wallet_id})
        }
    }
    
});
});
global.io = io;
global.usersMap = usersMap;

// api routes
app.use('/users', require('./users/users.controller'));
app.use('/friends', require('./friends/friends.controller'));
app.use('/subscribes', require('./subscribes/subscribes.controller'));
app.use('/notifications', require('./notifications/notifications.controller'));
app.use('/blocks', require('./blocks/block.controller'));
app.use('/chats', require('./chats/chat.controller'));
app.use('/xumm', require('./xumm/xumm.controller'));
app.use('/statistics', require('./statistics/statistics.controller'));


app.use(express.static(path.join(__dirname, "client", "dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
