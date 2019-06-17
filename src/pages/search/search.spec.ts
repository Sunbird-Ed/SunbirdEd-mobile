import {mockRes} from '../search/search.spec.data';
import {
  appGlobalServiceMock,
  commonUtilServiceMock,
  contentServiceMock,
  eventsMock,
  fileUtilMock,
  formAndFrameworkUtilServiceMock,
  navCtrlMock,
  navParamsMock,
  pageAssembleServiceMock,
  platformMock,
  sharedPreferencesMock,
  telemetryGeneratorServiceMock,
  translateServiceMock,
  zoneMock,
  appHeaderServiceMock,
  courseServiceMock,
  popoverCtrlMock
} from '../../__tests__/mocks';
import {SearchPage} from './search';
import {ProfileType} from 'sunbird';
import {FilterPage} from './filters/filter';
import {AudienceFilter, ContentType, MimeType} from '../../app/app.constant';
import {EnrolledCourseDetailsPage} from '../enrolled-course-details/enrolled-course-details';
import {CollectionDetailsEtbPage} from '../collection-details-etb/collection-details-etb';
import {ContentDetailsPage} from '../content-details/content-details';

describe.only('SearchPage', () => {
    let searchPage: SearchPage;

    beforeEach(() => {
        jest.resetAllMocks();

        appGlobalServiceMock.isUserLoggedIn.mockResolvedValue(true);
        sharedPreferencesMock.getString.mockResolvedValue('SAMPLE');

        searchPage = new SearchPage(
            contentServiceMock as any,
            pageAssembleServiceMock as any,
            navParamsMock as any,
            navCtrlMock as any,
            zoneMock as any,
            eventsMock as any,
            fileUtilMock as any,
            eventsMock as any,
            appGlobalServiceMock as any,
            platformMock as any,
            formAndFrameworkUtilServiceMock as any,
            commonUtilServiceMock as any,
            telemetryGeneratorServiceMock as any,
            sharedPreferencesMock as any,
            translateServiceMock as any,
            appHeaderServiceMock as any,
            courseServiceMock as any,
            popoverCtrlMock as any
        );
        searchPage.loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };

        jest.resetAllMocks();
    });

    it('can load instance', () => {
        expect(searchPage).toBeTruthy();
    });

    it('should create valid instance for SearchPage', () => {
        spyOn(searchPage, 'handleDeviceBackButton').and.stub();
        spyOn(searchPage, 'checkUserSession').and.stub();
    });
    it('should be called backButtonFunction ionViewWillLeave ', () => {
        // arrange
        (eventsMock.unsubscribe as any).mockReturnValue('genie.event');
        searchPage.backButtonFunc = true;
        spyOn(searchPage, 'backButtonFunc').and.stub();
        // act
        searchPage.ionViewWillLeave();
        // assert
        expect(searchPage.backButtonFunc).toHaveBeenCalled();
    });
    it('should be get current framework id getFrameworkId()', (done) => {
        // arrange
        sharedPreferencesMock.getString.mockResolvedValue('SAMPLE_ID');

        // act
        searchPage.getFrameworkId();
        // assert
        setTimeout(() => {
            expect(searchPage.currentFrameworkId).toBe('SAMPLE_ID');
            done();
        }, 0);
    });
    it('should be handled error scenario getFrameWorkId()', () => {
        sharedPreferencesMock.getString.mockRejectedValue('SAMPLE_ID');
    });

    it('should be a backbutton of popCurrentPage()', () => {
        navCtrlMock.pop();
        // spyOn(searchPage, 'backButtonFunc').and.stub();
        // searchPage.popCurrentPage();
    });
    it('should be handled handleDeviceBackButton()', () => {
        // arrange
        platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
        spyOn(searchPage, 'navigateToPreviousPage').and.stub();

        // act
        searchPage.handleDeviceBackButton();
        platformMock.registerBackButtonAction.mock.calls[0][0].call(searchPage);

        // assert
        expect(searchPage.navigateToPreviousPage).toBeCalled();
        expect(searchPage.backButtonFunc).toBeCalled();
        // expect(telemetryGeneratorServiceMock.generateBackClickedTelemetry).toBeCalledWith(
        //     ImpressionType.SEARCH, Environment.HOME, false, undefined, undefined
        // );
    });
    it('should be openCollection()', () => {
        // arrange
        spyOn(searchPage, 'showContentDetails').and.stub();

        // act
        searchPage.openCollection({ identifier: 'SAMPLE_ID' });
        // assert
        expect(searchPage.showContentDetails).toHaveBeenCalled();
    });
    it('should invoked checkParent if collection is defined for openContent()', () => {
        // arrange
        contentServiceMock.getContentDetail.mockResolvedValue('SAMPLE_COLLECTION_ID');
        spyOn(searchPage, 'generateInteractEvent').and.stub();
        spyOn(searchPage, 'checkParent').and.returnValue(jest.fn());
        // act
        searchPage.openContent({ identifier: 'SAMPLE_COLLECTION_ID' }, { identifier: 'SAMPLE_ID' }, 0);
        // assert
        expect(searchPage.checkParent).toHaveBeenCalled();
    });
    it('should invoke showContentDetails of openContent()', () => {
        // arrange
        contentServiceMock.getContentDetail.mockResolvedValue('SAMPLE_COLLECTION_ID');
        spyOn(searchPage, 'generateInteractEvent').and.stub();
        spyOn(searchPage, 'checkRetiredOpenBatch').and.stub();
        // act
        searchPage.openContent(undefined, { identifier: 'SAMPLE_ID' }, 0);
        // assert
        expect(searchPage.checkRetiredOpenBatch).toHaveBeenCalled();
    });
    it('should show filter page showFilter()', (done) => {
        // arrange
        (formAndFrameworkUtilServiceMock.getLibraryFilterConfig as any).mockReturnValue(Promise.resolve(mockRes.courseConfigFilter));
        searchPage.responseData = mockRes.dialCodesearchResultResponse2;
        // act
        searchPage.showFilter();
        // assert
        setTimeout(() => {
            expect(commonUtilServiceMock.getTranslatedValue).toHaveBeenCalled();
            expect(navCtrlMock.push).toHaveBeenCalledWith(FilterPage,
                {  filterCriteria: mockRes.dialCodesearchResultResponse2.result.filterCriteria });
             done();
        }, 0);
    });
    it('should cancel the download cancelDownload()', (done) => {
        // arrange
        searchPage.parentContent = {};
        (contentServiceMock.cancelDownload as any).mockReturnValue(Promise.resolve(JSON.stringify({})));
        // act
        searchPage.cancelDownload();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.showLoading).toBe(false);
            done();
        }, 0);
    });

    it('should handled error senario for cancel download cancelDownload()', (done) => {
        // arrange
        searchPage.parentContent = {};
        (contentServiceMock.cancelDownload as any).mockReturnValue(Promise.reject(JSON.stringify({})));
        // act
        searchPage.cancelDownload();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.showLoading).toBe(false);
            done();
        }, 0);
    });

    it('should navigate to EnrolledCourseDetails Page for showContentDetails()', () => {
        // arrange
        searchPage.shouldGenerateEndTelemetry = true;
        // act
        searchPage.showContentDetails({ identifier: 'SAMPLE_ID', contentType: ContentType.COURSE });
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, expect.objectContaining({
            content: { identifier: 'SAMPLE_ID', contentType: ContentType.COURSE }
        }));
    });
    it('should navigate to CollectionDetails Page for showContentDetails()', () => {
        // arrange
        const content = { identifier: 'SAMPLE_ID', mimeType: MimeType.COLLECTION };
        // act
        searchPage.showContentDetails(content);
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsEtbPage, expect.objectContaining({}));
    });
    it('should navigate to ContentDetails Page for showContentDetails()', () => {
        // arrange
        const content = { identifier: 'SAMPLE_ID', contentType: ContentType.GAME };
        // act
        searchPage.showContentDetails(content);
        // assert
        expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, expect.objectContaining({}));
    });
    it('should invoke processDialCode if filter is being applied on Dial code result when applyFilter() ', (done) => {
        // arrange
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.dialCodesearchResultResponse2)));
        spyOn(searchPage, 'processDialCodeResult').and.returnValue(() => { });
        // act
        searchPage.responseData = mockRes.dialCodesearchResultResponse2;
        searchPage.applyFilter();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            // expect(searchPage.processDialCodeResult).to(true);
            done();
        }, 0);
    });
    it('should mark isEmpty parameter true for applyFilter()', (done) => {
        // arrange
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.emptyDialCodeResponse)));
        spyOn(searchPage, 'updateFilterIcon').and.stub();
        // act
        searchPage.responseData = mockRes.dialCodesearchResultResponse2;
        searchPage.applyFilter();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.isEmptyResult).toBe(true);
            done();
        }, 0);
    });
    it('should mark isEmpty parameter true if empty response comes from API for', (done) => {
        // arrange
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.resolve(JSON.stringify({ status: false, result: {} })));
        spyOn(searchPage, 'updateFilterIcon').and.callThrough();
        // act
        searchPage.responseData = mockRes.dialCodesearchResultResponse2;
        searchPage.applyFilter();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.isEmptyResult).toBe(true);
            done();
        }, 0);
    });
    it('should handle error response from content search API', (done) => {
        // arrange
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.reject(JSON.stringify({ status: false, result: {} })));
        // act
        searchPage.responseData = mockRes.dialCodesearchResultResponse2;
        searchPage.applyFilter();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.showLoader).toBe(false);
            done();
        }, 0);
    });
    it('handleSearch() should not invoke search API if searched keyword is greater than 3', (done) => {
        // arrange
        searchPage.searchKeywords = 'SOME_SEARCH_KEYWORD';

        spyOn(searchPage, 'applyProfileFilter').and.stub();

        window['cordova'] = { plugins: { Keyboard: { close: jest.fn() } } };

        (contentServiceMock.searchContent as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.searchResponse)));
        // act
        searchPage.handleSearch();

        // assert
        expect(searchPage.showLoader).toBe(true);
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(contentServiceMock.searchContent).toHaveBeenCalled();
            expect(searchPage.searchContentResult.length).toBe(2);
            expect(searchPage.showLoader).toBe(false);
            done();
        }, 0);
    });
    it(' should handle if empty response from search API handleSearch()', (done) => {
        // arrange
        searchPage.searchKeywords = 'SOME_SEARCH_KEYWORD';
        spyOn(searchPage, 'applyProfileFilter').and.stub();
        window['cordova'] = { plugins: { Keyboard: { close: jest.fn() } } };
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.searchResponse)));
        // act
        searchPage.handleSearch();
        // assert
        setTimeout(() => {
            expect(contentServiceMock.searchContent).toHaveBeenCalled();
            expect(searchPage.searchContentResult.length).toBe(0);
            expect(searchPage.showLoader).toBe(true);
            expect(searchPage.isEmptyResult).toBe(false);
            done();
        }, 0);
    });
    it('handleSearch() should handle error response from search API', (done) => {
        // arrange
        searchPage.searchKeywords = 'SOME_SEARCH_KEYWORD';

        spyOn(searchPage, 'applyProfileFilter').and.stub();
        window['cordova'] = { plugins: { Keyboard: { close: jest.fn() } } };
        (contentServiceMock.searchContent as any).mockReturnValue(Promise.reject(JSON.stringify(mockRes.searchResponse)));
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        (commonUtilServiceMock.showToast as any).mockReturnValue('ERROR_OFFLINE_MODE');
        // act
        searchPage.handleSearch();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.searchContentResult.length).toBe(0);
            expect(searchPage.showLoader).toBe(false);
            done();
        }, 0);
    });
    it('should get filter for applyProfileFilter()', () => {
        // arrange
        const profileFilter = ['SAMPLE_FILTER_CODE_1', 'SAMPLE_FILTER_CODE_2'];
        const categoryKey = 'SAMPLE_KEY';
        const assembleFilter = ['a', 'SAMPLE_FILTER_CODE_1'];
        // act
        const result = searchPage.applyProfileFilter(profileFilter, assembleFilter, categoryKey);

        // assert
        expect(result).toEqual(['a', 'SAMPLE_FILTER_CODE_1', 'SAMPLE_FILTER_CODE_2']);
    });

    it('should invoke getContentForDialCode in the constructor  for valid dialod code init ', () => {
        // arrange
        spyOn(searchPage, 'getContentForDialCode').and.stub();
        spyOn(searchPage, 'applyFilter').and.stub();

        navParamsMock.get.mockImplementation((v: string) => {
            if (v === 'dialCode') {
                return 'SOME_DIAL_CODE';
            } else {
                return 'OTHER';
            }
        });

        (eventsMock.subscribe as any).mockReturnValue(Promise.resolve(mockRes.dialCodesearchResultResponse2.result.filterCriteria));
        // act
        searchPage.init();
        // assert
        expect(searchPage.getContentForDialCode).toHaveBeenCalled();
    });

    it('should not invoke search API for empty dialcode getContentForDialCode()', (done) => {
        // arrange
        searchPage.dialCode = 'SOME_DIAL_CODE';
        const sections = 'SOME_SECTION';
        spyOn(searchPage, 'processDialCodeResult').and.stub();
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        (pageAssembleServiceMock.getPageAssemble as any).mockReturnValue(Promise.resolve
            (JSON.stringify(mockRes.dialCodeSections)));
        // act
        searchPage.getContentForDialCode();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.processDialCodeResult).toHaveBeenCalledWith(JSON.parse(mockRes.dialCodeSections.sections));
            done();
        }, 0);
    });
    it('should show error toast if there is no internet connection getContentForDialCode ()', (done) => {
        // arrange
        searchPage.dialCode = 'SOME_DIAL_CODE';
        (pageAssembleServiceMock.getPageAssemble as any).mockReturnValue(Promise.reject());
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        // act
        searchPage.getContentForDialCode();
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(commonUtilServiceMock.showToast).toBeCalledWith('ERROR_OFFLINE_MODE');
            done();
        }, 0);
    });
    it('should not  be called updateFilterIcon()', () => {
        // arrange
        searchPage.isEmptyResult = false;
        searchPage.responseData = mockRes.dialCodesearchResultResponse3;
        // act
        searchPage.updateFilterIcon();
        // assert
        expect(searchPage.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
    });
    it('should populate userType for guest(STUDENT) profiles checkUserSession() ', () => {
        // arrange
        (appGlobalServiceMock.isUserLoggedIn as any).mockReturnValue(false);
        (appGlobalServiceMock.getGuestUserType as any).mockReturnValue(ProfileType.STUDENT);
        //  appGlobalServiceMock.getCurrentUser.mockReturnValue(jest.fn());
        // act
        searchPage.checkUserSession();
        // assert
        expect(searchPage.audienceFilter[0]).toBe(AudienceFilter.GUEST_STUDENT[0]);
    });
    it('should populate userType for guest(STUDENT) profiles checkUserSession() ', () => {
        // arrange
        (appGlobalServiceMock.isUserLoggedIn as any).mockReturnValue(false);
        (appGlobalServiceMock.getGuestUserType as any).mockReturnValue(ProfileType.TEACHER);
        // spyOn(appGlobalServiceMock, 'getCurrentUser').and.stub();
        // act
        searchPage.checkUserSession();
        // assert
        expect(searchPage.audienceFilter[0]).toBe(AudienceFilter.GUEST_TEACHER[0]);
    });
    it('should populate userType for guest(STUDENT) profiles checkUserSession() ', () => {
        // arrange
        (appGlobalServiceMock.isUserLoggedIn as any).mockReturnValue(true);
        // act
        searchPage.checkUserSession();
        // assert
        expect(searchPage.audienceFilter[0]).toBe(AudienceFilter.LOGGED_IN_USER[0]);
        expect(searchPage.profile).toBeUndefined();
    });
    it('should be return navParam getImportContentRequestBody() ', () => {
        // arrange
        const identifiers = [];
        (fileUtilMock.internalStoragePath as any).mockReturnValue('SAMPLE_CODE');
        identifiers.push('SAMPLE_CODE');
        // act
        searchPage.getImportContentRequestBody(identifiers, true);
        // assert
    });
  it('should update the download progress when download progress event comes subscribeSdkEvent() ', () => {
        // arrange
        // act
        searchPage.subscribeSdkEvent();
        eventsMock.subscribe.mock.calls[0][1].call(searchPage, JSON.stringify(mockRes.downloadProgressEventSample1));
        zoneMock.run.mock.calls[0][0].call(searchPage);
        // assert
        expect(searchPage.loadingDisplayText).toBe('Loading content');
    });
  it('should update the download progress when download progress event comes and its 100 subscribeSdkEvent() ', () => {
        // arrange
        // (eventsMock.subscribe as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.downloadProgressEventSample2)));
        // act
        searchPage.subscribeSdkEvent();

        eventsMock.subscribe.mock.calls[0][1].call(searchPage, [(JSON.stringify(
            {
                data: {
                    downloadId: 18788,
                    downloadProgress: 100,
                    identifier: 'SAMPLE_ID',
                    status: 1
                },
                type: 'downloadProgress'
            }
        ))]);

        // eventsMock.subscribe.mock.calls[0][1].call(searchPage, JSON.stringify(mockRes.downloadProgressEventSample2));
        zoneMock.run.mock.calls[0][0].call(searchPage);
        // assert
        expect(searchPage.loadingDisplayText).toBe('Loading content ');
    });
  it('should  invoke showContentDetails subscribeSdkEvent() ', (done) => {

        spyOn(searchPage, 'showContentDetails').and.stub();

        searchPage.isDownloadStarted = true;
        searchPage.queuedIdentifiers = ['SAMPLE_ID'];
        searchPage.subscribeSdkEvent();

        eventsMock.subscribe.mock.calls[0][1].call(searchPage, [(JSON.stringify(
            {
                data: {
                    downloadId: 18788,
                    downloadProgress: -1,
                    identifier: 'SAMPLE_ID',
                    status: 'IMPORT_COMPLETED'
                },
                type: 'contentImport'
            }
        ))]);

        zoneMock.run.mock.calls[0][0].call(searchPage);

        setTimeout(() => {
            expect(searchPage.showContentDetails).toHaveBeenCalled();
            done();
        }, 0);
    });
    it(' should show error if nothing is added in queuedIdentifiers when downloadParentContent()', (done) => {
        searchPage.queuedIdentifiers = [];
        const data = JSON.stringify(mockRes.enqueuedOthersImportContentResponse);
        (contentServiceMock.importContent as any).mockReturnValue(Promise.resolve(data));
        searchPage.isDownloadStarted = false;
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
        // (commonUtilServiceMock.showToast as any).mockReturnValue('ERROR_CONTENT_NOT_AVAILABLE');
        // act
        searchPage.downloadParentContent({ identifier: 'SAMPLE_ID' });

        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.queuedIdentifiers.length).toEqual(0);
            //  expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
            done();
        }, 0);
        setTimeout(() => {
            zoneMock.run.mock.calls[1][0].call(searchPage);
            expect(searchPage.queuedIdentifiers.length).toEqual(0);
            expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
            done();
        }, 0);
    });

    it('should show error if nothing is added in queuedIdentifiers  and network is not available downloadParentContent() ', (done) => {
        // arrange
        const data = JSON.stringify(mockRes.enqueuedOthersImportContentResponse);
        contentServiceMock.importContent.mockResolvedValue(data);
        searchPage.isDownloadStarted = false;
        commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
        (commonUtilServiceMock.showToast as any).mockReturnValue('ERROR_OFFLINE_MODE');
        // act
        searchPage.downloadParentContent({ identifier: 'SAMPLE_ID' });
        // assert
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.queuedIdentifiers.length).toEqual(0);
            done();
        }, 0);
        setTimeout(() => {
            zoneMock.run.mock.calls[1][0].call(searchPage);
            expect(searchPage.queuedIdentifiers.length).toEqual(0);
            expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_OFFLINE_MODE');
        }, 0);
    });

    it('should data result is available locally checkParent()', (done) => {
        // assert
        spyOn(searchPage, 'showContentDetails').and.stub();
        const data = mockRes.contentDetailsResponse;
        (contentServiceMock.getContentDetail as any).mockResolvedValue(JSON.stringify(data));
        // act
        searchPage.checkParent({ identifier: 'SAMPLE_ID' }, { identifier: 'SAMPLE_ID' });
        // arrange
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.showContentDetails).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should data result is not available locally checkParent()', (done) => {
        // assert
        const data = mockRes.contentDetailsResponse;
        data.result.isAvailableLocally = false;
        (contentServiceMock.getContentDetail as any).mockResolvedValue(JSON.stringify(data));
      spyOn(searchPage, 'subscribeSdkEvent').and.stub();
        spyOn(searchPage, 'downloadParentContent').and.stub();
        // act
        searchPage.checkParent({ identifier: 'SAMPLE_ID' }, { identifier: 'SAMPLE_ID' });
        // arrange
        setTimeout(() => {
            expect(searchPage.subscribeSdkEvent).toHaveBeenCalled();
            expect(searchPage.downloadParentContent).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should data is invalid checkParent()', (done) => {
        // assert
        const data = false;
        (contentServiceMock.getContentDetail as any).mockResolvedValue(JSON.stringify(data));
        spyOn(searchPage, 'showContentDetails').and.stub();
        // act
        searchPage.checkParent({ identifier: 'SAMPLE_ID' }, { identifier: 'SAMPLE_ID' });
        // arrange
        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call(searchPage);
            expect(searchPage.showContentDetails).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should be telemetry generate service when generateQRScanSuccessInteractEvent()', () => {
        // arrange
        // act
        searchPage.generateQRScanSuccessInteractEvent({value: 'count'}, {value: 'scannedData'});
        // assert
    });
    it(' should be displayed dial code result when  processDialCodeResult()', () => {
        // arrange
        const dialResult = mockRes.dialCodesearchResultResponse2;
        // act
        searchPage.processDialCodeResult([]);
        // assert
    });
    // it('processDialCodeResultPrev should be called', () => {
    //     // arrange
    //     const dialResults = mockRes.dialCodesearchResultResponse;
    //     // act
    //     searchPage.processDialCodeResultPrev(dialResults);
    //     // assert
    // });
    it('should be navigate when ionViewDidLoad() ', () => {
        // arrange
        spyOn(searchPage, 'navigateToPreviousPage').and.stub();
         const data = (telemetryGeneratorServiceMock.generateBackClickedTelemetry as any).mockReturnValue('');
         searchPage.navBar = data;
        // act
        searchPage.ionViewDidLoad();
        // assert
    });

    it('#checkRetiredOpenBatch should call navigateToDetailPage()', () => {
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        commonUtilServiceMock.getLoader.mockReturnValue(loader);
        spyOn(searchPage, 'showContentDetails').and.stub();
        searchPage.checkRetiredOpenBatch({}, 'InProgress');
        expect(searchPage.showContentDetails).toBeCalledWith({}, true);
    });

    it('#checkRetiredOpenBatch should call navigateToBatchListPopup()', () => {
        const loader = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        commonUtilServiceMock.getLoader.mockReturnValue(loader);
        searchPage.enrolledCourses = mockRes.enrolledCourses;
        spyOn(searchPage, 'navigateToBatchListPopup').and.stub();
        searchPage.checkRetiredOpenBatch(mockRes.contentMock1);
        expect(searchPage.navigateToBatchListPopup).toBeCalledWith(mockRes.contentMock1, undefined, [mockRes.enrolledCourses[1]]);
    });

    it('#navigateToBatchListPopup should call should present the popup calling present()', (done) => {
        commonUtilServiceMock.networkInfo = {
            isNetworkAvailable: true
        };
        const popup = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        searchPage.guestUser = false;
        popoverCtrlMock.create.mockReturnValue(popup);
        courseServiceMock.getCourseBatches.mockResolvedValue(JSON.stringify(mockRes.openUpcomingBatchesResponse));

        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call();
            expect(searchPage.batches.length).toBe(1);
            expect(searchPage.loader.dismiss).toHaveBeenCalled();
            expect(popup.present).toHaveBeenCalled();
            done();
        }, 0);
        searchPage.navigateToBatchListPopup(mockRes.contentMock1);
    });

    it('#navigateToBatchListPopup should call navigateToDetailPage()', (done) => {
        commonUtilServiceMock.networkInfo = {
            isNetworkAvailable: true
        };
        const popup = {
            present: jest.fn(),
            dismiss: jest.fn()
        };
        searchPage.guestUser = false;
        popoverCtrlMock.create.mockReturnValue(popup);
        courseServiceMock.getCourseBatches.mockResolvedValue(JSON.stringify(mockRes.noOpenUpcomingBatchesResponse));
        spyOn(searchPage, 'showContentDetails').and.stub();

        setTimeout(() => {
            zoneMock.run.mock.calls[0][0].call();
            expect(searchPage.batches.length).toBe(0);
            expect(searchPage.showContentDetails).toHaveBeenCalledWith(mockRes.contentMock1, true);
            expect(searchPage.loader.dismiss).toHaveBeenCalled();
            done();
        }, 0);
        searchPage.navigateToBatchListPopup(mockRes.contentMock1, null);
    });

});

