import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Message } from '../../models/message';
import { LocationData } from '../../models/location-data'
import { MessageService } from '../../providers/message-service';
import { NotificationService } from '../../providers/notification-service'
import { UserService } from '../../providers/user-service'
import { LoginPage } from '../login/login';
import { MapViewPage } from '../map-view/map-view'
import { Camera, Geolocation } from 'ionic-native';
import * as moment from 'moment';

export const cameraOptions = {
  destinationType: Camera.DestinationType.DATA_URL,
  targetWidth: 400,
  targetHeight: 300
};

export const imageContentPrefix = 'data:image/jpeg;base64,';
export const locationDataContentPrefix = 'data:location,';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MessageService, NotificationService]
})
export class HomePage {
  public currentMessage: string;
  public showAdditionalIcons: boolean;

  constructor(public navCtrl: NavController, private messageService: MessageService, public userService: UserService, private notificationService: NotificationService) {
    this.setupUser();
    this.showAdditionalIcons = false;
  }

  private setupUser() {
    this.userService.setupCurrentUser().then((user)=>{
      if (!user) {
        this.navCtrl.push(LoginPage);
      }
    }, (error) => {
      this.notificationService.showMessage('setup current user error: ' + JSON.stringify(error));
      this.navCtrl.push(LoginPage);
    });
  }

  public login() {
    this.navCtrl.push(LoginPage, {});
  }

  public logout() {
    this.userService.clearCurrentUser();
    this.navCtrl.push(LoginPage);
  }

  public formatDateTo_hhmm(dateProvidedAsString: string) {
    return moment(new Date(dateProvidedAsString)).format('MMM D - h:mm a');
  }

  public isThisMessageFromMe(message: Message) {
    return (!this.userService.currentUser || message.userKey !== this.userService.currentUser.$key);
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

  public getImageFromMessageContent(message: Message) {
    // Added this function so that I don't get errors in the console when the img tag
    // tries to render an image from not-image data.
    return this.doesThisMessageContainAnImage(message) ? message.messageContent : "";
  }

  public viewLocationData(message: Message) {
    let locationData = JSON.parse(message.messageContent.substring(locationDataContentPrefix.length));
    this.navCtrl.push(MapViewPage, { locationData: locationData, userName: message.userName });
  }

  public sendPhoto() {
    Camera.getPicture(cameraOptions).then((imageData) => {
      let base64Image = imageContentPrefix + imageData.replace(/[\n\r]/g, '');
      this.buildAndSendMessage(base64Image);
      this.showAdditionalIcons = false;
    }, (error) => {
      this.notificationService.showMessage('photo capture error: ' + JSON.stringify(error));
      this.showAdditionalIcons = false;
    });
  }

  public sendLocation() {
    Geolocation.getCurrentPosition().then((resp) => {
      let locationData = new LocationData();
      locationData.accuracy = resp.coords.accuracy;
      locationData.latitude = resp.coords.latitude;
      locationData.longitude = resp.coords.longitude;
      this.buildAndSendMessage('data:location,' + JSON.stringify(locationData));
      this.showAdditionalIcons = false;
    }).catch((error) => {
      this.notificationService.showMessage('error getting location: ' + JSON.stringify(error));
      this.showAdditionalIcons = false;
    });
  }

  public send() {
    this.buildAndSendMessage(this.currentMessage);
    this.currentMessage = "";
  }

  private buildAndSendMessage(message: string) {
    var newMessage = new Message();
    newMessage.userName = this.userService.currentUser.name;
    newMessage.userKey = this.userService.currentUser.$key;
    newMessage.messageContent = message;
    this.messageService.addMessage(newMessage);
  }
}
