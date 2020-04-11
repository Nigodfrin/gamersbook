import {Component, TemplateRef, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { User } from 'src/app/models/User';
import { Discussion } from 'src/app/models/Discussion';
import { Message } from 'src/app/models/Message';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MessageService } from 'src/app/services/message.service';
import { SignalRService } from 'src/app/services/signalR.service';

@Component({
  selector: 'app-smallChatBox',
  templateUrl: 'chat-container.component.html',
  styleUrls: ['chat-container.component.css']
})
export class ChatContainerComponent implements OnInit {

    @Input() index: number;
    @Input() user: User;
    @Input() discussion: Discussion;
    @Output() closeDialog: EventEmitter<any> = new EventEmitter();
    @Output() sendMessage: EventEmitter<any> = new EventEmitter();
    private show : boolean = true;
    inputValue: string = '';

  constructor(private authServ: AuthenticationService,private messageService: MessageService) {
    
  }

  ngOnInit(): void {
  }
  onHeaderClick(){
        if(this.show){
            this.show=false;
            document.getElementById('chatBoxBody'+this.index).style.display = 'none';
          document.getElementById('chatBoxFooter'+this.index).style.display = 'none';
          document.getElementById('chatBox'+this.index).style.height = '30px';
        }
        else {
            this.show=true;
            document.getElementById('chatBoxBody'+this.index).style.display = 'block';
          document.getElementById('chatBox'+this.index).style.height = '360px';
          document.getElementById('chatBoxFooter'+this.index).style.display = 'block';
        }
          
  }
  closeChat(){
    console.log(this.index);
    this.closeDialog.emit(this.index);
  }
  sendText(){
    let message = new Message({messageText: this.inputValue,sender:this.authServ.currentUser.id,receiver: this.user.id});
    this.inputValue = '';
    console.log(message);
    this.discussion.messages.push(message);
    message.discussionId = this.discussion.id;
    this.messageService.addMessage(message);
    this.sendMessage.emit({pseudo:this.user.pseudo,message:message});
  }
}