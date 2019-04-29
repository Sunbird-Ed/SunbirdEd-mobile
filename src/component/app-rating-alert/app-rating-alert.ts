import { Component, Inject } from '@angular/core';
import { ViewController, Platform } from 'ionic-angular';
import { UtilityService, AppRatingService } from '@app/service';
import { SharedPreferences } from 'sunbird-sdk';
import { AppVersion } from '@ionic-native/app-version';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
    appRate: { type: ViewType.APP_RATE, heading: 'APP_RATING_RATE_EXPERIENCE', message: 'APP_RATING_TAP_ON_STARS' },
    storeRate: { type: ViewType.STORE_RATE, heading: 'APP_RATING_THANKS_FOR_RATING', message: 'APP_RATING_RATE_ON_PLAYSTORE' },
    helpDesk: { type: ViewType.HELP_DESK, heading: 'APP_RATING_THANKS_FOR_RATING', message: 'APP_RATING_REPORT_AN_ISSUE' }
  };
  private ratingNumber: number;

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
    this.viewCtrl.onDidDismiss((data: null | 'close') => {
      console.log(data);
      switch (data) {
        case null: {
          console.log('Increase 2 Days');
          this.appRatingService.setInitialDate();
          break;
        }
        case 'close': {
          console.log('Stops Days , still not Implemented');
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
    this.closePopover();
  }

  rateOnStore() {
    this.appVersion.getPackageName().then((pkg: any) => {
      this.utilityService.openPlayStore(pkg);
      this.appRatingService.setEndStoreRate();
      this.viewCtrl.dismiss('close');
    });
  }

  submitRating(rating) {
    console.log(rating);
    setTimeout(() => {
      if (rating >= this.appRatingService.APP_MIN_RATE) {
        this.currentViewText = this.appRateView[ViewType.STORE_RATE];
        return;
      }
      this.currentViewText = this.appRateView[ViewType.HELP_DESK];
    }, 0);
  }

  goToHelpSection() {

  }

}
