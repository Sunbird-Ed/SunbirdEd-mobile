import { async, TestBed, ComponentFixture, inject } from "@angular/core/testing";
import { CoursesPage } from './courses';
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import {
    NavController, Events, IonicModule, NavParams, ToastController, PopoverController,
    LoadingController, Platform
} from 'ionic-angular';

import {
    StorageMock, PopoverControllerMock, LoadingControllerMock,
    NetworkMock
} from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule, BuildParamService,
    ContentService, TelemetryService, CourseService, ProfileType, ShareUtil, PageAssembleService, PageId
} from "sunbird";

import {
    GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, NavParamsMock,
    SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock, EventsMock, AppGlobalServiceMock, ToastControllerMockNew
} from '../../../test-config/mocks-ionic';
import { PBHorizontal } from "../../component/pbhorizontal/pb-horizontal";
import { OnboardingCardComponent } from '../../component/onboarding-card/onboarding-card';
import { CourseCard } from "../../component/card/course/course-card";
import { SignInCardComponent } from '../../component/sign-in-card/sign-in-card';
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';
import { AppGlobalService } from "../../service/app-global.service";
import { PipesModule } from "../../pipes/pipes.module";
import { HttpClientModule } from "@angular/common/http";
import { DirectivesModule } from "../../directives/directives.module";
import { Ionic2RatingModule } from "ionic2-rating";
import { } from 'jasmine';
import { SunbirdQRScanner } from "../qrscanner/sunbirdqrscanner.service";
import { AppVersion } from "@ionic-native/app-version";
import { SearchPage } from "../search/search";
import { ContentType } from "../../app/app.constant";
import { ViewMoreActivityPage } from "../view-more-activity/view-more-activity";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { CourseUtilService } from "../../service/course-util.service";
import { mockRes } from "../../mock.spec.data";
import { mockRes as CourseMock } from '../courses/courses.spec.data';
import { QRScannerResultHandler } from "../qrscanner/qrscanresulthandler.service";
import { CommonUtilService } from "../../service/common-util.service";
import { FormAndFrameworkUtilService } from "../profile/formandframeworkutil.service";
declare let GenieSDK: any;
describe('CoursesPage Component', () => {
    let component: CoursesPage;
    let fixture: ComponentFixture<CoursesPage>;
    let translateService: TranslateService;

    const buildParamServiceStub = {
        getBuildConfigParam: () => ({})
    }

    const telemetryServiceStub = {
        getTelemetryService: () => ({}),
        impression: () => ({})
    }

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
                ContentService, TelemetryService, TelemetryGeneratorService, CourseService, ShareUtil, SunbirdQRScanner, QRScannerResultHandler,
                Network, AppVersion, CourseUtilService, CommonUtilService, FormAndFrameworkUtilService,
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: EventsMock },
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
                { provide: BuildParamService, useValue: buildParamServiceStub },
                { provide: TelemetryService, useValue: telemetryServiceStub },

            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoursesPage);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        })
    });

    it('should not invoke getEnrolledCourses for guest users', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        spyOn(component, "getEnrolledCourses").and.callThrough();
        component.getUserId();
        expect(component.getEnrolledCourses).not.toHaveBeenCalled();
    });

    it('should  invoke getEnrolledCourses for loggedIn users', () => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        AppGlobalServiceMock.setSessionData(mockRes.sessionResponse);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake(function (option, success) {
            let data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(component, "getEnrolledCourses").and.callThrough();
        component.getUserId();
        expect(component.getEnrolledCourses).toHaveBeenCalled();
    });

    it('should  dismiss loader while invoking getEnrolledCourses for loggedIn users in case of no internet connection', () => {
        AppGlobalServiceMock.setLoggedInStatus(true);
        AppGlobalServiceMock.setSessionData(mockRes.sessionResponse);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake(function (option, success, error) {
            let data = JSON.stringify(CourseMock.getEnrolledCourses);
            return error("CONNECTION_ERROR");
        });
        spyOn(component, "getEnrolledCourses").and.callThrough();
        component.getUserId();
        expect(component.getEnrolledCourses).toHaveBeenCalled();
        expect(component.showLoader).toBe(false);
    });

    it('should  invoke getCourseTabData on ngOnInit for signedin users', () => {
        spyOn(component, "getCourseTabData").and.callThrough();
        spyOn(component, "getPopularAndLatestCourses").and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake(function (option, success) {
            let data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake(function (option, success) {
            let data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        component.ngOnInit();
        let timeOut = setTimeout(() => {
            expect(component.getPopularAndLatestCourses).toHaveBeenCalled();
            expect(component.getCourseTabData).toHaveBeenCalledWith();
        }, 0);
        clearTimeout(timeOut);

    });


    it('should  invoke getCourseTabData on ngOnInit for guest users', () => {
        AppGlobalServiceMock.setLoggedInStatus(false);
        spyOn(component, "getCourseTabData").and.callThrough();
        spyOn(component, "getPopularAndLatestCourses").and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake(function (option, success) {
            let data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake(function (option, success) {
            let data = JSON.stringify(CourseMock.popularCoursesResponse);
            return success(data);
        });
        component.ngOnInit();
        let timeOut = setTimeout(() => {
            expect(component.getPopularAndLatestCourses).toHaveBeenCalled();
            expect(component.getCourseTabData).toHaveBeenCalledWith();
        }, 0);
        clearTimeout(timeOut);

    });

    it('should  invoke getCourseTabData on ngOnInit for guest users in error condition', () => {
        spyOn(component, "getCourseTabData").and.callThrough();
        spyOn(component, "getPopularAndLatestCourses").and.callThrough();
        const commonUtilService = TestBed.get(CommonUtilService);
        spyOn(commonUtilService, "showToast").and.callThrough();
        const pageService = TestBed.get(PageAssembleService);
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getEnrolledCourses').and.callFake(function (option, success) {
            let data = JSON.stringify(CourseMock.getEnrolledCourses);
            return success(data);
        });
        spyOn(pageService, 'getPageAssemble').and.callFake(function (option, success, error) {
            let data = JSON.stringify({ "error": "CONNECTION_ERROR" });
            return error(data);
        });
        component.ngOnInit();
        let timeOut = setTimeout(() => {
            expect(component.getCourseTabData).toHaveBeenCalledWith();
            expect(component.isNetworkAvailable).toBe(false);
            expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        }, 0);
        clearTimeout(timeOut);

    });




    it('should  navigate to ViewMoreActivityPage with gven parameters', () => {
        let navCtrl = fixture.debugElement.injector.get(NavController);
        component.userId = "sample_userId";
        spyOn(navCtrl, 'push');
        component.navigateToViewMorContentsPage(true);
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            headerTitle: 'COURSES_IN_PROGRESS',
            userId: component.userId,
            pageName: 'course.EnrolledCourses'
        });

    });


    it('should  navigate to ViewMoreActivity page with popular courses search query', () => {
        let navCtrl = fixture.debugElement.injector.get(NavController);
        let searchQuery = CourseMock.searchQuery;
        let headerTitle = "headerTitle";
        spyOn(navCtrl, 'push');
        component.navigateToViewMorContentsPage(false, searchQuery, headerTitle);
        expect(navCtrl.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
            headerTitle: headerTitle,
            requestParams: CourseMock.mergedSearchQuery,
            pageName: 'course.PopularContent'
        });

    });

    it('should  start QRscanner', () => {
        let qrScanner = TestBed.get(SunbirdQRScanner);
        spyOn(qrScanner, 'startScanner');
        component.scanQRCode();
        expect(qrScanner.startScanner).toHaveBeenCalled();

    });

    it('should  navigate to SearchPage', () => {
        let navCtrl = fixture.debugElement.injector.get(NavController);
        spyOn(navCtrl, 'push');
        component.search();
        expect(navCtrl.push).toHaveBeenCalledWith(SearchPage, { contentType: ["Course"], source: PageId.COURSES });

    });



});