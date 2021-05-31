import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models/User';
import { ApiService } from '../../Store/api-store.service';

@Component({
  selector: 'app-user-line',
  templateUrl: './user-line.component.html',
  styleUrls: ['./user-line.component.css']
})
export class UserLineComponent implements OnInit {
  @Input('user') user: User;
  @Input('addAndDelete') addAndDelete: boolean = false;
  @Input('showAction') showAction: boolean;
  @Output() action: EventEmitter<User> = new EventEmitter();

  friends: User[];

  constructor(private apistore: ApiService) {
      this.apistore.getFriends().subscribe(res => {
        this.friends = res;
      });
  }

  ngOnInit() {

  }
  isFriends(user: User) {
    return this.friends.some(u => u.pseudo === user.pseudo);
  }
  actionToDo() {
    this.action.emit(this.user);
  }

}
