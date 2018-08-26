import { SignInCardComponent } from './../../component/sign-in-card/sign-in-card';
import { PipesModule } from './../../pipes/pipes.module';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CourseBatchesPage } from './course-batches';
import { } from 'jasmine';
import {
    NavController, IonicModule, NavParams, ToastController} from 'ionic-angular';
import {
    AuthService, FrameworkModule, CourseService} from "sunbird";
import {
    NavParamsMock,
    NavMock, TranslateLoaderMock,ToastControllerMockNew
} from '../../../test-config/mocks-ionic';


import { mockRes } from '../course-batches/course-batches.spec.data';

describe('CourseBatchPage Component', () => {
    let component: CourseBatchesPage;
    let fixture: ComponentFixture<CourseBatchesPage>;

    beforeEach(async(() => {
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
                CourseService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseBatchesPage);
        component = fixture.componentInstance;
    });


    it('should create a valid instance of CourseBatchesPage', () => {
        expect(component instanceof CourseBatchesPage).toBe(true);
        expect(component).not.toBeFalsy();
    });

    it('should invoke getBatchesByCourseId() and populate ongoingbatches list', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.callFake(function (option, success) {
            let data = JSON.stringify(mockRes.getOngoingBatchesResponse);
            return success(data);
        });
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(1);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should invoke getBatchesByCourseId() and populate upcomingbatches list', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.callFake(function (option, success) {
            let data = JSON.stringify(mockRes.getUpcomingBatchesResponse);
            return success(data);
        });
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(1);
    });

    it('should show error message in case of no internet connection', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.callFake(function (option, success, error) {
            return error("CONNECTION_ERROR");
        });
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should show toast message after successfully enrolling to a batch', () => {
        const courseService = TestBed.get(CourseService);
        let option = {};
        spyOn(courseService, 'enrollCourse').and.callFake(function (option, success) {
            let data = JSON.stringify(mockRes.enrollBatchResponse);
            return success(data);
        });
        component.enrollIntoBatch(option);
        spyOn(component, "translateLanguageConstant").and.callThrough();
        spyOn(component, "showMessage").and.callThrough();
        let timeOut =setTimeout(() => {
            expect(component.showMessage).toHaveBeenCalledWith('COURSE_ENROLLED');
            expect(component.navCtrl.pop).toHaveBeenCalled();
        }, 0);
        clearTimeout(timeOut);

    });

    it('should show error toast message while enrolling to a batch in case of no internet connection', () => {
        const courseService = TestBed.get(CourseService);
        let option = {};
        spyOn(courseService, 'enrollCourse').and.callFake(function (option, success, error) {
            return error("CONNECTION_ERROR");
        });
        component.enrollIntoBatch(option);
        spyOn(component, 'translateLanguageConstant').and.callThrough();
        spyOn(component, 'showMessage').and.callThrough();
        let timeOut = setTimeout(() => {
            expect(component.showMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        }, 0);
        clearTimeout(timeOut);
    });

    it('should not invoke getBatchesByCourseId for guestUser', () => {
        const authService = TestBed.get(AuthService);
        spyOn(authService, 'getSessionData').and.callFake(function (success) {
            return success(undefined);
        });
        spyOn(component, "getBatchesByCourseId").and.callThrough();
        component.ngOnInit();
        spyOn(component, 'getUserId').and.callThrough();
        let timeOut = setTimeout(() => {
            expect(component.getUserId).toHaveBeenCalled();
            expect(component.isGuestUser).toBe(true);
            expect(component.getBatchesByCourseId).not.toHaveBeenCalled();
        }, 0);
        clearTimeout(timeOut);
    });

    it('should  invoke getBatchesByCourseId for signedIn user', () => {
        const courseService = TestBed.get(CourseService);
        const authService = TestBed.get(AuthService);
        spyOn(courseService, 'getCourseBatches').and.callFake(function (option, success) {
            let data = JSON.stringify(mockRes.getOngoingBatchesResponse);
            return success(data);
        });
        spyOn(authService, 'getSessionData').and.callFake(function (success) {
            let data = JSON.stringify(mockRes.sessionResponse);
            return success(data);
        });
        spyOn(component, "getBatchesByCourseId").and.callThrough();
        component.ngOnInit();
        spyOn(component, 'getUserId').and.callThrough();
        let timeOut = setTimeout(() => {
            expect(component.getUserId).toHaveBeenCalled();
            expect(component.isGuestUser).toBe(false);
            expect(component.userId).toBe("sample_user_token");
            expect(component.getBatchesByCourseId).toHaveBeenCalled();
        }, 0);
        clearTimeout(timeOut);
    });

    it('should  update filter', () => {
       component.changeFilter("ONGOING");
       expect(component.selectedFilter).toBe("VIEW_ONGOING_BATCHES");

       component.changeFilter("UPCOMING");
       expect(component.selectedFilter).toBe("VIEW_UPCOMING_BATCHES");
    });
});
