// mic end cam

import { Button } from "antd";
import Mic from "./Mic";
import PhoneHang from "./PhoneHang";
import Cam from "./Cam";
import { useContext, useRef, useState, useEffect} from "react";
import { RoomContext } from "../context/RoomContext";



export default function Controls({handleCall, width, height}) {
    const [video,setVideo] = useState<boolean>(true);
    const [audio, setAudio] = useState<boolean>(true);
    const {call, myStream} = useContext(RoomContext);

    const toggleCamera = () => {
        if (video){
            // disable camera
            myStream?.getVideoTracks()[0].stop();
            myStream?.removeTrack(myStream.getVideoTracks()[0]);
            setVideo(false);
        }
        else {
            // turn on camera
            navigator.mediaDevices.getUserMedia({video: true})
            .then((stream) => {
                myStream?.addTrack(stream.getVideoTracks()[0]);
                call?.peerConnection.getSenders()[1].replaceTrack(stream.getVideoTracks()[0]);
                setVideo(true);
            })
        }
    }
    const toggleMic = () => {
        if (audio){
            // disable mic
            myStream!.getAudioTracks()[0].enabled = false;
            setAudio(false);
        }
        else{
            // enable mic
            myStream!.getAudioTracks()[0].enabled = true;
            setAudio(true);
        }
    }
    const stopCall = () => {
        call?.close();
    }
    return (
        <>
         <div className="flex flex-row justify-center gap-2.5">
                {/* Mic */}
                <button onClick={toggleMic} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                    <Mic height={height} width={width}></Mic>
                </button>
                <button onClick={stopCall} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                    <PhoneHang height={height} width={width}></PhoneHang>
                </button>
                <button onClick={toggleCamera} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                    <Cam height={height} width={width}></Cam>
                </button>
                {/* Exit */}
                {/* Cam */}
         </div>   
        </>
    )
}