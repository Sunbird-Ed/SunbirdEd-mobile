import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';
import { AppHeaderService } from '@app/service';


@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  showNewNotificationCount = true;
  notificationList = [
    { title: 'First Notification', description: 'Your instructor will allow access when the course is ready.', time: 'Thu 10 Jan 20:27' },
    {
      title: 'Second Notification', description: 'Second Notification Description', time: 'Thu 10 Jan 20:27', size: '5.34 MB',
      updateNotes: ['Introducing Wizard Tiers. Upgrade to a higher tier to enjoy added benefits.',
        'Now Notification land at the Notification center. Look for the bell icon on the homepage.'
      ]
    },
    { title: 'Third Notification', description: 'Third Notification Description', time: 'Thu 10 Jan 20:27' },
    { title: 'Fourth Notification', description: 'Fourth Notification Description', time: 'Thu 10 Jan 20:27' },
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private headerService: AppHeaderService
  ) {
    this.headerService.hideHeader();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

  clearNotifications() {
    this.showNewNotificationCount = false;
  }

  removeNotification(slidingItem: ItemSliding, index?: number) {
    this.notificationList.splice(index, 1);
  }

}