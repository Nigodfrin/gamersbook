
export class Game {

    private id: number;
    private name: string;
    private deck: string;
    private releaseDate: Date;
    private genres: string[];
    private platforms: string[];

    constructor(data){
        if(data){
            this.id = data.id,
            this.name = data.name,
            this.deck = data.deck,
            this.releaseDate = new Date(data.expected_release_day,data.expected_release_month,data.expected_release_year),
            this.genres = data.genres,
            this.platforms = data.platforms
        }
    }

}