import {Component, TemplateRef, Input, Output, EventEmitter} from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-smallChatBox',
  templateUrl: 'chat-container.component.html',
  styleUrls: ['chat-container.component.css']
})
export class ChatContainerComponent {
    @Input() index: number;
    @Input() user: User;
    @Output() closeDialog: EventEmitter<any> = new EventEmitter();
    @Output() sendMessage: EventEmitter<any> = new EventEmitter();
    private show : boolean = true;

  constructor() {}

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
  sendText(event){
    const message = event.target.value;
    event.target.value = '';
    this.sendMessage.emit(message);


  }

}