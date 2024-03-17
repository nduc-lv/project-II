'use client'
import { useSearchParams } from "next/navigation";
import socket from "../utils/socket/socketIndex";
import Peer from "peerjs";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactPlayer from "react-player";


const myPeer = new Peer(undefined, {host:"/", port: "9000"});
myPeer.on('connection', function(conn) {
    conn.on('data', function(data){
      // Will print 'hi!'
      console.log(data);
    });
  });
socket.on("user-connected", (peerId: string) => {
    var conn = myPeer.connect(peerId);
    // on open will be launch when you successfully connect to PeerServer
    conn.on('open', function(){
        console.log("success");
        // here you have conn.id
        conn.send('hi!');
    });
})
const roomId = localStorage.getItem("roomId");
if (roomId){
    myPeer.on("open", (id) => {
        socket.emit("join-room", roomId, id);
    })
}
export default function VideoCall(){
    const router = useRouter();
    if (!localStorage.getItem("roomId")){
        router.push("/");
    }
    return(
        <>
            <h1>Hi</h1>
            <ReactPlayer url = {datastream}></ReactPlayer>
        </>
    )
}