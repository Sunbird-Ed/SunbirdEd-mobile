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
    beforeEach(() => {
        const preferenceStub = TestBed.get(SharedPreferences);
        spyOn(preferenceStub, 'getString').and.returnValue(Promise.resolve('en'));
    });

    it("#constructor isOnBoardingCardCompleted defaults to: false", () => {
        let service = TestBed.get(OnboardingService);
        expect(service.isOnBoardingCardCompleted).toEqual(false);
    });

    it("#contructor should fetch current languge", (done) => {
        const preferenceStub = TestBed.get(SharedPreferences);
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
    it('#translateMessage should accept language constant and return translated value of the given key for current language', fakeAsync(() => {
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
    it('#getSyllabusDetails should return syllaus list', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getSyllabusDetails).toBeDefined();
        spyOn(service, 'getSyllabusDetails').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve(mockSyllabusDetails.syllabusDetailsAPIResponse));
        service.getSyllabusDetails().then(() => {
            expect(service.getSyllabusDetails).toHaveBeenCalled();
            expect(service.syllabusList).toEqual(mockSyllabusDetails.syllabusList);
            done();
        });
    });
    it('#getSyllabusDetails should return syllaus list', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getSyllabusDetails).toBeDefined();
        spyOn(service, 'getSyllabusDetails').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getSyllabusList').and.returnValue(Promise.resolve([]));
        /*         service.getSyllabusDetails();
                
                setTimeout(() => {
                    expect(service.getSyllabusDetails).toHaveBeenCalled();
                    expect();
                    done();
                }, 10); */
        let promise = service.getSyllabusDetails();
        promise.then(() => {
            done();
        }).catch((error) => {
            expect(error).toEqual([]);
            done();
        })
    });
    it('#selectedCheckboxValue should filter out selected values and store in local object', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(service.selectedCheckboxValue).toBeDefined();
        spyOn(service, 'selectedCheckboxValue').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockGetFrameworkDetails.getFrameworkAPIResponse));
        spyOn<any>(service, 'setAndSaveDetails');
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.selectedCheckboxValue(mockSelectedSlide, 0);

        setTimeout(() => {
            expect(service.selectedCheckboxValue).toHaveBeenCalled();
            expect(service.onBoardingSlides[0].selectedCode.length).toEqual(0);
            expect(service.onBoardingSlides[0].selectedOptions).toEqual("");
            expect(service['setAndSaveDetails']).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#selectedCheckboxValue should filter out selected values and store in local object, if internet not available', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);

        expect(service.selectedCheckboxValue).toBeDefined();
        spyOn(service, 'selectedCheckboxValue').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.reject('Error occurred'));
        spyOn(service, 'getToast');
        spyOn(service, 'translateMessage').and.returnValue('No internet connectivity, turn on WiFi or mobile data and try again');
        spyOn(service, 'arrayToString').and.returnValue('State (Andhra Pradesh)');
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.syllabusList = mockSyllabusDetails.syllabusListWithSelectedvalue;
        service.selectedCheckboxValue(mockSelectedSlide, 0);

        setTimeout(() => {
            expect(service.selectedCheckboxValue).toHaveBeenCalled();
            expect(service.onBoardingSlides[0].selectedOptions).toEqual('State (Andhra Pradesh)');
            expect(service.arrayToString).toHaveBeenCalled();
            expect(service.getToast).toHaveBeenCalled();
            expect(service.translateMessage).toHaveBeenCalledWith('NEED_INTERNET_TO_CHANGE');
            expect(service.getToast).toHaveBeenCalledWith('No internet connectivity, turn on WiFi or mobile data and try again');
            done();
        }, 10);
    });
    it('#selectedCheckboxValue should filter out selected values and store in local object', (done) => {
        service = TestBed.get(OnboardingService);

        expect(service.selectedCheckboxValue).toBeDefined();
        spyOn(service, 'selectedCheckboxValue').and.callThrough();
        spyOn<any>(service, 'setAndSaveDetails');
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.selectedCheckboxValue(mockSelectedSlide, 1);

        setTimeout(() => {
            expect(service.selectedCheckboxValue).toHaveBeenCalled();
            expect(service['setAndSaveDetails']).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#setAndSaveDetails should save selected details', (done) => {
        service = TestBed.get(OnboardingService);
        const events = TestBed.get(Events);
        expect(service["setAndSaveDetails"]).toBeDefined();

        spyOn<any>(service, 'setAndSaveDetails');
        spyOn(service, 'saveDetails').and.returnValue(Promise.resolve(mockCurrentUserDetails));
        spyOn(events, 'publish');
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service["setAndSaveDetails"](mockSelectedSlide, 0);

        setTimeout(() => {
            expect(service["setAndSaveDetails"]).toHaveBeenCalled();
            expect(service.onBoardingSlides[0].selectedCode).toEqual([]);
            done();
        }, 10);
    });
    it('#checkPrevValue should save the details, and when slide index is greater than 1', () => {
        service = TestBed.get(OnboardingService);
        expect(service.checkPrevValue).toBeDefined();


        spyOn(service, "checkPrevValue").and.callThrough();
        service.checkPrevValue(0, 'syllabusList', undefined, false);

        expect(service.checkPrevValue).toHaveBeenCalled();
    });
    it('#checkPrevValue should save the details, and when slide index is 1 ', (done) => {
        service = TestBed.get(OnboardingService);
        expect(service.checkPrevValue).toBeDefined();

        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        const eventsStub = TestBed.get(Events);
        const translateServiceStub = TestBed.get(TranslateService);

        spyOn(service, "checkPrevValue").and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(eventsStub, 'publish');
        spyOn(service, 'getCategoryData');
        translateServiceStub.currentLang = 'en';
        let catRequest = {
            currentCategory: 'board',
            selectedLanguage: 'en'
        };
        service.checkPrevValue(1, 'boardList', undefined, false);

        setTimeout(() => {
            expect(service.checkPrevValue).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('is-data-available', { show: false, index: 1 });
            expect(service.categories).toEqual(mockCategories);
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.getCategoryData).toHaveBeenCalledWith(catRequest, 'boardList', 1, false);
            done();
        }, 10);
    });
    it('#checkPrevValue should save the details, and when slide index is greater than 1', (done) => {
        service = TestBed.get(OnboardingService);
        expect(service.checkPrevValue).toBeDefined();

        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        const eventsStub = TestBed.get(Events);
        const translateServiceStub = TestBed.get(TranslateService);

        spyOn(service, "checkPrevValue").and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getFrameworkDetails').and.returnValue(Promise.resolve(mockCategories));
        spyOn(eventsStub, 'publish');
        spyOn(service, 'getCategoryData');
        service.categories = mockCategories;
        translateServiceStub.currentLang = 'en';
        let catRequest = {
            currentCategory: 'medium',
            prevCategory: 'board',
            selectedCode: undefined,
            selectedLanguage: 'en'
        };
        service.checkPrevValue(2, 'mediumList', undefined, false);

        setTimeout(() => {
            expect(service.checkPrevValue).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('is-data-available', { show: false, index: 2 });
            expect(service.categories).toEqual(mockCategories);
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.getCategoryData).toHaveBeenCalledWith(catRequest, 'mediumList', 2, false);
            done();
        }, 10);
    });

    it('#saveDetails should make an API call for current category is subject, and it should pick selected values', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        spyOn(eventsStub, 'publish');
        spyOn(service, 'getCurrentUser');
        service.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.gradeList = mockSaveDetails.gradeList;
        service.saveDetails(0);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            expect(service.isOnBoardingCardCompleted).toBe(false);
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: false });
            expect(eventsStub.publish).toHaveBeenCalledWith('refresh:profile');
            expect(service.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call for current category is subject, and it should pick selected values', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        spyOn(eventsStub, 'publish');
        spyOn(service, 'getCurrentUser');
        service.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.gradeList = mockSaveDetails.gradeList;
        service.saveDetails(4);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            expect(service.isOnBoardingCardCompleted).toBe(true);
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: true });
            expect(eventsStub.publish).toHaveBeenCalledWith('refresh:profile');
            expect(service.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call for current category is syllabus but failed to update', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            error('Error occurred');
        });
        service.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.saveDetails(0);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call for current category is board', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        const eventsStub = TestBed.get(Events);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        spyOn(eventsStub, 'publish');
        spyOn(service, 'getCurrentUser');
        service.onBoardingSlides = mockSaveDetails.onBoardingSlides;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.saveDetails(0);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            expect(service.isOnBoardingCardCompleted).toBe(false);
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalledWith('onboarding-card:completed', { isOnBoardingCardCompleted: false });
            expect(eventsStub.publish).toHaveBeenCalledWith('refresh:profile');
            expect(service.getCurrentUser).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.saveDetails(0);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.saveDetails(1);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.saveDetails(2);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#saveDetails should make an API call with old profile fallback data', (done) => {
        service = TestBed.get(OnboardingService);
        const profileService = TestBed.get(ProfileService);
        expect(service.saveDetails).toBeDefined();
        spyOn(service, 'saveDetails').and.callThrough();
        spyOn(profileService, 'updateProfile').and.callFake((req, res, error) => {
            res(JSON.parse(mockCurrentUserDetails));
        });
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.saveDetails(3);
        setTimeout(() => {
            expect(service.saveDetails).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for boardList', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getCategoryData).toBeDefined();
        spyOn(service, 'getCategoryData').and.callThrough();
        spyOn<any>(service, 'setAndSaveDetails');
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([{
            code: "stateandhrapradesh",
            name: "State (Andhra Pradesh)"
        }]));
        let req = {
            currentCategory: "board",
            selectedLanguage: "en"
        }
        service.frameworkId = 'ap_k-12_13';
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCategoryData(req, 'boardList', 1, false);
        setTimeout(() => {
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.boardList.length).toEqual(1);
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for medium (and when it is manual selection)', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getCategoryData).toBeDefined();
        spyOn(service, 'getCategoryData').and.callThrough();
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: "telugu",
                name: "Telugu"
            }, {
                code: "english",
                name: "English"
            }
        ]));
        let req = {
            currentCategory: "medium",
            prevCategory: "board",
            selectedCode: ["stateandhrapradesh"],
            selectedLanguage: "en"
        }
        service.frameworkId = 'ap_k-12_13';
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCategoryData(req, 'mediumList', 2, true);
        setTimeout(() => {
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.mediumList.length).toBeGreaterThan(0);
            expect(service.onBoardingSlides[2].selectedCode.length).toBeGreaterThanOrEqual(1);
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for medium (and when it is automated selection)', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getCategoryData).toBeDefined();
        spyOn(service, 'getCategoryData').and.callThrough();
        spyOn<any>(service, "setAndSaveDetails");
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: "english",
                name: "English"
            }
        ]));
        let req = {
            currentCategory: "medium",
            prevCategory: "board",
            selectedCode: ["stateandhrapradesh"],
            selectedLanguage: "en"
        }
        service.frameworkId = 'ap_k-12_13';
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCategoryData(req, 'mediumList', 2, false);
        setTimeout(() => {
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.mediumList.length).toBeGreaterThan(0);
            expect(service.onBoardingSlides[2].selectedCode.length).toBeGreaterThanOrEqual(3);
            expect(service['mediumList'][0].checked).toBeTruthy();
            expect(service.onBoardingSlides[2].selectedOptions).toEqual('English');
            expect(service.onBoardingSlides[2].selectedCode).toEqual(['english', 'english', 'english']);
            expect(service["setAndSaveDetails"]).toHaveBeenCalled();
            done();
        }, 10);
    });
    it('#getCategoryData should call api to fetch category data for class (and when it is manual selection)', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getCategoryData).toBeDefined();
        spyOn(service, 'getCategoryData').and.callThrough();
        spyOn<any>(service, "setAndSaveDetails");
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: "class9",
                name: "Class 9"
            }
        ]));
        let req = {
            currentCategory: "gradeLevel",
            prevCategory: "medium",
            selectedCode: ["english", "telugu"],
            selectedLanguage: "en"
        }
        service.frameworkId = 'ap_k-12_13';
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCategoryData(req, 'gradeList', 3, false);
        setTimeout(() => {
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.gradeList.length).toBeGreaterThan(0);
            expect(service['gradeList'][0].checked).toBeTruthy();
            expect(service.onBoardingSlides[3].selectedOptions).toEqual('Class 9');
            expect(service.onBoardingSlides[3].selectedCode).toEqual(["class9", "class9"]);
            expect(service.onBoardingSlides[3].selectedCode.length).toBeGreaterThan(0);
            expect(service["setAndSaveDetails"]).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#getCategoryData should call api to fetch category data for subject (and when it is manual selection)', (done) => {
        service = TestBed.get(OnboardingService);
        const formAndFrameworkUtilServiceStub = TestBed.get(FormAndFrameworkUtilService);
        expect(service.getCategoryData).toBeDefined();
        spyOn(service, 'getCategoryData').and.callThrough();
        spyOn<any>(service, "setAndSaveDetails");
        spyOn(formAndFrameworkUtilServiceStub, 'getCategoryData').and.returnValue(Promise.resolve([
            {
                code: "mathematics",
                name: "Mathematics"
            }
        ]));
        let req = {
            currentCategory: "subject",
            prevCategory: "gradelevel",
            selectedCode: ["class9", "class10"],
            selectedLanguage: "en"
        }
        service.frameworkId = 'ap_k-12_13';
        service.profile = JSON.parse(mockCurrentUserDetails);
        service.onBoardingSlides = mockOnBoardingSlideDefaults;
        service.getCategoryData(req, 'subjectList', 4, true);
        setTimeout(() => {
            expect(service.getCategoryData).toHaveBeenCalled();
            expect(service.subjectList.length).toBeGreaterThan(0);
            expect(service['subjectList'][0].checked).toBeTruthy();
            expect(service.onBoardingSlides[4].selectedCode).toEqual(["mathematics"]);
            expect(service.onBoardingSlides[3].selectedCode.length).toBeGreaterThan(0);
            done();
        }, 10);
    });
});