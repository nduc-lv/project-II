'use client'
import { useContext, useEffect } from "react";
import { RoomContext } from "../context/RoomContext";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";

export default function EndCall(){
    const {setMyStream, setRoomId} = useContext(RoomContext)
    const {setUserId} = useContext(UserContext);
    useEffect(() => {
        setMyStream(null)
        setRoomId(null)
        setUserId(null)
    });
    const router = useRouter()
    return (
        <>
            <h1>End Call</h1>
            <Button onClick={() => {router.push("/")}}> Go back </Button>
        </>
    ) 
}