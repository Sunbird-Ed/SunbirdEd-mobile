import { fakeAsync } from '@angular/core/testing';
import { mockCurrentUserDetails, mockCategories, mockOnBoardingSlideDefaults, mockSyllabusList } from './onboarding.data.spec';
import { AppGlobalService } from './../../service/app-global.service';
import { ServiceProvider, FrameworkService, BuildParamService, FormService, AuthService, TelemetryService } from 'sunbird';
import { OnboardingService } from './onboarding.service';
import {
    Injectable
} from '@angular/core';
import { Events, ToastOptions, PopoverController } from 'ionic-angular';
import {
    CategoryRequest,
    ProfileService,
    Profile,
    SharedPreferences,
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../../pages/profile/formandframeworkutil.service';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PreferenceKey } from '../../app/app.constant';
import { TestBed, inject } from '@angular/core/testing';
import { EventsMock, PopoverControllerMock } from 'ionic-mocks';
import { TranslateServiceStub, ToastControllerMock, AppGlobalServiceMock, FormAndFrameworkUtilServiceMock } from '../../../test-config/mocks-ionic';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Observable } from 'rxjs';
describe('OnBoarding.service', () => {
    let service: OnboardingService;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                ProfileService, FrameworkService, BuildParamService, FormService, SharedPreferences, OnboardingService,
                ServiceProvider, AuthService, TelemetryGeneratorService, TelemetryService,
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                // { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: Events, useClass: EventsMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: ToastController, useClass: ToastControllerMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
            ]
        });
    });
    // beforeEach(inject([ProfileService, SharedPreferences, FormAndFrameworkUtilService, ProfileService], (onBoardingService: OnboardingService, authServicecb, ProfileService) => {

    // }));

    it("#constructor isOnBoardingCardCompleted defaults to: false", () => {
        let service = TestBed.get(OnboardingService);
        expect(service.isOnBoardingCardCompleted).toEqual(false);
    });

    it("#contructor should fetch current languge", (done) => {
        const preferenceStub = TestBed.get(SharedPreferences);
        spyOn(preferenceStub, 'getString').and.returnValue(Promise.resolve('en'));
        service = TestBed.get(OnboardingService);
        setTimeout(() => {
            expect(service.selectedLanguage).toEqual('en');
            done();
        }, 10);
    });

    it('#initializeCard should return promise of index', (done) => {
        service = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(service.initializeCard).toBeDefined();
        spyOn(service, 'initializeCard').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            res(mockCurrentUserDetails);
        });
        spyOn(service, 'initializeSlides');
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(service, 'getCurrentUser').and.returnValue(Promise.resolve(3));
        service.slideIndex = -1;
        service.initializeCard();

        expect(service.initializeCard).toHaveBeenCalled();
        setTimeout(() => {
            expect(service.profile).toEqual(JSON.parse(mockCurrentUserDetails));
            expect(service.initializeSlides).toHaveBeenCalled();
            expect(service.categories).toEqual(mockCategories);
            expect(service.getCurrentUser).toHaveBeenCalled();
            expect(service.slideIndex).toEqual(3);
            done();
        }, 10);
    });

    it('#initializeCard should return promise with reject', (done) => {
        service = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(service.initializeCard).toBeDefined();
        spyOn(service, 'initializeCard').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            res(mockCurrentUserDetails);
        });
        spyOn(service, 'initializeSlides');
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(service, 'getCurrentUser').and.returnValue(Promise.reject('error occured'));
        service.slideIndex = -1;
        service.initializeCard();

        expect(service.initializeCard).toHaveBeenCalled();
        setTimeout(() => {
            expect(service.profile).toEqual(JSON.parse(mockCurrentUserDetails));
            expect(service.initializeSlides).toHaveBeenCalled();
            expect(service.categories).toEqual(mockCategories);
            expect(service.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#initializeCard should return error of getcurrentUser', (done) => {
        service = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(service.initializeCard).toBeDefined();
        spyOn(service, 'initializeCard').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            err('error');
        });
        service.slideIndex = -1;
        service.initializeCard();

        setTimeout(() => {
            expect(service.initializeCard).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#initializeCard should return index', (done) => {
        service = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(service.initializeCard).toBeDefined();
        spyOn(service, 'initializeCard').and.callThrough();
        service.slideIndex = 2;
        service.initializeCard().then((index) => {
            expect(index).toEqual(2);
            done()
        });
    });

    it('#initializeSlides should assign default data', () => {
        service = TestBed.get(OnboardingService);
        expect(service.initializeSlides).toBeDefined();
        spyOn(service, 'initializeSlides').and.callThrough();
        service.initializeSlides();
        expect(service.initializeSlides).toHaveBeenCalled();
        expect(service.onBoardingSlides).toEqual(mockOnBoardingSlideDefaults);
    });

    it('#getCurrentUser should return index', (done) => {
        service = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(service.getCurrentUser).toBeDefined();
        spyOn(service, 'getCurrentUser').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            res(mockCurrentUserDetails);
        });
        spyOn(service, 'arrayToString');
        spyOn(service, 'getSelectedOptions');

        service.syllabusList = mockSyllabusList;
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCurrentUser();
        setTimeout(() => {
            expect(service.getCurrentUser).toHaveBeenCalled();
            expect(profileServiceStub.getCurrentUser).toHaveBeenCalled();
            expect(service.profile).toEqual(JSON.parse(mockCurrentUserDetails));

            //Syllabus
            expect(service.arrayToString).toHaveBeenCalled();
            expect(service.arrayToString).toHaveBeenCalledWith(['மாநிலம் (ஆந்திரப் பிரதேசம்)']);
            //expect(service.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
            expect(service.currentIndex).toEqual(100);

            /*             //board
                        expect(service.getSelectedOptions).toHaveBeenCalled();
                        expect(service.getSelectedOptions).toHaveBeenCalledWith(0, ['stateandhrapradesh']);
                        expect(service.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(service.currentIndex).toEqual(20);
            
                        //medium
                        expect(service.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(service.currentIndex).toEqual(20);
            
                        //class
                        expect(service.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(service.currentIndex).toEqual(20);
            
                        //subjects
                        expect(service.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(service.currentIndex).toEqual(20); */

            done();
        }, 20);
    });
    it('#getCurrentUser should return index', (done) => {
        service = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(service.getCurrentUser).toBeDefined();
        spyOn(service, 'getCurrentUser').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            err('error occured');
        });

        service.syllabusList = mockSyllabusList;
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCurrentUser();
        setTimeout(() => {
            expect(service.getCurrentUser).toHaveBeenCalled();
            done();
        }, 20);
    });
    it('#arrayToString  should return comma separated string', () => {
        service = TestBed.get(OnboardingService);
        expect(service.arrayToString).toBeDefined();
        spyOn(service, 'arrayToString').and.callThrough();
        let arr = ['syllabus', 'board',];
        let response = service.arrayToString(arr);
        expect(service.arrayToString).toHaveBeenCalled();
        expect(response).toEqual('syllabus, board');
        expect(typeof response).toBe('string')
    });
    xit('#translateMessage should accept language constant and return translated value of the given key for current language', fakeAsync(() => {
        let translate = TestBed.get(TranslateService);
        service = TestBed.get(OnboardingService);
        const spy = spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        let translatedMessage = service.translateMessage('CANCEL');
        expect(translatedMessage).toEqual('Cancel');
        expect(typeof translatedMessage).toBe('string');
        expect(spy.calls.any()).toEqual(true);
    }));
    it("#getToast should not create ToastController if not passed any message for toast", () => {
        const toastCtrlStub = TestBed.get(ToastController);
        service = TestBed.get(OnboardingService);
        spyOn(toastCtrlStub, "create");
        service.getToast();
        expect(toastCtrlStub.create).not.toHaveBeenCalled();
    });
    it("#getToast should create ToastController", () => {
        const toastCtrlStub = TestBed.get(ToastController);
        service = TestBed.get(OnboardingService);
        spyOn(toastCtrlStub, "create");
        service.getToast('Some Message');
        expect(toastCtrlStub.create).toHaveBeenCalled();
        expect(toastCtrlStub.create).toBeTruthy();
    });
    it('#getListName should syllabuslist of number passed to it, is 0', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListName).toBeDefined();
        spyOn(service, 'getListName').and.callThrough();
        let res = service.getListName(0);
        expect(service.getListName).toHaveBeenCalled();
        expect(res).toEqual('syllabusList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should boardList of number passed to it, is 1', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListName).toBeDefined();
        spyOn(service, 'getListName').and.callThrough();
        let res = service.getListName(1);
        expect(service.getListName).toHaveBeenCalled();
        expect(res).toEqual('boardList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should mediumList of number passed to it, is 2', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListName).toBeDefined();
        spyOn(service, 'getListName').and.callThrough();
        let res = service.getListName(2);
        expect(service.getListName).toHaveBeenCalled();
        expect(res).toEqual('mediumList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should gradeList of number passed to it, is 3', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListName).toBeDefined();
        spyOn(service, 'getListName').and.callThrough();
        let res = service.getListName(3);
        expect(service.getListName).toHaveBeenCalled();
        expect(res).toEqual('gradeList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should subjectList of number passed to it, is 4', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListName).toBeDefined();
        spyOn(service, 'getListName').and.callThrough();
        let res = service.getListName(4);
        expect(service.getListName).toHaveBeenCalled();
        expect(res).toEqual('subjectList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should boardList of number passed to it, is 5', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListName).toBeDefined();
        spyOn(service, 'getListName').and.callThrough();
        let res = service.getListName(5);
        expect(service.getListName).toHaveBeenCalled();
        expect(res).toEqual('boardList');
        expect(typeof res).toBe('string');
    });
    it('#getListArray should assign syllabuslist data to local variable', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListArray).toBeDefined();
        spyOn(service, 'getListArray').and.callThrough();
        service.syllabusList = ['ap_k-12_13'];
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getListArray('syllabusList');
        expect(service.getListArray).toHaveBeenCalled();
        expect(service.onBoardingSlides[0].options).toEqual(['ap_k-12_13']);
    });
    it('#getListArray should assign boardList data to local variable', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListArray).toBeDefined();
        spyOn(service, 'getListArray').and.callThrough();
        service.boardList = ['stateandhrapradesh'];
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getListArray('boardList');
        expect(service.getListArray).toHaveBeenCalled();
        expect(service.onBoardingSlides[1].options).toEqual(['stateandhrapradesh']);
    });
    it('#getListArray should assign mediumList data to local variable', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListArray).toBeDefined();
        spyOn(service, 'getListArray').and.callThrough();
        service.mediumList = ['english'];
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getListArray('mediumList');
        expect(service.getListArray).toHaveBeenCalled();
        expect(service.onBoardingSlides[2].options).toEqual(['english']);
    });
    it('#getListArray should assign gradeList data to local variable', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListArray).toBeDefined();
        spyOn(service, 'getListArray').and.callThrough();
        service.gradeList = ["class10", "class9"];
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getListArray('gradeList');
        expect(service.getListArray).toHaveBeenCalled();
        expect(service.onBoardingSlides[3].options).toEqual(["class10", "class9"]);
    });
    it('#getListArray should assign subjectList data to local variable', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getListArray).toBeDefined();
        spyOn(service, 'getListArray').and.callThrough();
        service.subjectList = ['english', 'marathi'];
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getListArray('subjectList');
        expect(service.getListArray).toHaveBeenCalled();
        expect(service.onBoardingSlides[4].options).toEqual(['english', 'marathi']);
    });
    it('#getSelectedOptions should  return sorted diplay value of given field', () => {
        service = TestBed.get(OnboardingService);
        expect(service.getSelectedOptions).toBeDefined();
        spyOn(service, 'getSelectedOptions').and.callThrough();
        service.categories = mockCategories;
        let res = service.getSelectedOptions(0, ['statemaharashtra']);
        expect(service.getSelectedOptions).toHaveBeenCalled();
        expect(res).toEqual('State (Maharashtra)');
        expect(typeof res).toBe('string');
    });
});