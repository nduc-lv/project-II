'use client'
import socket from "../utils/socket/socketIndex";
import { useState, useContext, useEffect, createContext} from "react";
import Peer from "peerjs";
import { UserContext } from "./UserContext";
import { useRouter } from "next/navigation";

interface RoomValue{
    myStream: MediaStream,
    peerStream: MediaStream,
    toggleMute: any
}
const roomId = localStorage.getItem("roomId");
export const RoomContext = createContext<RoomValue>({})
export const RoomProvider = ({children}) => {
    const [myPeer, setMyPeer] = useState<Peer>();
    const [myStream, setMyStream] = useState<MediaStream>( new MediaStream());
    const [peerStream, setPeerStream] = useState<MediaStream>( new MediaStream());
    const {interests, setInterests, userId, setUserId} = useContext(UserContext);
    const [audio, setAudio] = useState<boolean>(true)
    const [video, setVideo] = useState<boolean>(true);
    const router = useRouter();
    // 2 things need to do
    // return myStream
    // return peerStream
    useEffect(() => {
        // create peer connection to the peer server
        if (!roomId){
            router.push("/");
            return;
        }
        const peer = new Peer(userId, {
            host: "localhost",
            port: 9000,
        });
        setMyPeer(peer);
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then((stream) => {
            setMyStream(stream);
        })
        // get the media
    }, [userId, roomId]);

    useEffect(() => {
        if (!myPeer || !myStream){
            return;
        }
        // call peer
        socket.on("user-connected", (peerId) => {
            localStorage.setItem("peerId", peerId);
            myStream.getVideoTracks()[0].enabled = true;
            const call = myPeer.call(peerId, myStream);
            call.on("stream", (incomingStream) => {
                setPeerStream(incomingStream);
            })
        })
        // listen if anyone called?
        myPeer.on("call", (call) => {
            call.answer(myStream);
            call.on("stream", (incomingStream) => {
                setPeerStream(incomingStream);
            })
        })
        return () => {
            socket.off("user-connected");
        }
    })
    const toggleMute = (e:Event) => {
        e.preventDefault();
        setVideo(!video);
    }
    return (
        <RoomContext.Provider value={{
            myStream,
            peerStream,
            toggleMute,
        }}>
            {children}
        </RoomContext.Provider>
    )
}