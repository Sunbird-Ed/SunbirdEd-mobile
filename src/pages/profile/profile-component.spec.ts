import { Observable } from 'rxjs';
import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    LoadingController, ToastController,
    NavController, NavParams, Events, PopoverController
} from 'ionic-angular';
import {
    AuthService, UserProfileService, CourseService,
    ContentService, TelemetryService, ProfileService, ServiceProvider,
    SharedPreferences, BuildParamService, FrameworkService,
} from 'sunbird';
import { DatePipe } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppGlobalService } from '../../service/app-global.service';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../component/components.module';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { mockProfileRes } from './profile.data.spec';
import { } from 'jasmine';
import {
    LoadingControllerMock, TranslateServiceStub,
    ToastControllerMockNew, PopoverControllerMock,
    AuthServiceMock, AppGlobalServiceMock, NavMock,
    NavParamsMock,
    EventsMock, TelemetryServiceMock
} from '../../../test-config/mocks-ionic';
import { CommonUtilService } from '../../service/common-util.service';

describe('ProfilePage', () => {
    let comp: ProfilePage;
    let fixture: ComponentFixture<ProfilePage>;

    beforeEach(() => {

        const userProfileServiceStub = {
            endorseOrAddSkill: () => ({}),
            setProfileVisibility: () => ({}),
            getUserProfileDetails: () => ({})
        };

        const courseServiceStub = {
            getEnrolledCourses: () => ({})
        };
        const contentServiceStub = {
            searchContent: () => ({})
        };

        const datePipeStub = {
            transform: () => ({})
        };

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), ComponentsModule],
            declarations: [ProfilePage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ProfileService, ServiceProvider, SharedPreferences, BuildParamService, FrameworkService, CourseService,
                TelemetryGeneratorService, CommonUtilService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Events, useClass: EventsMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: UserProfileService, useValue: userProfileServiceStub },
                { provide: ContentService, useValue: contentServiceStub },
                { provide: TelemetryService, useClass: TelemetryServiceMock },
                { provide: DatePipe, useValue: datePipeStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }
            ]
        });

        fixture = TestBed.createComponent(ProfilePage);
        comp = fixture.componentInstance;
    });

    // it("userId should default to ''", (done) => {
    //     const navParams = TestBed.get(NavParams);
    //     spyOn(navParams, "get").and.callFake(function(data){
    //         console.log('in callfake');
    //         return undefined;
    //     });
    //     let fixture1 = TestBed.createComponent(ProfilePage);
    //     let comp1 = fixture1.componentInstance;
    //     setTimeout(() => {
    //         expect(comp1.userId).toBe('');
    //         done();
    //     },10)
    // });

    const getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    };

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('isLoggedInUser defaults to: false', () => {
        expect(comp.isLoggedInUser).toEqual(false);
    });

    // fit("should subscribe to force_optional_upgrade", () => {
    //     const events = TestBed.get(Events);
    //     const appGlobal = TestBed.get(AppGlobalService);
    //     spyOn(appGlobal, "openPopover")
    //     spyOn(events, 'subscribe').and.callFake(function (arg,success) {
    //         if(arg === 'force_optional_upgrade'){
    //             return success("true");
    //         }
    //     });
    //     expect(appGlobal.openPopover).toHaveBeenCalled();
    // });

    it('ionViewDidLoad makes expected calls', () => {
        const telemetryServiceStub = TestBed.get(TelemetryService);
        const events = TestBed.get(Events);
        spyOn(telemetryServiceStub, 'impression');
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'profilePicture:update') {
                return success(mockProfileRes.viewLoadEvent);
            }
        });
        spyOn(comp, 'doRefresh');
        comp.ionViewDidLoad();
        expect(telemetryServiceStub.impression).toHaveBeenCalled();
    });

    it('should handle success scenario for doRefresh', (done) => {
        getLoader();
        const events = TestBed.get(Events);
        spyOn(events, 'publish');
        spyOn(comp, 'refreshProfileData').and.returnValue(Promise.resolve('success'));
        // spyOn(comp,'getEnrolledCourses').and.returnValue(Promise.resolve('success'));
        comp.doRefresh();
        setTimeout(() => {
            expect(events.publish).toHaveBeenCalled();
            done();
        }, 1000);

    });

    it('should handle success scenarion for refreshProfileData', (done) => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        comp.isLoggedInUser = true;
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        spyOn(userProfileService, 'getUserProfileDetails').and.callFake((req, success, error) => {
            success(mockProfileRes.profileDetailsMock);
        });
        comp.refreshProfileData();
        expect(authService.getSessionData).toHaveBeenCalled();
        setTimeout(() => {
            expect(comp.loggedInUserId).toEqual(mockProfileRes.sessionMock.userToken);
            done();
        }, 10);

    });

    it('should handle success scenarion for refreshProfileData', (done) => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        comp.isLoggedInUser = true;
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        spyOn(userProfileService, 'getUserProfileDetails').and.callFake((req, success, error) => {
            error('error');
        });
        comp.refreshProfileData();
        expect(authService.getSessionData).toHaveBeenCalled();
        setTimeout(() => {
            expect(comp.loggedInUserId).toEqual(mockProfileRes.sessionMock.userToken);
            done();
        }, 10);
    });

    it('should handle failure scenario for doRefresh', () => {
        getLoader();
        spyOn(comp, 'refreshProfileData').and.returnValue(Promise.reject('error'));
        comp.doRefresh();
    });

    it('arrayToString should convert array to string', () => {
        const data = ['1', '2', '3'].join(', ');
        expect(comp.arrayToString(['1', '2', '3'])).toEqual(data);
        // return stringArray.join(", ");
    });

    it('#showMoreBadges should set badgeAssertions length to default', () => {
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        comp.showMoreBadges();
        expect(comp.badgesLimit).toEqual(comp.profile.badgeAssertions.length);
    });
    it('#showLessBadges should set badgeAssertions length to default', () => {
        comp.showLessBadges();
        expect(comp.badgesLimit).toEqual(comp.DEFAULT_PAGINATION_LIMIT);
    });
    it('#showLessTrainings should set trainingsLimit length to default', () => {
        comp.showLessTrainings();
        expect(comp.trainingsLimit).toEqual(comp.DEFAULT_PAGINATION_LIMIT);
    });

    it('#navigate to Categories Edit Page', () => {
        const navController = TestBed.get(NavController);
        spyOn(navController, 'push');
        comp.navigateToCategoriesEditPage();
        expect(navController.push).toHaveBeenCalled();
    });

    it('getLoader makes expected calls', () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
        expect(loadingController.create).toHaveBeenCalled();
    });

    /* it('getToast should make expected calls', () => {
        const toasrCtrlStub  = TestBed.get(ToastController);
        let msg = 'testMessage';
        let getToast = comp.getToast(msg);
        expect(comp.options.message).toEqual(msg);
    }); */

    it('translateMessage', () => {
        const translate = TestBed.get(TranslateService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        commonUtilServiceStub.translateMessage('testMessage');
    });
    it('#getEnrolledCourses should not make expected calls', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(comp, 'getEnrolledCourses').and.callThrough();
        spyOn(courseService, 'getEnrolledCourses').and.callFake(({ }, success, error) => {
            return error;
        });
        comp.getEnrolledCourses();
        expect(courseService.getEnrolledCourses).toHaveBeenCalled();
    });
    it('#getEnrolledCourses should make expected calls', (done) => {
        const courseService = TestBed.get(CourseService);
        const option = {
            'userId': '659b011a-06ec-4107-84ad-955e16b0a48a',
            'refreshEnrolledCourses': true,
            'returnRefreshedEnrolledCourses': true
        };
        spyOn(comp, 'getEnrolledCourses').and.callThrough();
        spyOn(courseService, 'getEnrolledCourses').and.callFake(({ }, success, error) => {
            const data = JSON.stringify((mockProfileRes.getEnrolledCourses));
            return success(data);
        });
        comp.getEnrolledCourses();
        setTimeout(() => {
            expect(courseService.getEnrolledCourses).toHaveBeenCalled();
            done();
        }, 10);
        comp.showMoreTainings();
        expect(comp.trainingsLimit).toEqual(mockProfileRes.trainingsCompleted.length);
    });
});
