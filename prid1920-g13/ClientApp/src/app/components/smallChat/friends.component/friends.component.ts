import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/user.service";
import * as _ from 'lodash';
import { ChatService } from "src/app/services/notifications.service";


@Component({
    selector: 'friendsComponent',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
    
    connectedFriends: User[] = [];
    friendsContainerHeight = 500;
    chatBoxUser: User[] = [];
    showFriendsContainer: boolean = true;
    filter: string = "" ;
    filterConnectedUsers: User[] = [];
    
    constructor(private userService: UserService,private notifServ: ChatService){
        
    }
    ngOnInit(): void {
        this.friendsContainerHeight = window.innerHeight;
        this.userService.getFriend().subscribe(res => {
            console.log('test',res);
            this.connectedFriends = res;
            this.filterConnectedUsers=res;
        });
    }
    showChat(user: User){
        this.chatBoxUser.push(user);
    }
    filterUsers(){
        const filter = this.filter.toLowerCase();
        this.filterConnectedUsers = _.filter(this.connectedFriends,user => user.firstName.toLowerCase().includes(filter) || user.lastName.toLowerCase().includes(filter));
    }
    showFriends(){
        if(this.showFriendsContainer){
            this.showFriendsContainer = false;
            document.getElementById('friends-container').style.marginRight = '-200px';
        }
        else {
            this.showFriendsContainer = true
            document.getElementById('friends-container').style.marginRight = '0px';
        }
    }
    closeDialog(index){
        this.chatBoxUser.splice(index,1);
    }
    sendMessage(message){
        this.notifServ.sendMessage('pseudo',message);
    }
}