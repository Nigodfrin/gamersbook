import {Component, TemplateRef, Input, Output, EventEmitter} from '@angular/core';
import { User } from 'src/app/models/User';
import { Discussion } from 'src/app/models/Discussion';

@Component({
  selector: 'app-smallChatBox',
  templateUrl: 'chat-container.component.html',
  styleUrls: ['chat-container.component.css']
})
export class ChatContainerComponent {
    @Input() index: number;
    @Input() user: User;
    @Input() discussion: Discussion;
    @Output() closeDialog: EventEmitter<any> = new EventEmitter();
    @Output() sendMessage: EventEmitter<any> = new EventEmitter();
    private show : boolean = true;

  constructor() {
    console.log(this.discussion);
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
  sendText(value: string){
    const message = value;
    this.sendMessage.emit({pseudo:this.user.pseudo,message:message});
  }

}