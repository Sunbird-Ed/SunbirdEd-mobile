import { IonicModule, NavController, NavParams, ToastController } from 'ionic-angular';
import { } from 'jasmine';
import { AuthService, CourseService, FrameworkModule, SharedPreferences } from 'sunbird';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
    NgZone,
  } from '@angular/core';
import {
    NavMock, NavParamsMock, ToastControllerMock, TranslateLoaderMock
} from '../../../test-config/mocks-ionic';
import { SignInCardComponent } from '../../component/sign-in-card/sign-in-card';
import { PipesModule } from '../../pipes/pipes.module';
import { mockRes } from '../course-batches/course-batches.spec.data';
import { CourseBatchesPage } from './course-batches';
import { CommonUtilService } from '../../service/common-util.service';
import { resolve } from 'url';
import { Network } from '@ionic-native/network';

fdescribe('CourseBatchesPage Component', () => {
    let component: CourseBatchesPage;
    let fixture: ComponentFixture<CourseBatchesPage>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CourseBatchesPage, SignInCardComponent],
            imports: [
                IonicModule.forRoot(CourseBatchesPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                FrameworkModule
            ],
            providers: [
                CourseService, CommonUtilService, Network, NavController , ToastController, AuthService,
                SharedPreferences,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ToastController, useClass: ToastControllerMock },
            ]
        });
        const data = {
            'identifier': '123',
        };
        const navParams = TestBed.get(NavParams);
        console.log('navParams', navParams);
        navParams.data['identifier'] = '123';
        // navParams.setData(data);
        spyOn(navParams, 'get').and.callThrough();
        fixture = TestBed.createComponent(CourseBatchesPage);
        component = fixture.componentInstance;
        console.log('component', component);
    });
    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should create a valid instance of CourseBatchesPage', () => {
        expect(component instanceof CourseBatchesPage).toBe(true);
        expect(component).not.toBeFalsy();
    });

    it('should invoke getBatchesByCourseId() and populate ongoingbatches list', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.returnValue(Promise.resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should invoke getBatchesByCourseId() and populate upcomingbatches list', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.returnValue(Promise.resolve(JSON.stringify(mockRes.getUpcomingBatchesResponse)));
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should show error message in case of no internet connection', (done) => {
        const courseService: CourseService = {
            getCourseBatches: null
        } as CourseService;

        const zoneMock: NgZone = {
            run: null
        } as NgZone;

        const commonUtilService: CommonUtilService = {
            translateMessage: null
        } as CommonUtilService;

        const navParamsMock: NavParams = {
            get: null
        } as NavParams;

        spyOn(commonUtilService, 'translateMessage').and.returnValue(null);

        const courseBatches: CourseBatchesPage = new CourseBatchesPage(courseService, null, navParamsMock, zoneMock,
             null, commonUtilService, null);

        spyOn(courseService, 'getCourseBatches').and.returnValue(Promise.reject('CONNECTION_ERROR'));
        spyOn(zoneMock, 'run');
        spyOn(navParamsMock, 'get');
        spyOn(courseBatches, 'spinner').and.returnValue(null);

        courseBatches.getBatchesByCourseId();
        expect(navParamsMock.get).toHaveBeenCalledWith('identifier');
        expect(courseService.getCourseBatches).toHaveBeenCalled();

        setTimeout(() => {
            expect(courseBatches.showLoader).toBe(false);
            done();
        }, 0);
    });

    it('should show error message in case of no internet connection', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.returnValue(Promise.reject('USER_ALREADY_ENROLLED_COURSE'));
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should show toast message after successfully enrolling to a batch', () => {
        const courseService = TestBed.get(CourseService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        const option = {};
        spyOn(courseService, 'enrollCourse').and.returnValue(Promise.resolve(JSON.stringify(mockRes.enrollBatchResponse)));
        component.enrollIntoBatch(option);
        spyOn(commonUtilServiceStub, 'showToast').and.callThrough();
        const timeout = setTimeout(() => {
            expect(commonUtilServiceStub.showToast).toHaveBeenCalledWith('COURSE_ENROLLED');
            expect(component['navCtrl'].pop).toHaveBeenCalled();
        }, 0);
        clearTimeout(timeout);

    });

    it('should show error toast message while enrolling to a batch in case of no internet connection', () => {
        const courseService = TestBed.get(CourseService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        const option = {};
        spyOn(courseService, 'enrollCourse').and.returnValue(Promise.reject(JSON.stringify(mockRes.connectionFailureResponse)));
        component.enrollIntoBatch(option);
        spyOn(commonUtilServiceStub, 'showToast').and.callThrough();
        const timeOut1 = setTimeout(() => {
            expect(commonUtilServiceStub.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        }, 0);
        clearTimeout(timeOut1);
    });

    it('should show error toast message while enrolling to a batch which is already enrolled', () => {
        const courseService = TestBed.get(CourseService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        const option = {};
        spyOn(courseService, 'enrollCourse').and.returnValue(Promise.reject(JSON.stringify(mockRes.alreadyRegisterredFailureResponse)));
        component.enrollIntoBatch(option);
        spyOn(commonUtilServiceStub, 'showToast').and.callThrough();
        const timeout = setTimeout(() => {
            expect(commonUtilServiceStub.showMessage).toHaveBeenCalledWith('ALREADY_ENROLLED_COURSE');
        }, 0);
        clearTimeout(timeout);
    });

    it('should not invoke getBatchesByCourseId for guestUser', () => {
        const authService = TestBed.get(AuthService);
        spyOn(authService, 'getSessionData').and.returnValue(Promise.resolve(undefined));
        spyOn(component, 'getBatchesByCourseId').and.callThrough();
        component.ngOnInit();
        spyOn(component, 'getUserId').and.callThrough();
        const timeOut = setTimeout(() => {
            expect(component.getUserId).toHaveBeenCalled();
            expect(component.isGuestUser).toBe(true);
            expect(component.getBatchesByCourseId).not.toHaveBeenCalled();
        }, 0);
        clearTimeout(timeOut);
    });

    it('should  invoke getBatchesByCourseId for signedIn user', () => {
        const courseService = TestBed.get(CourseService);
        const authService = TestBed.get(AuthService);
        spyOn(courseService, 'getCourseBatches').and.returnValue(Promise.resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
        spyOn(authService, 'getSessionData').and.returnValue(Promise.resolve(JSON.stringify(mockRes.sessionResponse)));
        spyOn(component, 'getBatchesByCourseId').and.callThrough();
        component.ngOnInit();
        spyOn(component, 'getUserId').and.callThrough();
        const timeOut = setTimeout(() => {
            expect(component.getUserId).toHaveBeenCalled();
            expect(component.isGuestUser).toBe(false);
            expect(component.userId).toBe('sample_user_token');
            expect(component.getBatchesByCourseId).toHaveBeenCalled();
        }, 0);
        clearTimeout(timeOut);
    });

    it('should  update filter', () => {
        component.changeFilter('ONGOING');
        expect(component.selectedFilter).toBe('VIEW_ONGOING_BATCHES');
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.returnValue(Promise.resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
        component.changeFilter('UPCOMING');
        expect(component.selectedFilter).toBe('VIEW_UPCOMING_BATCHES');
    });
});
