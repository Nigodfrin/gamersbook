export class Vote {
    postId: number;
    authorId: number;
    upDown: number;
    constructor(data){
        if(data){
            this.postId = data.postId,
            this.authorId = data.authorId,
            this.upDown = data.upDown
        }
    }
}