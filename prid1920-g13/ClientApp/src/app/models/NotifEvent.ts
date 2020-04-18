import { User } from "./User";
import { Notif } from "./Notif";

export class NotifEvent {
    notif: Notif;
    users: User[];

    constructor(data){
        if(data){
            this.notif = data.notif,
            this.users = data.users   
        }
    }
}