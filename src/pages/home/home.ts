import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Message } from '../../models/message';
import { MessageService } from '../../providers/message-service';
import { UserService } from '../../providers/user-service'
import { LoginPage } from '../login/login';
import * as moment from 'moment';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MessageService]
})
export class HomePage {
  public currentMessage: string;

  constructor(public navCtrl: NavController, private messageService: MessageService, public userService: UserService) {
    if (!this.userService.currentUser) {
      this.navCtrl.push(LoginPage, {});
    }
  }

  public formatDateTo_hhmm(dateProvidedAsString: string) {
    return moment(new Date(dateProvidedAsString)).format('MMM D - h:mm a');
  }

  public login() {
    this.navCtrl.push(LoginPage, {});
  }

  public logout() {
    this.userService.clearCurrentUser();
  }

  public isThisMessageFromMe(message: Message) {
    return (!this.userService.currentUser || message.userName !== this.userService.currentUser.name);
  }

  public send() {
    this.buildAndSendMessage(this.currentMessage);
    this.currentMessage = "";
  }

  private buildAndSendMessage(message: string) {
    var newMessage = new Message();
    newMessage.userName = this.userService.currentUser.name;
    newMessage.messageContent = this.currentMessage;
    this.messageService.addMessage(newMessage);
  }
}
