import { Server } from 'socket.io';
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
    "http://localhost:5173", // Local Development
    "https://ping-it-up.vercel.app", // Vercel Frontend Domain
    "https://pingitup-n54z.onrender.com" // Render API Domain
];

const io =new Server(server,{
    cors:{
        origin: allowedOrigins, // Use the updated array of origins
    }
})

export function getReceiverSocketId(userId) {
    return userSocketmap[userId]
}

const userSocketmap = {};

io.on("connection", (socket) => {
    console.log("A user Connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketmap[userId] = socket.id
    }

    io.emit('getOnlineUsers', Object.keys(userSocketmap))

    // --- START: WebRTC Signaling Logic ---
    
    // 1. Handle Call Initiation
    socket.on('callUser', ({ userToCall, from, fromName }) => {
        const receiverSocketId = getReceiverSocketId(userToCall);
        
        if (receiverSocketId) {
            // Emit 'incomingCall' only to the intended recipient
            io.to(receiverSocketId).emit('incomingCall', { 
                from, 
                fromName 
            });
        }
    });

    // 2. Handle WebRTC Signaling (Offer, Answer, ICE Candidates)
    socket.on('signal', ({ to, signalData }) => {
        const receiverSocketId = getReceiverSocketId(to);

        if (receiverSocketId) {
            // Forward the signal data to the receiving user
            io.to(receiverSocketId).emit('signal', { 
                from: userId, // Use the actual userId as the 'from' field
                signalData 
            });
        }
    });

    // 3. Handle Call End
    socket.on('endCall', ({ to }) => {
        const receiverSocketId = getReceiverSocketId(to);
        
        if (receiverSocketId) {
            // Notify the other user that the call has ended
            io.to(receiverSocketId).emit('callEnded');
        }
    });

    // --- END: WebRTC Signaling Logic ---


    socket.on('disconnect', () => {
        console.log("A user Disconnected", socket.id);
        delete userSocketmap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketmap))
    })
})

export { io, app, server };