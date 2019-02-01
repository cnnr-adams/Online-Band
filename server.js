const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const User = require('./user');
function generateRoomNumber() {
    let digit;
    do {
        digit = Math.floor(100000 + Math.random() * 900000);
    } while (rooms.has(digit));
    return digit;
}

let rooms = new Map(); // map room IDs to a map of socket IDs to Users
let sockets = new Map(); // connects socket IDs to the room theyre in, for verification purposes
app.get('/', function (req, res) {
    // host react app here
});

io.on('connection', function (socket) {

    socket.on('host', function () {
        if (sockets.has(socket.id)) {
            socket.emit('error', 400, "Already in a server, leave it first!");
        } else {
            let roomNum = generateRoomNumber();
            let roomMap = new Map();
            roomMap.set(socket.id, new User(socket, socket.id));
            rooms.set(roomNum, roomMap);
            sockets.set(socket.id, roomNum);
            socket.emit('host', roomNum);
        }
    });

    socket.on('join', function (roomId) {
        if (sockets.has(socket.id)) {
            socket.emit('error', 400, "Already in a server, leave it first!");
        } else if (!rooms.has(roomId)) {
            socket.emit('error', 404, "Room not found!");
        } else {
            rooms.get(roomId).set(socket.id, new User(socket, socket.id));
            sockets.set(socket.id, roomId);
            let users = [];
            rooms.get(roomId).forEach((user) => {
                users.push(user.getSendObject());
            });
            socket.emit('join', users);
        }
    });

    socket.on('note', function (noteInfo) {
        if (!sockets.has(socketId)) {
            socket.emit('error', 403, "You're not in a server");
        } else {
            let roomId = sockets.get(socket.id);
            rooms.get(roomId).forEach((user, id) => {
                if (id !== socket.id) {
                    user.socket.emit('note', noteInfo);
                }
            });
        }
    });

    socket.on('instrument', function (instrumentInfo) {
        if (!sockets.has(socketId)) {
            socket.emit('error', 403, "You're not in a server");
        } else {
            let roomId = sockets.get(socket.id);
            rooms.get(roomId).forEach((user, id) => {
                if (id !== socket.id) {
                    user.socket.emit('instrument', instrumentInfo);
                }
            });
        }
    });

    socket.on('leave', function () {
        leave(socket.id);
    });

    socket.on('disconnect', function () {
        leave(socket.id);
    });
});

function leave(socketId) {
    if (!sockets.has(socketId)) {
        return;
    }
    let roomId = sockets.get(socketId);
    let delUser = rooms.get(roomId);
    rooms.get(roomId).delete(socketId);
    rooms.get(roomId).forEach((user) => {
        user.socket.emit("clientLeave", delUser);
    });
    sockets.delete(socketId);
}

http.listen(3000, function () {
    console.log("Listening to your every movement on 3000");
})

