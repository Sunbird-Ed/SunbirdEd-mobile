import { TranslateService } from '@ngx-translate/core';
import { LoadingController, ToastController, NavController } from 'ionic-angular';
import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { AuthService, UserProfileService } from 'sunbird';

import { ProfilePage } from './../profile';
import { ProfileConstants } from '../../../app/app.constant';

@Component({
  selector: 'skill-tags',
  templateUrl: 'skill-tags.html',
  encapsulation: ViewEncapsulation.None,
})

/**
 * With this component User can add skills
 */
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

  /**
   *  This will triggers when page started showing up, and it will internally makes an API call for Skill set
   */
  ionViewWillEnter(): void {
    let loader = this.getLoader();
    loader.present();
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.error("session is null");
        loader.dismiss();
      } else {
        this.userProfileService.getSkills({ refreshProfileSkills: true },
          (res: any) => {
            this.zone.run(() => {
              this.suggestedSkills = JSON.parse(res).skills;
              loader.dismiss();
            });
          },
          (error: any) => {
            console.error("Res", error);
            loader.dismiss();
          });
      }
    });
  }

  /**
   *  Makes an API call of Add Skill
   */
  addSkills(): void {
    let loader = this.getLoader();
    loader.present();
    this.authService.getSessionData((session) => {
      if (session === undefined || session == null) {
        console.error("session is null");
      } else {
        let req = {
          userId: JSON.parse(session)[ProfileConstants.USER_TOKEN],
          skills: this.skillTags.map(item => {
            return item["value"];
          })
        };

        this.userProfileService.endorseOrAddSkill(req,
          (res: any) => {
            loader.dismiss();
            this.presentToast(this.translateMessage('SKILLS_ADDED_SUCCESSFULLY'));
            this.navCtrl.setRoot(ProfilePage, { returnRefreshedUserProfileDetails: true });
          },
          (error: any) => {
            loader.dismiss();
            console.error("Res", error);
            this.presentToast(this.translateMessage('SKILL_NOT_ADDED'));
          });
      }
    });
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  /* It returns the object of the Loader */
  getLoader(): any {
    return this.loadingCtrl.create({ duration: 30000, spinner: "crescent" });
  }

  /**
   * It will shows the Toast Message
   * @param {string} message - Message to be displayed on Toaster
   */
  presentToast(message: string): void {
    this.toastCtrl.create({
      message: this.translateMessage(message),
      duration: 3000
    }).present();
  }

  /**
   * Used to Translate message to current Language
   * @param {string} messageConst - Message Constant to be translated
   * @returns {string} translatedMsg - Translated Message
   */
  translateMessage(messageConst): string {
    let translatedMsg = '';
    this.translate.get(messageConst).subscribe(
      (value: any) => {
        translatedMsg = value;
      }
    );
    return translatedMsg;
  }
}
