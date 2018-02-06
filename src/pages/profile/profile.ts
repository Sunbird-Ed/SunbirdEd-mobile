import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  imageUri: string = "assets/imgs/logo.png";

  constructor(public navCtrl: NavController, private camera: Camera) {

  }

  editEduDetails() {
    this.navCtrl.push(FormEducation);
  }

  editAddress() {
    this.navCtrl.push(FormAddress);
  }

  editPicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageUri = imageData;
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
    }, (err) => {
      // Handle error
    });
  }

}
