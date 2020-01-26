import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";
import { Game } from "../models/Game";
@Injectable({ providedIn: 'root' })
export class GameService {

  quote: Observable<any>;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { 
    }
    public getGames(){

        this.http.jsonp(`https://www.giantbomb.com/api/games/?api_key=936a5fa9e2453ce9a616290d70a74c6be1101f40&format=jsonp&field_list=name,id,deck,expected_release_day,expected_release_month,expected_release_year,image,platforms&filter=name:world%20of%20warcraft&json_callback=callback`,'callback')
            .subscribe(res => {
              console.log(res);
            })
    }
    callback(data){
      console.log(data);
    }
}