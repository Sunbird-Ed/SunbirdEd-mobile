import { TranslateService } from '@ngx-translate/core';
import { LoadingController, ToastController, NavController } from 'ionic-angular';
import { Component, NgZone } from '@angular/core';
import { AuthService, UserProfileService } from 'sunbird';

import { ProfilePage } from './../profile';

@Component({
  selector: 'skill-tags',
  templateUrl: 'skill-tags.html'
})
export class SkillTagsComponent {

  suggestedSkills: Array<string> = [];
  skillTags: Array<string> = [];

  constructor(private authService: AuthService, 
    private userProfileService: UserProfileService, 
    private loadingCtrl: LoadingController, 
    private zone: NgZone,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private navCtrl: NavController) {
  }

  ionViewWillEnter() {
    let loader = this.getLoader();
    loader.present();
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.error("session is null");
        loader.dismiss();
      } else {
        this.userProfileService.getSkills({ refreshProfileSkills: true }, res => {
          this.zone.run(() => {
            this.suggestedSkills = JSON.parse(res).skills;
            loader.dismiss();
          });
        },
        error => {
          console.error("Res", error);
          loader.dismiss();
        });
      }
    });
  }

  addSkills() {
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let req = {
          userId: JSON.parse(session)["userToken"],
          skills: this.skillTags.map(item => {
            return item["value"];
          })
        };
        console.log("Request Object", req);
        this.userProfileService.endorseOrAddSkill(req, res => {
          this.presentToast('SKILLS_ADDED_SUCCESSFULLY');
          this.navCtrl.push(ProfilePage);
         },
         error => {
          console.error("Res", error);
          this.presentToast('SKILL_NOT_ADDED');
         });
      }
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  getLoader() {
    return this.loadingCtrl.create({duration: 30000, spinner: "crescent" });
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: this.translateMessage(message),
      duration: 3000
    });
    toast.present();
  }

  translateMessage(messageConst): string {
    let translatedmsg = '';
    this.translate.get(messageConst).subscribe(
      value => {
        translatedmsg = value;
      }
    );
    return translatedmsg;
  }

}
