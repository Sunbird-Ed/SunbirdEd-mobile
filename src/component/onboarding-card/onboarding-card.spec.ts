import { mockSyllabusList, mockOnboardingEvents, mockSelectedSlide } from './onboarding.data.spec';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PopoverController, NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { OnboardingService } from '../onboarding-card/onboarding.service';
import { OnboardingCardComponent } from './onboarding-card';
import {
    PopoverControllerMock, EventsMock, ToastControllerMock,
    BuildParamaServiceMock, AuthServiceMock, FormAndFrameworkUtilServiceMock
} from '../../../test-config/mocks-ionic';
import {
    ProfileService, ServiceProvider, SharedPreferences,
    FrameworkService, BuildParamService, FormService, AuthService, TelemetryService
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../../pages/profile/formandframeworkutil.service';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Observable } from 'rxjs';
describe('OnboardingCardComponent', () => {
    let comp: OnboardingCardComponent;
    let fixture: ComponentFixture<OnboardingCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OnboardingCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                OnboardingService, NavController, ProfileService, ServiceProvider, SharedPreferences, FrameworkService,
                FormService, AppGlobalService, TelemetryGeneratorService, TelemetryService,
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: BuildParamService, useClass: BuildParamaServiceMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: Events, useClass: EventsMock },
                { provide: ToastController, useClass: ToastControllerMock }
            ]
        });
    });

    it('#contructor hould fetch Syllabus Details and should make expected calls', (done) => {
        const onboardingService = TestBed.get(OnboardingService);
        spyOn(OnboardingCardComponent.prototype, 'showLoader');
        spyOn(onboardingService, 'getSyllabusDetails').and.returnValue(Promise.resolve(mockSyllabusList));
        fixture = TestBed.createComponent(OnboardingCardComponent);
        comp = fixture.componentInstance;
        setTimeout(() => {
            expect(OnboardingCardComponent.prototype.showLoader).toHaveBeenCalled();
            expect(comp.isDataAvailable).toBe(true);
            done();
        }, 10);
    });

    it('#contructor should show toast message as no data found for syllabus and message should be translated in current language',
        (done) => {
            const onboardingService = TestBed.get(OnboardingService);
            spyOn(OnboardingCardComponent.prototype, 'showLoader');
            spyOn(OnboardingCardComponent.prototype, 'getToast');
            spyOn(OnboardingCardComponent.prototype, 'translateMessage');
            spyOn(OnboardingCardComponent.prototype, 'initializeService');
            spyOn(onboardingService, 'getSyllabusDetails').and.returnValue(Promise.resolve(undefined));
            fixture = TestBed.createComponent(OnboardingCardComponent);
            comp = fixture.componentInstance;
            setTimeout(() => {
                expect(OnboardingCardComponent.prototype.showLoader).toHaveBeenCalled();
                expect(comp.isDataAvailable).toBe(false);
                expect(OnboardingCardComponent.prototype.getToast).toHaveBeenCalled();
                expect(OnboardingCardComponent.prototype.translateMessage).toHaveBeenCalled();
                expect(OnboardingCardComponent.prototype.initializeService).toHaveBeenCalled();
                done();
            }, 20);
        });


    it('#contructor should set some flags based on the data aviablability and should executed once event triggered', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'is-data-available') {
                return success(mockOnboardingEvents.isDataAvailable);
            }
        });
        spyOn(OnboardingCardComponent.prototype, 'showLoader');
        fixture = TestBed.createComponent(OnboardingCardComponent);
        comp = fixture.componentInstance;
        expect(comp.showLoader).toHaveBeenCalled();
        expect(comp.showLoader).toHaveBeenCalledWith(false);
        expect(comp.isDataAvailable).toBe(true);
    });

    /*     it("should execute this on triggeredof event slide-onboarding-card and should move slide to next slide", async(() => {
            const events = TestBed.get(Events);
            spyOn(events, 'subscribe').and.callFake((arg, success) => {
                if (arg === "slide-onboarding-card") {
                    return success({});
                }
            });
            fixture = TestBed.createComponent(OnboardingCardComponent);
            comp = fixture.componentInstance;
            fixture.detectChanges();
            const slides: Slides = comp.mSlides;
            spyOn(slides,'lockSwipes');
            spyOn(slides,'slideNext');
            expect(slides).toBeDefined();
            expect(slides.lockSwipes).toHaveBeenCalled();
            expect(slides.slideNext).toHaveBeenCalled();
        })); */


    it('#contructor should reinitiliaze the cards on user info get updated', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'user-profile-changed') {
                return success();
            }
        });
        spyOn(OnboardingCardComponent.prototype, 'reinitializeCards');
        fixture = TestBed.createComponent(OnboardingCardComponent);
        comp = fixture.componentInstance;
        expect(comp.reinitializeCards).toHaveBeenCalled();
    });

    it('#contructor should set some flags based on the data aviablability and should executed once event triggered', () => {
        const events = TestBed.get(Events);
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'refresh:onboardingcard') {
                return success();
            }
        });
        spyOn(OnboardingCardComponent.prototype, 'reinitializeCards');
        fixture = TestBed.createComponent(OnboardingCardComponent);
        comp = fixture.componentInstance;
        expect(comp.reinitializeCards).toHaveBeenCalled();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingCardComponent);
        comp = fixture.componentInstance;
    });

    it('#contructor should load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('#contructor should USER_INFO_UPDATED defaults to: user-profile-changed', () => {
        expect(OnboardingCardComponent.USER_INFO_UPDATED).toEqual('user-profile-changed');
    });

    it('#contructor should isOnBoardCard defaults to: true', () => {
        expect(comp.isOnBoardCard).toEqual(true);
    });

    it('#contructor should loader defaults to: True', () => {
        expect(comp.loader).toEqual(true);
    });

    it('#contructor should isDataAvailable defaults to: false', () => {
        expect(comp.isDataAvailable).toEqual(false);
    });

    it('#reinitializeCards should reinitialiaze cards flow', () => {
        expect(comp.reinitializeCards).toBeDefined();
        const onboardingServiceStub = TestBed.get(OnboardingService);
        spyOn(onboardingServiceStub, 'initializeCard').and.returnValue(Promise.resolve(5));
        spyOn(comp, 'reinitializeCards').and.callThrough();
        comp.reinitializeCards();
        expect(comp.reinitializeCards).toHaveBeenCalled();
    });

    it('#translateMessage should return translated message', fakeAsync(() => {
        const translate = TestBed.get(TranslateService);
        const translateStub = TestBed.get(TranslateService);
        const spy = spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        const translatedMessage = comp.translateMessage('CANCEL');
        expect(translatedMessage).toEqual('Cancel');
        expect(spy.calls.any()).toEqual(true);
    }));

    it('#initializeService should start to show onboarding cards', () => {
        expect(comp.initializeService).toBeDefined();
        const onboardingServiceStub: OnboardingService = TestBed.get(OnboardingService);
        spyOn(onboardingServiceStub, 'initializeCard').and.returnValue(Promise.resolve(0));
        spyOn(comp, 'initializeService').and.callThrough();
        comp.initializeService();
        expect(comp.initializeService).toHaveBeenCalled();
    });

    it('#getToast should not create ToastController if not passed any message for toast', () => {
        const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
        spyOn(toastCtrlStub, 'create');
        comp.getToast();
        expect(toastCtrlStub.create).not.toHaveBeenCalled();
    });
    it('#getToast should create ToastController', () => {
        const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
        spyOn(toastCtrlStub, 'create');
        comp.getToast('Some Message');
        expect(toastCtrlStub.create).toHaveBeenCalled();
        expect(toastCtrlStub.create).toBeTruthy();
    });
    /*     it('#onSlideDrag', () => {
            expect(comp.onSlideDrag).toBeDefined();
            spyOn(comp, 'onSlideDrag').and.callThrough();
            comp.onSlideDrag();
            expect(comp.onSlideDrag).toHaveBeenCalled();
        }); */

    it('#ionViewWillEnter should slide to 0th index if there is no index set', () => {
        expect(comp.ionViewWillEnter).toBeDefined();
        spyOn(comp, 'ionViewWillEnter').and.callThrough();
        const onboardingServiceStub: OnboardingService = TestBed.get(OnboardingService);
        onboardingServiceStub.currentIndex = 2; // Change this to undefined
        comp.ionViewWillEnter();
        expect(comp.ionViewWillEnter).toHaveBeenCalled();
    });

    it('#openFilterOptions should show option for the syllabus list', () => {
        const onboardingService = TestBed.get(OnboardingService);
        expect(comp.openFilterOptions).toBeDefined();
        spyOn(onboardingService, 'checkPrevValue');
        spyOn(onboardingService, 'getListName').and.returnValue('syllabusList');
        spyOn(comp, 'openFilterOptions').and.callThrough();
        comp.openFilterOptions(mockSelectedSlide, 0);
        expect(comp.openFilterOptions).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalledWith(0, 'syllabusList', undefined, true);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(onboardingService.getListName).toHaveBeenCalledWith(0);
    });
    it('#openFilterOptions should show option for the board list', () => {
        const onboardingService = TestBed.get(OnboardingService);
        expect(comp.openFilterOptions).toBeDefined();
        spyOn(onboardingService, 'checkPrevValue');
        spyOn(onboardingService, 'getListName').and.returnValue('boardList');
        spyOn(comp, 'openFilterOptions').and.callThrough();
        comp['onboardingService'].profile.syllabus = ['ap_k-12_13'];
        comp.openFilterOptions(mockSelectedSlide, 1);
        expect(comp.openFilterOptions).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalledWith(1, 'boardList', ['ap_k-12_13'], true);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(onboardingService.getListName).toHaveBeenCalledWith(1);
    });
    it('#openFilterOptions should show option for the medium list', () => {
        const onboardingService = TestBed.get(OnboardingService);
        expect(comp.openFilterOptions).toBeDefined();
        spyOn(onboardingService, 'checkPrevValue');
        spyOn(onboardingService, 'getListName').and.returnValue('mediumList');
        spyOn(comp, 'openFilterOptions').and.callThrough();
        comp['onboardingService'].profile.board = ['stateandhrapradesh'];
        comp.openFilterOptions(mockSelectedSlide, 2);
        expect(comp.openFilterOptions).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalledWith(2, 'mediumList', ['stateandhrapradesh'], true);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(onboardingService.getListName).toHaveBeenCalledWith(2);
    });
    it('#openFilterOptions should show option for the grade list', () => {
        const onboardingService = TestBed.get(OnboardingService);
        expect(comp.openFilterOptions).toBeDefined();
        spyOn(onboardingService, 'checkPrevValue');
        spyOn(onboardingService, 'getListName').and.returnValue('gradeList');
        spyOn(comp, 'openFilterOptions').and.callThrough();
        comp['onboardingService'].profile.medium = ['english'];
        comp.openFilterOptions(mockSelectedSlide, 3);
        expect(comp.openFilterOptions).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalledWith(3, 'gradeList', ['english'], true);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(onboardingService.getListName).toHaveBeenCalledWith(3);
    });
    it('#openFilterOptions should show option for the subject list', () => {
        const onboardingService = TestBed.get(OnboardingService);
        expect(comp.openFilterOptions).toBeDefined();
        spyOn(onboardingService, 'checkPrevValue');
        spyOn(onboardingService, 'getListName').and.returnValue('subjectList');
        spyOn(comp, 'openFilterOptions').and.callThrough();
        comp['onboardingService'].profile.grade = ['class10'];
        comp.openFilterOptions(mockSelectedSlide, 4);
        expect(comp.openFilterOptions).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalled();
        expect(onboardingService.checkPrevValue).toHaveBeenCalledWith(4, 'subjectList', ['class10'], true);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(onboardingService.getListName).toHaveBeenCalledWith(4);
    });
});
