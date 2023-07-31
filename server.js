const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io')
const server =http.createServer(app)
const io = new Server(server)
const ACTIONS = require('./src/Actions');
const userSocketMap= {

};
function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

io.on('connection', (socket) =>{
    console.log('socket connected',socket.id)
    socket.on(ACTIONS.JOIN,({roomId, username})=>{
        Object.keys(userSocketMap).forEach((socketId) => {
            if (userSocketMap[socketId] === username && socketId !== socket.id) {
              io.to(socketId).emit(ACTIONS.ERROR, {
                message: 'You are already connected with another device.',
              });
              io.sockets.sockets.get(socketId).disconnect(true);
            }
          });

        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients= getAllConnectedClients(roomId);
        clients.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                clients,
                username,
                socketId:socket.id,
            });
        });
    
    
    socket.on(ACTIONS.CODE_CHANGE.toLowerCase(), ({roomId,code})=>{
        //console.log(roomId)
        console.log('recieving',code);
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE.toLowerCase(),{code});
      })
    
       
    });
    socket.on('disconnect', () => {
        // Remove user from userSocketMap when disconnected
        
        const username = userSocketMap[socket.id];
        delete userSocketMap[socket.id];
        console.log(`Socket disconnected: ${socket.id} (${username})`);
      });
    socket.on('disconnecting' ,()=>{
        const rooms =[...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
                socketId: socket.id,
                username: userSocketMap[socket.id],
            })
        });
       delete userSocketMap[socket.id];
       socket.leave();
    })
})


const PORT =process.env.REACT_APP_BACKEND_URL || 5000;
server.listen(PORT, ()=> console.log(`Listening to port  ${PORT}`));






        //   const existingSocketId = Object.keys(userSocketMap).find(
        //     (socketId) => userSocketMap[socketId] === username
        //   );
        
        //   if (existingSocketId) {
        //     // User with the same username already exists, handle accordingly
        //     // For example, you can emit an error message to the client
        //     socket.emit(ACTIONS.ERROR, {
        //       message: 'Username already taken',
        //     });
        //     //return;
        //   }

       // io.to(socketId)


// let isDuplicateSocket = false;

        // Object.keys(userSocketMap).forEach((id) => {
        //   if (userSocketMap[id] === username) {
        //     if (id !== socket.id) {
        //       isDuplicateSocket = true;
        //     }
        //   }
        // });
        
        // if (isDuplicateSocket) {
        //   socket.disconnect(true);
        //   return;
        // }


