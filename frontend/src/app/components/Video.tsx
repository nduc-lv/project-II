import { useRef, useEffect } from "react"

interface Props{
    stream: MediaStream,
    width: string,
    muted: boolean,
}

export default function Video({stream, width, muted}: Props) {
    const ref = useRef<HTMLVideoElement>();
    useEffect(() => {
        if (ref.current && stream){
            console.log("hi");
            ref.current.srcObject = stream;
            ref.current.addEventListener("loadeddata", () => {
                ref.current?.play();
            })
        }
    }, [stream])
    return (
        <>
             <div className="h-full">
                    <div className="w-full h-full rounded-3xl shadow-2xl aspect-video bg-black overflow-hidden">
                            <video width={width} muted={muted} style={{objectFit: "cover"}} height={"100%"} ref={ref}>
                            </video>
                </div>
            </div>
        </>
    )
}