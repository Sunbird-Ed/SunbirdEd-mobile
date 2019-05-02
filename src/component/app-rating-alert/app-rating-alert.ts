import {Component, Inject} from '@angular/core';
import {NavParams, Platform, ViewController} from 'ionic-angular';
import {AppRatingService, TelemetryGeneratorService, UtilityService} from '@app/service';
import {LogLevel, LogType, SharedPreferences, TelemetryLogRequest, TelemetryService} from 'sunbird-sdk';
import {AppVersion} from '@ionic-native/app-version';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {StoreRating} from '../../app/app.constant';
import {
  Environment,
  ImpressionSubtype,
  ImpressionType,
  InteractSubtype,
  InteractType
} from "@app/service/telemetry-constants";

enum ViewType {
  APP_RATE = 'appRate',
  STORE_RATE = 'storeRate',
  HELP_DESK = 'helpDesk',
}

interface ViewText {
  type: string;
  heading: string;
  message: string;
}

@Component({
  selector: 'app-rating-alert',
  templateUrl: 'app-rating-alert.html'
})
export class AppRatingAlertComponent {

  private readonly appRateView = {
    appRate: {type: ViewType.APP_RATE, heading: 'APP_RATING_RATE_EXPERIENCE', message: 'APP_RATING_TAP_ON_STARS'},
    storeRate: {
      type: ViewType.STORE_RATE,
      heading: 'APP_RATING_THANKS_FOR_RATING',
      message: 'APP_RATING_RATE_ON_PLAYSTORE'
    },
    helpDesk: {type: ViewType.HELP_DESK, heading: 'APP_RATING_THANKS_FOR_RATING', message: 'APP_RATING_REPORT_AN_ISSUE'}
  };
  private ratingNumber: number;
  private rateLaterCount = 0;
  private popupType: string;
  private appRate = 0;
  private pageId = '';
  public currentViewText: ViewText;
  public appLogo$: Observable<string>;
  public appName$: Observable<string>;
  backButtonFunc = undefined;

  constructor(private viewCtrl: ViewController,
              private appVersion: AppVersion,
              private utilityService: UtilityService,
              private appRatingService: AppRatingService,
              @Inject('SHARED_PREFERENCES') private preference: SharedPreferences,
              private translate: TranslateService,
              private platform: Platform,
              private telemetryGeneratorService: TelemetryGeneratorService,
              private navParams: NavParams,
              @Inject('TELEMETRY_SERVICE') private telemetryService: TelemetryService,
  ) {
    this.appLogo$ = this.preference.getString('app_logo').map((logo) => logo || './assets/imgs/ic_launcher.png');
    this.appName$ = this.preference.getString('app_name');
    this.currentViewText = this.appRateView[ViewType.APP_RATE];
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss(null);
      this.backButtonFunc();
    }, 20);
  }

  ionViewDidLoad() {
    this.pageId = this.navParams.get('pageId');
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
    this.telemetryService.log(log).subscribe((data) => {
      console.log(data);
    }, (error) => {
      console.log('errorOccurred', error);
    });

    this.viewCtrl.onDidDismiss((data: null | 'close') => {
      switch (data) {
        case null: {
          this.appRatingService.setInitialDate();
          break;
        }
        case 'close': {
          // this.appRatingService.setEndAppRate();
          break;
        }
      }
    });
  }

  closePopover() {
    this.viewCtrl.dismiss(null);
  }

  rateLater() {
    this.rateLaterCount += 1;
    console.log('rateLater count ', this.rateLaterCount);
    const paramsMap = new Map();
    paramsMap['rateLater'] = this.rateLaterCount;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.RATE_LATER_CLICKED,
      Environment.HOME,
      this.pageId, undefined, paramsMap,
      undefined, undefined
    );
    this.closePopover();
  }

  rateOnStore() {
    this.appVersion.getPackageName().then((pkg: any) => {
      this.utilityService.openPlayStore(pkg);
      this.appRatingService.setEndStoreRate(this.appRate);
      const paramsMap = new Map();
      paramsMap['RateStore'] = this.appRate;
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.PLAY_STORE_BUTTON_CLICKED,
        Environment.HOME,
        this.pageId, undefined, paramsMap,
        undefined, undefined
      );
      this.viewCtrl.dismiss('close');
    });
  }

  submitRating(rating) {
    setTimeout(() => {
      if (rating >= StoreRating.APP_MIN_RATE) {
        this.currentViewText = this.appRateView[ViewType.STORE_RATE];
        this.appRate = rating;
        return;
      }
      this.currentViewText = this.appRateView[ViewType.HELP_DESK];
    }, 0);
    const paramsMap = new Map();
    paramsMap['Ratings'] = this.appRate;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.RATING_SUBMITTED,
      Environment.HOME,
      this.pageId, undefined, paramsMap,
      undefined, undefined
    );
  }

  goToHelpSection() {
    const paramsMap = new Map();
    paramsMap['Help-section'] = this.appRate;
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      InteractSubtype.HELP_SECTION_CLICKED,
      Environment.HOME,
      this.pageId, undefined, paramsMap, undefined, undefined
    );
  }

}
