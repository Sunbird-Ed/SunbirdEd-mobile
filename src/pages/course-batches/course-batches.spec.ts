import { IonicModule, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService, CourseService, FrameworkModule } from 'sunbird';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import {
    NavMock, NavParamsMock, ToastControllerMock, TranslateLoaderMock
} from '../../../test-config/mocks-ionic';
import { SignInCardComponent } from '../../component/sign-in-card/sign-in-card';
import { PipesModule } from '../../pipes/pipes.module';
import { mockRes } from '../course-batches/course-batches.spec.data';
import { CourseBatchesPage } from './course-batches';

describe('CourseBatchesPage Component', () => {
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
                { provide: ToastController, useClass: ToastControllerMock },
            ]
        });
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
        spyOn(courseService, 'getCourseBatches').and.callFake( (option, success) => {
            const data = JSON.stringify(mockRes.getOngoingBatchesResponse);
            return success(data);
        });
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(1);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should invoke getBatchesByCourseId() and populate upcomingbatches list', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.callFake( (option, success) => {
            const data = JSON.stringify(mockRes.getUpcomingBatchesResponse);
            return success(data);
        });
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(1);
    });

    it('should show error message in case of no internet connection', () => {
        const courseService = TestBed.get(CourseService);
        spyOn(courseService, 'getCourseBatches').and.callFake( (option, success, error) => {
            return error('CONNECTION_ERROR');
        });
        component.getBatchesByCourseId();
        expect(component.ongoingBatches.length).toBe(0);
        expect(component.upcommingBatches.length).toBe(0);
    });

    it('should show toast message after successfully enrolling to a batch', () => {
        const courseService = TestBed.get(CourseService);
        const option = {};
        spyOn(courseService, 'enrollCourse').and.callFake( (_option, success) => {
            const data = JSON.stringify(mockRes.enrollBatchResponse);
            return success(data);
        });
        component.enrollIntoBatch(option);
        spyOn(component, 'translateLanguageConstant').and.callThrough();
        spyOn(component, 'showMessage').and.callThrough();
        const timeOut = setTimeout(() => {
            expect(component.showMessage).toHaveBeenCalledWith('COURSE_ENROLLED');
            expect(component.navCtrl.pop).toHaveBeenCalled();
        }, 0);
        clearTimeout(timeOut);

    });

    it('should show error toast message while enrolling to a batch in case of no internet connection', () => {
        const courseService = TestBed.get(CourseService);
        const option = {};
        spyOn(courseService, 'enrollCourse').and.callFake( (_option, success, error) => {
            return error(JSON.stringify(mockRes.connectionFailureResponse));
        });
        component.enrollIntoBatch(option);
        spyOn(component, 'translateLanguageConstant').and.callThrough();
        spyOn(component, 'showMessage').and.callThrough();
        const timeOut = setTimeout(() => {
            expect(component.showMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        }, 0);
        clearTimeout(timeOut);
    });

    it('should show error toast message while enrolling to a batch which is already enrolled', () => {
        const courseService = TestBed.get(CourseService);
        const option = {};
        spyOn(courseService, 'enrollCourse').and.callFake( (_option, success, error) => {
            return error(JSON.stringify(mockRes.alreadyRegisterredFailureResponse));
        });
        component.enrollIntoBatch(option);
        spyOn(component, 'translateLanguageConstant').and.callThrough();
        spyOn(component, 'showMessage').and.callThrough();
        const timeOut = setTimeout(() => {
            expect(component.showMessage).toHaveBeenCalledWith('ALREADY_ENROLLED_COURSE');
        }, 0);
        clearTimeout(timeOut);
    });

    it('should not invoke getBatchesByCourseId for guestUser', () => {
        const authService = TestBed.get(AuthService);
        spyOn(authService, 'getSessionData').and.callFake( (success) => {
            return success(undefined);
        });
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
        spyOn(courseService, 'getCourseBatches').and.callFake( (option, success) => {
            const data = JSON.stringify(mockRes.getOngoingBatchesResponse);
            return success(data);
        });
        spyOn(authService, 'getSessionData').and.callFake( (success) => {
            const data = JSON.stringify(mockRes.sessionResponse);
            return success(data);
        });
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
       spyOn(courseService, 'getCourseBatches').and.callFake( (option, success) => {
        const data = JSON.stringify(mockRes.getOngoingBatchesResponse);
        return success(data);
    });
       component.changeFilter('UPCOMING');
       expect(component.selectedFilter).toBe('VIEW_UPCOMING_BATCHES');
    });
});
