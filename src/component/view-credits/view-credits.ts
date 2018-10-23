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
  Environment,
  ImpressionType,
  ImpressionSubtype,
  Log,
  LogLevel
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import {
  generateImpressionTelemetry
} from '../../app/telemetryutil';
import { ProfileConstants } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';

@Component({
  selector: 'view-credits',
  templateUrl: 'view-credits.html'
})
export class ViewCreditsComponent {
  isDisable = false;
  userId = '';
  comment = '';
  backButtonFunc = undefined;
  content: any;
  private pageId = '';
  userRating = 0;
  private popupType: string;

  /**
   * Default function of class ViewCreditsComponent
   *
   * @param navParams
   * @param viewCtrl
   * @param authService
   * @param contentService
   */
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private contentService: ContentService,
    private telemetryService: TelemetryService,
    private appGlobalService: AppGlobalService
  ) {
    this.getUserId();
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
    this.ngZone.run(() => {
      this.popupType = this.navParams.get('popupType');
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
    this.telemetryService.impression(
      generateImpressionTelemetry(
        ImpressionType.VIEW,
        ImpressionSubtype.RATING_POPUP,
        this.pageId,
        Environment.HOME,
        '',
        '',
        '',
        undefined,
        undefined
      )
    );

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
      this.userId = this.appGlobalService.getSessionData()[
        ProfileConstants.USER_TOKEN
      ];
    } else {
      this.userId = '';
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
}
