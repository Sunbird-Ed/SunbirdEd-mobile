import { navbarMock } from './../../__tests__/mocks';
import { Observable } from 'rxjs';
import { NotificationsPage } from "./notifications";
import { navCtrlMock, navParamsMock, headerServiceMock, commonUtilServiceMock, notificationServiceMock, eventsMock, telemetryGeneratorServiceMock, platformMock } from "../../__tests__/mocks";
import { PageId, Environment, ImpressionType, InteractSubtype, InteractType } from '../../service/telemetry-constants';
import { ItemSliding } from 'ionic-angular';

describe('Notification Page', () => {
    let notificationPage: NotificationsPage;
    //Initialize Constructor
    beforeEach(() => {
        headerServiceMock.hideHeader.mockResolvedValue();
        notificationPage = new NotificationsPage(
            navCtrlMock as any,
            navParamsMock as any,
            headerServiceMock as any,
            commonUtilServiceMock as any,
            notificationServiceMock as any,
            eventsMock as any,
            telemetryGeneratorServiceMock as any,
            platformMock as any
        );
        notificationPage.navBar = navbarMock as any;

        jest.resetAllMocks()
    });

    it('should create a instance', () => {
        expect(notificationPage).toBeTruthy();
    });

    describe('ionViewWillEnter', () => {
        beforeEach(() => {
            spyOn(notificationPage, 'getNotifications').and.stub();
        });
        it('should call getNotifications', () => {
            notificationPage.ionViewWillEnter();
            expect(notificationPage.getNotifications).toHaveBeenCalled();
        });
        it('should subscribe for the event notification: received', () => {
            notificationPage.ionViewWillEnter();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('notification:received', expect.any(Function));
        });
        it('should call getNotifications once received event', () => {
            eventsMock.subscribe.mockReturnValue(Observable.of(true));
            notificationPage.ionViewWillEnter();
            expect(eventsMock.subscribe).toHaveReturned();
        });
        it('should call registerBackButtonAction', () => {
            platformMock.registerBackButtonAction.mockReturnValue('');
            notificationPage.ionViewWillEnter();
            expect(platformMock.registerBackButtonAction).toHaveBeenCalled();
        });
        it('should call generateBackClickedTelemetry once back button pressed', (done) => {
            spyOn(platformMock, 'registerBackButtonAction').and.callFake((cb1, cb2) => cb1());
            notificationPage.ionViewWillEnter();
            setTimeout(() => {
                expect(telemetryGeneratorServiceMock.generateBackClickedTelemetry).toHaveBeenCalledWith(PageId.NOTIFICATION, Environment.NOTIFICATION, false);
                expect(navCtrlMock.pop).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should handled callback once notification: received caught', () => {
            notificationPage.ionViewWillEnter();
            eventsMock.subscribe.mock.calls[0][1].call(notificationPage);
            expect(notificationPage.getNotifications).toHaveBeenCalled();


        });
    });

    describe('getNotifications', () => {
        it('should return saved notifications', () => {
            const returnVal = [{
                id: 121,
                type: 1,
                displayTime: 12121212,
                expiry: 212121212,
                isRead: 0,
                actionData: {
                    actionType: 'updateApp',
                    title: 'Update Available',
                    ctaText: 'Update App',
                    deepLink: 'https://google-play',
                    thumbnail: 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg',
                    banner: 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg'
                }

            }];
            notificationServiceMock.getAllNotifications.mockReturnValue(Observable.of(returnVal));
            notificationPage.getNotifications();
            expect(notificationServiceMock.getAllNotifications).toHaveBeenCalled();
            expect(notificationPage.newNotificationCount).toEqual(1);
            expect(notificationPage.notificationList).toEqual(returnVal);
        });
    });

    describe('ionViewDidLoad', () => {
        it('should call backButtonClick', () => {
            notificationPage.ionViewDidLoad();
            notificationPage.navBar.backButtonClick({} as UIEvent);
            expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalledWith(
                ImpressionType.VIEW, '',
                PageId.NOTIFICATION,
                Environment.NOTIFICATION, '', '', '');

            expect(navCtrlMock.pop).toHaveBeenCalled();
            expect(telemetryGeneratorServiceMock.generateBackClickedTelemetry).toHaveBeenCalledWith(PageId.NOTIFICATION, Environment.NOTIFICATION, true);
        });
    });

    describe('clearAllNotifications', () => {
        it('should delete the notification', () => {
            notificationServiceMock.deleteNotification.mockReturnValue(Observable.of(true));
            spyOn(notificationPage, 'generateClickInteractEvent').and.stub();
            notificationPage.clearAllNotifications();
            expect(notificationServiceMock.deleteNotification).toHaveBeenCalled();
            expect(notificationPage.newNotificationCount).toEqual(0);
            expect(eventsMock.publish).toHaveBeenCalledWith('notification-status:update', { isUnreadNotifications: false });

            const valuesMap = new Map();
            valuesMap['clearAllNotifications'] = true;
            expect(notificationPage.generateClickInteractEvent).toHaveBeenCalledWith(valuesMap, InteractSubtype.CLEAR_NOTIFICATIONS_CLICKED);
        });
    });

    describe('removeNotification', () => {
        it('should delete a given indexed notification', () => {
            notificationPage.notificationList = [{
                id: 121,
                type: 1,
                displayTime: 12121212,
                expiry: 212121212,
                isRead: 0,
                actionData: {
                    actionType: 'updateApp',
                    title: 'Update Available',
                    ctaText: 'Update App',
                    deepLink: 'https://google-play',
                    thumbnail: 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg',
                    banner: 'https://getuikit.com/v2/docs/images/placeholder_600x400.svg'
                }

            }];
            spyOn(notificationPage, 'generateClickInteractEvent').and.stub();
            spyOn(notificationPage, 'updateNotificationCount').and.stub();
            spyOn(notificationPage.notificationList, 'splice').and.stub();
            notificationServiceMock.deleteNotification.mockReturnValue(Observable.of(true));
            notificationPage.removeNotification({} as ItemSliding, 0, "left");
            const valuesMap = new Map();
            valuesMap['deleteNotificationId'] = 0;
            valuesMap['swipeDirection'] = "left";
            expect(notificationPage.generateClickInteractEvent).toHaveBeenCalledWith(valuesMap, InteractSubtype.CLEAR_NOTIFICATIONS_CLICKED);
            expect(notificationServiceMock.deleteNotification).toHaveBeenCalledWith(121);
            expect(notificationPage.updateNotificationCount).toHaveBeenCalled();
            expect(notificationPage.notificationList.splice).toHaveBeenCalledWith(0, 1);
        });
    });

    describe('updateNotificationCount', () => {
        it('should update new Notification Count', () => {
            notificationPage.newNotificationCount = 1;
            notificationPage.updateNotificationCount();
            expect(eventsMock.publish).toHaveBeenCalledWith('notification-status:update', { isUnreadNotifications: false });
            expect(notificationPage.newNotificationCount).toEqual(0);
        });
    });

    describe('handleTelemetry', () => {
        it('should call generateClickInteractEvent', () => {
            spyOn(notificationPage, 'generateClickInteractEvent').and.stub();
            const valuesMap = new Map();
            valuesMap['notificationBody'] = {};
            notificationPage.handleTelemetry({ valuesMap: valuesMap, interactSubType: InteractSubtype.NOTIFICATION_READ });
            expect(notificationPage.generateClickInteractEvent).toHaveBeenCalledWith(valuesMap, InteractSubtype.NOTIFICATION_READ);
        });
    });

    describe('generateClickInteractEvent', () => {
        it('should call generateInteractTelemetry with options', () => {
            spyOn(telemetryGeneratorServiceMock, 'generateInteractTelemetry').and.stub();
            const valuesMap = new Map();
            valuesMap['clearAllNotifications'] = true;
            notificationPage.generateClickInteractEvent(valuesMap, InteractSubtype.CLEAR_NOTIFICATIONS_CLICKED);
            expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(
                InteractType.TOUCH,
                InteractSubtype.CLEAR_NOTIFICATIONS_CLICKED,
                Environment.NOTIFICATION,
                PageId.NOTIFICATION,
                undefined,
                valuesMap
            );
        });
    });

    describe('ionViewWillLeave', () => {
        it('should unregister back button Event', () => {
            notificationPage.unregisterBackButton = jest.fn();
            notificationPage.ionViewWillLeave();
            expect(notificationPage.unregisterBackButton).toHaveBeenCalled();
        });
    });
});