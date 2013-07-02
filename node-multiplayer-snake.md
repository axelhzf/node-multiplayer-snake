# Multiplayer Snake Game

## TLP2K13

Axel Hernández Ferrera

---

## Websockets

Websockets permite establecer una conexión permanente entre el navegador y el servidor.

El cliente y el servidor pueden enviar información en cualquier momento.

[Artículo de introducción a websockets](http://www.html5rocks.com/en/tutorials/websockets/basics/)

---

## Node.js

---

## Express.js


---

## Socket.io

Realtime application framework for Node.JS, with HTML5 WebSockets and cross-browser fallbacks support.

---

## Socket.io

- Client : crowss browser, including mobile & internet explorer 5!
- Server : NodeJS

---

## Socket.io : client

Transports

- WebSocket
- Adobe® Flash® Socket
- AJAX long polling
- AJAX multipart streaming
- Forever Iframe
- JSONP Polling

---

## Socket.io

Instalación

    npm install socket.io --save

## Socket.io

Instalación del cliente con bower

    bower search socket.io
    bower install socket.io-client

    <script src="components/socket.io-client/dist/socket.io.js"></script>

# Socket.io + Express

    var io = require('socket.io');

    var server = http.createServer(app);
    io.listen(server);
    server.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });

# Node-dev

    npm install  node-dev --save-dev
    npm install --save underscore


    bower install backbone.babysitter
