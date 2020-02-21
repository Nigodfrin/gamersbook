import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { User } from '../models/User';

@Injectable({ providedIn: 'root' })
export class ChatService {
  messageReceived = new EventEmitter<User>();
  connectionEstablished = new EventEmitter<Boolean>();

  private connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
  }

  sendMessage(pseudo: string) {
    this._hubConnection.invoke('SendMessage', pseudo, 'Coucou les gars');
  }

  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('notificationsHub')
      .build();
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
    this._hubConnection.on('ReceiveMessage', (data: any) => {
      console.log(data);
    });
  }

}    