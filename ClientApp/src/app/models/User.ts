import { EmailValidator } from "@angular/forms";

export class User {
    Id: any;
    Pseudo: string;
    Password: string;
    Email: string;
    LastName: string;
    FirstName: string;
    BirthDate: string;
    Reputation: any;
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
      }
    }
  }