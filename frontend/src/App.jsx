import React, { useEffect, useRef, useState } from 'react';
import PeerToPeerChat from './pages/PeerToPeerChat';
import RoomPage from './pages/RoomPage';
import CreateRoom from './components/room/create-room/CreateRoom';
import Room from './components/room/Room';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const SERVER_URL = 'http://localhost:8000'; // Change for production

const App = () => {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<CreateRoom />}/>
          <Route path="/room/:roomId" element={<Room />}/>
        </Routes>
      </Router>
    </>
  );
};

export default App;
