import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { io } from 'socket.io-client'
import "./Room.css"

const socket = io("https://video-conferencing-vsoe.onrender.com/");
const Room = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [newJoined, setNewJoined] = useState("");
    const { roomId } = useParams();
    const [search] = useSearchParams();
    const userId = search.get("userId");
    const userName = search.get("userName");

    useEffect(() => {
        console.log(roomId, userName, userId);
        if (roomId && userName && userId) {

            socket.emit("join-room", { roomId: roomId, userName: userName, userId: userId });
        }


        const handleReceiveMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        const handleUsersInRoom = (userList) => {
            setUsers(userList);
        };

        const handleNewUserJoined = (user) => {
            setNewJoined(user);
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("users-in-room", handleUsersInRoom);
        socket.on("users-joined", handleNewUserJoined);

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("users-in-room", handleUsersInRoom);
            socket.off("users-joined", handleNewUserJoined);
        }
    }, [roomId, userName, userName]);



    const handleSend = () => {
        if (message.trim()) {
            const msg = { userName, text: message };
            socket.emit("send-message", { roomId, message: msg });
            setMessages((prev) => [...prev, msg]); // Local echo
            setMessage("");
        }
    };


    return (
        <div style={{ padding: "2rem" }}>
            <h2>Room ID: {roomId}</h2>
            <h3>Welcome, {userName}</h3>

            <div style={{ margin: "1rem 0" }}>
                <strong>Participants:</strong>
                <ul>
                    {users.map((user) => (
                        <li key={user.userId}>{user.userName}</li>
                    ))}
                </ul>
            </div>

            <div style={{
                border: "1px solid #ccc",
                padding: "1rem",
                height: "300px",
                overflowY: "auto",
                marginBottom: "1rem"
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <strong>{msg.userName}:</strong> {msg.text}
                    </div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{ marginRight: "0.5rem" }}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Room