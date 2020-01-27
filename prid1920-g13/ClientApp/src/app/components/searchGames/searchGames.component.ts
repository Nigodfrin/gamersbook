import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { GameService } from "src/app/services/game.service";

@Component({
    templateUrl: './searchGames.component.html',
})
export class SearchGamesComponent implements OnInit {
    
    public ctlSearch: FormControl = new FormControl('',[]);
    
    
    constructor(private gamesService: GameService) {}

    ngOnInit(): void {

    }
    search(){
        let query: string = this.ctlSearch.value;
        this.gamesService.searchGames(query.toLowerCase()).subscribe(games => {
            console.log(games);
        });
    }
}