import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { User } from '../models/User';
import { AuthenticationService } from './authentication.service';
import * as signalR from '@aspnet/signalr';
import { Message } from '../models/Message';

@Injectable({ providedIn: 'root' })
export class ChatService {
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor(private authServ: AuthenticationService) {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendMessage(pseudo: string,message: Message) {
    console.log(pseudo,message);
    this._hubConnection.invoke('SendMessage', pseudo,this.authServ.currentUser.pseudo ,message);
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('notificationsHub', {accessTokenFactory: () => { return this.authServ.currentUser.token} })
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }
  joinRoom(){
    this._hubConnection.invoke('JoinRoom', this.authServ.currentUser.pseudo);
  }
  leaveRoom(){
    this._hubConnection.invoke('LeaveRoom', this.authServ.currentUser.pseudo);
  }
  
  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(function () { this.startConnection(); }, 5000);
      });
  }

  private registerOnServerEvents(): void {
    this._hubConnection.on('ReceiveMessage', (data: any,data2:any) => {
      console.log('signalr',data,data2);
      const message =  new Message(data2);
      this.messageReceived.emit(message);
    });
  }

}    