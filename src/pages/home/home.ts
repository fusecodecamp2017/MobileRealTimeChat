import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Message } from '../../models/message'
import { MessageService } from '../../providers/message-service'
import { Camera } from 'ionic-native';
import { Geolocation } from '@ionic-native/geolocation';
import * as moment from 'moment';

export const cameraOptions = {
  destinationType: Camera.DestinationType.DATA_URL,
  targetWidth: 400,
  targetHeight: 300
};

export const imageContentPrefix = 'data:image/jpeg;base64,';
export const locationDataContentPrefix = 'geo:';
export const appleMapsUrlPrefix = "https://maps.apple.com/?q=";
export const googleMapsUrlPrefix = "https://maps.google.com/maps?q=loc:";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MessageService, Geolocation]
})
export class HomePage {
  public USER_NAME_CONSTANT = 'John Ryan';
  public currentMessage: string;
  public showAdditionalIcons: boolean;

  constructor(public navCtrl: NavController, private messageService: MessageService, private geolocation: Geolocation, public platform: Platform) {
    this.showAdditionalIcons = false;
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
      this.showAdditionalIcons = false;
    }, (error) => {
      this.buildAndSendMessage('photo capture error: ' + JSON.stringify(error));
      this.showAdditionalIcons = false;
    });
  }

  public sendLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.buildAndSendMessage(locationDataContentPrefix + resp.coords.latitude + ',' + resp.coords.longitude);
      this.showAdditionalIcons = false;
    }).catch((error) => {
      this.buildAndSendMessage('error getting location: ' + JSON.stringify(error));
      this.showAdditionalIcons = false;
    });
  }

  public getImageFromMessageContent(message: Message) {
    // Added this function so that I don't get errors in the console when the img tag
    // tries to render an image from not-image data.
    return this.doesThisMessageContainAnImage(message) ? message.messageContent : "";
  }

  public getLocationUrlFromMessageContent(message: Message) {
    let suffixToUse = message.messageContent.substr(locationDataContentPrefix.length);
    if (this.platform.is('ios')) {
      return appleMapsUrlPrefix + suffixToUse;
    }
    return googleMapsUrlPrefix + suffixToUse;
  }

  public isThisMessageSimpleText(message: Message) {
    return !this.doesThisMessageContainAnImage(message) && !this.doesThisMessageContainLocationData(message);
  }

  public doesThisMessageContainAnImage(message: Message) {
    return message.messageContent.indexOf(imageContentPrefix) !== -1;
  }

  public doesThisMessageContainLocationData(message: Message) {
    return message.messageContent.indexOf(locationDataContentPrefix) !== -1;
  }
}
