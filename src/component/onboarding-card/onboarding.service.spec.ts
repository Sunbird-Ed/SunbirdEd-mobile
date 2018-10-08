import { fakeAsync } from '@angular/core/testing';
import {
    mockCurrentUserDetails,
    mockCategories,
    mockOnBoardingSlideDefaults,
    mockSyllabusList,
    mockSyllabusDetails,
    mockSelectedSlide,
    mockGetFrameworkDetails,
    mockSaveDetails
} from './onboarding.data.spec';
import {
    ServiceProvider,
    FrameworkService,
    BuildParamService,
    FormService,
    AuthService,
    TelemetryService
} from 'sunbird';
import { OnboardingService } from './onboarding.service';
import {
    Injectable
} from '@angular/core';
import {
    Events,
    PopoverController
} from 'ionic-angular';
import {
    ProfileService,
    SharedPreferences,
} from 'sunbird';
import { FormAndFrameworkUtilService } from '../../pages/profile/formandframeworkutil.service';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { PopoverControllerMock } from 'ionic-mocks';
import {
    TranslateServiceStub,
    ToastControllerMock,
    FormAndFrameworkUtilServiceMock,
    EventsMock
} from '../../../test-config/mocks-ionic';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { Observable } from 'rxjs';

describe('OnBoarding.service', () => {
    let onboardingService: OnboardingService;

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
    beforeEach(() => {
        const preferenceStub = TestBed.get(SharedPreferences);
        spyOn(preferenceStub, 'getString').and.returnValue(Promise.resolve('en'));
    });

    it('#constructor isOnBoardingCardCompleted defaults to: false', () => {
        const service = TestBed.get(OnboardingService);
        expect(service.isOnBoardingCardCompleted).toEqual(false);
    });

    it('#contructor should fetch current languge', (done) => {
        const preferenceStub = TestBed.get(SharedPreferences);
        onboardingService = TestBed.get(OnboardingService);
        setTimeout(() => {
            expect(onboardingService.selectedLanguage).toEqual('en');
            done();
        }, 10);
    });

    it('#initializeCard should return promise of index', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(onboardingService.initializeCard).toBeDefined();
        spyOn(onboardingService, 'initializeCard').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            res(mockCurrentUserDetails);
        });
        spyOn(onboardingService, 'initializeSlides');
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(onboardingService, 'getCurrentUser').and.returnValue(Promise.resolve(3));
        onboardingService.slideIndex = -1;
        onboardingService.initializeCard();

        expect(onboardingService.initializeCard).toHaveBeenCalled();
        setTimeout(() => {
            expect(onboardingService.profile).toEqual(JSON.parse(mockCurrentUserDetails));
            expect(onboardingService.initializeSlides).toHaveBeenCalled();
            expect(onboardingService.categories).toEqual(mockCategories);
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            expect(onboardingService.slideIndex).toEqual(3);
            done();
        }, 10);
    });

    it('#initializeCard should return promise with reject', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(onboardingService.initializeCard).toBeDefined();
        spyOn(onboardingService, 'initializeCard').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            res(mockCurrentUserDetails);
        });
        spyOn(onboardingService, 'initializeSlides');
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(onboardingService, 'getCurrentUser').and.returnValue(Promise.reject('error occured'));
        onboardingService.slideIndex = -1;
        onboardingService.initializeCard();

        expect(onboardingService.initializeCard).toHaveBeenCalled();
        setTimeout(() => {
            expect(onboardingService.profile).toEqual(JSON.parse(mockCurrentUserDetails));
            expect(onboardingService.initializeSlides).toHaveBeenCalled();
            expect(onboardingService.categories).toEqual(mockCategories);
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#initializeCard should return error of getcurrentUser', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(onboardingService.initializeCard).toBeDefined();
        spyOn(onboardingService, 'initializeCard').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            err('error');
        });
        onboardingService.slideIndex = -1;
        onboardingService.initializeCard();

        setTimeout(() => {
            expect(onboardingService.initializeCard).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#initializeCard should return index', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(onboardingService.initializeCard).toBeDefined();
        spyOn(onboardingService, 'initializeCard').and.callThrough();
        onboardingService.slideIndex = 2;
        onboardingService.initializeCard().then((index) => {
            expect(index).toEqual(2);
            done();
        });
    });

    it('#initializeSlides should assign default data', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.initializeSlides).toBeDefined();
        spyOn(onboardingService, 'initializeSlides').and.callThrough();
        onboardingService.initializeSlides();
        expect(onboardingService.initializeSlides).toHaveBeenCalled();
        expect(onboardingService.onBoardingSlides).toEqual(mockOnBoardingSlideDefaults);
    });

    it('#getCurrentUser should return index', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(onboardingService.getCurrentUser).toBeDefined();
        spyOn(onboardingService, 'getCurrentUser').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            res(mockCurrentUserDetails);
        });
        spyOn(onboardingService, 'arrayToString');
        spyOn(onboardingService, 'getSelectedOptions');

        onboardingService.syllabusList = mockSyllabusList;
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCurrentUser();
        setTimeout(() => {
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            expect(profileServiceStub.getCurrentUser).toHaveBeenCalled();
            expect(onboardingService.profile).toEqual(JSON.parse(mockCurrentUserDetails));

            // Syllabus
            expect(onboardingService.arrayToString).toHaveBeenCalled();
            expect(onboardingService.arrayToString).toHaveBeenCalledWith(['மாநிலம் (ஆந்திரப் பிரதேசம்)']);
            // expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
            expect(onboardingService.currentIndex).toEqual(100);

            /*             //board
                        expect(onboardingService.getSelectedOptions).toHaveBeenCalled();
                        expect(onboardingService.getSelectedOptions).toHaveBeenCalledWith(0, ['stateandhrapradesh']);
                        expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(onboardingService.currentIndex).toEqual(20);

                        //medium
                        expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(onboardingService.currentIndex).toEqual(20);

                        //class
                        expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(onboardingService.currentIndex).toEqual(20);

                        //subjects
                        expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('மாநிலம் (ஆந்திரப் பிரதேசம்)');
                        expect(onboardingService.currentIndex).toEqual(20); */

            done();
        }, 20);
    });
    it('#getCurrentUser should return index', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileServiceStub = TestBed.get(ProfileService);

        expect(onboardingService.getCurrentUser).toBeDefined();
        spyOn(onboardingService, 'getCurrentUser').and.callThrough();
        spyOn(profileServiceStub, 'getCurrentUser').and.callFake((res, err) => {
            err('error occured');
        });

        onboardingService.syllabusList = mockSyllabusList;
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCurrentUser();
        setTimeout(() => {
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            done();
        }, 20);
    });
    it('#arrayToString  should return comma separated string', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.arrayToString).toBeDefined();
        spyOn(onboardingService, 'arrayToString').and.callThrough();
        const arr = ['syllabus', 'board',];
        const response = onboardingService.arrayToString(arr);
        expect(onboardingService.arrayToString).toHaveBeenCalled();
        expect(response).toEqual('syllabus, board');
        expect(typeof response).toBe('string');
    });
    it('#translateMessage should accept language constant and return translated value of the given key for current language',
        fakeAsync(() => {
            const translate = TestBed.get(TranslateService);
            onboardingService = TestBed.get(OnboardingService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            const translatedMessage = service.translateMessage('CANCEL');
            expect(translatedMessage).toEqual('Cancel');
            expect(typeof translatedMessage).toBe('string');
            expect(spy.calls.any()).toEqual(true);
        }));
    it('#getToast should not create ToastController if not passed any message for toast', () => {
        const toastCtrlStub = TestBed.get(ToastController);
        onboardingService = TestBed.get(OnboardingService);
        spyOn(toastCtrlStub, 'create');
        onboardingService.getToast();
        expect(toastCtrlStub.create).not.toHaveBeenCalled();
    });
    it('#getToast should create ToastController', () => {
        const toastCtrlStub = TestBed.get(ToastController);
        onboardingService = TestBed.get(OnboardingService);
        spyOn(toastCtrlStub, 'create');
        onboardingService.getToast('Some Message');
        expect(toastCtrlStub.create).toHaveBeenCalled();
        expect(toastCtrlStub.create).toBeTruthy();
    });
    it('#getListName should syllabuslist of number passed to it, is 0', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListName).toBeDefined();
        spyOn(onboardingService, 'getListName').and.callThrough();
        const res = onboardingService.getListName(0);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(res).toEqual('syllabusList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should boardList of number passed to it, is 1', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListName).toBeDefined();
        spyOn(onboardingService, 'getListName').and.callThrough();
        const res = onboardingService.getListName(1);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(res).toEqual('boardList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should mediumList of number passed to it, is 2', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListName).toBeDefined();
        spyOn(onboardingService, 'getListName').and.callThrough();
        const res = onboardingService.getListName(2);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(res).toEqual('mediumList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should gradeList of number passed to it, is 3', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListName).toBeDefined();
        spyOn(onboardingService, 'getListName').and.callThrough();
        const res = onboardingService.getListName(3);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(res).toEqual('gradeList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should subjectList of number passed to it, is 4', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListName).toBeDefined();
        spyOn(onboardingService, 'getListName').and.callThrough();
        const res = onboardingService.getListName(4);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(res).toEqual('subjectList');
        expect(typeof res).toBe('string');
    });
    it('#getListName should boardList of number passed to it, is 5', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListName).toBeDefined();
        spyOn(onboardingService, 'getListName').and.callThrough();
        const res = onboardingService.getListName(5);
        expect(onboardingService.getListName).toHaveBeenCalled();
        expect(res).toEqual('boardList');
        expect(typeof res).toBe('string');
    });
    it('#getListArray should assign syllabuslist data to local variable', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListArray).toBeDefined();
        spyOn(onboardingService, 'getListArray').and.callThrough();
        onboardingService.syllabusList = ['ap_k-12_13'];
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getListArray('syllabusList');
        expect(onboardingService.getListArray).toHaveBeenCalled();
        expect(onboardingService.onBoardingSlides[0].options).toEqual(['ap_k-12_13']);
    });
    it('#getListArray should assign boardList data to local variable', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListArray).toBeDefined();
        spyOn(onboardingService, 'getListArray').and.callThrough();
        onboardingService.boardList = ['stateandhrapradesh'];
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getListArray('boardList');
        expect(onboardingService.getListArray).toHaveBeenCalled();
        expect(onboardingService.onBoardingSlides[1].options).toEqual(['stateandhrapradesh']);
    });
    it('#getListArray should assign mediumList data to local variable', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListArray).toBeDefined();
        spyOn(onboardingService, 'getListArray').and.callThrough();
        onboardingService.mediumList = ['english'];
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getListArray('mediumList');
        expect(onboardingService.getListArray).toHaveBeenCalled();
        expect(onboardingService.onBoardingSlides[2].options).toEqual(['english']);
    });
    it('#getListArray should assign gradeList data to local variable', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListArray).toBeDefined();
        spyOn(onboardingService, 'getListArray').and.callThrough();
        onboardingService.gradeList = ['class10', 'class9'];
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getListArray('gradeList');
        expect(onboardingService.getListArray).toHaveBeenCalled();
        expect(onboardingService.onBoardingSlides[3].options).toEqual(['class10', 'class9']);
    });
    it('#getListArray should assign subjectList data to local variable', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getListArray).toBeDefined();
        spyOn(onboardingService, 'getListArray').and.callThrough();
        onboardingService.subjectList = ['english', 'marathi'];
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getListArray('subjectList');
        expect(onboardingService.getListArray).toHaveBeenCalled();
        expect(onboardingService.onBoardingSlides[4].options).toEqual(['english', 'marathi']);
    });
    it('#getSelectedOptions should  return sorted diplay value of given field', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.getSelectedOptions).toBeDefined();
        spyOn(onboardingService, 'getSelectedOptions').and.callThrough();
        onboardingService.categories = mockCategories;
        const res = onboardingService.getSelectedOptions(0, ['statemaharashtra']);
        expect(onboardingService.getSelectedOptions).toHaveBeenCalled();
        expect(res).toEqual('State (Maharashtra)');
        expect(typeof res).toBe('string');
    });
    it('#getSyllabusDetails should return syllaus list', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getSyllabusDetails).toBeDefined();
        spyOn(onboardingService, 'getSyllabusDetails').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub,
            'getSyllabusList').and.returnValue(Promise.resolve(mockSyllabusDetails.syllabusDetailsAPIResponse));
        onboardingService.getSyllabusDetails().then(() => {
            expect(onboardingService.getSyllabusDetails).toHaveBeenCalled();
            expect(onboardingService.syllabusList).toEqual(mockSyllabusDetails.syllabusList);
            done();
        });
    });
    it('#getSyllabusDetails should return syllaus list', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getSyllabusDetails).toBeDefined();
        spyOn(onboardingService, 'getSyllabusDetails').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve([]));
        /*         onboardingService.getSyllabusDetails();

                setTimeout(() => {
                    expect(onboardingService.getSyllabusDetails).toHaveBeenCalled();
                    expect();
                    done();
                }, 10); */
        const promise = onboardingService.getSyllabusDetails();
        promise.then(() => {
            done();
        }).catch((error) => {
            expect(error).toEqual([]);
            done();
        });
    });
    it('#selectedCheckboxValue should filter out selected values and store in local object', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(onboardingService.selectedCheckboxValue).toBeDefined();
        spyOn(onboardingService, 'selectedCheckboxValue').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails')
            .and.returnValue(Promise.resolve(mockGetFrameworkDetails.getFrameworkAPIResponse));
        spyOn<any>(onboardingService, 'setAndSaveDetails');
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.selectedCheckboxValue(mockSelectedSlide, 0);

        setTimeout(() => {
            expect(onboardingService.selectedCheckboxValue).toHaveBeenCalled();
            expect(onboardingService.onBoardingSlides[0].selectedCode.length).toEqual(0);
            expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('');
            expect(onboardingService['setAndSaveDetails']).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#selectedCheckboxValue should filter out selected values and store in local object, if internet not available', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(onboardingService.selectedCheckboxValue).toBeDefined();
        spyOn(onboardingService, 'selectedCheckboxValue').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.reject('Error occurred'));
        spyOn(onboardingService, 'getToast');
        spyOn(onboardingService, 'translateMessage').and.returnValue('No internet connectivity, turn on WiFi or mobile data and try again');
        spyOn(onboardingService, 'arrayToString').and.returnValue('State (Andhra Pradesh)');
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.syllabusList = mockSyllabusDetails.syllabusListWithSelectedvalue;
        onboardingService.selectedCheckboxValue(mockSelectedSlide, 0);

        setTimeout(() => {
            expect(onboardingService.selectedCheckboxValue).toHaveBeenCalled();
            expect(onboardingService.onBoardingSlides[0].selectedOptions).toEqual('State (Andhra Pradesh)');
            expect(onboardingService.arrayToString).toHaveBeenCalled();
            expect(onboardingService.getToast).toHaveBeenCalled();
            expect(onboardingService.translateMessage).toHaveBeenCalledWith('NEED_INTERNET_TO_CHANGE');
            expect(onboardingService.getToast).toHaveBeenCalledWith('No internet connectivity, turn on WiFi or mobile data and try again');
            done();
        }, 10);
    });
    it('#selectedCheckboxValue should filter out selected values and store in local object', (done) => {
        onboardingService = TestBed.get(OnboardingService);

        expect(onboardingService.selectedCheckboxValue).toBeDefined();
        spyOn(onboardingService, 'selectedCheckboxValue').and.callThrough();
        spyOn<any>(onboardingService, 'setAndSaveDetails');
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.selectedCheckboxValue(mockSelectedSlide, 1);

        setTimeout(() => {
            expect(onboardingService.selectedCheckboxValue).toHaveBeenCalled();
            expect(onboardingService['setAndSaveDetails']).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#setAndSaveDetails should save selected details', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const events = TestBed.get(Events);
        expect(onboardingService['setAndSaveDetails']).toBeDefined();

        spyOn<any>(onboardingService, 'setAndSaveDetails');
        spyOn(onboardingService, 'saveDetails').and.returnValue(Promise.resolve(mockCurrentUserDetails));
        spyOn(events, 'publish');
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService['setAndSaveDetails'](mockSelectedSlide, 0);

        setTimeout(() => {
            expect(onboardingService['setAndSaveDetails']).toHaveBeenCalled();
            expect(onboardingService.onBoardingSlides[0].selectedCode).toEqual([]);
            done();
        }, 10);
    });
    it('#checkPrevValue should save the details, and when slide index is greater than 1', () => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.checkPrevValue).toBeDefined();


        spyOn(onboardingService, 'checkPrevValue').and.callThrough();
        onboardingService.checkPrevValue(0, 'syllabusList', undefined, false);

        expect(onboardingService.checkPrevValue).toHaveBeenCalled();
    });
    it('#checkPrevValue should save the details, and when slide index is 1 ', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.checkPrevValue).toBeDefined();

        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        const eventsStub = TestBed.get(Events);
        const translateServiceStub = TestBed.get(TranslateService);

        spyOn(onboardingService, 'checkPrevValue').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(eventsStub, 'publish');
        spyOn(onboardingService, 'getCategoryData');
        translateServiceStub.currentLang = 'en';
        const catRequest = {
            currentCategory: 'board',
            selectedLanguage: 'en'
        };
        onboardingService.checkPrevValue(1, 'boardList', undefined, false);

        setTimeout(() => {
            expect(onboardingService.checkPrevValue).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('is-data-available', { show: false, index: 1 });
            expect(onboardingService.categories).toEqual(mockCategories);
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.getCategoryData).toHaveBeenCalledWith(catRequest, 'boardList', 1, false);
            done();
        }, 10);
    });
    it('#checkPrevValue should save the details, and when slide index is greater than 1', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        expect(onboardingService.checkPrevValue).toBeDefined();

        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        const eventsStub = TestBed.get(Events);
        const translateServiceStub = TestBed.get(TranslateService);

        spyOn(onboardingService, 'checkPrevValue').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(eventsStub, 'publish');
        spyOn(onboardingService, 'getCategoryData');
        onboardingService.categories = mockCategories;
        translateServiceStub.currentLang = 'en';
        const catRequest = {
            currentCategory: 'medium',
            prevCategory: 'board',
            selectedCode: undefined,
            selectedLanguage: 'en'
        };
        onboardingService.checkPrevValue(2, 'mediumList', undefined, false);

        setTimeout(() => {
            expect(onboardingService.checkPrevValue).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('is-data-available', { show: false, index: 2 });
            expect(onboardingService.categories).toEqual(mockCategories);
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.getCategoryData).toHaveBeenCalledWith(catRequest, 'mediumList', 2, false);
            done();
        }, 10);
    });

    it('#saveDetails should make an API call for current category is subject, and it should pick selected values', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        spyOn(eventsStub, 'publish');
        spyOn(onboardingService, 'getCurrentUser');
        onboardingService.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.gradeList = mockSaveDetails.gradeList;
        onboardingService.saveDetails(0);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            expect(onboardingService.isOnBoardingCardCompleted).toBe(false);
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: false });
            expect(eventsStub.publish).toHaveBeenCalledWith('refresh:profile');
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call for current category is subject, and it should pick selected values', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        spyOn(eventsStub, 'publish');
        spyOn(onboardingService, 'getCurrentUser');
        onboardingService.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.gradeList = mockSaveDetails.gradeList;
        onboardingService.saveDetails(4);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            expect(onboardingService.isOnBoardingCardCompleted).toBe(true);
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: true });
            expect(eventsStub.publish).toHaveBeenCalledWith('refresh:profile');
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call for current category is syllabus but failed to update', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            error('Error occurred');
        });
        onboardingService.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.saveDetails(0);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call for current category is board', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        spyOn(eventsStub, 'publish');
        spyOn(onboardingService, 'getCurrentUser');
        onboardingService.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.saveDetails(0);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            expect(onboardingService.isOnBoardingCardCompleted).toBe(false);
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: false });
            expect(eventsStub.publish).toHaveBeenCalledWith('refresh:profile');
            expect(onboardingService.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.saveDetails(0);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.saveDetails(1);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.saveDetails(2);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(onboardingService.saveDetails).toBeDefined();
        spyOn(onboardingService, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.saveDetails(3);
        setTimeout(() => {
            expect(onboardingService.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for boardList', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getCategoryData).toBeDefined();
        spyOn(onboardingService, 'getCategoryData').and.callThrough();
        spyOn<any>(onboardingService, 'setAndSaveDetails');
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([{
            code: 'stateandhrapradesh',
            name: 'State (Andhra Pradesh)'
        }]));
        const req = {
            currentCategory: 'board',
            selectedLanguage: 'en'
        };
        onboardingService.frameworkId = 'ap_k-12_13';
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCategoryData(req, 'boardList', 1, false);
        setTimeout(() => {
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.boardList.length).toEqual(1);
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for medium (and when it is manual selection)', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getCategoryData).toBeDefined();
        spyOn(onboardingService, 'getCategoryData').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: 'telugu',
                name: 'Telugu'
            }, {
                code: 'english',
                name: 'English'
            }
        ]));
        const req = {
            currentCategory: 'medium',
            prevCategory: 'board',
            selectedCode: ['stateandhrapradesh'],
            selectedLanguage: 'en'
        };
        onboardingService.frameworkId = 'ap_k-12_13';
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCategoryData(req, 'mediumList', 2, true);
        setTimeout(() => {
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.mediumList.length).toBeGreaterThan(0);
            expect(onboardingService.onBoardingSlides[2].selectedCode.length).toBeGreaterThanOrEqual(1);
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for medium (and when it is automated selection)', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getCategoryData).toBeDefined();
        spyOn(onboardingService, 'getCategoryData').and.callThrough();
        spyOn<any>(onboardingService, 'setAndSaveDetails');
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: 'english',
                name: 'English'
            }
        ]));
        const req = {
            currentCategory: 'medium',
            prevCategory: 'board',
            selectedCode: ['stateandhrapradesh'],
            selectedLanguage: 'en'
        };
        onboardingService.frameworkId = 'ap_k-12_13';
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCategoryData(req, 'mediumList', 2, false);
        setTimeout(() => {
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.mediumList.length).toBeGreaterThan(0);
            expect(onboardingService.onBoardingSlides[2].selectedCode.length).toBeGreaterThanOrEqual(3);
            expect(onboardingService['mediumList'][0].checked).toBeTruthy();
            expect(onboardingService.onBoardingSlides[2].selectedOptions).toEqual('English');
            expect(onboardingService.onBoardingSlides[2].selectedCode).toEqual(['english', 'english', 'english']);
            expect(onboardingService['setAndSaveDetails']).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for class (and when it is manual selection)', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getCategoryData).toBeDefined();
        spyOn(onboardingService, 'getCategoryData').and.callThrough();
        spyOn<any>(onboardingService, 'setAndSaveDetails');
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: 'class9',
                name: 'Class 9'
            }
        ]));
        const req = {
            currentCategory: 'gradeLevel',
            prevCategory: 'medium',
            selectedCode: ['english', 'telugu'],
            selectedLanguage: 'en'
        };
        onboardingService.frameworkId = 'ap_k-12_13';
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCategoryData(req, 'gradeList', 3, false);
        setTimeout(() => {
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.gradeList.length).toBeGreaterThan(0);
            expect(onboardingService['gradeList'][0].checked).toBeTruthy();
            expect(onboardingService.onBoardingSlides[3].selectedOptions).toEqual('Class 9');
            expect(onboardingService.onBoardingSlides[3].selectedCode).toEqual(['class9', 'class9']);
            expect(onboardingService.onBoardingSlides[3].selectedCode.length).toBeGreaterThan(0);
            expect(onboardingService['setAndSaveDetails']).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#getCategoryData should call api to fetch category data for subject (and when it is manual selection)', (done) => {
        onboardingService = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(onboardingService.getCategoryData).toBeDefined();
        spyOn(onboardingService, 'getCategoryData').and.callThrough();
        spyOn<any>(onboardingService, 'setAndSaveDetails');
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: 'mathematics',
                name: 'Mathematics'
            }
        ]));
        const req = {
            currentCategory: 'subject',
            prevCategory: 'gradelevel',
            selectedCode: ['class9', 'class10'],
            selectedLanguage: 'en'
        };
        onboardingService.frameworkId = 'ap_k-12_13';
        onboardingService.profile = JSON.parse(mockCurrentUserDetails);
        onboardingService.onBoardingSlides = mockOnBoardingSlideDefaults;
        onboardingService.getCategoryData(req, 'subjectList', 4, true);
        setTimeout(() => {
            expect(onboardingService.getCategoryData).toHaveBeenCalled();
            expect(onboardingService.subjectList.length).toBeGreaterThan(0);
            expect(onboardingService['subjectList'][0].checked).toBeTruthy();
            expect(onboardingService.onBoardingSlides[4].selectedCode).toEqual(['mathematics']);
            expect(onboardingService.onBoardingSlides[3].selectedCode.length).toBeGreaterThan(0);
            done();
        }, 10);
    });
});
