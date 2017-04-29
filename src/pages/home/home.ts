import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Message } from '../../models/message'
import { MessageService } from '../../providers/message-service'
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as moment from 'moment';

export const imageContentPrefix = 'data:image/jpeg;base64,';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MessageService, Camera]
})
export class HomePage {
  public USER_NAME_CONSTANT = 'John Ryan';
  public currentMessage: string;

  constructor(public navCtrl: NavController, private messageService: MessageService, private camera: Camera) {
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
    let options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 400,
      targetHeight: 300
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = imageContentPrefix + imageData;
      this.buildAndSendMessage(base64Image);
    }, (error) => {
      this.buildAndSendMessage('photo capture error: ' + JSON.stringify(error));
    });
  }
}
