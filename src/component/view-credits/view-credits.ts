import {Component, NgZone} from '@angular/core';
import {NavParams, Platform, ViewController} from 'ionic-angular';
import {TelemetryObject} from 'sunbird-sdk';
import {ProfileConstants} from '../../app/app.constant';
import {AppGlobalService} from '../../service/app-global.service';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {Environment, InteractType} from '../../service/telemetry-constants';
import { AppVersion } from '@ionic-native/app-version';
import { ContentUtil } from '@app/util/content-util';

@Component({
  selector: 'view-credits',
  templateUrl: 'view-credits.html'
})
export class ViewCreditsComponent {
  userId = '';
  backButtonFunc = undefined;
  content: any;
  rollUp: any;
  correlation: any;
  private pageId = '';
  private popupType: string;
  appName: any;

  /**
   * Default function of class ViewCreditsComponent
   *
   * @param navParams
   * @param viewCtrl
   * @param platform
   * @param ngZone
   * @param telemetrygeneratorService
   * @param appGlobalService
   */
  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private platform: Platform,
    private ngZone: NgZone,
    private telemetrygeneratorService: TelemetryGeneratorService,
    private appGlobalService: AppGlobalService,
    private appVersion: AppVersion
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
    this.appVersion.getAppName()
      .then((appName: any) => {
        this.appName = appName;
    });

    this.content = this.navParams.get('content');
    this.pageId = this.navParams.get('pageId');
    this.rollUp = this.navParams.get('rollUp');
    this.correlation = this.navParams.get('correlation');
    const telemetryObject = new TelemetryObject(this.content.identifier, this.content.contentType, this.content.pkgVersion);

    this.telemetrygeneratorService.generateInteractTelemetry(InteractType.TOUCH,
      'credits-clicked',
      Environment.HOME,
      this.pageId,
      telemetryObject,
      undefined,
      this.rollUp,
      this.correlation
    );
  }

  /* SUDO
    if firstprperty is there and secondprperty is not there, then return firstprperty value
    else if firstprperty is not there and secondprperty is there, then return secondprperty value
    else do the merger of firstprperty and secondprperty value and return merged value
  */
 mergeProperties(mergeProp) {
  return ContentUtil.mergeProperties(this.content, mergeProp);
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
