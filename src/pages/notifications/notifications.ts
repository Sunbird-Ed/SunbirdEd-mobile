import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, Events } from 'ionic-angular';
import { AppHeaderService, CommonUtilService } from '@app/service';

import { NotificationService, NotificationStatus } from 'sunbird-sdk';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  showNewNotificationCount = true;
  notificationList = [];
  newNotificationCount: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private headerService: AppHeaderService,
    private commonUtilService: CommonUtilService,
    @Inject('NOTIFICATION_SERVICE') private notificationService: NotificationService,
    private events: Events
  ) {
    this.headerService.hideHeader();
  }

  ionViewWillEnter() {
    this.getNotifications();
    this.events.subscribe('notification:received', () => {
      this.getNotifications();
    });
  }


  getNotifications() {
    this.notificationService.getAllNotifications({ notificationStatus: NotificationStatus.ALL }).subscribe((notificationList: any) => {
      this.newNotificationCount = 0;
      notificationList.forEach((item) => {
        if (!item.isRead) {
          this.newNotificationCount++;
        }
      });

      this.notificationList = notificationList;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  clearAllNotifications() {
    this.showNewNotificationCount = false;
    this.notificationService.deleteNotification().subscribe((status) => {
      this.notificationList = [];
      this.newNotificationCount = 0;

      this.events.publish('notification-status:update', { isUnreadNotifications: false });

    });
  }

  removeNotification(slidingItem: ItemSliding, index?: number) {
    this.notificationService.deleteNotification(this.notificationList[index].id).subscribe((status) => {
      if (!this.notificationList[index].isRead) {
        this.updateNotificationCount();
      }
      this.notificationList.splice(index, 1);
    });
  }

  updateNotificationCount(event?) {
    if(this.newNotificationCount === 1) {
      this.events.publish('notification-status:update', { isUnreadNotifications: false });
    }
    this.newNotificationCount--;
  }

}