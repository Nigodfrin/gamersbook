import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";
import { Game } from "../models/Game";
@Injectable({ providedIn: 'root' })
export class GameService {
    private baseUrl: string = "https://www.giantbomb.com/api";
    constructor(private http: HttpClient,@Inject('BASE_URL') private base: string) { 
    }
    public searchGames(query: string){
        return this.http.jsonp(`${this.baseUrl}/games/?api_key=936a5fa9e2453ce9a616290d70a74c6be1101f40&format=jsonp&field_list=name,id,deck,expected_release_day,expected_release_month,expected_release_year,image&filter=name:${query}`,'json_callback')
            .pipe(map((res: any) => res.results.map((m: any) => new Game(m))));
    }
    public addGameToUser(game: Game){
        console.log(game);
        return this.http.post<Game>(`${this.base}api/game/`,game)
            .pipe(map(res => true),
            catchError(err => {
              console.error(err);
              return of(false);
            })
          );
    }

    
    


}