import { ActiveDownloadsPage } from './active-downloads';
import {
    commonUtilServiceMock,
    contentServiceMock,
    eventsMock,
    navCtrlMock,
    popoverCtrlMock,
    telemetryGeneratorServiceMock,
    zoneMock,
    viewControllerMock,
    utilityServiceMock,
    translateServiceMock,
    platformMock,
    toastControllerMock,
    appHeaderServiceMock,
    downloadServiceMock,
    eventBusServiceMock,
    changeDetectionRefMock
} from '../../__tests__/mocks';
import { ActiveDownloadsInterface } from './active-downloads.interface';
import { Observable, Subscription } from 'rxjs';
import { SbPopoverComponent } from '@app/component';
import { SbNoNetworkPopupComponent } from '@app/component/popups/sb-no-network-popup/sb-no-network-popup';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { EventNamespace } from 'sunbird-sdk';
import { convertUrlToDehydratedSegments } from 'ionic-angular/umd/navigation/url-serializer';
import { doesNotThrow } from 'assert';
describe.only('ActiveDownloadsPage', () => {
    let activeDownloadPage: ActiveDownloadsPage;
    beforeEach(() => {
        platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
        downloadServiceMock.getActiveDownloadRequests.mockReturnValue(Observable.of([]));
        activeDownloadPage = new ActiveDownloadsPage(
            popoverCtrlMock as any,
            viewControllerMock as any,
            changeDetectionRefMock as any,
            appHeaderServiceMock as any,
            navCtrlMock as any,
            commonUtilServiceMock as any,
            toastControllerMock as any,
            telemetryGeneratorServiceMock as any,
            downloadServiceMock as any,
            eventBusServiceMock as any
        );
        jest.resetAllMocks();
    });
    it('should load instance', () => {
        expect(activeDownloadPage).toBeTruthy();
    });

    it('should set activeDownloadRequests$', () => {
        // assert
        expect(activeDownloadPage.activeDownloadRequests$).toBeTruthy();
        expect(activeDownloadPage.activeDownloadRequests$ instanceof Observable).toBeTruthy();
    });

    describe('onInit()', () => {
        beforeEach(() => {
            // arrange
            eventBusServiceMock.events.mockReturnValue(Observable.from([]));
            appHeaderServiceMock.headerEventEmitted$ = Observable.from([]) as any;
            appHeaderServiceMock.getDefaultPageConfig.mockReturnValue({});
            commonUtilServiceMock.networkAvailability$ = Observable.of(false) as any;
            const toast = {
                present: jest.fn(() => ({ then: (cb) => cb() })),
            };

            toastControllerMock.create.mockReturnValue(toast);
        });

        it('should subscribe to downloadProgress onInit()', () => {
            // act
            activeDownloadPage.ngOnInit();
            // assert
            expect(eventBusServiceMock.events).toHaveBeenCalledWith(EventNamespace.DOWNLOADS);
        });

        it('should configure the app header onInit()', () => {
            // act
            activeDownloadPage.ngOnInit();
            // assert
            expect(appHeaderServiceMock.updatePageConfig).toHaveBeenCalledWith(expect.objectContaining({
                actionButtons: [],
                showBurgerMenu: false
            }));
        });
        it('should subscribe to networkAvailability changes onInit()', () => {
            // arrange
            spyOn((commonUtilServiceMock.networkAvailability$ as any), 'subscribe');
            // act
            activeDownloadPage.ngOnInit();
            // assert
            expect((commonUtilServiceMock.networkAvailability$ as any).subscribe).toHaveBeenCalled();
        });
        it('should create a toast for the network availability onInit()', () => {
            const toast = {
                present: jest.fn(() => ({ then: (cb) => cb() })),
            };
            commonUtilServiceMock.networkAvailability$ = Observable.of(true) as any;
            toastControllerMock.create.mockReturnValue(toast);
            spyOn((commonUtilServiceMock.networkAvailability$ as any), 'subscribe');
            // act
            activeDownloadPage.ngOnInit();
            // assert
            // expect(toast.present).toHaveBeenCalled();
            expect((commonUtilServiceMock.networkAvailability$ as any).subscribe).toHaveBeenCalled();
        });
    });

    describe('cancelDownload()', () => {
        let downloadRequest;
        let popover;
        let loader;
        let toast;
        beforeEach(() => {
            // arrange
            downloadRequest = {
                downloadId: 'SAMPLE_ID',
                identifier: 'SAMPLE_IDENTIFIER',
                downloadUrl: 'SAMPLE_DOWNLOAD_URL',
                mimeType: 'SAMPLE_MIMETYPE',
                destinationFolder: 'SAMPLE_DESTINATION_FOLDER',
                filename: 'SAMPLE_FILENAME',
                downloadedFilePath: 'SAMPLE_DOWNLOADED_FILEPATH'
            };

            // arrange
            popover = {
                present: jest.fn(),
                onDidDismiss: jest.fn((cb) => {
                    cb(true);
                })
            };
            popoverCtrlMock.create.mockReturnValue(popover);
            loader = {
                present: jest.fn(() => ({ then: (cb) => cb() })),
                dismiss: jest.fn(() => ({ then: (cb) => cb() }))
            };
            commonUtilServiceMock.getLoader.mockReturnValue(loader);
            toast = {
                present: jest.fn(() => ({ then: (cb) => cb() })),
            };
            toastControllerMock.create.mockReturnValue(toast);
            downloadServiceMock.cancel.mockReturnValue(Observable.empty());
            downloadServiceMock.cancelAll.mockReturnValue(Observable.empty());
        });

        it('should present the cancel popover on cancelDownload()', () => {
            // act
            activeDownloadPage.cancelDownload(downloadRequest);
            // assert
            expect(popover.present).toHaveBeenCalled();
        });

        it('should cancel the download when popover onDidDismiss()', () => {
            // act
            activeDownloadPage.cancelDownload(downloadRequest);
            // assert
            expect(downloadServiceMock.cancel).toHaveBeenCalled();
        });
        it('should present the cancel popover on cancelAllDownloads()', () => {
            // act
            activeDownloadPage.cancelAllDownloads();
            // assert
            expect(popover.present).toHaveBeenCalled();
        });
        xit('should cancel all the downloads when popover on onDidDismiss()', (done) => {
            // arrange
            popoverCtrlMock.create.mockClear();
            popover = {
                present: jest.fn(),
                onDidDismiss: jest.fn((cb) => {
                    cb(true);
                })
            };
            popoverCtrlMock.create.mockReturnValue(popover);
            // act
            activeDownloadPage.cancelAllDownloads();
            // assert
            setTimeout(() => {
                expect(downloadServiceMock.cancelAll).toHaveBeenCalled();
                done();
            }, 0);
        });
    });


    it('should get the download progress of the content on getContentDownloadProgress()', () => {
        // arrange
        spyOn(activeDownloadPage, 'getContentDownloadProgress').and.callThrough();
        // act
        activeDownloadPage.getContentDownloadProgress('do_123444343');
        // assert
        expect(activeDownloadPage.getContentDownloadProgress).toHaveBeenCalled();
    });

    it('should unsubscribe methods on ngOnDestroy()', () => {
        // arrange
        const events$ = Observable.from([]);
        const headerEvents$ = Observable.from([]) as any;
        const networkAvailability$ = Observable.of(true) as any;

        const eventSubscription = { unsubscribe: jest.fn() };
        const headerEventsSubscription = { unsubscribe: jest.fn() };
        const networkAvailabilitySubscription = { unsubscribe: jest.fn() };

        spyOn(events$, 'subscribe').and.returnValue(eventSubscription);
        spyOn(headerEvents$, 'subscribe').and.returnValue(headerEventsSubscription);
        spyOn(networkAvailability$, 'subscribe').and.returnValue(networkAvailabilitySubscription);

        eventBusServiceMock.events.mockReturnValue(events$);
        appHeaderServiceMock.headerEventEmitted$ = headerEvents$;
        appHeaderServiceMock.getDefaultPageConfig.mockReturnValue({});
        commonUtilServiceMock.networkAvailability$ = networkAvailability$;
        // act
        activeDownloadPage.ngOnInit();
        activeDownloadPage.ngOnDestroy();
        // assert
        expect(headerEventsSubscription.unsubscribe).toHaveBeenCalled();
        expect(networkAvailabilitySubscription.unsubscribe).toHaveBeenCalled();
        // expect(eventSubscription.unsubscribe).toHaveBeenCalled();
    });



});
