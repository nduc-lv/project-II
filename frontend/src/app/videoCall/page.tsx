'use client'
import { useSearchParams } from "next/navigation";
import socket from "../utils/socket/socketIndex";
import Peer from "peerjs";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import { useState } from "react"
import { Button } from "antd";
import { v4 } from "uuid";


// get peer Id
const roomId = localStorage.getItem("roomId");
// const peer = new Peer(undefined, {host:"/", port: "9000"});
// const id = v4();
let check = 1;
export default function VideoCall(){
    const [myPeer, setMyPeer] = useState<Peer>();
    const [myStream, setMyStream] = useState<MediaStream>();
    const router = useRouter();
    if (!localStorage.getItem("roomId")){
        router.push("/");
    }
    const myvideo = useRef();
    const peervideo = useRef(null);
    useEffect(() => {
        const peer = new Peer( undefined, {host:"/", port: "9000"});
        peer.on("open", (id) => {
            localStorage.setItem("myId", id); 
        })
        setMyPeer(peer);
        navigator.mediaDevices.getUserMedia({video: true, audio:true})
        .then((stream: MediaStream) => {
            setMyStream(stream);
            addVideoStream(myvideo.current, stream);
        });
    }, []);

    useEffect(() => {
        if (!myPeer){
            return;
        }
        if (!myStream){
            return;
        }
        
        socket.on("user-connected", (peerId) => {
            console.log("this guy call", peerId);
            const call = myPeer.call(peerId, myStream);
            call.on("stream", (userStream) => {
                addVideoStream(peervideo.current, userStream)
            })
            call.on("close", () => {
                peervideo.current.remove();
            })
        })
        if (check == 1){
            const myId = localStorage.getItem("myId")
            console.log(myId);
            if (myId){
                socket.emit("join-room", roomId, myId);
                check = 2;
            }
        }
        myPeer.on("call", (call) => {
            console.log("this guy answer")
            call.answer(myStream);
            call.on("stream", (userStream) => {
                addVideoStream(peervideo.current, userStream)
            })
            call.on("close", () => {
                peervideo.current.remove();
            })
        })
        return () => {
            socket.off("user-connected")
        }

        
    }, [myPeer, myStream]);

    const addVideoStream = (video, stream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
        video.play()
  });
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