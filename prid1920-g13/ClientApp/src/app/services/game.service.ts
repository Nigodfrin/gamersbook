import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";
import { Game } from "../models/Game";
@Injectable({ providedIn: 'root' })
export class GameService {
    private baseUrl: string = "https://www.giantbomb.com/api";
    constructor(private http: HttpClient) { 
    }
    public getGames(){

        return this.http.jsonp(`${this.baseUrl}/games/?api_key=936a5fa9e2453ce9a616290d70a74c6be1101f40&format=jsonp&field_list=name,id,deck,expected_release_day,expected_release_month,expected_release_year,image,platforms`,'json_callback')
            .pipe(map((res: any) => res.results.map((m: any) => new Game(m))));
    }
    public searchGames(query: string){
        
        return this.http.jsonp(`${this.baseUrl}/search/?api_key=936a5fa9e2453ce9a616290d70a74c6be1101f40&format=jsonp&query=${query}&resources=game`,'json_callback')
            .pipe(map((res: any) => res.results.map((m: any) => new Game(m))));
    }

    
    


}