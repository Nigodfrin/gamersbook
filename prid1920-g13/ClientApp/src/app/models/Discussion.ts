import { Message } from "./Message";
import { User } from "./User";

export class Discussion {
    id: number;
    messages: Message[] = [];
    participants: string [];

    constructor(data) {
        if(data){
            this.messages = data.messages;
            this.participants = data.participants;
            this.id = data.id;
        }
    }
}