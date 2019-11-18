import { EmailValidator } from "@angular/forms";
export enum Role {
  Member = 0,
  Manager = 1,
  Admin = 2
}
export class User {
    Id: any;
    Pseudo: string;
    Password: string;
    Email: string;
    LastName: string;
    FirstName: string;
    BirthDate: string;
    Reputation: any;
    role: Role;
    token: string;
    constructor(data: any) {
      if (data) {
        this.Id = data.id;
        this.Pseudo = data.pseudo;
        this.Password = data.password;
        this.LastName = data.fullName;
        this.FirstName = data.FirstName;
        this.Reputation = data.Reputation;
        this.BirthDate = data.birthDate &&
          data.birthDate.length > 10 ? data.birthDate.substring(0, 10) : data.birthDate;
        this.role = data.role || Role.Member;
        this.token = data.token;
      }
    }
    public get roleAsString(): string {
      return Role[this.role];
    }
  }