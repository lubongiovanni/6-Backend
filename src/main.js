const fs = require('fs');
const express = require('express');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');


const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('../public'));


const products = [];
const messages = [];

io.on('connection', async socket => {
    console.log('¡Un nuevo cliente se ha conectado!');

    socket.emit('products', products);

    socket.emit('chat', messages);    

    socket.on('update', product => {
        products.push(product)
        io.sockets.emit('products', products);
    });

    socket.on('chat', message => {
        messages.push(message)
        try {
            fs.writeFileSync('../messages.txt',JSON.stringify(messages, null, 2));
        } catch (error) {
            console.log(error);
        }
        io.sockets.emit('chat', messages);
    });
});

const PORT = 8084;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on('error', error => console.log(`Error en el servidor ${error}`));