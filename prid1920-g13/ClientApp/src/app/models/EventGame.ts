import { Game } from "./Game";

import { User } from "./User";

export enum EventsType {
    Public,
    Friends,
    ParticularFriend
}
export class EventGame {
    id: number;
    name: string
    description: string
    start_date: Date
    end_date: Date
    langue: string
    nbUsers: string
    eventType: EventsType
    constructor(data) {
        if (data) {
            this.id = data.id,
                this.name = data.name,
                this.description = data.description,
                this.start_date = data.start_date,
                this.end_date = data.end_date,
                this.langue = data.langue,
                this.nbUsers = data.nbUsers,
                this.eventType = data.eventType
        }
    }
}