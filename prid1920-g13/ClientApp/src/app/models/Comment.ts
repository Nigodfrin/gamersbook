import { User } from "./User";

export class Comment {
    public id: any;
    public author: User;
    public body: string;
    public timestamp: Date;
    constructor(data: any){
        this.timestamp = data.timestamp,
        this.id = data.id,
        this.author = data.author,
        this.body = data.body
    }
}
