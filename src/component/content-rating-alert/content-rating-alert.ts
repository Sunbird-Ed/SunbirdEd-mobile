import { Component, NgZone } from '@angular/core';
import { NavParams, ViewController, Platform, ToastController } from "ionic-angular";
import {
  ContentService, AuthService, TelemetryService,
  InteractType, InteractSubtype, Environment, ImpressionType, ImpressionSubtype, Log, LogLevel
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import { generateImpressionTelemetry, generateInteractTelemetry } from '../../app/telemetryutil';
import { ProfileConstants } from '../../app/app.constant';


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
  private pageId: string = "";
  userRating: number = 0;
  private popupType: string;

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
    private ngZone: NgZone,
    private contentService: ContentService,
    private telemetryService: TelemetryService) {
    this.getUserId();
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
    this.ngZone.run(() => {
      this.content = this.navParams.get("content");
      this.userRating = this.navParams.get("rating");
      this.comment = this.navParams.get('comment');
      this.popupType = this.navParams.get('popupType');
      if (this.userRating) {
        this.showCommentBox = true;
      }
    })
  }

  /**
   * Get user id
   */
  getUserId() {
    this.authService.getSessionData((data: string) => {
      let res = JSON.parse(data);
      if (res === undefined || res === "null") {
        this.userId = '';
      } else {
        this.userId = res[ProfileConstants.USER_TOKEN] ? res[ProfileConstants.USER_TOKEN] : '';
      }
    });
  }

  /**
   * 
   * @param {number} ratingCount 
   */
  rateContent(ratingCount) {
    this.showCommentBox = true;
    this.ratingCount = ratingCount;
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
    this.viewCtrl.dismiss();
    let paramsMap = new Map();
    paramsMap["Ratings"] = this.ratingCount;
    paramsMap["Comment"] = this.comment;
    this.telemetryService.interact(generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.RATING_SUBMITTED,
      Environment.HOME,
      this.pageId, paramsMap,
      undefined,
      undefined
    ));

    let viewDismissData = {
      rating: this.ratingCount,
      comment: this.comment ? this.comment : '',
      message: ''
    };

    this.contentService.sendFeedback(option, (res: any) => {
      console.log('success:', res);
      viewDismissData.message = 'rating.success';
      this.viewCtrl.dismiss(viewDismissData);
      this.showMessage(this.translateLangConst('THANK_FOR_RATING'));
    },
      (data: any) => {
        console.log('error:', data);
        viewDismissData.message = 'rating.error';
        // TODO: ask anil to show error message(s)
        this.viewCtrl.dismiss(viewDismissData);
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
  * Ionic life cycle hook
  */
  ionViewDidLoad(): void {
    this.content = this.navParams.get("content");
    this.pageId = this.navParams.get("pageId");

  }

  ionViewWillEnter() {
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW,
      ImpressionSubtype.RATING_POPUP,
      this.pageId,
      Environment.HOME, "", "", "",
      undefined,
      undefined
    ));

    let log = new Log();
    log.level = LogLevel.INFO;
    log.message = this.pageId;
    log.env = Environment.HOME;
    log.type = ImpressionType.VIEW;
    let params = new Array<any>();
    let paramsMap = new Map();
    paramsMap["PopupType"] = this.popupType;
    params.push(paramsMap);
    log.params = params;
    this.telemetryService.log(log);
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
