export class Tag {
    name: string;
    id: any;
    num: number;
    
    constructor(data: any) {
      if (data) {
        this.name = data.name;
        this.id = data.id;
        this.num = data.num;
      }
    }
  }
