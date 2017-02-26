import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Message } from '../../models/message';
import { MessageService } from '../../providers/message-service';
import { NotificationService } from '../../providers/notification-service'
import { UserService } from '../../providers/user-service'
import { LoginPage } from '../login/login';
import * as moment from 'moment';
import { Camera, Geolocation } from 'ionic-native';

export const cameraOptions = {
  destinationType: Camera.DestinationType.DATA_URL,
  targetWidth: 400,
  targetHeight: 300
};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MessageService, NotificationService]
})
export class HomePage {
  public currentMessage: string;
  public showAdditionalIcons: boolean;

  constructor(public navCtrl: NavController, private messageService: MessageService, public userService: UserService, private notificationService: NotificationService) {
    if (!this.userService.currentUser) {
      this.navCtrl.push(LoginPage, {});
    }
    this.showAdditionalIcons = false;
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

  public getImageFromMessageContent(message: Message) {
    // Added this function so that I don't get errors in the console when the img tag
    // tries to render an image from not-image data.
    return this.doesThisMessageContainAnImage(message) ? message.messageContent : "";
  }

  public isThisMessageFromMe(message: Message) {
    return (!this.userService.currentUser || message.userName !== this.userService.currentUser.name);
  }

  public sendPhoto() {
    Camera.getPicture(cameraOptions).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData.replace(/[\n\r]/g, '');
      this.buildAndSendMessage(base64Image);
      this.currentMessage = "";
    }, (error) => {
      this.notificationService.showMessage('photo capture error: ' + JSON.stringify(error));
    });
  }

  public sendLocation() {
    Geolocation.getCurrentPosition().then((resp) => {
     // resp.coords.latitude
     // resp.coords.longitude
    }).catch((error) => {
      this.notificationService.showMessage('error getting location: ' + JSON.stringify(error));
    });
  }

  public doesThisMessageContainAnImage(message: Message) {
    return message.messageContent.indexOf('data:image') !== -1;
  }

  public send() {
    this.buildAndSendMessage(this.currentMessage);
    this.currentMessage = "";
  }

  private buildAndSendMessage(message: string) {
    var newMessage = new Message();
    newMessage.userName = this.userService.currentUser.name;
    newMessage.messageContent = message;
    this.messageService.addMessage(newMessage);
  }
}
