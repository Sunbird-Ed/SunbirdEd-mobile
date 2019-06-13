import { Component, Input, Inject, Output, EventEmitter } from '@angular/core';
import { NotificationService } from 'sunbird-sdk';
@Component({
  selector: 'notification-item',
  templateUrl: 'notification-item.html'
})
export class NotificationItemComponent {

  isExpanded = false;
  @Output() notificationClick = new EventEmitter();
  @Input('itemData') itemData;
  constructor(@Inject('NOTIFICATION_SERVICE') private notificationService: NotificationService) {
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  handleDeepLink() {
    this.itemData.isRead = 1;
    this.notificationService.updateNotification(this.itemData).subscribe((status) => {
      this.notificationClick.emit();
    });
    console.log("handleDeepLink");
  }

}
