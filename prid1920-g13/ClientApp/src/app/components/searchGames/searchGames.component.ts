import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { GameService } from "src/app/services/game.service";
import { Game } from "src/app/models/Game";
import { UserService } from "src/app/services/user.service";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    templateUrl: './searchGames.component.html',
    styleUrls: ['./searchGames.component.css']
})
export class SearchGamesComponent implements OnInit {
    
    public searchedGames: Game[];
    public ctlSearch: FormControl = new FormControl('',[]);
    
    
    constructor(private gamesService: GameService,private userService: UserService,private authService: AuthenticationService) {}

    ngOnInit(): void {

    }
    search(){
        let query: string = this.ctlSearch.value;
        this.gamesService.searchGames(query.toLowerCase()).subscribe(games => {
            console.log(games);
            this.searchedGames = games;
        });
    }
    addGames(game: any){
        console.log(game);
        const jeu = new Game({
            id: game.id ,
            name: game.name, 
            deck: game.deck,
            expected_release_day: game.expected_release_day, 
            expected_release_month:game.expected_release_month,
            expected_release_year:game.expected_release_year,
             image: game.image.medium_url,
        });
        console.log(jeu);
        this.gamesService.addGameToUser(jeu).subscribe(res => {
            this.userService.getById(this.authService.currentUser.pseudo).subscribe(user => {
                // sessionStorage.setItem('currentUser',JSON.stringify(user));
                // this.authService.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            });
        });
    }
}