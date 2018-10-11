import {
    async, TestBed,
    ComponentFixture, inject
} from '@angular/core/testing';
import { ResourcesPage } from './resources';
import {
    TranslateService,
    TranslateModule, TranslateLoader
} from '@ngx-translate/core';
import {
    NavController, Events, IonicModule,
    NavParams, ToastController, PopoverController,
    LoadingController
} from 'ionic-angular';
import {
    StorageMock,
    ToastControllerMock,
    PopoverControllerMock, LoadingControllerMock,
    NetworkMock
} from 'ionic-mocks';
import {
    FileUtil, AuthService, GenieSDKServiceProvider,
    SharedPreferences, FrameworkModule,
    ContentService, TelemetryService, CourseService,
    ProfileType, ShareUtil, PageAssembleService, PageId,
    Environment, InteractSubtype, InteractType, Profile,
    PageAssembleCriteria, PageAssembleFilter,
    QRScanner, PermissionService
} from 'sunbird';
import {
    GenieSDKServiceProviderMock,
    SharedPreferencesMock,
    FileUtilMock, NavParamsMock,
    SocialSharingMock, NavMock,
    TranslateLoaderMock, AuthServiceMock,
    AppGlobalServiceMock
} from '../../../test-config/mocks-ionic';
import { PBHorizontal } from '../../component/pbhorizontal/pb-horizontal';
import { OnboardingCardComponent } from '../../component/onboarding-card/onboarding-card';
import { CourseCard } from '../../component/card/course/course-card';
import { SignInCardComponent } from '../../component/sign-in-card/sign-in-card';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Network } from '@ionic-native/network';
import { AppGlobalService } from '../../service/app-global.service';
import { PipesModule } from '../../pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { DirectivesModule } from '../../directives/directives.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { } from 'jasmine';
import { SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
import { AppVersion } from '@ionic-native/app-version';
import { mockRes } from './resources.spec.data';
import { SearchPage } from '../search/search';
import {
    ContentType,
    AudienceFilter
} from '../../app/app.constant';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { QRScannerResultHandler } from '../qrscanner/qrscanresulthandler.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';

describe('ResourcesPage Component', () => {
    let component: ResourcesPage;
    let fixture: ComponentFixture<ResourcesPage>;
    let translateService: TranslateService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResourcesPage, PBHorizontal,
                OnboardingCardComponent,
                CourseCard,
                SignInCardComponent],
            imports: [
                IonicModule.forRoot(ResourcesPage),
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
                ContentService, TelemetryService, CourseService, ShareUtil, SunbirdQRScanner,
                Network, AppVersion, QRScannerResultHandler, CommonUtilService, TelemetryGeneratorService,
                FormAndFrameworkUtilService,
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: Storage, useFactory: () => StorageMock.instance() },
                { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                // { provide: PageAssembleMock, useClass: PageAssembleMock }

            ]
        });
    }));

    beforeEach(() => {
        const appVersion = TestBed.get(AppVersion);
        spyOn(appVersion, 'getAppName').and.returnValue(Promise.resolve('Sunbird'));
        fixture = TestBed.createComponent(ResourcesPage);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        });
    });

    it('should create a valid instance of ResourcesPage', () => {
        expect(component instanceof ResourcesPage).toBe(true);
    });

    it('#ionViewDidEnter should should show highLighter on app start for fresh install', (done) => {
        const sharedPreferences = TestBed.get(SharedPreferences);
        spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve('true'));
        spyOn(sharedPreferences, 'putString');
        component.ionViewDidEnter();
        sharedPreferences.getString().then((val) => {
            setTimeout(() => {
                expect(sharedPreferences.putString).toHaveBeenCalledWith('show_app_walkthrough_screen', 'false');
                done();
            }, 200);
        });
    });

    it('#ionViewDidLoad should should show highLighter on app start for fresh install', () => {
        const appGlobalService = TestBed.get(AppGlobalService);
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(component, 'generateImpressionEvent').and.callThrough();
        spyOn(appGlobalService, 'generateConfigInteractEvent');
        spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callThrough().and.callFake((success) => {
        });
        component.ionViewDidLoad();
        expect(component.generateImpressionEvent).toHaveBeenCalled();
        expect(appGlobalService.generateConfigInteractEvent).toHaveBeenCalledWith(PageId.LIBRARY, false);
    });


    it('#subscribeUtilityEvents should  update local contents when event is available', () => {
        const events = TestBed.get(Events);
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setSavedContent').and.callThrough();
        spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.resolve(JSON.stringify(mockRes.getAllLocalContentsResponse)));

        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'savedResources:update') {
                return success(JSON.parse(mockRes.updateLocalContents));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.setSavedContent).toHaveBeenCalled();
    });

    it('#subscribeUtilityEvents should invoke getPopular Content when language is changed', () => {
        const events = TestBed.get(Events);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(component, 'getPopularContent').and.callThrough();
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'onAfterLanguageChange:update') {
                return success(JSON.parse(mockRes.languageChangeEvent));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.selectedLanguage).toBe('hi');
        expect(component.getPopularContent).toHaveBeenCalled();

    });

    it('#subscribeUtilityEvents should  invoke swipeDownToRefresh when profile object is changed', () => {
        const events = TestBed.get(Events);
        const pageService = TestBed.get(PageAssembleService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(component, 'swipeDownToRefresh').and.callThrough();
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === AppGlobalService.PROFILE_OBJ_CHANGED) {
                return success();
            }
        });
        component.subscribeUtilityEvents();
        expect(component.swipeDownToRefresh).toHaveBeenCalled();
        component.checkEmptySearchResult(false);

    });


    it('#subscribeUtilityEvents should show Upgrade popOver when upgrade event is fired', () => {
        const events = TestBed.get(Events);
        const appGlobalService = TestBed.get(AppGlobalService);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'force_optional_upgrade') {
                return success(JSON.parse(mockRes.upgradeAppResponse));
            }

        });
        spyOn(appGlobalService, 'openPopover').and.callThrough();
        component.subscribeUtilityEvents();
        expect(appGlobalService.openPopover).toHaveBeenCalled();
    });

    it('#subscribeUtilityEvents should reset the filter when tab is changed', () => {
        const events = TestBed.get(Events);
        component.appliedFilter = {};
        const pageService = TestBed.get(PageAssembleService);
        spyOn(component, 'getPopularContent').and.callThrough();
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'tab.change') {
                return success('LIBRARY');
            }
        });

        component.subscribeUtilityEvents();
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
        expect(component.resourceFilter).toBe(undefined);
        expect(component.isFilterApplied).toBe(false);
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');

    });

    it('#ngOnInit should invoke setSavedContent()', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setSavedContent').and.callThrough();
        spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.resolve(JSON.stringify(mockRes.getAllLocalContentsResponse)));
        component.ngOnInit();
        expect(component.setSavedContent).toHaveBeenCalled();
    });

    it('#ngAfterViewInit should mark onboarding completed when event is fired', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'onboarding-card:completed') {
                return success(JSON.parse(mockRes.onboardingCompleteResponse));
            }
        });
        component.ngAfterViewInit();
        expect(component.isOnBoardingCardCompleted).toBe(true);
    });

    it('#ionViewWillLeave should unsubscribe events', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'unsubscribe');
        component.ionViewWillLeave();
        expect(events.unsubscribe).toHaveBeenCalledWith('genie.event');
    });

    it('#getCurrrentUser should  showSigninCard if ProfileType is teacher and config is enabled', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        spyOn(appGlobal, 'getGuestUserType').and.returnValue(ProfileType.TEACHER);
        appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER = true;
        component.getCurrentUser();
        expect(component.showSignInCard).toBe(true);
        expect(component.audienceFilter).toBe(AudienceFilter.GUEST_TEACHER);

    });

    it('#getCurrrentUser should  showSigninCard if ProfileType is student and config is enabled', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        spyOn(appGlobal, 'getGuestUserType').and.returnValue(ProfileType.STUDENT);
        appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT = true;
        component.getCurrentUser();
        expect(component.showSignInCard).toBe(true);
        expect(component.audienceFilter).toBe(AudienceFilter.GUEST_STUDENT);

    });

    it('#getCurrrentUser should  mark on boarding is complete if all profile attributes are available', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        const events = TestBed.get(Events);
        spyOn(events, 'publish');
        spyOn(appGlobal, 'getCurrentUser').and.returnValue(mockRes.sampleProfile);
        component.getCurrentUser();
        expect(component.isOnBoardingCardCompleted).toBe(true);
        expect(events.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: true });

    });

    it('#navigateToViewMoreContentPage should navigate to ViewMoreList page', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(({ }, success) => {
        });
        const navCtrl = fixture.debugElement.injector.get(NavController);
        spyOn(navCtrl, 'push');
        component.navigateToViewMoreContentsPage();
        const values = new Map();
        values['SectionName'] = 'Saved Resources';
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            headerTitle: 'SAVED_RESOURCES',
            pageName: 'resource.SavedResources'
        });
    });

    it('#navigateToViewMoreContentPageWithParams should navigate to ViewMoreList page with search params if filter is not applied', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(({ }, success) => {
        });
        const navCtrl = fixture.debugElement.injector.get(NavController);
        spyOn(navCtrl, 'push');
        component.navigateToViewMoreContentsPageWithParams(JSON.stringify(mockRes.queryParams), 'Popular Books');
        const values = new Map();
        values['SectionName'] = 'Popular Books';
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            requestParams: JSON.stringify(mockRes.queryParams),
            headerTitle: 'Popular Books'
        });
    });

    it('#navigateToViewMoreContentPageWithParams should navigate to ViewMoreList page with search params if filter is applied', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(({ }, success) => {
        });
        const navCtrl = fixture.debugElement.injector.get(NavController);
        spyOn(navCtrl, 'push');
        component.appliedFilter = mockRes.appliedFilterBooks;
        component.profile = mockRes.profile;
        component.isFilterApplied = true;
        component.mode = 'hard';
        component.navigateToViewMoreContentsPageWithParams(JSON.stringify(mockRes.queryParams), 'Popular Books');
        const values = new Map();
        values['SectionName'] = 'Popular Books';
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            requestParams: JSON.stringify(mockRes.queryParamsAfterFilter),
            headerTitle: 'Popular Books'
        });
    });

    it('#setSavedContent should call getAllLocalContents API() successfully', (done) => {
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setSavedContent').and.callThrough();
        spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.resolve(mockRes.getAllLocalContentsResponse));

        component.setSavedContent();
        setTimeout(() => {
            expect(component.localResources).toEqual(mockRes.getAllLocalContentsResponse);
            expect(component.showLoader).toBe(false);
            done();
        }, 5);
    });

    it('#setSavedContent should handle error situation came from getAllLocalContents API()', (done) => {
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setSavedContent').and.callThrough();
        spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.reject());

        component.setSavedContent();
        setTimeout(() => {
            expect(component.localResources).toBeUndefined();
            expect(component.showLoader).toBe(false);
            done();
        }, 5);
    });

    it('#getPopularContent should  apply all profile values in pageassemble criteria while filling up onboarding cards', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        const profile: Profile = mockRes.sampleProfile;
        component.profile = profile;
        component.isFilterApplied = false;
        const criteria = new PageAssembleCriteria();
        criteria.name = 'Resource';
        criteria.mode = 'soft';
        criteria.filters = new PageAssembleFilter();
        criteria.filters.board = ['CBSE'];
        criteria.filters.medium = ['English'];
        criteria.filters.gradeLevel = ['KG'];
        criteria.filters.subject = ['English'];
        component.getPopularContent();
        component.checkEmptySearchResult(false);
        expect(pageService.getPageAssemble).toHaveBeenCalledWith(criteria, jasmine.any(Function), jasmine.any(Function));
    });

    it('#showFilter should  apply all profile values in pageassemble criteria after applying filter', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const pageService = TestBed.get(PageAssembleService);
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake((option, success, error) => {
        });
        spyOn(formAndFrameworkUtilService, 'getLibraryFilterConfig').and.returnValue(Promise.resolve(mockRes.libraryConfigFilter));
        component.resourceFilter = mockRes.libraryConfigFilter;
        component.showFilter();

        component.pageFilterCallBack.applyFilter(mockRes.filter, mockRes.appliedFilter);
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter_applied.png');
    });

    it('#showFilter should  apply soft filters if profile details is filled through onboarding cards', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const pageService = TestBed.get(PageAssembleService);
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake((option, success, error) => {
        });
        spyOn(formAndFrameworkUtilService, 'getLibraryFilterConfig').and.returnValue(Promise.resolve(mockRes.libraryConfigFilter));

        component.showFilter();

        component.pageFilterCallBack.applyFilter({}, {});
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
        component.applyProfileFilter([], []);
    });

    it('#getPopularContent should  apply previously applied filter', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        const profile: Profile = mockRes.sampleProfile;
        component.profile = profile;
        component.isFilterApplied = false;
        const criteria = new PageAssembleCriteria();
        criteria.name = 'Resource';
        criteria.mode = 'soft';
        criteria.filters = new PageAssembleFilter();
        criteria.filters.board = ['CBSE'];
        criteria.filters.medium = ['English'];
        criteria.filters.gradeLevel = ['KG'];
        criteria.filters.subject = ['English'];
        component.appliedFilter = mockRes.appliedFilterLibrary;
        component.getPopularContent();
    });


    // it('should call pageAssemble API() successfully', () => {
    //     const pageService = TestBed.get(PageAssembleService);
    //     spyOn(pageService, 'getPageAssemble').and.callFake(function({}, success, error){
    //         let data = JSON.stringify(mockRes.pageAPIResponse)
    //         return success(data);
    //     });
    //     component.ionViewWillEnter();
    //     expect(component.guestUser).toBe(false);
    // });

    it('#ionViewWillEnter should show connection messgae for server error in PageAssemble API', () => {
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake(({ }, success, error) => {
            return error('CONNECTION_ERROR');
        });
        component.ionViewWillEnter();
        expect(component.isNetworkAvailable).toBe(false);
    });

    it('#ionViewWillEnter should show server error messgae for server error in PageAssemble API', () => {
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake(({ }, success, error) => {
            return error('SERVER_ERROR');
        });
        component.ionViewWillEnter();
    });

    it('#showOfflineNetworkWarning should show network warning', (done) => {
        component.showOfflineNetworkWarning();
        expect(component.showWarning).toBe(true);
        setTimeout(() => {
            expect(component.showWarning).toBe(false);
            done();
        }, 3000);

    });

    it('#checkNetworkStatus should show network warning', () => {
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake(({ }, success, error) => {
            return error('SERVER_ERROR');
        });
        spyOn(component, 'swipeDownToRefresh').and.callThrough();
        component.checkNetworkStatus(true);
        expect(component.swipeDownToRefresh).toHaveBeenCalled();

    });

    it('#scanQRCode should open the scanner', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const qrScanner = TestBed.get(QRScanner);
        spyOn(qrScanner, 'startScanner');
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(({ }, success, error) => {
        });
        const permissionService = TestBed.get(PermissionService);
        spyOn(permissionService, 'hasPermission').and.callFake(({ }, success) => {

        });
        component.scanQRCode();
        expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
            InteractSubtype.QRCodeScanClicked,
            Environment.HOME,
            PageId.LIBRARY);

    });

    it('#search should navigate to SearchPage', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const sunbirdQrscannerService = TestBed.get(SunbirdQRScanner);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(({ }, success, error) => {
        });
        spyOn(telemetryGeneratorService, 'generateStartTelemetry').and.callFake(({ }, success, error) => {
        });
        spyOn(sunbirdQrscannerService, 'generateStartEvent').and.callFake(() => {
        });
        const navCtrl = fixture.debugElement.injector.get(NavController);
        spyOn(navCtrl, 'push');

        component.search();
        expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
            InteractSubtype.SEARCH_BUTTON_CLICKED,
            Environment.HOME,
            PageId.LIBRARY);
        expect(navCtrl.push).toHaveBeenCalledWith(SearchPage, { contentType: ContentType.FOR_LIBRARY_TAB, source: PageId.LIBRARY });

    });

    it('#subscribeGenieEvents should invoke setSavedContents', () => {
        const events = TestBed.get(Events);
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setSavedContent').and.callThrough();
        spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.resolve(JSON.stringify(mockRes.getAllLocalContentsResponse)));

        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'genie.event') {
                return success(mockRes.importCompleteEvent);
            }
        });
        component.subscribeGenieEvents();
        expect(component.setSavedContent).toHaveBeenCalled();
    });


    it('#ionViewWillEnter audience should be logged in user', () => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake(({ }, success, error) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        component.ionViewWillEnter();
        expect(component.audienceFilter).toBe(AudienceFilter.LOGGED_IN_USER);
    });

    it('#swipeDownToRefresh audience should be logged in user', () => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake(({ }, success, error) => {
            const data = JSON.stringify(mockRes.pageAPIResponse);
            return success(data);
        });
        component.swipeDownToRefresh();
        expect(component.audienceFilter).toBe(AudienceFilter.LOGGED_IN_USER);
    });



});
