'use client'
import socket from "../utils/socket/socketIndex";
import { useState, useContext, useEffect, createContext, useRef} from "react";
import Peer from "peerjs";
import { UserContext } from "./UserContext";
import { useRouter } from "next/navigation";
import { MediaConnection } from "peerjs";
import { Dispatch, SetStateAction } from "react";
interface RoomValue{
    myStream: MediaStream,
    peerStream: MediaStream,
    toggleCamera: any,
    roomId: string | undefined,
    setRoomId: Dispatch<SetStateAction<string | undefined>>
}

export const RoomContext = createContext<RoomValue>({})
export const RoomProvider = ({children}) => {
    const [myPeer, setMyPeer] = useState<Peer>();
    const [myStream, setMyStream] = useState<MediaStream>();
    const [peerStream, setPeerStream] = useState<MediaStream>();
    const [roomId, setRoomId] = useState<string>();
    const {interests, setInterests, userId, setUserId} = useContext(UserContext);
    const [audio, setAudio] = useState<boolean>(true)
    const video = useRef<boolean>(true)
    const [count, setCount] = useState(1);
    const router = useRouter();
    let callSave = useRef<MediaConnection>()
    let currStream;
    // 2 things need to do
    // return myStream
    // return peerStream
    useEffect(() => {
        // only run when the userId change
        // create peer connection to the peer server
        console.log("connect to peer server and get media")
        if (!userId){
            return;
        }
        const peer = new Peer(userId, {
            host: "localhost",
            port: 9000,
        });
        setMyPeer(peer);
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).
        then((stream) => {
            console.log(stream.getTracks());
            setMyStream(stream);
        })
        // get the media
    }, [userId]);

    useEffect(() => {
        // run when peer and stream change (set is invoked)
        console.log("add listener");
        if (!myPeer){
            return;
        }
        if (!myStream){
            return;
        }
        // call peer
        // need be call first before emit
        socket.on("user-connected", (peerId) => {
            // localStorage.setItem("peerId", peerId);
            console.log("call");
            console.log("this guy");
            console.log(peerId);
            callSave.current = myPeer.call(peerId, myStream);
            console.log(myStream.getTracks());
            callSave.current.on("stream", (incomingStream) => {
                console.log(incomingStream.getVideoTracks()[0]);
                setPeerStream(incomingStream);
            })
        })
        // listen if anyone called?
        myPeer.on("call", (call) => {
            console.log(myStream.getAudioTracks())
            callSave.current = call;
            callSave.current.on("stream", (incomingStream) => {
                console.log(incomingStream.getVideoTracks()[0]);
                setPeerStream(incomingStream);
            })
            console.log(myStream.getVideoTracks()[0]);
            callSave.current.answer(myStream);
            console.log(call);
            
        })
        return () => {
            socket.off("user-connected");
        }
    }, [myPeer, myStream]);
    const toggleCamera = (e:Event) => {
        // disable camera
        
        // navigator.mediaDevices.getUserMedia({audio: true, video: !video}).then(
        //     (stream) => {
        //         console.log(callSave.current?.peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0]));
        //         setMyStream(stream);
        //         setVideo(!video);
        //     }
        // )
        // if (video){
        //     callSave.current?.peerConnection.getSenders()[1].track.stop();
        // }
        // else{
        //     navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(
        //         (stream)=>{
        //             callSave.current?.peerConnection.addTrack(stream.getVideoTracks()[0])
        //             setMyStream(stream);
        //         }
        //     )
        // }
        // setVideo(!video);
        // callSave.current.localStream.getVideoTracks()[0].enabled = !video;
        // myStream.getVideoTracks()[0].enabled = !video;
        // setMyStream(callSave.current.localStream);
        // setVideo(!video);
        // video = !video;

        // stop media stream -> my stream .stop
        // media stream remove
        // turn off
        if (video.current == true ){
            myStream.getVideoTracks()[0].stop();
            myStream.removeTrack(myStream.getVideoTracks()[0]);
            console.log(callSave.current.localStream.getVideoTracks());
            console.log(callSave.current?.peerConnection.getSenders());
            video.current = false;
        }
        // turn on
        else{
            navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => {
                myStream.addTrack(stream.getTracks()[0]);
                console.log(callSave.current.localStream.getVideoTracks());
                console.log(callSave.current?.peerConnection.getSenders());
                callSave.current?.peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0]);
                video.current = true;
            });
        }
    };
    return (
        <RoomContext.Provider value={{
            myStream,
            peerStream,
            toggleCamera,
            setRoomId,
            roomId
        }}>
            {children}
        </RoomContext.Provider>
    )
}