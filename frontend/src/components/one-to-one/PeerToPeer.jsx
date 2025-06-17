import React, { useState, useEffect, useRef } from 'react';
import "./PeerToPeer.css";

import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { FaMicrophoneLines } from "react-icons/fa6";
import { FaMicrophoneLinesSlash } from "react-icons/fa6";




const PeerToPeer = () => {
    const localVidRef = useRef();
    const remoteVidRef = useRef();
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);

    // for local user cam and mic on off 
    const [mic, setMic] = useState(true);
    const [cam, setCam] = useState(true);


    // to req for cam and mic access when ever the page will load
    useEffect(() => {
        const handleLocalMediaRequest = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                if (localVidRef.current) {
                    localVidRef.current.srcObject = stream;
                    setLocalStream(stream);
                }

            } catch (e) {
                console.log(e.message);
            }
        }

        handleLocalMediaRequest();
        // stop the video when ever the component unmounts 
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        }
    }, []);


    const toggleLocalVideo = async () => {
        if (!localStream) return;
        if (cam) {
            localStream.getVideoTracks().forEach(track => track.stop());
            if (localVidRef.current) {
                localVidRef.current.srcObject = null; // Helps release the video stream faster
                // Assign only audio
                localVidRef.current.srcObject = new MediaStream(localStream.getAudioTracks());
            }

            setLocalStream(new MediaStream(localStream.getAudioTracks()));
            setCam(false);
        } else {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
                const videoTrack = newStream.getVideoTracks()[0];

                // Replace the old video track in the local stream
                const updatedStream = new MediaStream([...localStream.getAudioTracks(), videoTrack]);

                // Set video element and state
                localVidRef.current.srcObject = updatedStream;
                setLocalStream(updatedStream);
                setCam(true);
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        }
        setCam(!cam);
    }


    const toggleLocalAudio = () => {
        if (!localStream) return;
        localStream.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });

        setMic(!mic);
    }



    return (
        <div className='peer-to-peer-wrapper'>

            <div className='media-feed'>
                {/* user 1 video audio local stream */}
                <div className='user-1'>
                    <video ref={localVidRef} autoPlay playsInline className='user-1-video' />
                </div>

                {/* user 2 video audio remote stream */}
                <div className='user-2'>
                    <video ref={remoteVidRef} autoPlay playsInline muted className='user-2-video' />
                </div>
            </div>

            <div className='option-buttons'>
                <button className='camera-toggle' onClick={toggleLocalVideo}>{cam ? <FaVideo /> : <FaVideoSlash />}</button>
                <button className='mic-toggle' onClick={toggleLocalAudio}>{mic ? <FaMicrophoneLines /> : <FaMicrophoneLinesSlash />}</button>
            </div>
        </div>
    )
}

export default PeerToPeer