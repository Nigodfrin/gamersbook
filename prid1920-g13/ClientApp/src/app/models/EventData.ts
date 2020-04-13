import { EventGame } from "./EventGame";
import { User } from "./User";
import { Game } from "./Game";

export class EventData {
    eventGame: EventGame;
    participants: User[] = [];
    game: Game;
    constructor(data) {
        if (data) {
            this.eventGame = data.eventGame;
            this.participants = data.participants;
            this.game = data.game;
        }
    }
}