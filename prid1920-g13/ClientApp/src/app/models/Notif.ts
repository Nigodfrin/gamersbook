export class Notif {
    type: string;
    senderPseudo: string;
    see: boolean;

    constructor(data){
        if(data){
            this.type = data.type,
            this.senderPseudo = data.senderPseudo,
            this.see = data.see
        }
    }
}