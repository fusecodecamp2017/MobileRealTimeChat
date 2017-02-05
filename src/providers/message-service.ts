import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Message } from '../models/message'
import 'rxjs/add/operator/map';

@Injectable()
export class MessageService {
  public messages: FirebaseListObservable<any>;

  constructor(private angularFire: AngularFire) {
    this.messages = angularFire.database.list('/messages');
  }

  public addMessage(message: Message) {
    message.messageDate = new Date();
    this.messages.push(message);
  }
}
