import { Component } from '@angular/core';
import { NavParams, ViewController, Header, Platform, ToastController } from "ionic-angular";
import { ContentService, AuthService } from 'sunbird';
import { NgModule } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the ContentRatingAlertComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'content-rating-alert',
  templateUrl: 'content-rating-alert.html'
})
export class ContentRatingAlertComponent {

  isDisable: boolean = false;
  userId: string = '';
  comment: string = '';
  backButtonFunc = undefined;
  ratingCount: any;
  content: any;
  showCommentBox: boolean = false;
  userRating: number = 0;

  /**
   * Default function of class ContentRatingAlertComponent
   * 
   * @param navParams 
   * @param viewCtrl 
   * @param authService 
   * @param contentService 
   */
  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform,
    private authService: AuthService,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private contentService: ContentService) {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);

    this.content = this.navParams.get("content");
    this.userRating =  this.navParams.get("rating");
    this.getUserId();
  }

  /**
   * Get user id
   */
  getUserId() {
    this.authService.getSessionData((data: string) => {
      let res = JSON.parse(data);
      console.log('auth service...', res);
      if (res === undefined || res === "null") {
        this.userId = '';
      } else {
        this.userId = res["userToken"] ? res["userToken"] : '';
      }
    });
  }

  /**
   * 
   * @param e 
   */
  rateContent(event) {
    // this.isDisable = true;
    this.showCommentBox = true;
    this.ratingCount = event;
    console.log(this.comment);
  }

  cancel() {
    this.showCommentBox = false;
    this.viewCtrl.dismiss();
  }

  submit() {
    let option = {
      contentId: this.content.identifier,
      rating: this.ratingCount,
      comments: this.comment,
      contentVersion: this.content.versionKey
    }

    this.contentService.sendFeedback(option, (res: any) => {
      console.log('success:', res);
      this.viewCtrl.dismiss('rating.success');
      this.showMessage(this.translateLangConst('THANK_FOR_RATING'));
    },
      (data: any) => {
        console.log('error:', data);
        // TODO: ask anil to show error message
        this.viewCtrl.dismiss();
      })
  }

  showMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  /**
   * 
   * @param {string} constant 
   */
  translateLangConst(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
  }
}
