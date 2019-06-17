import { Component, Inject, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, Events, Navbar } from 'ionic-angular';
import { NotificationService, NotificationStatus } from 'sunbird-sdk';

import { AppHeaderService, CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { InteractType, Environment, PageId, InteractSubtype, ImpressionType } from '@app/service/telemetry-constants';
import { Platform } from 'ionic-angular/platform/platform';


@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  notificationList = [];
  newNotificationCount: number = 0;
  showClearNotificationButton: boolean;
  unregisterBackButton: any;
  @ViewChild(Navbar) navBar: Navbar;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private headerService: AppHeaderService,
    private commonUtilService: CommonUtilService,
    @Inject('NOTIFICATION_SERVICE') private notificationService: NotificationService,
    private events: Events,
    private telemetryGeneratorService: TelemetryGeneratorService,
    private platform: Platform
  ) {
    this.headerService.hideHeader();
  }

  ionViewWillEnter() {
    this.getNotifications();
    this.events.subscribe('notification:received', () => {
      this.getNotifications();
    });
    this.unregisterBackButton = this.platform.registerBackButtonAction(() => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.NOTIFICATION, Environment.NOTIFICATION, false);
      this.navCtrl.pop();
    }, 11);
  }


  getNotifications() {
    this.notificationService.getAllNotifications({ notificationStatus: NotificationStatus.ALL }).subscribe((notificationList: any) => {
      this.newNotificationCount = 0;
      this.newNotificationCount = notificationList.filter(item => !item.isRead).length;
      this.notificationList = notificationList;
    });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = () => {
      this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.NOTIFICATION, Environment.NOTIFICATION, true);
      this.navCtrl.pop();
    };
    this.telemetryGeneratorService.generateImpressionTelemetry(
      ImpressionType.VIEW, '',
      PageId.NOTIFICATION,
      Environment.NOTIFICATION, '', '', ''
    );
  }

  clearAllNotifications() {
    this.notificationService.deleteNotification().subscribe((status) => {
      this.notificationList = [];
      this.newNotificationCount = 0;
      this.events.publish('notification-status:update', { isUnreadNotifications: false });
    });

    const valuesMap = new Map();
    valuesMap['clearAllNotifications'] = true;
    this.generateClickInteractEvent(valuesMap, InteractSubtype.CLEAR_NOTIFICATIONS_CLICKED);
  }

  removeNotification(slidingItem: ItemSliding, index: number, swipeDirection: string) {
    const valuesMap = new Map();
    valuesMap['deleteNotificationId'] = this.notificationList[index].id;
    valuesMap['swipeDirection'] = swipeDirection;
    this.generateClickInteractEvent(valuesMap, InteractSubtype.CLEAR_NOTIFICATIONS_CLICKED);

    this.notificationService.deleteNotification(this.notificationList[index].id).subscribe((status) => {
      if (!this.notificationList[index].isRead) {
        this.updateNotificationCount();
      }
      this.notificationList.splice(index, 1);
    });
  }

  updateNotificationCount(event?) {
    if (this.newNotificationCount > 0) {
      if (this.newNotificationCount === 1) {
        this.events.publish('notification-status:update', { isUnreadNotifications: false });
      }
      this.newNotificationCount--;
    }
  }

  handleTelemetry(event) {
    this.generateClickInteractEvent(event.valuesMap, event.interactSubType);
  }

  generateClickInteractEvent(valuesMap, interactSubType) {
    this.telemetryGeneratorService.generateInteractTelemetry(
      InteractType.TOUCH,
      interactSubType,
      Environment.NOTIFICATION,
      PageId.NOTIFICATION,
      undefined,
      valuesMap
    );
  }

  ionViewWillLeave() {
    if (this.unregisterBackButton) {
      this.unregisterBackButton();
    }
  }
}
