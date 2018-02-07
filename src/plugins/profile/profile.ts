import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContainerService } from '../../core/container/container.services';
import { CoreModule } from '../../core/core.module';
import { PluginService } from '../../core/plugin/plugin.service';
import { BasePlugin } from '../../core/plugin/plugin.service';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { CameraService } from '../../core/services/camera.service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements BasePlugin {
  imageUri: string = "assets/imgs/logo.png";

  constructor(public navCtrl: NavController, private cameraService: CameraService) {

  }

  init(containerService: ContainerService) {
    containerService.addTab({ root: ProfilePage, label: "PROFILE", icon: "profile" })
  }

  editEduDetails() {
    this.navCtrl.push(FormEducation);
  }

  editAddress() {
    this.navCtrl.push(FormAddress);
  }

  editPicture() {
    this.cameraService.getPicture().then((imageData) => {
      this.imageUri = imageData;
    }, (err) => {
      // Handle error
    });
   }

}
