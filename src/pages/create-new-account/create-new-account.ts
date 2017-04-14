import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserService } from '../../providers/user-service'
import { NotificationService } from '../../providers/notification-service'
import { User } from '../../models/user'
import { Camera } from 'ionic-native';

export const cameraOptionsForUserPicture = {
  destinationType: Camera.DestinationType.DATA_URL,
  targetWidth: 400,
  targetHeight: 300
};
export const imageContentPrefix = 'data:image/jpeg;base64,';

@Component({
  selector: 'page-create-new-account',
  templateUrl: 'create-new-account.html',
  providers: [NotificationService]
})
export class CreateNewAccountPage {
  public userBeingEdited: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, public userService: UserService, public notificationService: NotificationService) {
    this.setupUserBeingEdited()
  }

  private setupUserBeingEdited() {
    if (this.userService.currentUser) {
      this.userBeingEdited = this.userService.currentUser;
    } else {
      this.userBeingEdited = new User();
    }
  }

  public capturePhoto() {
    Camera.getPicture(cameraOptionsForUserPicture).then((imageData) => {
      this.userBeingEdited.photo = imageContentPrefix + imageData.replace(/[\n\r]/g, '');
    }, (error) => {
      this.notificationService.showMessage('photo capture error: ' + JSON.stringify(error));
    });
  }

  public save() {
    this.userService.registerCurrentUser(this.userBeingEdited);
    this.navCtrl.popToRoot();
  }
}
