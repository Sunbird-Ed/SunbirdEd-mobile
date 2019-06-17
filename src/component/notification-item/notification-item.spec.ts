import { NotificationItemComponent } from "./notification-item";
import { notificationServiceMock } from "../../__tests__/mocks";
import { InteractSubtype } from "../../service/telemetry-constants";
import { Observable } from "rxjs";

describe('NotificationItemComponent', () => {
    let notificationItemComponent: NotificationItemComponent;

    let itemData = {
        "id": 120,
        "type": 1,
        "displayTime": "1560250228",
        "expiry": "1560663930",
        "actionData": {
            "actionType": "updateApp",
            "description": "Notification Description",
            "title": "Testing",
            "richText": "<div><ul><li>Put the downloaded file 'GoogleService-Info.plist' in the Cordova project root folder.</li><li>It's highly recommended to use REST API to send push notifications because Firebase console does not have all the functionalities. Pay attention to the payload example in order to use the plugin properly.</li><li>howLoaderOnConfirm is no longer necessary. Your button will automatically show a loding animation when its closeModal parameter is set to false.</li></ul></div>",
            "ctaText": "Update App"
        }
    }

    beforeEach(() => {
        notificationItemComponent = new NotificationItemComponent(notificationServiceMock as any);
    });

    describe('toggleExpand', () => {
        it('should toggle the expand-compress div on click of expand button', () => {
            notificationItemComponent.isExpanded = false;
            notificationItemComponent.toggleExpand();
            expect(notificationItemComponent.isExpanded).toBeTruthy();
        });
        it('should emit an event to generate Notification on click of expand button', () => {
            notificationItemComponent.isExpanded = false;
            spyOn(notificationItemComponent.generateNotification, 'emit').and.stub();
            notificationItemComponent.toggleExpand();
            const valuesMap = new Map();
            valuesMap['expandNotification'] = true;
            expect(notificationItemComponent.generateNotification.emit).toHaveBeenCalledWith({ valuesMap: valuesMap, interactSubType: InteractSubtype.NOTIFICATION_DESCRIPTION_TOGGLE_EXPAND });
        });
    });

    describe('handleDeepLink', () => {
        notificationServiceMock.updateNotification.mockReturnValue(Observable.of(true));
        it('should emit generateNotifiation event without deep link when deep link is not present in the notification', () => {
            notificationItemComponent.itemData = itemData;
            spyOn(notificationItemComponent.generateNotification, 'emit').and.stub();
            const valuesMap = new Map();
            valuesMap['notificationBody'] = notificationItemComponent.itemData.actionData;

            notificationItemComponent.handleDeepLink();
            expect(notificationItemComponent.generateNotification.emit).toHaveBeenCalledWith({ valuesMap: valuesMap, interactSubType: InteractSubtype.NOTIFICATION_READ });
            expect(notificationServiceMock.updateNotification).toHaveBeenCalled();
        });
        it('should emit generateNotification event with deep link, when deep link is present in the notification', () => {
            notificationItemComponent.itemData = itemData;
            notificationItemComponent.itemData.actionData.deepLink = 'https://google.com';
            spyOn(notificationItemComponent.generateNotification, 'emit').and.stub();
            const valuesMap = new Map();
            valuesMap['notificationBody'] = notificationItemComponent.itemData.actionData;
            valuesMap['notificationDeepLink'] = notificationItemComponent.itemData.actionData.deepLink;
            notificationItemComponent.handleDeepLink();
            expect(notificationItemComponent.generateNotification.emit).toHaveBeenCalledWith({ valuesMap: valuesMap, interactSubType: InteractSubtype.NOTIFICATION_READ });
        });
        it('should update the notification read status once user clicked on the notification', () => {
            notificationItemComponent.itemData = itemData;
            spyOn(notificationItemComponent.notificationClick, 'emit').and.stub();
            notificationItemComponent.handleDeepLink();
            expect(notificationItemComponent.itemData.isRead).toBe(1);
            expect(notificationItemComponent.notificationClick.emit).toHaveBeenCalled();
        });
    });
});