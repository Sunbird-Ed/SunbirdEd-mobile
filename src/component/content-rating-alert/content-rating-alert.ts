import {Component, Inject, NgZone} from '@angular/core';
import {NavParams, Platform, ToastController, ViewController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {TelemetryGeneratorService} from '@app/service';
import {ProfileConstants} from '../../app/app.constant';
import {AppGlobalService} from '../../service/app-global.service';
import {CommonUtilService} from '../../service/common-util.service';
import {
  Content,
  ContentFeedback,
  ContentFeedbackService,
  TelemetryLogRequest,
  TelemetryService
} from 'sunbird-sdk';
import {
  Environment,
  ImpressionSubtype,
  ImpressionType,
  InteractSubtype,
  InteractType,
  LogLevel,
  LogType
} from '../../service/telemetry-constants';

@Component({
  selector: 'content-rating-alert',
  templateUrl: 'content-rating-alert.html'
})
export class ContentRatingAlertComponent {

  isDisable = false;
  userId = '';
  comment = '';
  backButtonFunc = undefined;
  ratingCount: any;
  content: Content;
  showCommentBox = false;
  private pageId = '';
  userRating = 0;
  private popupType: string;

  /**
   * Default function of class ContentRatingAlertComponent
   *
   * @param navParams
   * @param viewCtrl
   * @param platform
   * @param translate
   * @param toastCtrl
   * @param ngZone
   * @param contentService
   * @param telemetryService
   * @param telemetryGeneratorService
   * @param appGlobalService
   * @param commonUtilService
   */
  constructor(private navParams: NavParams,
              private viewCtrl: ViewController,
              private platform: Platform,
              private translate: TranslateService,
              private toastCtrl: ToastController,
              private ngZone: NgZone,
              @Inject('CONTENT_FEEDBACK_SERVICE') private contentService: ContentFeedbackService,
              @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService,
              private telemetryGeneratorService: TelemetryGeneratorService,
              private appGlobalService: AppGlobalService,
              private commonUtilService: CommonUtilService) {
    this.getUserId();
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
    this.ngZone.run(() => {
      this.content = this.navParams.get('content');
      this.userRating = this.navParams.get('rating');
      this.comment = this.navParams.get('comment');
      this.popupType = this.navParams.get('popupType');
      if (this.userRating) {
        this.showCommentBox = true;
      }
    });
  }

  /**
  * Ionic life cycle hook
  */
  ionViewDidLoad(): void {
    this.content = this.navParams.get('content');
    this.pageId = this.navParams.get('pageId');

  }

  ionViewWillEnter() {
     this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW,
      ImpressionSubtype.RATING_POPUP,
      this.pageId,
      Environment.HOME, '', '', '',
      undefined,
      undefined
    );

    const log = new TelemetryLogRequest();
    log.level = LogLevel.INFO;
    log.message = this.pageId;
    log.env = Environment.HOME;
    log.type = LogType.NOTIFICATION;
    const params = new Array<any>();
    const paramsMap = new Map();
    paramsMap['PopupType'] = this.popupType;
    params.push(paramsMap);
    log.params = params;
    this.telemetryService.log(log).subscribe((val) => {
      console.log(val);
    }, err => {
      console.log(err);
    });
  }

  /**
   * Get user id
   */
  getUserId() {
    if (this.appGlobalService.getSessionData()) {
      this.userId = this.appGlobalService.getSessionData()[ProfileConstants.USER_TOKEN];
    } else {
      this.userId = '';
    }
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
  closePopover() {
    this.showCommentBox = false;
    this.viewCtrl.dismiss();
  }

  submit() {
    const option: ContentFeedback = {
      contentId: this.content.identifier,
      rating:  this.ratingCount ? this.ratingCount : this.userRating,
      comments: this.comment,
      contentVersion: this.content.contentData.versionKey
    };
    this.viewCtrl.dismiss();
    const paramsMap = new Map();
    paramsMap['Ratings'] =  this.ratingCount ? this.ratingCount : this.userRating;
    paramsMap['Comment'] = this.comment;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.RATING_SUBMITTED,
      Environment.HOME,
      this.pageId, undefined, paramsMap,
      undefined,
      undefined
    );

    const viewDismissData = {
      rating: this.ratingCount,
      comment: this.comment ? this.comment : '',
      message: ''
    };

    this.contentService.sendFeedback(option).subscribe((res) => {
      console.log('success:', res);
      viewDismissData.message = 'rating.success';
      viewDismissData.rating = this.ratingCount ? this.ratingCount : this.userRating;
      viewDismissData.comment = this.comment;
      this.viewCtrl.dismiss(viewDismissData);
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('THANK_FOR_RATING'));
    }, (data) => {
      console.log('error:', data);
      viewDismissData.message = 'rating.error';
      // TODO: ask anil to show error message(s)
      this.viewCtrl.dismiss(viewDismissData);
    });
  }

  showMessage(msg) {
    // const toast = this.toastCtrl.create({
    //   message: msg,
    //   duration: 3000,
    //   position: 'bottom'
    // });
    // toast.present();
    this.commonUtilService.showToast(this.commonUtilService.translateMessage(msg));
  }

  /**
   *
   * @param {string} constant
   */
  // translateLangConst(constant: string) {
  //   // let msg = '';
  //   // this.translate.get(constant).subscribe(
  //   //   (value: any) => {
  //   //     msg = value;
  //   //   }
  //   // );
  //   // return msg;
  //   this.commonUtilService.translateMessage(constant: string);
  // }
}
