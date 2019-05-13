import { ActiveDownloadsPage } from './../active-downloads/active-downloads';
import { DownloadManagerPage } from './download-manager';
import {
    appGlobalServiceMock,
    appVersionMock,
    commonUtilServiceMock,
    contentServiceMock,
    eventsMock,
    navCtrlMock,
    telemetryGeneratorServiceMock,
    zoneMock,
    appHeaderServiceMock,
    deviceInfoServiceMock,
    navParamsMock,
    popoverCtrlMock
  } from './../../__tests__/mocks';
import { SbPopoverComponent } from './../../component/popups/sb-popover/sb-popover';
import { profileDataMock, downloadsDataMock, appStorageInfo } from './downloads-manager.spec.data';
import { Observable, Subscription } from 'rxjs';
import { EmitedContents } from './download-manager.interface';

describe('DownloadManager', () => {
    let downloadManagerPage: DownloadManagerPage;

    beforeEach( () => {

        downloadManagerPage = new DownloadManagerPage(
            navCtrlMock as any,
            navParamsMock as any,
            zoneMock as any,
            popoverCtrlMock as any,
            commonUtilServiceMock as any,
            appHeaderServiceMock as any,
            eventsMock as any,
            appGlobalServiceMock as any,
            appVersionMock as any,
            contentServiceMock as any,
            deviceInfoServiceMock as any,
            telemetryGeneratorServiceMock as any,
        );

        jest.resetAllMocks();
        jest.clearAllTimers();
        jest.useRealTimers();

    });

    it('should construct valid downloadManagerPage instance', () => {
          expect(downloadManagerPage).toBeTruthy();
    });

    describe('OnInit', () => {
        let loader;
        beforeEach( () => {
            loader = {
                present: jest.fn(),
                dismiss: jest.fn(),
                onDidDismiss: jest.fn((cb) => {
                    cb(true);
                })
            };
            // arrange
            appGlobalServiceMock.getCurrentUser.mockReturnValue(profileDataMock);
            commonUtilServiceMock.getLoader.mockReturnValue(loader);
            contentServiceMock.getContents.mockReturnValue(Observable.of(downloadsDataMock as any));
            contentServiceMock.getContentSpaceUsageSummary.mockReturnValue(Observable.of(appStorageInfo));
            deviceInfoServiceMock.getAvailableInternalMemorySize.mockReturnValue(Observable.of(['123456']));
            appVersionMock.getAppName.mockResolvedValue('Sunbird');
            // eventsMock.subscribe.mockReturnValue(Observable.from([1]));
        });

        it('should fetch downloaded contents on ngOnInit()', async (done) => {
            await downloadManagerPage.ngOnInit();

            expect(contentServiceMock.getContents).toHaveBeenCalledWith(expect.objectContaining({
                uid: profileDataMock.uid
            }));
            done();
        });

        it('should fetch app name ngOnInit()', async (done) => {
            // act
            await downloadManagerPage.ngOnInit();
            // assert
            expect(appVersionMock.getAppName).toHaveBeenCalled();
            expect(downloadManagerPage.appName).toBeTruthy();
            done();
        });

        it('should subscribe to ContentUpdateEvents on ngOnInit() and fetch downloadedContents', () => {
            // arrange
            spyOn(downloadManagerPage, 'getDownloadedContents');
            eventsMock.subscribe.mockImplementation((namespace, cb) => {
                cb({update: true});
                return {};
            });
            // act
            downloadManagerPage.ngOnInit();
            // asssert
            expect(downloadManagerPage.getDownloadedContents).toHaveBeenCalledWith(false);
        });
    });

    describe('deleteContents', () => {
        let emitedContents: EmitedContents;
        let loader;
        let popover;
        beforeEach( () => {
            emitedContents = {
                selectedContentsInfo: { count: 10},
                selectedContents: [{identifier: 'sampleid'}] as any
            };
            loader = {
                present: jest.fn(),
                dismiss: jest.fn(),
                onDidDismiss: jest.fn((cb) => {
                    cb(true);
                })
            };
            popover = {
                present: jest.fn(),
                onDidDismiss: jest.fn((cb) => {
                    cb(true);
                })
            };
            popoverCtrlMock.create.mockReturnValue(popover);
            commonUtilServiceMock.getLoader.mockReturnValue(loader);
            contentServiceMock.clearContentDeleteQueue.mockReturnValue(Observable.of([1]));
            contentServiceMock.enqueueContentDelete.mockReturnValue(Observable.of([1]));
            contentServiceMock.getContentDeleteQueue.mockReturnValue(Observable.of([1]));
            contentServiceMock.deleteContent.mockReturnValue(Observable.of([1]));
        });

        it('should delete contents on DeleteContents()', () => {
            // arrange
            // contentServiceMock.deleteContent.mockReturnValue(Observable.of({}));
            // act
            downloadManagerPage.deleteContents(emitedContents);
            // assert
            expect(contentServiceMock.deleteContent).toHaveBeenCalledWith(expect.objectContaining({
                contentDeleteList: emitedContents.selectedContents
            }));
        });

        it('should show failure toast on fail of DeleteContents()', (done) => {
            // arrange
            loader = {
                present: jest.fn(),
                dismiss: jest.fn(),
                onDidDismiss: jest.fn()
            };
            commonUtilServiceMock.getLoader.mockReturnValue(loader);
            contentServiceMock.deleteContent.mockReturnValue(Observable.throw(new Error('')));
            // act
            downloadManagerPage.deleteContents(emitedContents);
            // assert
            setTimeout(() => {
                expect(commonUtilServiceMock.translateMessage).toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should call enqueueContentDelete on DeleteContents()', () => {
            // arrange
            // contentServiceMock.deleteContent.mockReturnValue(Observable.of({}));
            emitedContents.selectedContents = [{identifier: 'sampleid1'}, {identifier: 'sampleid2'}] as any;
            // act
            downloadManagerPage.deleteContents(emitedContents);
            // assert
            expect(contentServiceMock.enqueueContentDelete).toHaveBeenCalledWith(expect.objectContaining({
                contentDeleteList: emitedContents.selectedContents
            }));
        });

        it('should delete the downloaded contents when popover onDidDismiss()', (done) => {
            // arrange
            // contentServiceMock.deleteContent.mockReturnValue(Observable.of({}));
            emitedContents.selectedContents = [{identifier: 'sampleid1'}, {identifier: 'sampleid2'}] as any;
            // act
            downloadManagerPage.deleteContents(emitedContents);
            // assert
            setTimeout(() => {
                expect(contentServiceMock.clearContentDeleteQueue).toHaveBeenCalled();
                done();
            }, 0);
        });

    });

    describe('onSortCriteriaChange', () => {

        it('should sort the list based on sizeOnDevice', () => {
            // arrange
            const sortCriteria = {content: 'Content size'};
            spyOn(downloadManagerPage, 'getDownloadedContents');
            // act
            downloadManagerPage.onSortCriteriaChange(sortCriteria);
            // assert
            expect(downloadManagerPage.getDownloadedContents).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        sortAttribute: 'sizeOnDevice'
                    })
                ])
            );
        });

        it('should sort the list based on last viewed content', () => {
            // arrange
            const sortCriteria = {content: 'Last viewed'};
            spyOn(downloadManagerPage, 'getDownloadedContents');
            // act
            downloadManagerPage.onSortCriteriaChange(sortCriteria);
            // assert
            expect(downloadManagerPage.getDownloadedContents).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        sortAttribute: 'lastUsedOn'
                    })
                ])
            );
        });

    });

    describe('ionViewWillEnter', () => {

        beforeEach(() => {
            // arrange
            appHeaderServiceMock.headerEventEmitted$ = Observable.from([{name: 'download'}]) as any;
            contentServiceMock.getContentSpaceUsageSummary.mockReturnValue(Observable.of(appStorageInfo));
            deviceInfoServiceMock.getAvailableInternalMemorySize.mockReturnValue(Observable.of(['123456']));
        });

        it('should configure the app header ionViewWillEnter()', (done) => {
            // arrange
            appHeaderServiceMock.headerEventEmitted$ = Observable.from([{name: 'download'}]) as any;
            // act
            downloadManagerPage.ionViewWillEnter();
            // assert
            setTimeout(() => {
                expect(appHeaderServiceMock.showHeaderWithHomeButton).toHaveBeenCalledWith(expect.arrayContaining(['download']));
                expect(navCtrlMock.push).toHaveBeenCalled();
                done();
            }, 1000);
        });


    });

    it('should unsubscribe methods on ionViewWillLeave()', () => {
        // arrange
        downloadManagerPage.headerObservable =  Observable.of([{name: 'download'}]).subscribe();
        spyOn(downloadManagerPage, 'ionViewWillLeave').and.callThrough();
        // act
        downloadManagerPage.ionViewWillLeave();
        // assert
        expect(downloadManagerPage.ionViewWillLeave).toHaveBeenCalled();
    });

});
