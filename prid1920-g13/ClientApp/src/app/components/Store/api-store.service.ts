import { Injectable } from '@angular/core';
import { StoreService } from './store.service'
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/User';

@Injectable({ providedIn: 'root' })
export class ApiService {

    constructor( private store: StoreService,private userService: UserService ) { }

    getFriends(): Observable<User[]> {
        return this.userService.getFriend();
    }
}