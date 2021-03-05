export class Notif {
    uuid: string;
    type: string;
    senderId: number;
    see: boolean;
    uuidEvent: string;

    constructor(data){
        if(data){
            this.uuid = data.uuid,
            this.type = data.notificationType,
            this.senderId = data.senderId,
            this.see = data.see,
            this.uuidEvent = data.uuidEvent
        }
    }
}