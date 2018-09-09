import {
    Events, IonicModule, LoadingController, NavController, NavParams, Platform, PopoverController,
    ToastController
} from 'ionic-angular';
import { NetworkMock, StorageMock } from 'ionic-mocks';
import { Ionic2RatingModule } from 'ionic2-rating';
import { Observable } from 'rxjs/Observable';
import {
    AuthService, BuildParamService, ContentService, CourseService, FileUtil, FrameworkModule,
    GenieSDKServiceProvider, ProfileType, SharedPreferences, ShareUtil, TelemetryService, InteractSubtype, PageId, Environment, InteractType, TelemetryObject, Mode, Rollup
} from 'sunbird';

import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import {
    AuthServiceMock, FileUtilMock, GenieSDKServiceProviderMock, LoadingControllerMock, NavMock,
    NavParamsMock, PlatformMock, PopoverControllerMock, SharedPreferencesMock, SocialSharingMock,
    ToastControllerMock, TranslateLoaderMock, PopoverMock
} from '../../../test-config/mocks-ionic';
import { PBHorizontal } from '../../component/pbhorizontal/pb-horizontal';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CollectionDetailsPage } from './collection-details';
import { mockRes } from './collection-details.spec.data';
import { CommonUtilService } from '../../service/common-util.service';
import { } from 'jasmine';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { ContentDetailsPage } from '../content-details/content-details';

describe('CollectionDetailsPage Component', () => {
    let component: CollectionDetailsPage;
    let fixture: ComponentFixture<CollectionDetailsPage>;
    let translateService: TranslateService;
    let identifier = 'do_212516141114736640146589';
    let spyObjPreference;
    let spyObjBuildParam;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CollectionDetailsPage, PBHorizontal],
            imports: [
                IonicModule.forRoot(CollectionDetailsPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule,
                DirectivesModule,
                Ionic2RatingModule
            ],
            providers: [
                ContentService, TelemetryService, CourseService, ShareUtil, TelemetryGeneratorService,
                CommonUtilService,
                // { provide: Platform, useClass: PlatformMock },
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalService },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                // { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ToastController, useClass: ToastControllerMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                SharedPreferences
            ]
        })
    }));

    beforeEach(() => {
        const buildParamService = TestBed.get(BuildParamService);
        const prefernce = TestBed.get(SharedPreferences);
        spyObjBuildParam = spyOn(buildParamService, 'getBuildConfigParam');
        spyObjBuildParam.and.returnValue(Promise.resolve('SAMPLE_BASE_URL'));
        spyObjPreference = spyOn(prefernce, 'getString');
        spyObjPreference.and.returnValue(Promise.resolve(ProfileType.TEACHER));
        fixture = TestBed.createComponent(CollectionDetailsPage);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        })
    });

    it('should create a valid instance of CollectionDetailsPage', () => {
        expect(component instanceof CollectionDetailsPage).toBe(true);
        expect(component).not.toBeFalsy();
    });

    it('should return Loading object', () => {
        const loadingCtrlStub = TestBed.get(LoadingController);
        expect(component.getLoader).toBeDefined();
        spyOn(component, 'getLoader').and.callThrough();
        component.getLoader();
        expect(component.getLoader).toHaveBeenCalled();
        expect(loadingCtrlStub.create).toHaveBeenCalled();
    });

    it('should set content details', () => {
        component.contentDetail = { "contentTypesCount": 1 };
        component.cardData = { "contentTypesCount": 1 };
        component.userRating = 0;
        const contentService = TestBed.get(ContentService);
        const loadingCtrl = TestBed.get(LoadingController);
        spyOn(component, 'setContentDetails').and.callThrough();
        spyOn(contentService, 'getContentDetail').and.callFake(function (option, success, error) {
            let data = JSON.stringify((mockRes.contentDetailsResponse))
            return success(data);
        });
        spyOn(component, 'setChildContents').and.callFake(function (option, success, error) {
        });
        component.setContentDetails(identifier, true);
        expect(component.setContentDetails).toBeDefined();
        expect(component.setContentDetails).toHaveBeenCalledWith(identifier, true);
        //        expect(component.extractApiResponse).toBeDefined();
        //        expect(component.extractApiResponse).toHaveBeenCalled();
    });

    it('should extract content details api response: when content locally available', () => {
        component.contentDetail = {};
        component.cardData = {};
        component.cardData.contentData = '';
        component.cardData.pkgVersion = '';
        spyOn(component, 'extractApiResponse').and.callThrough();
        spyOn(component, 'setChildContents').and.callFake(function (option, success, error) {
        });
        component.extractApiResponse(mockRes.contentDetailsResponse);
        fixture.detectChanges();
        expect(component.contentDetail).not.toBeUndefined();
    });

    it('should extract content details api response: content Locally not available', () => {
        component.contentDetail = {};
        let data = mockRes.contentDetailsResponse;
        data.result.contentData.gradeLevel = ['Class 1', 'Class 2'];
        data.result.isAvailableLocally = false;
        spyOn(component, 'extractApiResponse').and.callFake;
        component.extractApiResponse(data);
        fixture.detectChanges();
        expect(component.extractApiResponse).toBeDefined();
        expect(component.extractApiResponse).toHaveBeenCalled();
        expect(component.contentDetail).not.toBeUndefined();
        // expect(component.contentDetail.downloadable).toBe(false);
    });

    it('should open content rating screen', () => {
        const popOverCtrl = TestBed.get(PopoverController);
        //spyOn(popOverCtrl, 'create').and.callThrough();
        component.contentDetail = {};
        component.contentDetail.isAvailableLocally = true;
        component.guestUser = false;
        spyOn(component, 'rateContent').and.callThrough();
        component.rateContent();
        fixture.detectChanges();
        expect(component.rateContent).toHaveBeenCalled();
        expect(popOverCtrl.create).toHaveBeenCalled();
    });

    it('should genearte rollup object', () => {
        component.cardData = {
            hierarchyInfo: undefined
        };
        component.cardData.hierarchyInfo = mockRes.hierarchyInfo;
        spyOn(component, 'generateRollUp').and.callThrough();
        component.generateRollUp();
        expect(component.cardData.hierarchyInfo).not.toBeNull();
        expect(component.generateRollUp).toBeDefined();
        expect(component.generateRollUp).toHaveBeenCalled();
        expect(component.objRollup).not.toBeUndefined();
    });

    it('should check content download progress', () => {
        let mockData = mockRes.importContentDownloadProgressResponse;
        spyOn(component, 'subscribeGenieEvent').and.callThrough();
        const event = TestBed.get(Events);
        spyOn(event, 'subscribe').and.callFake(function ({ }, success) {
            return success(JSON.stringify(mockData));
        });
        component.cardData = {};
        component.subscribeGenieEvent();
        expect(component.subscribeGenieEvent).toBeDefined();
        expect(component.subscribeGenieEvent).toHaveBeenCalled();
        expect(event.subscribe).toHaveBeenCalled();
        expect(component.downloadProgress).toEqual(mockData.data.downloadProgress);
    });

    it("#share should invoke  export ecar API if course is locally available", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": true, "identifier": "SAMPLE_ID" }
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry');
        spyOn(component, 'generateShareInteractEvents').and.callThrough();
        const shareUtil = TestBed.get(ShareUtil);
        spyOn(shareUtil, 'exportEcar').and.callThrough().and.callFake((identifier, success) => {
            return success('SAMPLE_PATH')
        });
        component.share();
        let values = new Map();
        values["ContentType"] = 'Collection';
        expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
            InteractSubtype.SHARE_LIBRARY_INITIATED,
            Environment.HOME,
            PageId.COLLECTION_DETAIL, undefined,
            values,
            undefined,
            undefined);

    });

    it("#share should show warning toast if exportEcar gives failure response ", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": true, "identifier": "SAMPLE_ID" }
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
        const shareUtil = TestBed.get(ShareUtil);
        spyOn(shareUtil, 'exportEcar').and.callThrough().and.callFake((identifier, success, error) => {
            return error('SAMPLE_PATH')
        });
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast')
        component.share();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('SHARE_CONTENT_FAILED');
    });

    it("#share should share successfully if content is not locally available ", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
        const shareUtil = TestBed.get(ShareUtil);
        spyOn(shareUtil, 'exportEcar').and.callThrough().and.callFake((identifier, success, error) => {
            return error('SAMPLE_PATH')
        });
        const social = TestBed.get(SocialSharing);
        spyOn(social, 'share').and.callThrough();

        component.share();
        expect(social.share).toHaveBeenCalled();
    });

    it("#navigateToDetailsPage should navigate to EnrolledCourseDetails page", function () {

        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        component.identifier = 'SAMPLE_ID';
        let content = { "contentType": "Course" };
        const contentState = {

        }
        component.navigateToDetailsPage(content, 1);
        expect(navController.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, {
            content: content,
            depth: 1,
            contentState: contentState,
            corRelation: undefined
        });
    });

    it("#navigateToDetailsPage should navigate to CollectionDetails page", function () {
        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        component.identifier = 'SAMPLE_ID';
        let content = { "mimeType": "application/vnd.ekstep.content-collection" };
        const contentState = {

        }
        component.navigateToDetailsPage(content, 1);
        expect(navController.push).toHaveBeenCalledWith(CollectionDetailsPage, {
            content: content,
            depth: 1,
            contentState: contentState,
            corRelation: undefined
        });
    });

    it("#navigateToDetailsPage should navigate to ContentDetails page", function () {

        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        component.identifier = 'SAMPLE_ID';
        let content = { "contentType": "Content" };
        const contentState = {

        }
        component.navigateToDetailsPage(content, 1);
        expect(navController.push).toHaveBeenCalledWith(ContentDetailsPage, {
            isChildContent: true,
            content: content,
            depth: 1,
            contentState: contentState,
            corRelation: undefined
        });
    });

    it("#cancelDownload should cancel the download", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'cancelDownload').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify({})
            return success(data);
        });
        const navController = TestBed.get(NavController);
        spyOn(navController, 'pop');
        component.identifier = 'SAMPLE_ID';
        component.cancelDownload();
        expect(component.showLoading).toBe(false);
        expect(navController.pop).toHaveBeenCalled();
    });

    it("#cancelDownload should handle error scenario from API", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'cancelDownload').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify({})
            return error(data);
        });
        const navController = TestBed.get(NavController);
        spyOn(navController, 'pop');
        component.identifier = 'SAMPLE_ID';
        component.cancelDownload();
        expect(component.showLoading).toBe(false);
        expect(navController.pop).toHaveBeenCalled();
    });

    it("#showDownloadAlert should show confirmation alert when download all is clicked if network is available", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        component.isNetworkAvailable = true;
        spyOn(component, 'downloadAllContent').and.callThrough().and.callFake(() => { });
        PopoverMock.setOnDissMissResponse(true);
        component.showDownloadConfirmatioAlert({});
        expect(component.downloadAllContent).toHaveBeenCalled();

    });

    it("#showDownloadAlert should show error message if network is not available", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        component.isNetworkAvailable = false;
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'downloadAllContent').and.callThrough().and.callFake(() => { });
        component.showDownloadConfirmatioAlert({});
        expect(component.downloadAllContent).not.toHaveBeenCalled();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');

    });

    it("#showOverflowMenu should show Overflow menu", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        let popOverController = TestBed.get(PopoverController);
        let navController = TestBed.get(NavController);
        spyOn(navController, 'pop').and.callThrough();
        PopoverMock.setOnDissMissResponse('delete.success');
        component.showOverflowMenu({});
        expect(popOverController.create).toHaveBeenCalled();
        expect(navController.pop).toHaveBeenCalled();
    });

    it("#downloadAllContent should invoke importContent API", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'importContent').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.enqueuedImportContentResponse))
            return success(data);
        });
        component.isNetworkAvailable = true;
        component.downloadAllContent();
        expect(contentService.importContent).toHaveBeenCalled();
    });

    it("#ionViewWillLeave should unsubscribe event", function () {
        const events = TestBed.get(Events);
        spyOn(events, 'unsubscribe');
        component.ionViewWillLeave();
        expect(events.unsubscribe).toHaveBeenCalledWith('genie.event');
    });

    it("#resetVariables should reset all variables", function () {
        component.resetVariables();
        expect(component.cardData).toBe('');
        expect(component.contentDetail).toBe('');
    });

    it("#getReadableFileSize should return proper file size", function () {
        expect(component.getReadableFileSize(1120.0)).toBe('1.1 KB');
    });

    it("#rateContent shouldnot show warning toast for guest  student profiles", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        const appGlobal = TestBed.get(AppGlobalService);
        const comonUtilService = TestBed.get(CommonUtilService);
        spyOn(comonUtilService, 'showToast').and.callThrough();
        spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
        spyObjPreference.and.returnValue(Promise.resolve(ProfileType.STUDENT));
        component.checkLoggedInOrGuestUser();
        component.profileType = ProfileType.STUDENT
        component.rateContent();
        expect(comonUtilService.showToast).not.toHaveBeenCalled();

    });

    it("#rateContent should show warning toast for guest  teacher profiles", function () {
        const appGlobal = TestBed.get(AppGlobalService);
        const comonUtilService = TestBed.get(CommonUtilService);
        spyOn(comonUtilService, 'showToast').and.callThrough();
        spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
        component.checkLoggedInOrGuestUser();
        component.profileType = ProfileType.TEACHER
        component.rateContent();
        expect(comonUtilService.showToast).toHaveBeenCalledWith('SIGNIN_TO_USE_FEATURE');
    });

    it("#rateContent should show rating popup if collection is locally available", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": true, "identifier": "SAMPLE_ID" }
        let popOverController = TestBed.get(PopoverController);
        PopoverMock.setOnDissMissResponse({ message: 'rating.success' });
        component.rateContent();
        expect(popOverController.create).toHaveBeenCalled();
    });

    it("#rateContent should show warning toast if course is not locally available", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" }
        let commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast').and.callThrough();
        component.rateContent();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('TRY_BEFORE_RATING');
    });

    it("#checkCurrentUserType should populate profileType as STUDENT", function (done) {
        spyObjPreference.and.returnValue(Promise.resolve(ProfileType.STUDENT));
        component.checkCurrentUserType();
        setTimeout(() => {
            expect(component.profileType).toBe(ProfileType.STUDENT);
            done();
        }, 500);

    });
    it("#setChildContents should dismiss the children loader", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getChildContents').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.getChildContentAPIResponse))
            return success(data);
        });
        component.setChildContents();
        expect(component.showChildrenLoader).toBe(false);
    });

    it("#setChildContents should handle error scenario", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getChildContents').and.callFake(function ({ }, success, error) {
            return error();
        });
        component.setChildContents();
        expect(component.showChildrenLoader).toBe(false);
    });

    it("#importContent should populate queuedIdentifier for successfull API calls", function (done) {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);

        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        spyOn(contentService, 'importContent').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.enqueuedImportContentResponse))
            return success(data);
        });
        component.isDownloadStarted = true;
        component.importContent(['SAMPLE_ID'], false);
        setTimeout(() => {
            expect(component.queuedIdentifiers).toEqual(['SAMPLE_ID']);
            done();
        });

    });

    it("#importContent should show error if nothing is added in queuedIdentifiers ", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        spyOn(contentService, 'importContent').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse))
            return success(data);
        });
        component.isDownloadStarted = true;
        component.importContent(['SAMPLE_ID'], false);
        expect(component.queuedIdentifiers.length).toEqual(0);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
    });

    it("#importContent should restore the download state for error condition from importContent", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        spyOn(contentService, 'importContent').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse))
            return error(data);
        });
        component.isDownloadStarted = true;
        component.importContent(['SAMPLE_ID'], false);
        expect(component.isDownloadStarted).toBe(false);
    });

    it("#importContent should show error toast if failure response from importContent API", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        spyOn(contentService, 'importContent').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse))
            return error(data);
        });
        component.isDownloadStarted = false;
        component.importContent(['SAMPLE_ID'], false);
        expect(component.isDownloadStarted).toBe(false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
    });

    it("#importContent should show error toast if no content found response from importContent API", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        spyOn(contentService, 'importContent').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.noContentFoundImportContentResponse))
            return success(data);
        });
        component.isDownloadStarted = false;
        component.childrenData = [];
        component.importContent(['SAMPLE_ID'], false);
        expect(component.isDownloadStarted).toBe(false);
        expect(component.showLoading).toBe(false);
    });

    it("#updateSavedResources should pulish savedresources event", function () {
        const events = TestBed.get(Events);
        spyOn(events, 'publish');
        component.updateSavedResources();
        expect(events.publish).toHaveBeenCalledWith('savedResources:update', {
            update: true
        });
    });

    it("#subscribeGenieEvent should update the download progress when download progress event comes", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.downloadProgressEventSample1));
        });
        component.subscribeGenieEvent();
        expect(component.downloadProgress).toBe(10);
    });

    it("#subscribeGenieEvent should update the progress to 0 if API gives response -1", function () {
        component.cardData = component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.downloadProgressEventSample2));
        });
        component.subscribeGenieEvent();
        expect(component.downloadProgress).toBe(0);
    });

    it("#subscribeGenieEvent should  dismiss overlay if download progress is 100", function () {
        component.cardData = component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.downloadProgressEventSample3));
        });
        component.subscribeGenieEvent();
        expect(component.showLoading).toBe(false);
    });

    it("#subscribeGenieEvent should  mark download as complete", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.importCompleteEventSample));
        });
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = true;
        component.subscribeGenieEvent();
        expect(component.showLoading).toBe(false);
        expect(component.isDownlaodCompleted).toBe(true);
    });

    it("#subscribeGenieEvent should  load all child contents when download is complete", function () {
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.importCompleteEventSample));
        });
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = true;
        spyOn(component, 'updateSavedResources');
        component.subscribeGenieEvent();
        expect(component.updateSavedResources).toHaveBeenCalled();
    });

    it("#subscribeGenieEvent should  update the course if update event is available ", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" };
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = false;
        component.identifier = 'SAMPLE_ID';
        component.parentContent = { "identifier": "PARENT_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.updateEventSample));
        });

        spyOn(component, 'importContent').and.callThrough().and.callFake(() => { });
        component.subscribeGenieEvent();
        expect(component.showLoading).toBe(true)
        expect(component.importContent).toHaveBeenCalledWith(['PARENT_ID'], false);
    });

    it("#subscribeGenieEvent should  invoke setContentDetails if  update event is available ", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID" };
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = false;
        component.identifier = 'SAMPLE_ID';
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.updateEventSample));
        });

        spyOn(component, 'importContent').and.callThrough().and.callFake(() => { });
        spyOn(component, 'setContentDetails').and.callThrough().and.callFake(() => { });
        component.subscribeGenieEvent();
        expect(component.setContentDetails).toHaveBeenCalled();
    });

    it("#subscribeGenieEvent should  invoke setContentDetials when import is complete", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.importCompleteEventSample));
        });
        spyOn(component, 'setContentDetails').and.callThrough().and.callFake(() => { });
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = false;
        component.parentContent = { "identifier": "PARENT_ID" };
        component.subscribeGenieEvent();
        expect(component.setContentDetails).toHaveBeenCalled()
    });

    it("#subscribeGenieEvent should  invoke setContentDetials when import is complete", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.importCompleteEventSample));
        });
        spyOn(component, 'setContentDetails').and.callThrough().and.callFake(() => { });
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = false;
        component.isUpdateAvailable = true;
        component.subscribeGenieEvent();
        expect(component.setContentDetails).toHaveBeenCalled()
    });

    it("#subscribeGenieEvent should  set child contents when import is complete", function () {
        component.cardData = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        component.contentDetail = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(function ({ }, success, error) {
            return success(JSON.stringify(mockRes.importCompleteEventSample));
        });
        spyOn(component, 'updateSavedResources').and.callThrough().and.callFake(() => { });
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getChildContents').and.callFake(function ({ }, success, error) {
            let data = JSON.stringify((mockRes.getChildContentAPIResponse))
            return success(data);
        });
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.isDownloadStarted = false;
        component.isUpdateAvailable = false;
        component.subscribeGenieEvent();
        expect(component.updateSavedResources).toHaveBeenCalled()
    });

    it("#handleNetworkAvaibility should  handle network avaibility", function () {
        component.cardData = {};
        component.contentDetail = { contentTypesCount: 1 };
        spyObjBuildParam.and.returnValue(Promise.reject());
        component.handleNetworkAvaibility();
        component.generateRollUp();
        component.setCollectionStructure();
        expect(component.contentDetail.contentTypesCount).toBe(1);
    });

    it("#handleNavBackButtonClick should handle nav back button click", function () {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateEndTelemetry');
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, 'pop');
        spyOn(component, 'generateQRSessionEndEvent').and.callThrough();
        spyOn(component, 'generateEndEvent').and.callThrough();
        component.cardData = {};
        component.contentDetail = { contentTypesCount: 1 };
        component.backButtonFunc = jasmine.createSpy();
        component.handleNavBackButton();
        expect(component.generateQRSessionEndEvent).not.toHaveBeenCalled();
        expect(component.generateEndEvent).toHaveBeenCalled();
        expect(navCtrl.pop).toHaveBeenCalled();
    });

    it("#handleNavBackButtonClick should generate qrsession end event if shouldGenerateEndEvents paramater is true", function () {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateEndTelemetry');
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, 'pop');
        spyOn(component, 'generateQRSessionEndEvent').and.callThrough();
        spyOn(component, 'generateEndEvent').and.callThrough();
        component.cardData = {};
        component.contentDetail = { contentTypesCount: 1 };
        component.shouldGenerateEndTelemetry = true;
        component.backButtonFunc = jasmine.createSpy();
        component.handleNavBackButton();
        expect(component.generateQRSessionEndEvent).toHaveBeenCalled();
        expect(component.generateEndEvent).toHaveBeenCalled();
        expect(navCtrl.pop).toHaveBeenCalled();
    });

    it("#ionViewDidload should handle back button click", function () {
        component.ionViewDidLoad();
    });

    it("#ionViewWillEnter should invoke setContentDetails when page is invoked", function () {
        const navParams = TestBed.get(NavParams);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateStartTelemetry');
        spyOn(telemetryGeneratorService, 'generateImpressionTelemetry');
        navParams.data['content'] = { "contentType": "Collection", "isAvailableLocally": false, "identifier": "SAMPLE_ID", "hierarchyInfo": "PARENT_ID/CHILD_ID" };
        spyOn(component, 'setContentDetails');
        spyOn(component, 'subscribeGenieEvent');
        component.ionViewWillEnter();
        expect(component.setContentDetails).toHaveBeenCalledWith('SAMPLE_ID', true);
        expect(component.subscribeGenieEvent).toHaveBeenCalled();
        expect(telemetryGeneratorService.generateStartTelemetry).toHaveBeenCalled();
        expect(telemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalled();
    });

    it('#handleDeviceBackButton  should handle device back button click', () => {
        const platform = TestBed.get(Platform);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);

        spyOn(platform, 'registerBackButtonAction').and.callFake(function (success) {
            return success();
        });
        spyOn(component, 'generateEndEvent').and.callThrough();
        spyOn(telemetryGeneratorService, 'generateEndTelemetry').and.callThrough().and.callFake(() => { });
        component.objId = 'SAMPLE_ID';
        component.objType = 'SAMPLE_TYPE';
        component.objVer = 'SAMPLE_VERSION';
        component.backButtonFunc = jasmine.createSpy();
        component.handleDeviceBackButton();
        expect(component.generateEndEvent).toHaveBeenCalledWith('SAMPLE_ID', 'SAMPLE_TYPE', 'SAMPLE_VERSION');
        let telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = 'SAMPLE_ID';
        telemetryObject.type = 'SAMPLE_TYPE';
        telemetryObject.version = 'SAMPLE_VERSION';
        expect(telemetryGeneratorService.generateEndTelemetry).toHaveBeenCalledWith('SAMPLE_TYPE',
            Mode.PLAY,
            PageId.COLLECTION_DETAIL,
            Environment.HOME,
            telemetryObject,
            new Rollup(),
            undefined);
    });

    it('#setContentDetails  should show error toast if any error comes from getContentDetails API', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const navController = TestBed.get(NavController);
        spyOn(navController, 'pop');
        spyOn(commonUtilService, 'showToast');
        spyOn(contentService, 'getContentDetail').and.callFake(function (arg, success, error) {
            return error();
        });
        component.setContentDetails('SAMPLE_ID', false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
        expect(navController.pop).toHaveBeenCalled();
    });

    it('#extractApiResponse  should  update content if update is available', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'importContent').and.callFake(function (arg, success, error) {
        });
        spyOn(component, 'setCollectionStructure').and.callFake(function (arg, success, error) {
        });
        component.isUpdateAvailable = false;
        component.extractApiResponse(mockRes.updateContentDetailsResponse);
        expect(contentService.importContent).toHaveBeenCalled();
    });

    it('#extractApiResponse  should  download the content of its not locally available', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'importContent').and.callFake(function (arg, success, error) {
        });
        spyOn(component, 'setCollectionStructure').and.callFake(function (arg, success, error) {
        });
        component.isUpdateAvailable = false;
        component.extractApiResponse(mockRes.locallyNotAvailableContentDetailsResponse);
        expect(contentService.importContent).toHaveBeenCalled();
    });

    it('#showDownloadAllBtn  should show the download button', () => {
        component.showDownloadAllBtn([mockRes.locallyNotAvailableContentDetailsResponse.result]);
        expect(component.showDownloadBtn).toBe(true);
    });



});
