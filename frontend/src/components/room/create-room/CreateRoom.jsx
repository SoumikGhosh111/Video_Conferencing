import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import { v4 as uudidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import "./CreateRoom.css";

const socket = io("http://localhost:8000/");
const CreateRoom = () => {
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [userName, setUserName] = useState("");
    const [userId] = useState(`user-${uudidv4()}`);
    const navigate = useNavigate(); 
    const handleCreateRoom = () => {
        if (userName.trim().length === 0) {
            alert("User Name Required");
            return;
        }
        const newRoomId = `room-${uudidv4()}`;
        const newUserId = `user-${uudidv4()}`;
        // window.location.href = `/?room=${newRoomId}&userId=${newUserId}&userName=${userName}`;

        if (userName.trim()) {
            navigate(`/room/${newRoomId}?userName=${encodeURIComponent(userName)}&userId=${userId}`);
        } else {
            alert("Please enter your username");
            return; 
        }


    }

    const handleJoinRoom = () => {
        if (roomId.trim() && userName.trim()) {
            navigate(`/room/${roomId}?userName=${encodeURIComponent(userName)}&userId=${userId}`);
        } else {
            alert("Enter both room ID and username");
            return; 
        }
    };


    // useEffect(() => {
    //     const paramSearch = new URLSearchParams(window.location.search);
    //     const room = paramSearch.get("room");
    //     const userName = paramSearch.get("userName");
    //     const userId = paramSearch.get("userId");

    //     if (room) {
    //         socket.emit('join-room', { roomId: room, userId: userId, userName: userName });
    //         setRoomId(roomId);
    //         setUSerId(userId);
    //         setUserName(userName);
    //         setJoined(true);
    //     }
    // }, [])

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Create or Join a Room</h2>
            <input
                required
                type="text"
                placeholder="Your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <br /><br />
            <button onClick={handleCreateRoom}>Create Room</button>
            <br /><br />
            <input
                type="text"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <button onClick={handleJoinRoom}>Join Room</button>
        </div>
    )
}

export default CreateRoom