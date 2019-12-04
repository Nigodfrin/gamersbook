import { User } from "./User";
import {UserService} from '../services/user.service';
export class Post {
    public id: any;
    public title: string;
    public body: string;
    public timestamp: Date;
    public reponses: any;
    public tags: any;
    public user: User;
    public score: any;
    public comments: any;
    public acceptedPostId: number;
    public parentId: number;
    constructor(data: any) {
        if (data) {
            this.id = data.id,
            this.title = data.title,
            this.body = data.body,
            this.timestamp = data.timestamp,
            this.reponses = data.reponses,
            this.tags = data.tags,
            this.user = data.user,
            this.score = data.score,
            this.comments = data.comments,
            this.acceptedPostId = data.acceptedRepId
            this.parentId = data.parentId
        }
    }
}