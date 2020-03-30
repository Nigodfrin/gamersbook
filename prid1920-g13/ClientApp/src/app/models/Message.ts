import { User } from "./User";

export class Message {
    senderPseudo: string;
    receiverPseudo: string;
    messageText: string;

    constructor(data){
        if(data){
            this.senderPseudo = data.senderPseudo;
            this.receiverPseudo = data.receiverPseudo;
            this.messageText = data.messageText;
        }
    }

}