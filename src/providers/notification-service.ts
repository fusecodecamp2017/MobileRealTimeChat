import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationService {

  constructor(public toastController: ToastController) {
  }

  public showMessage(message: string) {
    let toast = this.toastController.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }
}
