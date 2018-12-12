import {
    Events, IonicApp, IonicModule, LoadingController, NavController, NavParams, Platform,
    PopoverController, ToastController
} from 'ionic-angular';
import { LoadingControllerMock, NetworkMock, StorageMock } from 'ionic-mocks';
import { Ionic2RatingModule } from 'ionic2-rating';
import {
    AuthService, BuildParamService, ContentService, CourseService, FileUtil, FrameworkModule,
    GenieSDKServiceProvider, ProfileType, SharedPreferences, ShareUtil, TelemetryService, TelemetryObject,
    Environment, Mode, PageId, Rollup, ProfileService
} from 'sunbird';

import { HttpClientModule } from '@angular/common/http';
import { ElementRef, Renderer } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import {
    AuthServiceMock, FileUtilMock, GenieSDKServiceProviderMock, MockElementRef, NavMock,
    NavParamsMock, PopoverControllerMock, SocialSharingMock,
    ToastControllerMock, TranslateLoaderMock, AppGlobalServiceMock, PopoverMock, NavbarMock
} from '../../../test-config/mocks-ionic';
import { PBHorizontal } from '../../component/pbhorizontal/pb-horizontal';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { ContentDetailsPage } from './content-details';
import { mockRes } from './content-details.spec.data';
import { CommonUtilService } from '../../service/common-util.service';
import { } from 'jasmine';
import { Navbar } from 'ionic-angular';

describe('ContentDetailsPage Component', () => {
    let component: ContentDetailsPage;
    let fixture: ComponentFixture<ContentDetailsPage>;
    let translateService: TranslateService;
    const identifier = 'do_212516141114736640146589';
    let spyObjPreference;
    let spyObjBuildParam;

    const rendererMock = jasmine.createSpyObj('rendererMock', ['setElementClass']);
    const IonicAppMock = {
        _modalPortal: {
            getActive: () => ({
                dismiss: () => { }
            })
        },
        _overlayPortal: {
            getActive: () => ({
                dismiss: () => { }
            })
        }
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContentDetailsPage, PBHorizontal],
            imports: [
                IonicModule.forRoot(ContentDetailsPage),
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
                ContentService, TelemetryService, CourseService, ShareUtil, IonicApp, Renderer, TelemetryGeneratorService,
                CommonUtilService, Navbar,
                { provide: IonicApp, useValue: IonicAppMock },
                { provide: Renderer, useValue: rendererMock },
                { provide: ElementRef, useClass: MockElementRef },
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: Navbar, useClass: NavbarMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                // { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: Storage, useFactory: () => StorageMock.instance() },
                { provide: ToastController, useClass: ToastControllerMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                // { provide: Platform, useFactory: () => PlatformMock.instance() }
                SharedPreferences
            ]
        });
    }));

    beforeEach(() => {
        const buildParamService = TestBed.get(BuildParamService);
        const prefernce = TestBed.get(SharedPreferences);
        spyObjBuildParam = spyOn(buildParamService, 'getBuildConfigParam');
        spyObjBuildParam.and.returnValue(Promise.resolve('SAMPLE_BASE_URL'));
        spyObjPreference = spyOn(prefernce, 'getString');
        spyObjPreference.and.returnValue(Promise.resolve(ProfileType.TEACHER));
        fixture = TestBed.createComponent(ContentDetailsPage);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        });
    });

    // it('should create component', () => expect(component).toBeDefined());

    it('should create a valid instance of ContentDetailsPage', () => {
        expect(component instanceof ContentDetailsPage).toBe(true);
        expect(component).not.toBeFalsy();
    });


    it('should start content downloading', () => {
        const contentService = TestBed.get(ContentService);
        component.isNetworkAvailable = true;
        component.identifier = identifier;
        component.isChildContent = true;
        spyOn(component, 'downloadContent').and.callThrough();
        spyOn(component, 'importContent').and.callThrough();
        spyOn(contentService, 'importContent').and.callFake( ({ }, success) => {
            const data = JSON.stringify((mockRes.importContentResponse));
            return success(data);
        });
        component.downloadContent();
        fixture.detectChanges();
        expect(component.downloadContent).toHaveBeenCalled();
        expect(component.downloadProgress).toEqual('0');
        expect(component.importContent).toHaveBeenCalledWith([component.identifier], component.isChildContent);
    });

    it('should return error while importing content', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'importContent').and.callThrough();
        spyOn(contentService, 'importContent').and.callFake( ({ }, success, error) => {
            const data = JSON.stringify((mockRes.importContentResponse));
            return error(data);
        });
        component.isDownloadStarted = true;
        component.content = {};
        component.importContent([identifier], false);
        fixture.detectChanges();
        expect(component.importContent).toBeDefined();
        expect(component.importContent).toHaveBeenCalledWith([identifier], false);
    });

    it('should show no inetrnet message when user click on download button', () => {
        component.isNetworkAvailable = false;
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast').and.callThrough();
        spyOn(component, 'downloadContent').and.callThrough();
        component.downloadContent();
        fixture.detectChanges();
        expect(component.downloadContent).toHaveBeenCalled();
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
    });

    it('should cancel content downloading ', () => {
        component.content = {};
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'cancelDownload').and.callThrough();
        spyOn(contentService, 'cancelDownload').and.callFake( (_identifier, success) => {
            return success({});
        });
        component.cancelDownload();
        fixture.detectChanges();
        expect(component.cancelDownload).toBeDefined();
        expect(component.cancelDownload).toHaveBeenCalled();
        expect(component.content.downloadable).toBe(false);
    });

    it('should return error while canceling content downloading ', () => {
        component.content = {};
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'cancelDownload').and.callThrough();
        spyOn(contentService, 'cancelDownload').and.callFake( (_identifier, success, error) => {
            return error({ status: false });
        });
        component.cancelDownload();
        fixture.detectChanges();
        expect(component.cancelDownload).toBeDefined();
        expect(component.cancelDownload).toHaveBeenCalled();
    });

    it('should open content rating screen', () => {
        component.content = {};
        component.content.downloadable = true;
        component.content.contentAccess = ['true'];
        component.guestUser = false;
        spyOn(component, 'rateContent').and.callThrough();
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
        PopoverMock.setOnDissMissResponse(mockRes.popOverOnDismissResponse);
        component.rateContent('automatic');
        fixture.detectChanges();
        expect(component.rateContent).toHaveBeenCalled();
    });

    it('should extract content details api response: content isAvailableLocally', () => {
        component.cardData = {};
        component.cardData.contentData = '';
        component.cardData.pkgVersion = '';
        const navParams = TestBed.get(NavParams);
        navParams.data['isResumedCourse'] = true;
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(component, 'extractApiResponse').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        spyOn(component, 'generateStartEvent').and.callThrough().and.callFake(() => { });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
        spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callThrough().and.callFake(() => { });
        component.extractApiResponse(mockRes.contentDetailsResponse);
        fixture.detectChanges();
        expect(component.content).not.toBeUndefined();
        expect(navParams.get).toHaveBeenCalled();
    });

    it('should extract content details api response: content Locally not available', () => {
        component.cardData = {};
        const data = mockRes.contentDetailsResponse;
        data.result.isAvailableLocally = false;
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateStartTelemetry').and.callThrough().and.callFake(() => { });
        spyOn(component, 'extractApiResponse').and.callThrough();
        spyOn(component, 'generateStartEvent').and.callThrough();
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        component.extractApiResponse(data);
        fixture.detectChanges();
        expect(component.extractApiResponse).toBeDefined();
        expect(component.extractApiResponse).toHaveBeenCalled();
        expect(component.content).not.toBeUndefined();
        expect(component.content.downloadable).toBe(false);
    });

    it('should set content details', () => {
        component.content = {};
        component.cardData = {};
        component.userRating = 0;
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setContentDetails').and.callThrough();
        spyOn(component, 'extractApiResponse').and.callThrough();
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success) => {
            const data = JSON.stringify((mockRes.contentDetailsResponse));
            return success(data);
        });
        spyOn(component, 'generateStartEvent').and.callThrough().and.callFake(() => { });
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        component.setContentDetails(identifier, true, false);
        expect(component.setContentDetails).toBeDefined();
        expect(component.setContentDetails).toHaveBeenCalledWith(identifier, true, false);
        expect(component.extractApiResponse).toBeDefined();
        expect(component.extractApiResponse).toHaveBeenCalled();
    });

    it('should call ionViewWillEnter function', (done) => {
        component.content = {};
        component.cardData = {};
        const navParams = TestBed.get(NavParams);
        const cardData = { identifier: identifier, hierarchyInfo: 'SAMPLEID/SAMPLE_CHILD_ID' };
        navParams.data['content'] = cardData;
        navParams.data['isResumedCourse'] = false;
        component.isResumedCourse = false;
        component.isUpdateAvail = false;
        const platform = TestBed.get(Platform);
        spyOn(platform, 'registerBackButtonAction').and.callFake( (success) => {
            return success();
        });
        spyOn(component, 'dismissPopup').and.callThrough();
        spyOn(component, 'ionViewWillEnter').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        spyOn(component, 'setContentDetails').and.callThrough();
        spyOn(component, 'generateStartEvent').and.callThrough().and.callFake(() => { });
        spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success) => {
            const data = JSON.stringify((mockRes.contentDetailsResponse));
            return success(data);
        });
        component.ionViewWillEnter();
        expect(component.cardData).toEqual(cardData);
        expect(component.setContentDetails).toHaveBeenCalledWith(identifier, true, false);
        expect(navParams.get).toHaveBeenCalled();
        done();
    });

    it('should genearte rollup object', () => {
        component.cardData = {};
        component.cardData.hierarchyInfo = mockRes.hierarchyInfo;
        spyOn(component, 'generateRollUp').and.callThrough();
        component.generateRollUp();
        expect(component.cardData.hierarchyInfo).not.toBeNull();
        expect(component.generateRollUp).toBeDefined();
        expect(component.generateRollUp).toHaveBeenCalled();
        expect(component.objRollup).not.toBeUndefined();
    });

    it('should update content progress', () => {
        component.content = {};
        component.userId = 'ut12dcndcc';
        const navParams = TestBed.get(NavParams);
        const stateData = { batchId: 'do_123', courseId: 'do_123' };
        const courseService = TestBed.get(CourseService);
        navParams.data['contentState'] = stateData;
        spyOn(component, 'updateContentProgress').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        const spyObj = spyOn(courseService, 'updateContentState');
        spyObj.and.callFake( ({ }, success) => {
            return success({});
        });
        component.updateContentProgress();
        fixture.detectChanges();
        expect(component.updateContentProgress).toBeDefined();
        expect(component.updateContentProgress).toHaveBeenCalled();
        expect(navParams.get).toHaveBeenCalledWith('contentState');
        spyObj.and.callFake(({ }, success, error) => {
            return error({});
        });
        component.updateContentProgress();
    });

    it('should check content download progress', () => {
        const mockData = mockRes.importContentDownloadProgressResponse;
        spyOn(component, 'subscribeGenieEvent').and.callThrough();
        const event = TestBed.get(Events);
        spyOn(event, 'subscribe').and.callFake( ({ }, success) => {
            return success(JSON.stringify(mockData));
        });
        component.subscribeGenieEvent();
        expect(component.subscribeGenieEvent).toBeDefined();
        expect(component.subscribeGenieEvent).toHaveBeenCalled();
        expect(event.subscribe).toHaveBeenCalled();
        expect(component.downloadProgress).toEqual(mockData.data.downloadProgress);
    });

    it('should share content details: content is locally available and Ecar should get exported successfully', () => {
        const devicePath = '/storage/emulated/0/Ecars/tmp/Untitled Content-v1.0.ecar';
        component.content = {};
        component.content.contentType = 'Resource';
        component.content.downloadable = true;
        const shareUtil = TestBed.get(ShareUtil);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const socialShare = TestBed.get(SocialSharing);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
        spyOn(socialShare, 'share').and.returnValues({});
        spyOn(component, 'share').and.callThrough();
        spyOn(component, 'generateShareInteractEvents').and.callThrough();
        spyOn(shareUtil, 'exportEcar').and.callFake((_identifier, success) => {
            return success(devicePath);
        });
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
        expect(socialShare.share).toHaveBeenCalled();
    });

    it('it should share content details - content is locally available but exportEcar should return error', () => {
        component.content = {};
        component.content.contentType = 'Resource';
        component.content.downloadable = true;
        const shareUtil = TestBed.get(ShareUtil);
        const socialShare = TestBed.get(SocialSharing);

        spyOn(socialShare, 'share').and.returnValues({});
        spyOn(component, 'share').and.callThrough();
        spyOn(shareUtil, 'exportEcar').and.callFake( (_identifier, success, error) => {
            return error();
        });
        spyOn(component, 'generateShareInteractEvents').and.callThrough().and.callFake(() => { });
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
    });

    it('it should share content details without locally available', () => {
        component.content = {};
        component.content.contentType = 'Resource';
        const socialShare = TestBed.get(SocialSharing);
        spyOn(component, 'generateShareInteractEvents').and.callThrough().and.callFake(() => { });
        spyOn(socialShare, 'share').and.returnValues({});
        spyOn(component, 'share').and.callThrough();
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
        expect(socialShare.share).toHaveBeenCalled();
    });


    it('it should share content details without locally available', () => {
        component.content = {};
        component.content.contentType = 'Resource';
        const socialShare = TestBed.get(SocialSharing);
        spyOn(component, 'generateShareInteractEvents').and.callThrough().and.callFake(() => { });
        spyOn(socialShare, 'share').and.returnValues({});
        spyOn(component, 'share').and.callThrough();
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
        expect(socialShare.share).toHaveBeenCalled();
    });

    it('#handleDeviceBackButton  should handle device back button click', () => {
        const platform = TestBed.get(Platform);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);

        spyOn(platform, 'registerBackButtonAction').and.callFake((success) => {
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
        const  telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = 'SAMPLE_ID';
        telemetryObject.type = 'SAMPLE_TYPE';
        telemetryObject.version = 'SAMPLE_VERSION';
        expect(telemetryGeneratorService.generateEndTelemetry).toHaveBeenCalledWith('SAMPLE_TYPE',
            Mode.PLAY,
            PageId.CONTENT_DETAIL,
            Environment.HOME,
            telemetryObject,
            new Rollup(),
            undefined);
    });

    it('#handleDeviceBackButton  should generate Qrsession end event if it came from dialcode page', () => {
        const platform = TestBed.get(Platform);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(platform, 'registerBackButtonAction').and.callFake( (success) => {
            return success();
        });
        spyOn(component, 'generateEndEvent').and.callThrough();
        spyOn(telemetryGeneratorService, 'generateEndTelemetry').and.callThrough().and.callFake(() => { });
        component.objId = 'SAMPLE_ID';
        component.objType = 'SAMPLE_TYPE';
        component.objVer = 'SAMPLE_VERSION';
        component.shouldGenerateEndTelemetry = true;
        component.source = PageId.CONTENT_DETAIL;
        component.cardData = { 'identifier': 'SAMPLE_ID' };
        component.backButtonFunc = jasmine.createSpy();
        spyOn(component, 'generateQRSessionEndEvent').and.callThrough();
        component.handleDeviceBackButton();
        expect(component.generateEndEvent).toHaveBeenCalledWith('SAMPLE_ID', 'SAMPLE_TYPE', 'SAMPLE_VERSION');
        expect(component.generateQRSessionEndEvent).toHaveBeenCalledWith(PageId.CONTENT_DETAIL, 'SAMPLE_ID');
        const telemetryObject: TelemetryObject = new TelemetryObject();
        telemetryObject.id = 'SAMPLE_ID';
        telemetryObject.type = 'SAMPLE_TYPE';
        telemetryObject.version = 'SAMPLE_VERSION';
        expect(telemetryGeneratorService.generateEndTelemetry).toHaveBeenCalledWith('SAMPLE_TYPE',
            Mode.PLAY,
            PageId.CONTENT_DETAIL,
            Environment.HOME,
            telemetryObject,
            new Rollup(),
            undefined);
    });

    it('#handlePageResume  should handle page resume', () => {
        component.guestUser = false;
        component.isPlayerLaunched = true;
        const platform = TestBed.get(Platform);
        spyOn(platform.resume, 'subscribe').and.callFake( (success) => {
            return success();
        });
        spyOn(component, 'setContentDetails').and.callThrough().and.callFake(() => { });
        component.handlePageResume();
        expect(component.setContentDetails).toHaveBeenCalled();
    });

    xit('#handleNetworkAvailability  should handle network availability', () => {
        const network = TestBed.get(Network);
        spyOnProperty(network, 'type', 'set').and.returnValue('none');
        component.handleNetworkAvailability();
        expect(component.isNetworkAvailable).toBe(false);
    });

    it('#subscribePlayEvent  should subscribe for player launch event', () => {
        const events = TestBed.get(Events);
        spyObjBuildParam.and.returnValue(Promise.reject());
        spyOn(events, 'subscribe').and.callThrough().and.callFake(({ }, success) => {
            return success('launchPlayer');
        });
        spyOn(component, 'playContent').and.callThrough().and.callFake(() => { });
        component.subscribePlayEvent();
        expect(component.playContent).toHaveBeenCalled();
    });

    it('#calculateAvailableUserCount  should populate user count', (done) => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        const profileService = TestBed.get(ProfileService);
        spyOn(profileService, 'getAllUserProfile').and.returnValue(Promise.resolve(JSON.stringify([{ 'uid': '1234' }])));
        component.calculateAvailableUserCount();
        setTimeout(() => {
            expect(component.userCount).toBe(2);
            done();
        }, 500);

    });

    it('#calculateAvailableUserCount  should handle error scenario from the profile service API', (done) => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        const profileService = TestBed.get(ProfileService);
        spyOn(profileService, 'getAllUserProfile').and.returnValue(Promise.reject(JSON.stringify([{ 'uid': '1234' }])));
        component.calculateAvailableUserCount();
        setTimeout(() => {
            expect(component.userCount).toBe(0);
            done();
        }, 500);

    });

    it('#checkCurrentUserType should populate profileType as STUDENT', (done) => {
        spyObjPreference.and.returnValue(Promise.resolve(ProfileType.STUDENT));
        component.checkCurrentUserType();
        setTimeout(() => {
            expect(component.profileType).toBe(ProfileType.STUDENT);
            done();
        }, 500);

    });

    it('#rateContent  should show warning toast if user hasnt played the content before rating', () => {
        component.isContentPlayed = false;
        component.guestUser = false;
        component.content = {};
        const commonUtilService = TestBed.get(CommonUtilService);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(commonUtilService, 'showToast');
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });

        component.rateContent('automatic');
        expect(commonUtilService.showToast).toHaveBeenCalledWith('TRY_BEFORE_RATING');
    });

    it('#rateContent  should show warning toast user is not signed in', () => {
        component.guestUser = true;
        component.content = {};
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        component.profileType = ProfileType.TEACHER;
        component.rateContent('automatic');
        expect(commonUtilService.showToast).toHaveBeenCalledWith('SIGNIN_TO_USE_FEATURE');
    });
    it('#setContentDetail  should dismiss the loader if showRating parameter is false', () => {
        component.guestUser = true;
        component.content = {};
        component.profileType = ProfileType.TEACHER;
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success) => {
            const data = JSON.stringify({ 'message': 'successful' });
            return success(data);
        });
        component.setContentDetails('SAMPLE_ID', false, false);
        expect(contentService.getContentDetail).toHaveBeenCalled();
    });

    it('#setContentDetail  should show rating pop up when user comes back from content', () => {
        component.userRating = 0;
        component.content = {};
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success) => {
            const data = JSON.stringify({ 'message': 'successful' });
            return success(data);
        });
        spyOn(component, 'rateContent').and.callThrough().and.callFake(() => { });
        component.setContentDetails('SAMPLE_ID', false, true);
        expect(component.rateContent).toHaveBeenCalled();
    });

    it('#setContentDetail  should show error toast for connection error',  () => {
        component.userRating = 0;
        component.content = {};
        const contentService = TestBed.get(ContentService);
        const navController = TestBed.get(NavController);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success, error) => {
            const data = JSON.stringify({ 'error': 'CONNECTION_ERROR' });
            return error(data);
        });
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'rateContent').and.callThrough().and.callFake(() => { });
        spyOn(navController, 'pop');
        component.setContentDetails('SAMPLE_ID', false, false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        expect(navController.pop).toHaveBeenCalled();
    });

    it('#setContentDetail  should show error toast for server error', () => {
        component.userRating = 0;
        component.content = {};
        const contentService = TestBed.get(ContentService);
        const navController = TestBed.get(NavController);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success, error) => {
            const data = JSON.stringify({ 'error': 'SERVER_ERROR' });
            return error(data);
        });
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'rateContent').and.callThrough().and.callFake(() => { });
        spyOn(navController, 'pop');
        component.setContentDetails('SAMPLE_ID', false, false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_FETCHING_DATA');
        expect(navController.pop).toHaveBeenCalled();
    });

    it('#setContentDetail  should show error toast for other error', () => {
        component.userRating = 0;
        component.content = {};
        component.isDownloadStarted = true;
        const contentService = TestBed.get(ContentService);
        const navController = TestBed.get(NavController);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(contentService, 'getContentDetail').and.callFake( (option, success, error) => {
            const data = JSON.stringify({ 'error': 'AUTH_ERROR' });
            return error(data);
        });
        spyOn(commonUtilService, 'showToast');
        spyOn(component, 'rateContent').and.callThrough().and.callFake(() => { });
        spyOn(navController, 'pop');
        component.setContentDetails('SAMPLE_ID', false, false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
        expect(navController.pop).toHaveBeenCalled();
    });

    it('#ionViewWillLeave  should unsubscribe all genie events', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'unsubscribe').and.callThrough();
        component.ionViewWillLeave();
        expect(events.unsubscribe).toHaveBeenCalled();
    });

    it('#ionViewDidLoad  should handle nav back button', () => {
        const platform = TestBed.get(Platform);
        const navBar = TestBed.get(Navbar);
        component.backButtonFunc = jasmine.createSpy();
        spyOn(platform, 'registerBackButtonAction').and.callFake( (success) => {
            return success();
        });
        spyOn(navBar, 'backButtonClick').and.callThrough();
        navBar.backButtonClick();
        component.ionViewDidLoad();

    });

    it('#handleNavBackbutton  should handle nav back button', () => {
        component.backButtonFunc = jasmine.createSpy();
        spyOn(component, 'generateEndEvent').and.callThrough().and.callFake(() => { });
        component.handleNavBackButton();
        expect(component.generateEndEvent).toHaveBeenCalled();
    });

    it('#handleNavBackbutton  should generate qrsession end event', () => {
        component.backButtonFunc = jasmine.createSpy();
        spyOn(component, 'generateEndEvent').and.callThrough().and.callFake(() => { });
        spyOn(component, 'generateQRSessionEndEvent').and.callThrough().and.callFake(() => { });
        component.shouldGenerateEndTelemetry = true;
        component.cardData = { identofier: 'SAMPLE_ID' };
        component.source = PageId.CONTENT_DETAIL;
        component.handleNavBackButton();
        expect(component.generateEndEvent).toHaveBeenCalled();
        expect(component.generateQRSessionEndEvent).toHaveBeenCalled();
    });

    it('#subscribeGenieEvent  should handle import completed event and publish local content update event', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callThrough().and.callFake((arg, success) => {
            return success(JSON.stringify(mockRes.importCompleteResponse));
        });
        spyOn(events, 'publish');
        spyOn(component, 'setContentDetails').and.callThrough().and.callFake(() => { });
        component.isDownloadStarted = true;
        component.content = {};
        component.subscribeGenieEvent();
        expect(component.isDownloadStarted).toBe(false);
        expect(events.publish).toHaveBeenCalledWith('savedResources:update', {
            update: true
        });

    });

    it('#subscribeGenieEvent  should update the content', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callThrough().and.callFake((arg, success) => {
            return success(JSON.stringify(mockRes.updateEventSample));
        });
        component.subscribeGenieEvent();
        expect(component.isUpdateAvail).toBe(true);
    });

    it('#importContent  should update the content', () => {
        const contentService = TestBed.get(ContentService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast');
        spyOn(contentService, 'importContent').and.callThrough().and.callFake((arg, success) => {
            return success(JSON.stringify(mockRes.noContentFoundImportContentResponse));
        });
        component.importContent([''], false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
    });

    it('#dismissPopup  should pop from the page', () => {
        const navController = TestBed.get(NavController);
        const ionicApp = TestBed.get(IonicApp);
        spyOn(ionicApp._modalPortal, 'getActive').and.returnValue(false);
        spyOn(ionicApp._overlayPortal, 'getActive').and.returnValue(false);
        spyOn(navController, 'pop');
        component.dismissPopup();
        expect(navController.pop).toHaveBeenCalled();
    });

    it('#popToPreviousPage  should pop from the page if resumePage parameter is enebled', () => {
        const navController = TestBed.get(NavController);
        spyOn(navController, 'popTo');
        component.isResumedCourse = true;
        component.popToPreviousPage();
        expect(navController.popTo).toHaveBeenCalled();
    });

    it('#showSwitchUserAlert  should show play content', () => {
        AppGlobalService.isPlayerLaunched = false;
        component.userCount = 1;
        spyOn(component, 'playContent').and.callThrough().and.callFake(() => { });
        component.showSwitchUserAlert();
        expect(component.playContent).toHaveBeenCalled();
    });

    xit('#playContent  should show play content', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
        component.playContent();
        expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
        expect(component.isPlayerLaunched).toBe(true);
    });

    it('#getUserId  should show play content', () => {
        const appGlobalService = TestBed.get(AppGlobalService);
        spyOn(appGlobalService, 'getSessionData').and.callThrough().and.returnValue({userToken: '1234'});
        PopoverMock.setOnDissMissResponse(mockRes.popOverOnDismissResponse);
        component.getUserId();
        expect(component.userId).toBe('1234');
    });

    it('#showOverflowMenu  should show overflow menu', () => {
        component.content = {};
        PopoverMock.setOnDissMissResponse('delete.success');
        component.showOverflowMenu(event);
        expect(component.content.downloadable).toBe(false);
    });
    it('#viewCredits should open view credits screen', () => {
        const popOverCtrl = TestBed.get(PopoverController);
        component.content = {};
        spyOn(component, 'viewCredits').and.callThrough();
        component.viewCredits();
        fixture.detectChanges();
        expect(component.viewCredits).toHaveBeenCalled();
        expect(popOverCtrl.create).toHaveBeenCalled();
    });
});
