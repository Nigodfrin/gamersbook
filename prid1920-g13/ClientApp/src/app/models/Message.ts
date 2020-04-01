import { User } from "./User";

export class Message {
    senderId: number;
    receiverId: number;
    messageText: string;

    constructor(data){
        if(data){
            this.senderId = data.sender;
            this.receiverId = data.receiver;
            this.messageText = data.messageText;
        }
    }

}