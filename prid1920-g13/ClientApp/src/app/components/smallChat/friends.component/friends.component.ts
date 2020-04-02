import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/user.service";
import * as _ from 'lodash';
import { ChatService } from "src/app/services/notifications.service";
import { Discussion } from "src/app/models/Discussion";
import { DiscussionService } from "src/app/services/discussion.service";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Message } from "src/app/models/Message";


@Component({
    selector: 'friendsComponent',
    templateUrl: './friends.component.html',
    styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit,OnDestroy {
   
    
    connectedFriends: User[] = [];
    friendsContainerHeight = 500;
    chatBoxUser: User[] = [];
    showFriendsContainer: boolean = true;
    filter: string = "" ;
    filterConnectedUsers: User[] = [];
    dicussions: Discussion[] = [];
    
    constructor(private chatServ: ChatService,private authServ: AuthenticationService,
        private userService: UserService,
        private notifServ: ChatService,
        private discServ: DiscussionService){
        
    }
    ngOnInit(): void {
        this.friendsContainerHeight = window.innerHeight;
        this.userService.getFriend().subscribe(res => {
            this.connectedFriends = res;
            this.filterConnectedUsers=res;
        });
        this.discServ.getDiscussions(this.authServ.currentUser).subscribe(res => {
            this.dicussions = res;
        });
        this.chatServ.messageReceived.subscribe((msg: Message) => {
            console.log("test reception message",msg);
            this.dicussions.find(d => d.id === msg.discussionId).messages.push(msg);
          });
    }
    ngOnDestroy(): void {
        this.chatServ.leaveRoom();
        console.log("test leave room");
    }
    showChat(user: User){
        if(this.getDiscussion(user)){
            var index = this.chatBoxUser.indexOf(user);
            if(index < 0) {
                this.chatBoxUser.push(user);
            }
        }
        else {
            let d = new Discussion({message: [],participants:[user.pseudo,this.authServ.currentUser.pseudo]})
            this.discServ.addDiscussion(d).subscribe(res => {
                console.log(res);
                d.id = res;
                this.dicussions.push(d);
            });
        }
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
    sendMessage(value:any){
        console.log(value);
        this.notifServ.sendMessage(value.pseudo,value.message);
    }
    getDiscussion(u: User): Discussion{
        const discussion = _.find(this.dicussions,d => _.some(d.participants,p => p === u.pseudo)) ;
        console.log(discussion);
        return discussion;
    }
}