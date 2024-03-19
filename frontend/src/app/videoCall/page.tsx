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
import Video from "../components/Video";
import VideosCanva from "../components/VideoCanvaFull";
import Controls from "../components/Control";
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
    const {myStream, peerStream, toggleCamera} = useContext(RoomContext);
    // const {userId} = useContext(UserContext);
    // const {roomId} = useContext(RoomContext);
    // if (roomId) {
    //     socket.emit("join-room", roomId, userId);
    // }
    const handleCam = (e: Event) => {
        e.preventDefault();
        const videoTrack = myStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
    }
    const handleMic = (e: Event) => {
        e.preventDefault();
        const audioTrack = myStream.getTracks().find(track => track.kind === "audio")
        if (audioTrack?.enabled) {
            audioTrack.enabled = false;
        } else {
            audioTrack.enabled = true;
        }
    }
    return(
    <div className="relative">
            {/* <video ref={myvideo} style={{
                width: "500px", height: "500px" }} muted={true}></video> */}
            {/* <Video stream={myStream} width={"100%"}></Video> */}
            {/* <video ref={peervideo} style={{
                width: "500px", height: "500px" }} id="peerVideo"></video> */}
            {/* <Video stream={peerStream} width={"100%"}></Video> */}
            <VideosCanva myStream={myStream} peerStream={peerStream} width={"100%"}>
            </VideosCanva>
            
            <div className="absolute top-[90%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Controls handleCall={()=>{}} handleCam={toggleCamera} handleMic={handleMic} width={"2rem"} height={"2rem"}></Controls>
            </div>
            
            
    </div>
    )
}