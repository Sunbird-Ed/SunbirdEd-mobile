import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

// import { FormEducation } from '../../plugins/profile/education/form.education';
// import { FormAddress } from '../../plugins/profile/address/form.address';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements BasePlugin  {
  imageUri: string = "assets/imgs/logo.png";

  constructor(public navCtrl: NavController, private camera: Camera) {

  }

  init(containerService: ContainerService) {
    containerService.addTab({root: ProfilePage, label: "PROFILE", icon: "profile"})
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
