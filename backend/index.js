const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require('http');

require('dotenv').config();


const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const room = {};
const userMeta = {};
io.on('connection', socket => {
    // console.log("new User connected", socket.id);

    socket.on('join-room', ({ roomId, userId, userName }) => {
        socket.join(roomId);
        userMeta[socket.id] = { roomId, userId, userName };
        console.log(`${userName} joined the room ${roomId}`);
        if (!room[roomId]) room[roomId] = [];

        room[roomId].push(userId);

        // notify the others abt some one joining 
        socket.to(roomId).emit('user-joined', userName);
        
          // Broadcast updated user list to room
        broadcastUsersInRoom(roomId);   

        // handle WEBRTC offer
        socket.on('offer', ({ target, sdp, caller }) => {
            socket.to(target).emit('offer', { sdp, caller });
        });

        // Handle WebRTC answer
        socket.on('answer', ({ target, sdp, callee }) => {
            socket.to(target).emit('answer', { sdp, callee });
        });


        // Handle ICE candidates
        socket.on('ice-candidate', ({ target, candidate, from }) => {
            socket.to(target).emit('ice-candidate', { candidate, from });
        });

        // handle disconnection
        // socket.on('disconnect', () => {
        //     console.log(`${userId} disconnected from room ${roomId}`);
        //     room[roomId] = room[roomId].filter(id => id !== userId);
        //     socket.to(roomId).emit('user-disconnected', userId);
        // });


        socket.on("send-message", ({roomId, message}) => {
            socket.to(roomId).emit("receive-message", message);
            console.log(roomId); 
        });
    });






    socket.on('disconnect', () => {
        const info = userMeta[socket.id];
        if (info) {
            const { roomId, userId, userName } = info;

            console.log(`❌ ${userName} (${userId}) disconnected from room ${roomId}`);

            room[roomId] = room[roomId]?.filter(id => id !== userId);
            socket.to(roomId).emit('user-disconnected', userId);

            delete userMeta[socket.id];
            broadcastUsersInRoom(roomId);
        }

          // Broadcast updated user list to room
    });
}); 


function broadcastUsersInRoom(roomId) {
    const usersInRoom = Object.values(userMeta)
        .filter(meta => meta.roomId === roomId)
        .map(meta => ({ userId: meta.userId, userName: meta.userName }));

    io.to(roomId).emit('users-in-room', usersInRoom);
}

const PORT = process.env.PORT;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
