import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';
import { AppHeaderService, CommonUtilService } from '@app/service';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  showNewNotificationCount = true;
  notificationList = [
    {
      id: 121,
      type: 1,
      displayTime: "1560250228",
      expiry: "1560250228",
      actionData: {
        actionType: "courseUpdate",
        title: "Update Sunbird Application",
        richText: "Blah Blah Blah",
        deepLink: "https://google-play"
      }
    },
    {
      id: 121,
      type: 1,
      displayTime: "1560250228",
      expiry: "1560250228",
      actionData: {
        actionType: "updateApp",
        title: "Update Sunbird Application",
        richText: `<div><ul><li>Put the downloaded file 'GoogleService-Info.plist' in the Cordova project root folder.</li><li>It's highly recommended to use REST API to send push notifications because Firebase console does not have all the functionalities. Pay attention to the payload example in order to use the plugin properly.</li><li>howLoaderOnConfirm is no longer necessary. Your button will automatically show a loding animation when its closeModal parameter is set to false.</li></ul></div>`,
        ctaText: "Update App",
        deepLink: "https://google-play"
      },
    },
    {
      id: 122,
      type: 1,
      displayTime: "1560250228",
      expiry: "1560250228",
      actionData: {
        actionType: "courseBatch",
        title: "Course Batch Added",
        richText: "",
        deepLink: ""
      }
    }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private headerService: AppHeaderService,
    private commonUtilService: CommonUtilService
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