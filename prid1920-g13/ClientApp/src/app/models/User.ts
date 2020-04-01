import { EmailValidator } from "@angular/forms";
import { Game } from "./Game";
import { Discussion } from "./Discussion";
export enum Role {
  Visitor = 0,
  Member = 1,
  Admin = 2
}
export class User {
    id: number;
    pseudo: string;
    password: string;
    email: string;
    lastName: string;
    firstName: string;
    birthDate: Date;
    reputation: any;
    picturePath: string;
    role: Role;
    token: string;
    games: Game[] = [];
    discussions: Discussion[];
    constructor(data: any) {
      if (data) {
        this.id = data.id;
        this.pseudo = data.pseudo;
        this.password = data.password;
        this.lastName = data.lastName;
        this.firstName = data.firstName;
        this.reputation = data.reputation;
        this.picturePath = data.picturePath;
        this.email = data.email;
        this.birthDate = data.birthDate &&
          data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
        this.role = data.role || Role.Member;
        this.token = data.token;
        // data.games.forEach((game: Game) => {
        //   this.games.push(new Game(game));
        // });;
        this.discussions = data.discussions;

      }
    }
    public get roleAsString(): string {
      return Role[this.role];
    }
  }