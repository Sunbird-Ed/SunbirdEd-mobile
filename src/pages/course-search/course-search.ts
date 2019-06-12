import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppHeaderService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { Observable, Subscription } from 'rxjs';

/**
 * Generated class for the CourseSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-search',
  templateUrl: 'course-search.html',
})
export class CourseSearchPage implements OnInit {
  private _appHeaderSubscription?: Subscription;
  private _headerConfig = {
    showHeader: true,
    showBurgerMenu: false,
    actionButtons: [] as string[]
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private headerService: AppHeaderService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CourseSearchPage');
  }
  ngOnInit() {
    this.initAppHeader();
  }

  private initAppHeader() {
    this._appHeaderSubscription = this.headerService.headerEventEmitted$.subscribe(eventName => {
      this.handleHeaderEvents(eventName);
    });
    this._headerConfig = this.headerService.getDefaultPageConfig();
    this._headerConfig.actionButtons = [];
    this._headerConfig.showBurgerMenu = false;
    this.headerService.updatePageConfig(this._headerConfig);
  }
  private handleHeaderEvents(event: { name: string }) {
    switch (event.name) {
      case 'back':
        this.navCtrl.pop();
        break;
    }
  }

}
