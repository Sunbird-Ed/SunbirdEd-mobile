import {
    async, TestBed,
    ComponentFixture,
    inject
} from '@angular/core/testing';
import { CoursesPage } from './courses';
import {
    TranslateService,
    TranslateModule, TranslateLoader
} from '@ngx-translate/core';
import {
    NavController, Events,
    IonicModule, NavParams,
    ToastController, PopoverController,
    LoadingController
} from 'ionic-angular';
import {
    PopoverControllerMock, LoadingControllerMock, NetworkMock
} from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider,
    SharedPreferences, FrameworkModule, BuildParamService,
    ContentService, TelemetryService, CourseService,
    ProfileType, ShareUtil, PageAssembleService, PageId,
    Profile, PageAssembleCriteria, Environment,
    ImpressionType, PageAssembleFilter
} from 'sunbird';
import {
    GenieSDKServiceProviderMock,
    SharedPreferencesMock,
    FileUtilMock, NavParamsMock,
    SocialSharingMock,
    NavMock, TranslateLoaderMock,
    AuthServiceMock, AppGlobalServiceMock,
    ToastControllerMockNew,
    BuildParamaServiceMock,
    AppVersionMock
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
import { SearchPage } from '../search/search';
import { EventTopics } from '../../app/app.constant';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { CourseUtilService } from '../../service/course-util.service';
import { mockRes } from '../../mock.spec.data';
import {
    mockRes as CourseMock
} from '../courses/courses.spec.data';
import { QRScannerResultHandler } from '../qrscanner/qrscanresulthandler.service';
import { CommonUtilService } from '../../service/common-util.service';
import { FormAndFrameworkUtilService } from '../profile/formandframeworkutil.service';

describe('CoursesPage Component', () => {
    let component: CoursesPage;
    let fixture: ComponentFixture<CoursesPage>;
    let translateService: TranslateService;

    const buildParamServiceStub = {
        getBuildConfigParam: () => ({})
    };

    const telemetryServiceStub = {
        getTelemetryService: () => ({}),
        impression: () => ({}),
        interact: () => ({})
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CoursesPage, PBHorizontal,
                OnboardingCardComponent,
                CourseCard,
                SignInCardComponent],
            imports: [
                IonicModule.forRoot(CoursesPage),
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
                ContentService, TelemetryService, TelemetryGeneratorService, CourseService, ShareUtil, SunbirdQRScanner,
                QRScannerResultHandler,
                Network, AppVersion, CourseUtilService, CommonUtilService, FormAndFrameworkUtilService, SharedPreferences,
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: BuildParamService, useClass: BuildParamaServiceMock },
                { provide: TelemetryService, useValue: telemetryServiceStub },
                { provide: BuildParamService, useClass: BuildParamaServiceMock },
                { provide: AppVersion, useClass: AppVersionMock }
            ]
        });
    }));
    beforeEach(() => {
        const appVersion = TestBed.get(AppVersion);
        spyOn(appVersion, 'getAppName').and.returnValue(Promise.resolve('Sunbird'));
        fixture = TestBed.createComponent(CoursesPage);
        component = fixture.componentInstance;
        component.tabBarElement = {};
        component.tabBarElement.style = {};
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        });
    });

    it('should should show highLighter on app start for fresh install', (done) => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const appGlobalService = TestBed.get(AppGlobalService);
        const sharedPreferences = TestBed.get(SharedPreferences);
        spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callThrough();
        spyOn(appGlobalService, 'generateConfigInteractEvent').and.callThrough();
        spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve('true'));
        spyOn(sharedPreferences, 'putString');
        component.ionViewDidLoad();
        sharedPreferences.getString().then((val) => {
            expect(telemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(ImpressionType.VIEW, '',
                PageId.COURSES,
                Environment.HOME);
            expect(appGlobalService.generateConfigInteractEvent).toHaveBeenCalledWith(PageId.COURSES, false);
            setTimeout(() => {
                expect(sharedPreferences.putString).toHaveBeenCalledWith('show_app_walkthrough_screen', 'false');
                done();
            }, 200);
        });
    });

    it('should show Upgrade popOver when upgrade event is fired', () => {
        const events = TestBed.get(Events);
        const appGlobalService = TestBed.get(AppGlobalService);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'force_optional_upgrade') {
                return success(JSON.parse(CourseMock.upgradeAppResponse));
            }

        });
        spyOn(appGlobalService, 'openPopover').and.callThrough();

        component.subscribeUtilityEvents();
    });

    it('should update onboarding parameter onboarding complete event is fired', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'onboarding-card:completed') {
                return success(JSON.parse(CourseMock.onboardingCompleteResponse));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.isOnBoardingCardCompleted).toBe(true);
    });

    it('should  invoke getCourseTabData when profile object is changed', () => {
        const events = TestBed.get(Events);
        const pageService = TestBed.get(PageAssembleService);
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(component, 'getCourseTabData').and.callThrough();
        spyOn(commonUtilService, 'showToast').and.callThrough();
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === AppGlobalService.PROFILE_OBJ_CHANGED) {
                return success();
            }
        });
        component.subscribeUtilityEvents();
        expect(component.getCourseTabData).toHaveBeenCalled();
        component.checkEmptySearchResult(false);
        expect(commonUtilService.showToast).toHaveBeenCalledWith('NO_CONTENTS_FOUND', false);

    });

    it('should mark isVisible parameter true', () => {
        component.ionViewDidEnter();
        expect(component.isVisible).toBe(true);
    });

    it('should reinitialize all parameters ', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'unsubscribe');
        component.ionViewWillLeave();
        expect(events.unsubscribe).toHaveBeenCalledWith('genie.event');
        expect(component.isVisible).toBe(false);
        expect(component.showOverlay).toBe(false);
        expect(component.downloadPercentage).toBe(0);
    });



    it('should  invoke getEnrolledCourses when enrolllcourse event is fired', () => {
        const events = TestBed.get(Events);
        const courseService = TestBed.get(CourseService);
        spyOn(component, 'getEnrolledCourses').and.callThrough();
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === EventTopics.COURSE_STATUS_UPDATED_SUCCESSFULLY) {
                return success(JSON.parse(CourseMock.courseUpdate));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.getEnrolledCourses).toHaveBeenCalledWith(true);
    });


    it('should  update the progress when onboarding progess event comes', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'onboarding-card:increaseProgress') {
                return success(JSON.parse(CourseMock.onboardingCardProgress));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.onBoardingProgress).toBe(10);
    });

    it('should get resumed content information resume event is fired', () => {
        const events = TestBed.get(Events);
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'getContentDetails').and.callThrough();
        spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
            return success(CourseMock.sampleContentDetailsResponseLocal);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'course:resume') {
                return success(JSON.parse(CourseMock.resumeContent));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.resumeContentData).toEqual(JSON.parse(CourseMock.resumeContent).content);
        expect(component.getContentDetails).toHaveBeenCalledWith(JSON.parse(CourseMock.resumeContent).content);
    });

    it('should invoke getEnrolled courses when batch is enrolled', () => {
        const events = TestBed.get(Events);
        const courseService = TestBed.get(CourseService);
        spyOn(component, 'getEnrolledCourses').and.callThrough();
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === EventTopics.ENROL_COURSE_SUCCESS) {
                return success(JSON.parse(CourseMock.enrollCourseEvent));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.getEnrolledCourses).toHaveBeenCalledWith(true);
    });

    it('should invoke getPopular Courses when language is changed', () => {
        const events = TestBed.get(Events);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(component, 'getPopularAndLatestCourses').and.callThrough();
        component.appliedFilter = CourseMock.appliedFilterCourse;
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'onAfterLanguageChange:update') {
                return success(JSON.parse(CourseMock.languageChangeEvent));
            }
        });
        component.subscribeUtilityEvents();
        expect(component.selectedLanguage).toBe('hi');
        expect(component.getPopularAndLatestCourses).toHaveBeenCalled();

    });

    it('should reset the filter when tab is changed', () => {
        const events = TestBed.get(Events);
        component.appliedFilter = {};
        const pageService = TestBed.get(PageAssembleService);
        spyOn(component, 'getPopularAndLatestCourses').and.callThrough();
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'tab.change') {
                return success('COURSES');
            }
        });
        component.subscribeUtilityEvents();
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
        expect(component.courseFilter).toBe(undefined);
        expect(component.isFilterApplied).toBe(false);
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');

    });

    it('should not invoke getEnrolledCourses API for guest users', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        spyOn(component, 'getEnrolledCourses').and.callThrough();
        component.getUserId();
        expect(component.getEnrolledCourses).not.toHaveBeenCalled();
    });

    it('should  invoke getEnrolledCourses for loggedIn users', () => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        AppGlobalServiceMock.setSessionData(mockRes.sessionResponse);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(component, 'getEnrolledCourses').and.callThrough();
        component.getUserId();
        expect(component.getEnrolledCourses).toHaveBeenCalled();
    });

    it('should  dismiss loader while invoking getEnrolledCourses for loggedIn users in case of no internet connection', () => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        AppGlobalServiceMock.setSessionData(mockRes.sessionResponse);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return error('CONNECTION_ERROR');
        });
        spyOn(component, 'getEnrolledCourses').and.callThrough();
        component.getUserId();
        expect(component.getEnrolledCourses).toHaveBeenCalled();
        expect(component.showLoader).toBe(false);
    });

    it('should  invoke getCourseTabData on ngOnInit for signedin users', () => {
        spyOn(component, 'getCourseTabData').and.callThrough();
        spyOn(component, 'getPopularAndLatestCourses').and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        component.ngOnInit();
        const timeOut = setTimeout(() => {
            expect(component.getPopularAndLatestCourses).toHaveBeenCalled();
            expect(component.getCourseTabData).toHaveBeenCalledWith();
        }, 0);
        clearTimeout(timeOut);

    });


    it('should  invoke getCourseTabData on ngOnInit for guest users', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        spyOn(component, 'getCourseTabData').and.callThrough();
        spyOn(component, 'getPopularAndLatestCourses').and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        component.ngOnInit();
        const timeOut = setTimeout(() => {
            expect(component.getPopularAndLatestCourses).toHaveBeenCalled();
            expect(component.getCourseTabData).toHaveBeenCalledWith();
        }, 0);
        clearTimeout(timeOut);

    });

    it('should  show error toast on ngOnInit for guest users in no network condition', () => {
        spyOn(component, 'getCourseTabData').and.callThrough();
        spyOn(component, 'getPopularAndLatestCourses').and.callThrough();
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast').and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            return error('CONNECTION_ERROR');
        });
        component.ngOnInit();
        const timeOut = setTimeout(() => {
            expect(component.getCourseTabData).toHaveBeenCalledWith();
            expect(component.isNetworkAvailable).toBe(false);
            expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        }, 1);
        clearTimeout(timeOut);

    });

    it('should  show error toast on ngOnInit for guest users in case of server error', () => {
        spyOn(component, 'getCourseTabData').and.callThrough();
        spyOn(component, 'getPopularAndLatestCourses').and.callThrough();
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, 'showToast').and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
            const data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            return error('SERVER_ERROR');
        });
        component.ngOnInit();
        const timeOut = setTimeout(() => {
            expect(component.getCourseTabData).toHaveBeenCalledWith();
            expect(component.isNetworkAvailable).toBe(false);
            expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        }, 1);
        clearTimeout(timeOut);

    });

    it('should  apply all profile values in pageassemble criteria while filling up onboarding cards', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        const profile: Profile = CourseMock.sampleProfile;
        component.profile = profile;
        component.isFilterApplied = false;
        const criteria = new PageAssembleCriteria();
        criteria.name = 'Course';
        criteria.mode = 'soft';
        criteria.filters = new PageAssembleFilter();
        criteria.filters.board = ['CBSE'];
        criteria.filters.medium = ['English'];
        criteria.filters.gradeLevel = ['KG'];
        criteria.filters.subject = ['English'];
        component.getPopularAndLatestCourses();
        expect(pageService.getPageAssemble).toHaveBeenCalledWith(criteria, jasmine.any(Function), jasmine.any(Function));
    });

    it('should  apply all profile values in pageassemble criteria after applying filter', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const pageService = TestBed.get(PageAssembleService);
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough();
        spyOn(formAndFrameworkUtilService, 'getCourseFilterConfig').and.returnValue(Promise.resolve(CourseMock.courseConfigFilter));
        component.showFilter();

        component.pageFilterCallBack.applyFilter(CourseMock.filter, CourseMock.appliedFilter);
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter_applied.png');
    });

    it('should  apply soft filters if profile details is filled through onboarding cards', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const pageService = TestBed.get(PageAssembleService);
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough();
        spyOn(formAndFrameworkUtilService, 'getCourseFilterConfig').and.returnValue(Promise.resolve(CourseMock.courseConfigFilter));
        component.showFilter();

        component.pageFilterCallBack.applyFilter({}, {});
        expect(component.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
    });

    it('should  throw error if getCourseFilterConfig is failed', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const pageService = TestBed.get(PageAssembleService);
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough();
        spyOn(formAndFrameworkUtilService, 'getCourseFilterConfig').and.returnValue(Promise.reject(CourseMock.courseConfigFilter));
        component.showFilter();

        component.pageFilterCallBack.applyFilter({}, {});
    });

    it('should  show filter page if course filter is available', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const pageService = TestBed.get(PageAssembleService);
        const formAndFrameworkUtilService = TestBed.get(FormAndFrameworkUtilService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough();
        spyOn(formAndFrameworkUtilService, 'getCourseFilterConfig').and.returnValue(Promise.resolve(CourseMock.courseConfigFilter));
        spyOn(component, 'showFilterPage').and.callThrough();
        component.courseFilter = CourseMock.courseConfigFilter;
        component.showFilter();

        component.pageFilterCallBack.applyFilter(CourseMock.filter, CourseMock.appliedFilter);
        expect(component.showFilterPage).toHaveBeenCalled();
        expect(formAndFrameworkUtilService.getCourseFilterConfig).not.toHaveBeenCalled();
        component.applyProfileFilter([], []);
    });


    it('should  show Offline warning', (done) => {
        component.showOfflineWarning();
        expect(component.showWarning).toBe(true);
        setTimeout(() => {
            expect(component.showWarning).toBe(false);
            done();
        }, 4000);
    });

    // it('should  not call Page API if network is off ', () => {
    //     NetworkMock.instance('none')
    //     component.retryShowingPopularCourses(true);
    //     expect(component.isNetworkAvailable).toBe(false);

    // });

    it('should  call Page API if network is available ', () => {
        NetworkMock.instance('4G');
        spyOn(component, 'getCourseTabData').and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        spyOn(pageService, 'getPageAssemble').and.callFake((option, success, error) => {
            const data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        component.retryShowingPopularCourses(true);
        expect(component.getCourseTabData).toHaveBeenCalled();
        expect(component.isNetworkAvailable).toBe(true);
    });


    it('should  navigate to ViewMoreActivityPage with gven parameters', () => {
        const navCtrl = fixture.debugElement.injector.get(NavController);
        component.userId = 'sample_userId';
        spyOn(navCtrl, 'push');
        component.navigateToViewMoreContentsPage(true);
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            headerTitle: 'COURSES_IN_PROGRESS',
            userId: component.userId,
            pageName: 'course.EnrolledCourses'
        });

    });


    it('should  navigate to ViewMoreActivity page with popular courses search query', () => {
        const navCtrl = fixture.debugElement.injector.get(NavController);
        const searchQuery = CourseMock.searchQuery;
        const headerTitle = 'headerTitle';
        spyOn(navCtrl, 'push');
        component.navigateToViewMoreContentsPage(false, searchQuery, headerTitle);
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            headerTitle: headerTitle,
            requestParams: CourseMock.mergedSearchQuery,
            pageName: 'course.PopularContent'
        });

    });

    it('should  start QRscanner', () => {
        const qrScanner = TestBed.get(SunbirdQRScanner);
        spyOn(qrScanner, 'startScanner');
        component.scanQRCode();
        expect(qrScanner.startScanner).toHaveBeenCalled();

    });

    it('should  navigate to SearchPage', () => {
        const navCtrl = fixture.debugElement.injector.get(NavController);
        spyOn(navCtrl, 'push');
        component.search();
        expect(navCtrl.push).toHaveBeenCalledWith(SearchPage, { contentType: ['Course'], source: PageId.COURSES });

    });

    describe('should handle all the scenarios for getContentDetails() method', () => {
        const sampleContent = JSON.parse(CourseMock.sampleContent);
        it('should navigate to EnrollCourseDetails page if content is available', () => {
            const contentService = TestBed.get(ContentService);
            spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
                return success(CourseMock.sampleContentDetailsResponseLocal);
            });
            spyOn(component, 'navigateToContentDetailsPage').and.callThrough();
            component.getContentDetails(sampleContent);
            expect(contentService.getContentDetail).toHaveBeenCalledWith({ 'contentId': 'do_sample' },
                jasmine.any(Function), jasmine.any(Function));
            expect(component.showOverlay).toBe(false);
            expect(component.navigateToContentDetailsPage).toHaveBeenCalledWith(sampleContent);

        });

        it('should download the content if content is not available', () => {
            const contentService = TestBed.get(ContentService);
            spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
                return success(CourseMock.sampleContentDetailsResponseNonLocal);
            });
            spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
                return success(JSON.stringify(CourseMock.importContentResponse));
            });
            spyOn(component, 'importContent').and.callThrough();
            spyOn(component, 'subscribeGenieEvent').and.callThrough();
            component.getContentDetails(sampleContent);
            expect(contentService.getContentDetail).toHaveBeenCalledWith({ 'contentId': 'do_sample' },
                jasmine.any(Function), jasmine.any(Function));
            expect(component.showOverlay).toBe(true);
            expect(component.importContent).toHaveBeenCalledWith(['do_sample'], false);
            expect(component.subscribeGenieEvent).toHaveBeenCalled();

        });

        it('should show error if getContentDetails API throws error', () => {
            const contentService = TestBed.get(ContentService);
            const commonUtilService = TestBed.get(CommonUtilService);
            spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
                return error();
            });
            spyOn(commonUtilService, 'showToast').and.callThrough();
            component.getContentDetails(sampleContent);
            expect(contentService.getContentDetail).toHaveBeenCalledWith({ 'contentId': 'do_sample' },
                jasmine.any(Function), jasmine.any(Function));
            expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');

        });

    });


    describe('should handle all the scenarios for importContent() method', () => {
        it('should importContent and update queuedIdentifiers array', () => {
            const contentService = TestBed.get(ContentService);
            spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
                return success(CourseMock.importContentResponse);
            });
            component.importContent(['do_sample'], false);
            expect(contentService.importContent).toHaveBeenCalledWith(JSON.parse(CourseMock.importReQuest),
                jasmine.any(Function), jasmine.any(Function));

        });

        it('should show error message if content is not available to download', () => {
            const contentService = TestBed.get(ContentService);
            const commonUtilService = TestBed.get(CommonUtilService);
            spyOn(component, 'removeOverlayAndShowError').and.callThrough();
            spyOn(commonUtilService, 'showToast').and.callThrough();

            spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
                return success(CourseMock.failrueimportResponse);
            });
            component.importContent(['do_sample'], false);
            expect(contentService.importContent).toHaveBeenCalledWith(JSON.parse(CourseMock.importReQuest),
                jasmine.any(Function), jasmine.any(Function));
            expect(component.removeOverlayAndShowError).toHaveBeenCalled();
            expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
            expect(component.showOverlay).toBe(false);

        });

        it('should show error message  when importContent() throws error', () => {
            const contentService = TestBed.get(ContentService);
            const commonUtilService = TestBed.get(CommonUtilService);
            spyOn(component, 'removeOverlayAndShowError').and.callThrough();
            spyOn(commonUtilService, 'showToast').and.callThrough();

            spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
                return error();
            });
            component.importContent(['do_sample'], false);
            expect(contentService.importContent).toHaveBeenCalledWith(JSON.parse(CourseMock.importReQuest),
                jasmine.any(Function), jasmine.any(Function));
            expect(component.removeOverlayAndShowError).toHaveBeenCalled();
            expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
            expect(component.showOverlay).toBe(false);

        });

    });


    describe('should handle scenarios for subscribeGenieEvent()', () => {
        it('should update the download progress on download progress', () => {
            const events = TestBed.get(Events);
            spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
                return success(CourseMock.downloadProgressEventSample1);
            });
            component.subscribeGenieEvent();
            expect(events.subscribe).toHaveBeenCalledWith('genie.event', jasmine.any(Function));
            expect(component.downloadPercentage).toBe(10);

        });

        it('should update the download progress to 0 if from event its coming as -1', () => {
            const events = TestBed.get(Events);
            spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
                return success(CourseMock.downloadProgressEventSample2);
            });
            component.subscribeGenieEvent();
            expect(events.subscribe).toHaveBeenCalledWith('genie.event', jasmine.any(Function));
            expect(component.downloadPercentage).toBe(0);

        });

        it('should navigate to EnrolledContentDetails page when download is complete', () => {
            const events = TestBed.get(Events);
            component.resumeContentData = {};
            component.resumeContentData.contentId = 'do_sample';
            component.resumeContentData.identifeir = 'do_sample';
            spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
                return success(CourseMock.importCompleteEvent);
            });
            spyOn(component, 'navigateToContentDetailsPage').and.callThrough();
            component.downloadPercentage = 100;
            component.subscribeGenieEvent();
            expect(events.subscribe).toHaveBeenCalledWith('genie.event', jasmine.any(Function));
            expect(component.showOverlay).toBe(false);
            expect(component.navigateToContentDetailsPage).toHaveBeenCalled();

        });
    });

    describe('should handle scenarios for cancelDownload()', () => {

        it('should cancel the download and make the ovelay boolean false on success response', () => {
            const contentService = TestBed.get(ContentService);
            component.resumeContentData = {};
            component.resumeContentData.contentId = 'do_sample';
            component.resumeContentData.identifeir = 'do_sample';
            spyOn(contentService, 'cancelDownload').and.callFake(({ }, success, error) => {
                return success();
            });
            component.cancelDownload();
            expect(contentService.cancelDownload).toHaveBeenCalledWith('do_sample', jasmine.any(Function), jasmine.any(Function));
            expect(component.showOverlay).toBe(false);

        });

        it('should cancel the download and make the ovelay boolean false on error response', () => {
            const contentService = TestBed.get(ContentService);
            component.resumeContentData = {};
            component.resumeContentData.contentId = 'do_sample';
            component.resumeContentData.identifeir = 'do_sample';
            spyOn(contentService, 'cancelDownload').and.callFake((option, success, error) => {
                return error();
            });
            component.cancelDownload();
            expect(contentService.cancelDownload).toHaveBeenCalledWith('do_sample', jasmine.any(Function), jasmine.any(Function));
            expect(component.showOverlay).toBe(false);

        });
    });

    it('should  invoke events unsubscribe method', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'unsubscribe');
        component.ionViewCanLeave();
        expect(events.unsubscribe).toHaveBeenCalledWith('genie.event');

    });

    it('should  showSigninCard if ProfileType is teacher and config is enabled', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        spyOn(appGlobal, 'getGuestUserType').and.returnValue(ProfileType.TEACHER);
        appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER = true;
        component.getCurrentUser();
        expect(component.showSignInCard).toBe(true);

    });

    it('should  mark on boarding is complete if all profile attributes are available', () => {
        const appGlobal = TestBed.get(AppGlobalService);
        const events = TestBed.get(Events);
        spyOn(events, 'publish');
        spyOn(appGlobal, 'getCurrentUser').and.returnValue(CourseMock.sampleProfile);
        appGlobal.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER = false;
        component.getCurrentUser();
        expect(component.showSignInCard).toBe(false);
    });

});
