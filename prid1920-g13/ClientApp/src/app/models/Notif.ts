export class Notif {
    id: number;
    senderId: number;
    see: boolean;
    receiverId: number;
    notificationType: NotificationTypes;
    eventId: number
    createdOn: Date

    constructor(data){
        if(data){
            this.id = data.id,
            this.notificationType = data.notificationType,
            this.senderId = data.senderId,
            this.see = data.see,
            this.receiverId = data.receiverId,
            this.createdOn = data.createdOn,
            this.eventId = data.eventId
        }
    }
}
export enum NotificationTypes {Friendship, Event}