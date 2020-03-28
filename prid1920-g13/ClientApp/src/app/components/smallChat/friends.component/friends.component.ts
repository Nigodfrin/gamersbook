import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/user.service";


@Component({
    selector: 'friendsComponent',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
    
    connectedFriends: User[] = [];
    friendsContainerHeight = 500;
    
    constructor(private userService: UserService){
        
    }
    ngOnInit(): void {
        this.friendsContainerHeight = window.innerHeight;
        this.userService.getFriend().subscribe(res => {
            this.connectedFriends = res;
        });
    }
    showChat(pseudo: string){
        
    }
}