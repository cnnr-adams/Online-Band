
import io from 'socket.io-client';
export default class Backend {
    constructor(onConnected, onDisconnected) {
        this.onConnected = onConnected;
        this.onDisconnected = onDisconnected;
        this.connected = false;
        this.socket = io("localhost:3000");
        this.socket.on('connection', () => {
            console.log('connected!');
        })
        this.socket.on('disconnect', onDisconnected);
        this.users = new Map();
    }

    handleError(error) {
        console.error(error);
    }

    onNewUsers(callback) {
        this.socket.on('newUser', (userData) => {
            let user = new User(userData);
            this.users.set(user.id, user);
            callback(userData);
        });
    }
    onLeaveUsers(callback) {
        this.socket.on('clientLeave', (userId) => {
            this.users.delete(userId);
            callback(userId);
        });
    }
    host = () => {
        if (this.connected) {
            return;
        }
        this.socket.emit("host");
        this.socket.on("host", (error, lobbyId) => {
            if (error) {
                this.handleError();
                return;
            }
            this.connected = true;
            this.onConnected(lobbyId);
        });
    }

    join = (lobbyId) => {
        this.socket.emit("join", lobbyId);
        this.socket.on("join", (error, cUsers) => {
            if (error) {
                this.handleError();
                return;
            }
            this.connected = true;
            cUsers.forEach(user => {
                let u = new User(user);
                this.users.set(u.id, u);
            });
            this.onConnected(lobbyId);
        });
    }

    error(statusCode, status) {
        console.error("Error", statusCode, ":", status);
    }
}

class User {
    constructor(data) {
        data = new Map(data);
        this.id = data.get("id");
    }
}


