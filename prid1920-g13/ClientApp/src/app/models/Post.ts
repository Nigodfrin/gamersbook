export class Post {
    public id: any;
    public title: string;
    public body: string;
    public timestamp: Date;
    constructor(data: any) {
        if (data) {
            this.id = data.id,
            this.title = data.title,
            this.body = data.body,
            this.timestamp = data.timestamp
        }

    }
}