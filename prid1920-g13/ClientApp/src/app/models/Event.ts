import { Game } from "./Game";
import { User } from "./User";

export enum AccessType {
    Public,
    Friends,
    ParticularFriend
}

export class Event
{
    id: number;
    name: string
    description: string
    start_date: Date
    end_date: Date
    langue: string
    nbUsers: string
    accessType: AccessType
    createdByUserId: number;
    gameId: number;
    game: Game;
    participants: User[];
    constructor(data) {
        if (data) {
                this.id = data.id,
                this.name = data.name,
                this.description = data.description,
                this.start_date = data.start_date,
                this.end_date = data.end_date,
                this.langue = data.langue,
                this.nbUsers = data.nbUsers,
                this.accessType = data.accessType,
                this.createdByUserId = data.createdByUserId,
                this.gameId = data.gameId,
                this.game = data.game,
                this.participants = data.participants
        }
    }
}