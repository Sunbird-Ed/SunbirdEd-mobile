import { CommonUtilService } from './../../../service/common-util.service';
import { TranslateService } from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import {
  Component,
  NgZone,
  ViewEncapsulation
} from '@angular/core';
import {
  AuthService,
  UserProfileService
} from 'sunbird';
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

  constructor(
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private zone: NgZone,
    private translate: TranslateService,
    private navCtrl: NavController,
    private commonUtilService: CommonUtilService
  ) {
  }

  /**
   *  This will triggers when page started showing up, and it will internally makes an API call for Skill set
   */
  ionViewWillEnter(): void {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.authService.getSessionData((session) => {
      if (Boolean(session)) {
        this.userProfileService.getSkills({ refreshProfileSkills: true },
          (res: any) => {
            this.zone.run(() => {
              this.suggestedSkills = JSON.parse(res).skills;
              loader.dismiss();
            });
          },
          (error: any) => {
            console.error('Error', error);
            loader.dismiss();
          });
      } else {
        console.error('session is null');
        loader.dismiss();
      }
    });
  }

  /**
   *  Makes an API call of Add Skill
   */
  addSkills(): void {
    const loader = this.commonUtilService.getLoader();
    loader.present();
    this.authService.getSessionData((session) => {
      if (Boolean(session)) {
        const req = {
          userId: JSON.parse(session)[ProfileConstants.USER_TOKEN],
          skills: this.skillTags.map(item => {
            return item['value'];
          })
        };

        this.userProfileService.endorseOrAddSkill(req,
          (res: any) => {
            loader.dismiss();
            this.commonUtilService.showToast('SKILLS_ADDED_SUCCESSFULLY');
            this.navCtrl.setRoot(ProfilePage, { returnRefreshedUserProfileDetails: true });
          },
          (error: any) => {
            loader.dismiss();
            console.error('Res', error);
            this.commonUtilService.showToast('SKILL_NOT_ADDED');
          });
      }
    });
  }

  goBack(): void {
    this.navCtrl.pop();
  }
}
