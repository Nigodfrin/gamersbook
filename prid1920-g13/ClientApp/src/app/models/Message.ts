import { User } from "./User";

export class Message {
    sender: number;
    receiver: number;
    messageText: string;
    discussionId: number;

    constructor(data){
        if(data){
            this.sender = data.sender;
            this.receiver = data.receiver;
            this.messageText = data.messageText;
            this.discussionId = data.discussionId;
        }
    }

}