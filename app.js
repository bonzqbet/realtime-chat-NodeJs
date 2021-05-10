// const express = require("express");
var express = require("express");
const socketio = require("socket.io");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', ( req,res ) => {
    res.render('index');
})

// start server
const server = app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running...");
});

// initialize socket.io for ther server
const io = socketio(server);

io.on("connection",function(socket){
    console.log("New user connected");

    socket.username = "Anonymous";
    socket.on("change_username",data => {
        socket.username = data.username;
    })

    //handle the new message event
    socket.on('new_message',data =>{
        console.log('new massage');
        io.sockets.emit("receive_message", { message : data.message, username : socket.username });
    });

    socket.on('typing', data =>{
        console.log('typing');
        socket.broadcast.emit('typing', { username : socket.username })
    });
});

