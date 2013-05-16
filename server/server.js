// Keep track of the chat clients
var users = [];

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});
wss.on('connection', function(ws) {
    
    ws.on('message', function(message) {
        if (!ws.name){
            console.log(message + ' joined the chat');
            ws.name = message;
            users.push(ws);
            ws.send('current chatters:');
            for (var i = 0; i < users.length; i++){
                if (users[i] != ws){
                    ws.send(users[i].name);
                    users[i].send(ws.name + " has joined the chat");
                }
            }
        } else {
            console.log('%s: %s', ws.name, message);
            for (var i = 0; i < users.length; i++) {
                if (users[i] != ws){
                    users[i].send(ws.name + ": " + message);
                }
            }
        }
    });

    ws.on('close', function() {
        if (ws.name) {
            console.log(ws.name + ' left the chat');
            for (var i = 0; i < users.length; i++){
                if (users[i] != ws){
                    users[i].send(ws.name + " left the chat");
                } else {
                    users.splice(i, 1);
                }
            }
        }
    });
    ws.send('enter your name');
});
 
// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 8080\n");