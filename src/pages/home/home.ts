import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Message } from '../../models/message'
import { MessageService } from '../../providers/message-service'
import { NotificationService } from '../../providers/notification-service'
import { Camera } from 'ionic-native';
import * as moment from 'moment';

export const cameraOptions = {
  destinationType: Camera.DestinationType.DATA_URL,
  targetWidth: 400,
  targetHeight: 300
};

export const imageContentPrefix = 'data:image/jpeg;base64,';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MessageService]
})
export class HomePage {
  public USER_NAME_CONSTANT = 'John Ryan';
  public currentMessage: string;

  constructor(public navCtrl: NavController, private messageService: MessageService) {
  }

  public formatDateTo_hhmm(dateProvidedAsString: string) {
    return moment(new Date(dateProvidedAsString)).format('h:mm a');
  }

  public send() {
    this.buildAndSendMessage(this.currentMessage);
    this.currentMessage = "";
  }

  private buildAndSendMessage(message: string) {
    var newMessage = new Message();
    newMessage.userName = this.USER_NAME_CONSTANT;
    newMessage.messageContent = message;
    this.messageService.addMessage(newMessage);
  }

  public sendPhoto() {
    Camera.getPicture(cameraOptions).then((imageData) => {
      let base64Image = imageContentPrefix + imageData.replace(/[\n\r]/g, '');
      this.buildAndSendMessage(base64Image);
    }, (error) => {
      this.buildAndSendMessage('photo capture error: ' + JSON.stringify(error));
    });
  }
}
