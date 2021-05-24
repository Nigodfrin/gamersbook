import { User } from "./User";

export class Notif {
    id: number;
    senderId: number;
    see: boolean;
    receiverId: number;
    notificationType: NotificationTypes;
    eventId: number
    createdOn: Date
    sender: User
    receiver: User
    evenement: Event

    constructor(data){
        if(data){
            console.log(data)
            this.id = data.id,
            this.notificationType = data.notificationType,
            this.senderId = data.senderId,
            this.see = data.see,
            this.receiverId = data.receiverId,
            this.createdOn = data.createdOn,
            this.eventId = data.eventId,
            this.evenement = data.evenement,
            this.receiver = data.receiver,
            this.sender = data.sender
        }
    }
}
export enum NotificationTypes {
    FriendshipInvitation,
    RequestFriendshipResponse, 
    EventInvitation,
    RequestEventParticipation
}