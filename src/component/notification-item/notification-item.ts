import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'sunbird-sdk';
import { InteractSubtype } from '@app/service/telemetry-constants';

@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.html'
})
export class NotificationItemComponent {

  isExpanded = false;
  @Output() notificationClick = new EventEmitter();
  @Output() generateNotification = new EventEmitter();
  @Input('itemData') itemData;
  constructor(@Inject('NOTIFICATION_SERVICE') private notificationService: NotificationService) {
  }

  toggleExpand() {
    const valuesMap = new Map();
    valuesMap['expandNotification'] = !this.isExpanded;
    this.generateNotification.emit({ valuesMap: valuesMap, interactSubType: InteractSubtype.NOTIFICATION_DESCRIPTION_TOGGLE_EXPAND });

    this.isExpanded = !this.isExpanded;
  }

  handleDeepLink() {
    const valuesMap = new Map();
    valuesMap['notificationBody'] = this.itemData.actionData;
    if (this.itemData.actionData.deepLink && this.itemData.actionData.deepLink.length) {
      valuesMap['notificationDeepLink'] = this.itemData.actionData.deepLink;
    }
    this.generateNotification.emit({ valuesMap: valuesMap, interactSubType: InteractSubtype.NOTIFICATION_READ });

    this.itemData.isRead = 1;
    this.notificationService.updateNotification(this.itemData).subscribe((status) => {
      this.notificationClick.emit();
    });
  }
}
