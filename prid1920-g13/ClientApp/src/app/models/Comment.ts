import { User } from "./User";

export class Comment {
    public id: number;
    public author: User;
    public body: string;
    public timestamp: Date;
    public postId: number;
    constructor(data: any){
        this.id = data.id,
        this.timestamp = data.timestamp,
        this.author = data.author,
        this.body = data.body
    }
}
