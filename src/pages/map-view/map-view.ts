import { Component } from '@angular/core';
import {
  GoogleMap,
  GoogleMapsLatLng,
  GoogleMapsMarkerOptions,
  GoogleMapsMarker
} from 'ionic-native';
import { NavController, NavParams } from 'ionic-angular';
import { LocationData } from '../../models/location-data'
import { NotificationService } from '../../providers/notification-service'

@Component({
  selector: 'page-map-view',
  templateUrl: 'map-view.html',
  providers: [NotificationService]
})
export class MapViewPage {
  private locationData: LocationData;
  private userName: string;
  map: GoogleMap;

  constructor(public navCtrl: NavController, public navParams: NavParams, private notificationService: NotificationService) {
    this.getNavParamData();
  }

  private getNavParamData() {
    this.locationData = this.navParams.get('locationData');
    this.userName = this.navParams.get('userName');
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  private loadMap() {
    let location = new GoogleMapsLatLng(this.locationData.latitude, this.locationData.longitude);

    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 15,
        'bearing': 50
      }
    });

  let markerOptions: GoogleMapsMarkerOptions = {
    position: location,
    title: this.userName
  };

  this.map.addMarker(markerOptions).then((marker: GoogleMapsMarker) => {
      marker.showInfoWindow();
    },
    (error) => {
      this.notificationService.showMessage('google map error: ' + JSON.stringify(error));
    });


  }
}
