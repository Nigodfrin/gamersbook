import { Injectable } from '@angular/core';
import { User } from 'src/app/models/User';

@Injectable({providedIn: 'root'})
export class StoreService {

    friends: User[];

    constructor() { }

}