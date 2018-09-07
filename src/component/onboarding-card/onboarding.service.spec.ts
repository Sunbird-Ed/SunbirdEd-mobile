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
});