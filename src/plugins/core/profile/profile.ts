import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BasePlugin, ContainerService, CameraService } from '../../../framework';
import { FormEducation } from './education/form.education';
import { FormAddress } from './address/form.address';
import { FormExperience } from './experience/form.experience';
import { OverflowMenuComponent } from './overflowmenu/menu.overflow.component';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage implements BasePlugin {
  imageUri: string = "assets/imgs/ic_profile_default.png";
  list: Array<String> = ['SWITCH_ACCOUNT', 'DOWNLOAD_MANAGER', 'SETTINGS', 'SIGN_OUT'];
  lastLoginTime: string = "Last login time:Feb 13,2018,3:20:05 PM";
  userName: string = "User Name-vinayagasundar";
  profileName: string = "Boss Name";
  sunbird: string = "Sunbird";
  profileCompletionText: string = "Your profile is 82% completed";
  progValue: string = "82";
  profDesc: string = "Here are the detailed description of the profile fdhfh Here are the detailed description of the profile fdhfh";
  uncompletedDetails: string = "+ Add Experience";

  constructor(public navCtrl: NavController, private cameraService: CameraService, public popoverCtrl: PopoverController) {
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

  editExperience() {
    this.navCtrl.push(FormExperience);
  }

  showOverflowMenu(event) {
    let popover = this.popoverCtrl.create(OverflowMenuComponent, {
      list: this.list
    });
    popover.present({
      ev: event
    });
  }

}
