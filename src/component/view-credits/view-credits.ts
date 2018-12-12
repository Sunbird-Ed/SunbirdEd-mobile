import {
  Component,
  NgZone
} from '@angular/core';
import {
  NavParams,
  ViewController,
  Platform
} from 'ionic-angular';
import {
  Environment,
  InteractType,
  TelemetryObject
} from 'sunbird';
import { ProfileConstants } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

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
    private ngZone: NgZone,
    private telemetrygeneratorService: TelemetryGeneratorService,
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
    this.rollUp = this.navParams.get('rollUp');
    this.correlation = this.navParams.get('correlation');
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = this.content.identifier;
    telemetryObject.type = this.content.contentType;
    telemetryObject.version = this.content.pkgVersion;
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
