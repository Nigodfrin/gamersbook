import { Message } from "./Message";
import { User } from "./User";

export class Discussion {
    messageList: Message[];
    participants: User [];

    constructor(data) {
        if(data){
            this.messageList = data.messageList;
            this.participants = data.participants;
        }
    }
}