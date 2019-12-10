import { Post } from "./Post";

export class ReccordQuestion {
    public maxScore: number;
    public postquestion: Post;
    constructor(data: any){
        this.maxScore = data.maxScore,
        this.postquestion = data.postQuestion
    }
}