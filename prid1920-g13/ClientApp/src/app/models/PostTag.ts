export class PostTag {
    postid: number;
    tagid: number;
    
    constructor(data: any) {
      if (data) {
        this.postid = data.postid,
        this.tagid = data.tagid
      }
    }
  }
