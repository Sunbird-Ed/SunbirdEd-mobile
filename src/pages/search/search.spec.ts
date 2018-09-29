import { PBHorizontal } from './../../component/pbhorizontal/pb-horizontal';
import { PipesModule } from './../../pipes/pipes.module';
import {
    async,
    TestBed,
    ComponentFixture
} from '@angular/core/testing';
import {
    TranslateModule,
    TranslateLoader
} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { SearchPage } from './search';
import { DirectivesModule } from '../../directives/directives.module';
import { AppGlobalService } from '../../service/app-global.service';
import {
    NavController,
    Events,
    IonicModule,
    NavParams
} from 'ionic-angular';
import {
    NetworkMock,
} from 'ionic-mocks';
import {
    AuthService,
    FrameworkModule,
    ContentService,
    TelemetryService,
    CourseService,
    ShareUtil,
    SharedPreferences,
    ProfileType,
    FileUtil,
    PageId
} from 'sunbird';
import {
    NavMock,
    TranslateLoaderMock,
    AuthServiceMock,
    NavParamsMockNew,
    AppGlobalServiceMock,
    PopoverControllerMock
} from '../../../test-config/mocks-ionic';
import { } from 'jasmine';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';
import { AppVersion } from '@ionic-native/app-version';
import { CommonUtilService } from '../../service/common-util.service';
import { mockRes } from '../search/search.spec.data';
import {
    AudienceFilter,
    ContentType,
    MimeType
} from '../../app/app.constant';
import { Platform } from 'ionic-angular';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details/enrolled-course-details';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { PopoverController } from 'ionic-angular';
import { FilterPage } from './filters/filter';

describe('SearchPage Component', () => {
    let component: SearchPage;
    let fixture: ComponentFixture<SearchPage>;
    let spyObj;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchPage, PBHorizontal],
            imports: [
                IonicModule.forRoot(SearchPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule,
                DirectivesModule
            ],
            providers: [
                ContentService, TelemetryService, CourseService, ShareUtil, TelemetryGeneratorService,
                Network,
                AppVersion, CommonUtilService, FormAndFrameworkUtilService,
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMockNew },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                // { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }
            ]
        });
    }));

    beforeEach(() => {
        const prefernce = TestBed.get(SharedPreferences);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callThrough().and.callFake(() => { });
        spyObj = spyOn(prefernce, 'getString');
        spyObj.and.returnValue(Promise.resolve('en'));
        NavParamsMockNew.setParams('dialCode', undefined);
        fixture = TestBed.createComponent(SearchPage);
        component = fixture.componentInstance;
    });

    it('#subscribeUtilityEvents should handle device Back button', () => {
        const platform = TestBed.get(Platform);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(platform, 'registerBackButtonAction').and.callFake((success) => {
            return success();
        });
        spyOn(telemetryGeneratorService, 'generateEndTelemetry').and.callFake(() => { });
        spyOn(component, 'generateQRSessionEndEvent');
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.source = PageId.CONTENT_DETAIL;
        component.backButtonFunc = jasmine.createSpy();
        component.shouldGenerateEndTelemetry = true;
        component.handleDeviceBackButton();
        expect(component.generateQRSessionEndEvent).toHaveBeenCalledWith(PageId.CONTENT_DETAIL, 'SAMPLE_DIAL_CODE');
        expect(component.backButtonFunc).toBeUndefined();
    });


    it('#handleNavBackButton should handle nav back button click', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateEndTelemetry').and.callFake(() => { });
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, 'pop');
        spyOn(component, 'generateQRSessionEndEvent').and.callThrough();
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.source = PageId.CONTENT_DETAIL;
        component.shouldGenerateEndTelemetry = true;
        component.backButtonFunc = jasmine.createSpy();
        component.handleNavBackButton();
        expect(component.generateQRSessionEndEvent).toHaveBeenCalled();
        expect(navCtrl.pop).toHaveBeenCalled();
    });

    it('#checkParent should invoke showContentDetils if content is locally available', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake(({ }, success) => {
            return success(JSON.stringify(mockRes.contentDetailsResponse));
        });
        spyOn(component, 'showContentDetails');
        component.checkParent({ identifier: 'SAMPLE_PARENT_ID' }, { identifier: 'SAMPLE_CHILD_ID' });
        expect(component.showContentDetails).toHaveBeenCalled();
    });

    it('#checkParent should download parent if content is not locally available', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake(({ }, success) => {
            return success(JSON.stringify(mockRes.locallyNotAvailableContentDetailsResponse));
        });
        spyOn(component, 'subscribeGenieEvent');
        spyOn(component, 'downloadParentContent');
        component.checkParent({ identifier: 'SAMPLE_PARENT_ID' }, { identifier: 'SAMPLE_CHILD_ID' });
        expect(component.downloadParentContent).toHaveBeenCalled();
        expect(component.subscribeGenieEvent).toHaveBeenCalled();
    });

    it('#checkParent should invoke showContentDetils if response is empty', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake(({ }, success) => {
            return success(JSON.stringify({}));
        });
        spyOn(component, 'showContentDetails');
        component.checkParent({ identifier: 'SAMPLE_PARENT_ID' }, { identifier: 'SAMPLE_CHILD_ID' });
        expect(component.showContentDetails).toHaveBeenCalled();
    });

    it('#checkParent should handle error scenarios returned from getContentDetials API', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
            return error();
        });
        spyOn(component, 'showContentDetails');
        component.checkParent({ identifier: 'SAMPLE_PARENT_ID' }, { identifier: 'SAMPLE_CHILD_ID' });
        expect(component.showContentDetails).not.toHaveBeenCalled();
    });


    it('#subscribeGenieEvent should update the download progress when download progress event comes', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(({ }, success) => {
            return success(mockRes.downloadProgressEventSample1);
        });
        component.subscribeGenieEvent();
        expect(component.loadingDisplayText).toBe('Loading content 10 %');
    });

    it('#subscribeGenieEvent should update the download progress when download progress event comes and its 100', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(({ }, success) => {
            return success(mockRes.downloadProgressEventSample2);
        });
        component.subscribeGenieEvent();
        expect(component.loadingDisplayText).toBe('Loading content ');
    });

    it('#subscribeGenieEvent should  invoke showContentDetails', () => {
        const events = TestBed.get(Events);
        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        spyOn(component, 'showContentDetails');
        spyOn(events, 'publish');
        spyOn(events, 'subscribe').and.callFake(({ }, success) => {
            return success(mockRes.importCompleteEvent);
        });
        component.isDownloadStarted = true;
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.subscribeGenieEvent();
        expect(component.showContentDetails).toHaveBeenCalled();
        expect(events.publish).toHaveBeenCalledWith('savedResources:update', {
            update: true
        });
    });

    it('#subscribeGenieEvent should  publish save resource update event', () => {
        const events = TestBed.get(Events);
        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        spyOn(component, 'showContentDetails');
        spyOn(events, 'publish');
        spyOn(events, 'subscribe').and.callFake(({ }, success) => {
            return success(mockRes.importCompleteEvent);
        });
        component.queuedIdentifiers = ['SAMPLE_ID'];
        component.subscribeGenieEvent();
        expect(component.showContentDetails).not.toHaveBeenCalled();
        expect(events.publish).toHaveBeenCalledWith('savedResources:update', {
            update: true
        });
    });

    it('#cancelDownload should cancel the download', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'cancelDownload').and.callFake(({ }, success, error) => {
            const data = JSON.stringify({});
            return success(data);
        });
        component.parentContent = { identifier: 'SAMPLE_ID' };
        component.cancelDownload();
        expect(component.showLoading).toBe(false);
    });

    it('#cancelDownload should handle error scenario from API', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'cancelDownload').and.callFake(({ }, success, error) => {
            const data = JSON.stringify({});
            return error(data);
        });
        component.parentContent = { identifier: 'SAMPLE_ID' };
        component.cancelDownload();
        expect(component.showLoading).toBe(false);
    });

    it('#checkUserSession should populate userType for guest(TEACHER) profiles', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
        spyOn(appGlobal, 'getCurrentUser');
        spyOn(appGlobal, 'getGuestUserType').and.returnValue(ProfileType.STUDENT);
        component.checkUserSession();
        expect(component.audienceFilter).toBe(AudienceFilter.GUEST_STUDENT);
        expect(appGlobal.getCurrentUser).toHaveBeenCalled();
    });

    it('#checkUserSession should populate userType for guest(STUDENT) profiles', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        spyOn(appGlobal, 'getCurrentUser');
        spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
        spyOn(appGlobal, 'getGuestUserType').and.returnValue(ProfileType.TEACHER);
        component.checkUserSession();
        expect(component.audienceFilter).toBe(AudienceFilter.GUEST_TEACHER);
        expect(appGlobal.getCurrentUser).toHaveBeenCalled();
    });

    it('#checkUserSession should update the filter incase of logged in user', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        spyOn(appGlobal, 'getCurrentUser');
        spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(true);
        component.checkUserSession();
        expect(appGlobal.getCurrentUser).not.toHaveBeenCalled();
        expect(component.profile).toBeUndefined();
    });

    it('#downloadParentContent should populate queuedIdentifier for successfull API calls', (done) => {
        const contentService = TestBed.get(ContentService);
        const fileUtil = TestBed.get(FileUtil);
        spyOn(fileUtil, 'internalStoragePath').and.returnValue('');
        spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
            const data = JSON.stringify((mockRes.enqueuedImportContentResponse));
            return success(data);
        });
        component.isDownloadStarted = true;
        component.downloadParentContent({ identifier: 'SAMPLE_ID' });
        setTimeout(() => {
            expect(component.queuedIdentifiers).toEqual(['SAMPLE_ID']);
            done();
        });

    });

    it('#downloadParentContent should show error if nothing is added in queuedIdentifiers ', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const fileUtil = TestBed.get(FileUtil);
        spyOn(fileUtil, 'internalStoragePath').and.returnValue('');
        spyOn(commonUtilService, 'showToast');
        spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
            const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
            return success(data);
        });

        component.isDownloadStarted = false;
        component.downloadParentContent({ identifier: 'SAMPLE_ID' });
        expect(component.queuedIdentifiers.length).toEqual(0);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
    });

    it('#downloadParentContent should show error if nothing is added in queuedIdentifiers  and network is not available', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const fileUtil = TestBed.get(FileUtil);
        const network = TestBed.get(Network);
        spyOn(fileUtil, 'internalStoragePath').and.returnValue('');
        spyOn(commonUtilService, 'showToast');

        spyOnProperty(network, 'type').and.returnValue('none');
        spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
            const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
            return success(data);
        });

        component.isDownloadStarted = false;
        component.downloadParentContent({ identifier: 'SAMPLE_ID' });
        expect(component.queuedIdentifiers.length).toEqual(0);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_OFFLINE_MODE');
    });

    it('#downloadParentContent should restore the download state for error condition from importContent', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const fileUtil = TestBed.get(FileUtil);
        spyOn(fileUtil, 'internalStoragePath').and.returnValue('');
        spyOn(commonUtilService, 'showToast');

        spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
            const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
            return error(data);
        });

        component.isDownloadStarted = false;
        component.downloadParentContent({ identifier: 'SAMPLE_ID' });
        expect(component.queuedIdentifiers.length).toEqual(0);
    });
    it('#downloadParentContent should show error if nothing is added in queuedIdentifiers ', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        const fileUtil = TestBed.get(FileUtil);
        spyOn(fileUtil, 'internalStoragePath').and.returnValue('');
        spyOn(commonUtilService, 'showToast');
        spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
            const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
            return success(data);
        });

        component.isDownloadStarted = false;
        component.downloadParentContent({ identifier: 'SAMPLE_ID' });
        expect(component.queuedIdentifiers.length).toEqual(0);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
    });

    it('#openCollection should invoke showContentDetails', () => {
        spyOn(component, 'showContentDetails');
        component.openCollection({ identifier: 'SAMPLE_ID' });
        expect(component.showContentDetails).toHaveBeenCalled();
    });

    it('#openContent should invoke checkParent', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
        spyOn(component, 'checkParent');
        component.openContent({ identifier: 'SAMPLE_COLLECTION_ID' }, { identifier: 'SAMPLE_ID' }, 0);
        expect(component.checkParent).toHaveBeenCalled();
    });

    it('#openContent should invoke showContentDetails', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
        spyOn(component, 'showContentDetails');
        component.openContent(undefined, { identifier: 'SAMPLE_ID' }, 0);
        expect(component.showContentDetails).toHaveBeenCalled();
    });

    it('#ionViewWillLeave should unsubscribe genie events', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'unsubscribe').and.callFake(() => { });
        spyOn(component, 'showContentDetails');
        component.ionViewWillLeave();
        expect(events.unsubscribe).toHaveBeenCalledWith('genie.event');
    });

    it('#showContentDetails should navigate to EnrolledCourseDetails Page', () => {
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, 'push');
        component.source = PageId.CONTENT_DETAIL;
        component.shouldGenerateEndTelemetry = true;
        component.showContentDetails({ identifier: 'SAMPLE_ID', contentType: ContentType.COURSE });
        expect(navCtrl.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, {
            content: { identifier: 'SAMPLE_ID', contentType: ContentType.COURSE },
            corRelation: this.corRelationList,
            source: PageId.CONTENT_DETAIL,
            shouldGenerateEndTelemetry: true,
            parentContent: undefined
        });
        component.ionViewDidLoad();
        component.searchOnChange();
    });

    it('#showContentDetails should navigate to CollectionDetails Page', () => {
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, 'push');
        const content = { identifier: 'SAMPLE_ID', mimeType: MimeType.COLLECTION };
        component.showContentDetails(content);
        expect(navCtrl.push).toHaveBeenCalledWith(CollectionDetailsPage, {
            content: content,
            corRelation: undefined,
            parentContent: undefined
        });
    });

    it('#showContentDetails should navigate to ContentDetails Page', () => {
        const navCtrl = TestBed.get(NavController);
        spyOn(navCtrl, 'push');
        const content = { identifier: 'SAMPLE_ID', contentType: ContentType.GAME };
        component.showContentDetails(content);
        expect(navCtrl.push).toHaveBeenCalledWith(ContentDetailsPage, {
            content: content,
            corRelation: undefined,
            parentContent: undefined
        });
    });

    it('#handleSearch should not invoke search API if searched keyword is less than 3', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent');
        component.searchKeywords = 'Te';
        component.handleSearch();
        expect(contentService.searchContent).not.toHaveBeenCalled();
    });

    it('#handleSearch should not invoke search API if searched keyword is greater than 3', () => {
        const contentService = TestBed.get(ContentService);
        const windowObj = window['cordova'] = {};
        const plugins = windowObj['plugins'] = {};
        plugins['Keyboard'] = {
            close: () => ({})
        };
        spyOn(plugins['Keyboard'], 'close').and.callFake((error) => {
        });

        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => { });

        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.searchResponse));
        });
        component.searchKeywords = 'Test';
        component.profile = mockRes.sampleProfile;
        component.handleSearch();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(component.searchContentResult.length).toBe(2);
        expect(component.showLoader).toBe(false);
    });

    it('#handleSearch should handle if empty response from search API', () => {
        const contentService = TestBed.get(ContentService);
        const windowObj = window['cordova'] = {};
        const plugins = windowObj['plugins'] = {};
        plugins['Keyboard'] = {
            close: () => ({})
        };
        spyOn(plugins['Keyboard'], 'close').and.callFake((error) => {
        });

        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => { });

        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify({}));
        });
        component.searchKeywords = 'Test';
        component.profile = mockRes.sampleProfile;
        component.handleSearch();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(component.searchContentResult.length).toBe(0);
        expect(component.showLoader).toBe(false);
        expect(component.isEmptyResult).toBe(true);
    });

    it('#handleSearch should handle error response from search API', () => {
        const contentService = TestBed.get(ContentService);
        const windowObj = window['cordova'] = {};
        const plugins = windowObj['plugins'] = {};
        plugins['Keyboard'] = {
            close: () => ({})
        };
        spyOn(plugins['Keyboard'], 'close').and.callFake((error) => {
        });

        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => { });

        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return error(JSON.stringify({}));
        });

        const network = TestBed.get(Network);
        spyOnProperty(network, 'type').and.returnValue('none');
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        component.searchKeywords = 'Test';
        component.handleSearch();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(component.searchContentResult.length).toBe(0);
        expect(component.showLoader).toBe(false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_OFFLINE_MODE');
    });

    it('#getContentForDialCode should not invoke search API for empty dialcode', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.dialCodesearchResultResponse));
        });

        const network = TestBed.get(Network);
        spyOnProperty(network, 'type').and.returnValue('none');
        component.dialCode = '';
        component.getContentForDialCode();
        expect(contentService.searchContent).not.toHaveBeenCalled();
    });

    it('#getContentForDialCode should show error toast if there is no internet connection', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return error();
        });
        spyOn(commonUtilService, 'showToast');
        const network = TestBed.get(Network);
        spyOnProperty(network, 'type').and.returnValue('none');
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.getContentForDialCode();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_OFFLINE_MODE');
    });

    it('#getContentForDialCode should invoke serach API if it is invoked for a dialocode', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.dialCodesearchResultResponse));
        });

        const network = TestBed.get(Network);
        spyOnProperty(network, 'type').and.returnValue('none');
        spyOn(component, 'checkParent').and.callFake(() => { });
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.getContentForDialCode();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(component.dialCodeResult.length).toBe(1);
        expect(component.showLoader).toBe(false);
        expect(component.checkParent).toHaveBeenCalled();
    });


    it('#getContentForDialCode should populate dialcodeContent Result', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.dialCodesearchResultResponse4));
        });

        const network = TestBed.get(Network);
        spyOnProperty(network, 'type').and.returnValue('none');
        spyOn(component, 'checkParent').and.callFake(() => { });
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.getContentForDialCode();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(component.dialCodeContentResult.length).toBe(1);
        expect(component.showLoader).toBe(false);
    });


    it('#getContentForDialCode should navigate to collection details if it is not associated to any Textbook', () => {
        const contentService = TestBed.get(ContentService);
        const navController = TestBed.get(NavController);
        const network = TestBed.get(Network);

        spyOn(navController, 'pop');
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.dialCodesearchResultResponse2));
        });
        spyOnProperty(network, 'type').and.returnValue('none');
        spyOn(component, 'showContentDetails').and.callFake(() => { });
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.getContentForDialCode();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(navController.pop).toHaveBeenCalled();
        expect(component.showContentDetails).toHaveBeenCalled();
    });

    it('#getContentForDialCode should show Coming soon alert when dial code is not attached to any TextbookUnit', (done) => {
        const contentService = TestBed.get(ContentService);
        const navController = TestBed.get(NavController);
        const network = TestBed.get(Network);
        const popOverController = TestBed.get(PopoverController);

        spyOn(navController, 'pop');
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.emptyDialCodeResponse));
        });
        spyOnProperty(network, 'type').and.returnValue('none');
        spyOn(component, 'showContentComingSoonAlert').and.callThrough();
        spyOn(component, 'generateQRSessionEndEvent').and.callFake(() => { });
        component.dialCode = 'SAMPLE_DIAL_CODE';
        component.source = PageId.CONTENT_DETAIL;
        component.shouldGenerateEndTelemetry = true;
        component.getContentForDialCode();
        expect(contentService.searchContent).toHaveBeenCalled();
        expect(navController.pop).toHaveBeenCalled();
        expect(component.generateQRSessionEndEvent).toHaveBeenCalledWith(PageId.CONTENT_DETAIL, 'SAMPLE_DIAL_CODE');
        expect(component.showContentComingSoonAlert).toHaveBeenCalled();

        setTimeout(() => {
            // expect(popOverController.present).toHaveBeenCalled();
            done();
        }, 400);
    });

    it('#showFilter should show  Filter page', (done) => {
        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(formAndFrameworkUtilService, 'getLibraryFilterConfig').and.returnValue(Promise.resolve(mockRes.courseConfigFilter));
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.showFilter();
        setTimeout(() => {
            expect(navController.push).toHaveBeenCalledWith(FilterPage,
                { filterCriteria: mockRes.dialCodesearchResultResponse2.result.filterCriteria });
            done();
        }, 300);
    });

    it('#applyFilter should apply filter and update the filter icon after filter applied', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.dialCodesearchResultResponse2));
        });
        spyOn(component, 'updateFilterIcon').and.callThrough();
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.applyFilter();
        expect(component.updateFilterIcon).toHaveBeenCalled();
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter_applied.png');
    });


    it('#applyFilter should invoke processDialCode if filter is being applied on Dial code result', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.dialCodesearchResultResponse2));
        });
        spyOn(component, 'processDialCodeResult').and.callFake(() => { });
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.isDialCodeSearch = true;
        component.applyFilter();
        expect(component.processDialCodeResult).toHaveBeenCalled();
    });

    it('#applyFilter should mark isEmpty parameter true', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify(mockRes.emptyDialCodeResponse));
        });
        spyOn(component, 'updateFilterIcon').and.callThrough();
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.applyFilter();
        expect(component.isEmptyResult).toBe(true);
    });

    it('#applyFilter should mark isEmpty parameter true if empty response comes from API', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return success(JSON.stringify({ status: false, result: {} }));
        });
        spyOn(component, 'updateFilterIcon').and.callThrough();
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.applyFilter();
        expect(component.isEmptyResult).toBe(true);
    });

    it('#applyFilter should handle error response from content search API', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
            return error(JSON.stringify({ status: false, result: {} }));
        });
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.applyFilter();
        expect(component.showLoader).toBe(false);
    });

    it('#updateFilterIcon should not updateFilterIcon', () => {
        component.responseData = mockRes.dialCodesearchResultResponse3;
        component.updateFilterIcon();
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
    });

    it('#init should invoke getContentForDialCode in the constructor  for valid dialod code', () => {
        spyOn(component, 'getContentForDialCode').and.callFake(() => { });
        NavParamsMockNew.setParams('dialCode', 'SAMPLE_DIAL_CODE');
        component.init();
        expect(component.getContentForDialCode).toHaveBeenCalled();
    });

    it('#init should apply filter if apply filter event comes', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake(({ }, success) => {
            return success(mockRes.dialCodesearchResultResponse2.result.filterCriteria);
        });
        spyOn(component, 'applyFilter').and.callFake(() => { });
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.init();
        expect(component.applyFilter).toHaveBeenCalled();
    });

    it('#ionViewDidEnter should update the isFirstLaunch parameter', (done) => {
        component.responseData = mockRes.dialCodesearchResultResponse2;
        component.ionViewDidEnter();
        spyOn(component.searchBar, 'setFocus').and.returnValue(Promise.resolve());
        setTimeout(() => {
            expect(component.isFirstLaunch).toBe(false);
            done();
        }, 200);
    });

});
