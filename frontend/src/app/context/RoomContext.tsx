'use client'
import socket from "../utils/socket/socketIndex";
import { useState, useContext, useEffect, createContext} from "react";
import Peer from "peerjs";
import { UserContext } from "./UserContext";

interface RoomValue{
    myStream: MediaStream,
    peerStream: MediaStream
}
export const RoomContext = createContext<RoomValue>({})
export const RoomProvider = ({children}) => {
    const [myPeer, setMyPeer] = useState<Peer>();
    const [myStream, setMyStream] = useState<MediaStream>();
    const [peerStream, setPeerStream] = useState<MediaStream>();
    const {interests, setInterests, userId, setUserId} = useContext(UserContext);
    const roomId = localStorage.getItem("roomId");
    // 2 things need to do
    // return myStream
    // return peerStream
    useEffect(() => {
        // create peer connection to the peer server
        if (!roomId){
            return;
        }
        const peer = new Peer(userId, {
            host: "localhost",
            port: 9000,
        });
        setMyPeer(peer);
        // get the media
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then((stream) => {
            setMyStream(stream);
        })
    }, [userId, roomId]);

    useEffect(() => {
        if (!myPeer || !myStream){
            return;
        }
        // call peer
        socket.on("user-connected", (peerId) => {
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

    return (
        <RoomContext.Provider value={{
            myStream,
            peerStream
        }}>
            {children}
        </RoomContext.Provider>
    )
}