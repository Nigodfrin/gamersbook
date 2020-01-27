
export class Game {

    public id: number;
    public name: string;
    public deck: string;
    public releaseDate: Date;
    public platforms: string;
    public image: string;

    constructor(data: any){
        if(data){
            this.id = data.id,
            this.name = data.name,
            this.deck = data.deck,
            this.releaseDate = new Date(data.releaseDate),
            this.platforms = data.platforms,
            this.image = data.image ? data.image : 'uploads/_Unknown.png';
        }
    }

}