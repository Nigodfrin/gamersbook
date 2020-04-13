import { Game } from "./Game";

import { User } from "./User";

export enum EventsType {
    Public,
    AllFriends,
    SelectedFriendsOrGroups
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
    eventGame: Game
    participants: User[]
    constructor(data) {
        if (data) {
            this.id = data.id,
                this.name = data.name,
                this.description = data.description,
                this.start_date = data.start_date,
                this.end_date = data.end_date,
                this.langue = data.langue,
                this.nbUsers = data.nbUsers,
                this.eventType = data.eventType,
                this.eventGame = data.eventGame,
                this.participants = data.participants
        }
    }
}