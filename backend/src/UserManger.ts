import { Socket } from "socket.io";
import { RoomManger } from "@src/RoomManager";
import { uuid } from "uuidv4";
interface User{
    userName: string;
    socket: Socket;
}

export class UserManager{
    private waitlist:Array<User>;
    private userList:Array<User>;
    private roomManager:RoomManger;
    constructor(){
        this.roomManager = new RoomManger();
        this.waitlist = new Array<User>;
        this.userList = new Array<User>;
    }

    addUser(user: User){
        this.userList.push(user);
    }

    matchUser(user: User){
        if (this.waitlist.length == 0){
            this.waitlist.push(user);
        }
        else{
            for (let i = 0; i < this.waitlist.length; i++){
                if (user.userName != this.waitlist[i].userName){
                    const roomId = uuid();
                    user.socket.emit("found-peer", roomId);
                    this.waitlist[i].socket.emit("found-peer", roomId);
                    this.waitlist.splice(i, 1);
                    return;
                }
            }
            this.waitlist.push(user);
        }
    }

    // need functions to communicate to users in the room
}