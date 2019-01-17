import {
  Component,
  NgZone
} from '@angular/core';
import {
  NavParams,
  ViewController,
  Platform,
  ToastController
} from 'ionic-angular';
import {
  ContentService,
  TelemetryService,
  InteractType,
  InteractSubtype,
  Environment,
  ImpressionType,
  ImpressionSubtype,
  Log,
  LogLevel
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import {
  generateImpressionTelemetry,
  generateInteractTelemetry
} from '../../app/telemetryutil';
import { ProfileConstants } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { CommonUtilService } from '../../service/common-util.service';

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
  content: any;
  showCommentBox = false;
  private pageId = '';
  userRating = 0;
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
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private contentService: ContentService,
    private telemetryService: TelemetryService,
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
    this.telemetryService.impression(generateImpressionTelemetry(
      ImpressionType.VIEW,
      ImpressionSubtype.RATING_POPUP,
      this.pageId,
      Environment.HOME, '', '', '',
      undefined,
      undefined
    ));

    const log = new Log();
    log.level = LogLevel.INFO;
    log.message = this.pageId;
    log.env = Environment.HOME;
    log.type = ImpressionType.VIEW;
    const params = new Array<any>();
    const paramsMap = new Map();
    paramsMap['PopupType'] = this.popupType;
    params.push(paramsMap);
    log.params = params;
    this.telemetryService.log(log);
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

  submit() {
    const option = {
      contentId: this.content.identifier,
      rating: this.ratingCount,
      comments: this.comment,
      contentVersion: this.content.versionKey
    };
    this.viewCtrl.dismiss();
    const paramsMap = new Map();
    paramsMap['Ratings'] = this.ratingCount;
    paramsMap['Comment'] = this.comment;
    this.telemetryService.interact(generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.RATING_SUBMITTED,
      Environment.HOME,
      this.pageId, paramsMap,
      undefined,
      undefined
    ));

    const viewDismissData = {
      rating: this.ratingCount,
      comment: this.comment ? this.comment : '',
      message: ''
    };

    this.contentService.sendFeedback(option).then((res: any) => {
      console.log('success:', res);
      viewDismissData.message = 'rating.success';
      this.viewCtrl.dismiss(viewDismissData);
      this.commonUtilService.showToast(this.commonUtilService.translateMessage('THANK_FOR_RATING'));
    })
      .catch((data: any) => {
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
