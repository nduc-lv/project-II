'use client'
import { useSearchParams } from "next/navigation";
import socket from "../utils/socket/socketIndex";
import Peer from "peerjs";
import { useEffect, useRef, useContext} from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { useState } from "react"
import { Button } from "antd";
import { v4 } from "uuid";
import { RoomContext, RoomProvider } from "../context/RoomContext";
import { UserContext, UserProvider } from "../context/UserContext";
// get peer Id
const roomId = localStorage.getItem("roomId");
const userId = localStorage.getItem("userId");
// const peer = new Peer(undefined, {host:"/", port: "9000"});
// const id = v4();
if (roomId){
    socket.emit("join-room", roomId, userId);
}

export default function VideoCall(){
    const myvideo = useRef<HTMLVideoElement>();
    const peervideo = useRef<HTMLVideoElement>();
    const {myStream, peerStream} = useContext(RoomContext);
    const {userId} = useContext(UserContext);
    useEffect(() => {
        // add stream to media
        if (myStream){
            addStream(myvideo.current, myStream);
        }
        if (peerStream){
            addStream(peervideo.current, peerStream);
        }
        
    }, [myStream, peerStream]);
    const addStream = (video:HTMLVideoElement, stream:MediaStream) => {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
    }
    return(
    <>
            <video ref={myvideo} style={{
                width: "500px", height: "500px" }} muted={true}></video>
            <video ref={peervideo} style={{
                width: "500px", height: "500px" }} id="peerVideo"></video>
    </>
    )
}