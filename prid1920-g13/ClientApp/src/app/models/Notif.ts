export class Notif {
    uuid: string;
    type: string;
    senderPseudo: string;
    see: boolean;
    uuidEvent: string;

    constructor(data){
        if(data){
            this.uuid = data.uuid,
            this.type = data.type,
            this.senderPseudo = data.senderPseudo,
            this.see = data.see,
            this.uuidEvent = data.uuidEvent
        }
    }
}