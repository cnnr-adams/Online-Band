export default class User {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
    }
    getSendObject() {
        let sendObject = new Map();
        sendObject.add(id);
        return sendObject;
    }
}