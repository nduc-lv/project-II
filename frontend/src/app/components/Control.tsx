// mic end cam

import { Button } from "antd";
import Mic from "./Mic";
import PhoneHang from "./PhoneHang";
import Cam from "./Cam";

export default function Controls({handleMic, handleCall, handleCam, width, height}) {
    return (
        <>
         <div className="flex flex-row justify-center gap-2.5">
                {/* Mic */}
                <button onClick={handleMic} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                    <Mic height={height} width={width}></Mic>
                </button>
                <button onClick={handleCall} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                    <PhoneHang height={height} width={width}></PhoneHang>
                </button>
                <button onClick={handleCam} className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                    <Cam height={height} width={width}></Cam>
                </button>
                {/* Exit */}
                {/* Cam */}
         </div>   
        </>
    )
}