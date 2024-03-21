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

// const peer = new Peer(undefined, {host:"/", port: "9000"});
// const id = v4();

export default function VideoCall(){
    const myvideo = useRef<HTMLVideoElement>();
    const peervideo = useRef<HTMLVideoElement>();
    const {myStream, peerStream, roomId, checkInRoom} = useContext(RoomContext);
    const {userId} = useContext(UserContext);
    useEffect(() => {
        console.log("in room status", checkInRoom.current)
        if (checkInRoom.current == false){
            socket.emit("join-room", roomId, userId);
            checkInRoom.current = true;
        }
    }, [])
    // const {userId} = useContext(UserContext);
    // const {roomId} = useContext(RoomContext);
    // if (roomId) {
    //     socket.emit("join-room", roomId, userId);
    // }
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
                <Controls handleCall={()=>{}} width={"2rem"} height={"2rem"}></Controls>
            </div>
            
            
    </div>
    )
}