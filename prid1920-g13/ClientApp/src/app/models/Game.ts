
export class Game {

    public id: number;
    public name: string;
    public deck: string;
    public expected_release_day: number;
    public expected_release_month: number;
    public expected_release_year: number;
    public platforms: string;
    public image: string;
    public year: string;

    constructor(data: any){
        if(data){
            this.id = data.id,
            this.name = data.name,
            this.deck = data.deck,
            this.platforms = data.platforms,
            this.expected_release_day = data.expected_release_day,
            this.expected_release_month = data.expected_release_month,
            this.expected_release_year = data.expected_release_year,
            this.image = data.image ? data.image : 'uploads/_Unknown.png';

        }
    }

}