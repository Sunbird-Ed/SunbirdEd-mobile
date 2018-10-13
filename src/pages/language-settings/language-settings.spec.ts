import { } from 'jasmine';
import {
    ComponentFixture,
    TestBed,
    fakeAsync
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import {
    ToastController,
    PopoverController,
    LoadingController
} from 'ionic-angular';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import {
    TranslateService,
    TranslateModule
} from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';
import {
    SharedPreferences, AuthService,
    ProfileService, ServiceProvider,
    FrameworkService, BuildParamService
} from 'sunbird';
import { TelemetryService } from 'sunbird';
import { LanguageSettingsPage } from './language-settings';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AppGlobalService } from '../../service/app-global.service';
import {
    ToastControllerMock,
    PopoverControllerMock,
    LoadingControllerMock,
    EventsMock
} from 'ionic-mocks';
import {
    AppGlobalServiceMock,
    BuildParamaServiceMock
} from '../../../test-config/mocks-ionic';
import { CommonUtilService } from '../../service/common-util.service';

describe('LanguageSettingsPage', () => {
    let comp: LanguageSettingsPage;
    let fixture: ComponentFixture<LanguageSettingsPage>;

    // class ToastControllerMock {
    //     create() { }
    // }
    class Toast {
        present() { }
        dismissAll() { }

    }
    beforeEach(() => {
        const ngZoneStub = {
            run: () => ({})
        };
        const navControllerStub = {
            pop: () => ({}),
            push: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        // const eventsStub = {
        //     publish: () => ({})
        // };

        const translateServiceStub = {
            use: () => ({}),
            get: () => ({
                subscribe: () => ({})
            })
        };
        const translateModuleStub = {
            use: () => ({})
        };
        const authServiceStub = {
            getSessionData: () => ({})
        };
        const globalizationStub = {};
        // const sharedPreferencesStub = {
        //     getString: () => ({}),
        //     putString: () => ({})
        // };
        const telemetryServiceStub = {
            impression: () => ({}),
            interact: () => ({})
        };
        const telemetryGeneratorServiceStub = {
            generateInteractTelemetry: () => ({}),
            generateImpressionTelemetry: () => ({})
        };
        const BuildParamServiceStub = {
            getBuildConfigParam: () => ({})
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [LanguageSettingsPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [ProfileService, ServiceProvider, FrameworkService, Platform,
                CommonUtilService,
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: AuthService, useValue: authServiceStub },
                { provide: BuildParamService, useValue: BuildParamServiceStub },
                { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: TranslateModule, useValue: translateModuleStub },
                { provide: Globalization, useValue: globalizationStub },
                // { provide: SharedPreferences, useValue: sharedPreferencesStub },
                { provide: TelemetryService, useValue: telemetryServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: Events, useFactory: () => EventsMock.instance() },
                { provide: BuildParamService, useClass: BuildParamaServiceMock },
                SharedPreferences

            ]
        });
        fixture = TestBed.createComponent(LanguageSettingsPage);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('languages defaults to: []', () => {
        expect(comp.languages).toEqual([]);
    });

    it('isLanguageSelected defaults to: false', () => {
        expect(comp.isLanguageSelected).toEqual(false);
    });

    it('isFromSettings defaults to: false', () => {
        expect(comp.isFromSettings).toEqual(false);
    });

    it('btnColor defaults to: #55acee', () => {
        expect(comp.btnColor).toEqual('#55acee');
    });

    describe('init', () => {
        it('makes expected calls and value if undefined', (done) => {
            const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
            const sharedPreferencesStub = TestBed.get(SharedPreferences);

            spyOn(comp, 'init').and.callThrough();
            spyOn(sharedPreferencesStub, 'getString').and.returnValue(Promise.resolve(undefined));

            comp.init();

            sharedPreferencesStub.getString().then((val) => {
                expect(comp.previousLanguage).toEqual(undefined);
                expect(sharedPreferencesStub.getString).toHaveBeenCalled();
                expect(comp.previousLanguage).toBeUndefined();
                expect(val).toBe(undefined);
                done();
            });
        });
        it('make expected calls if value is empty', (done) => {
            const sharedPreferencesStub = TestBed.get(SharedPreferences);
            spyOn(comp, 'init').and.callThrough();
            spyOn(sharedPreferencesStub, 'getString').and.returnValue(Promise.resolve(''));

            comp.init();

            sharedPreferencesStub.getString().then((val) => {
                // expect(comp.previousLanguage).toEqual('');
                expect(sharedPreferencesStub.getString).toHaveBeenCalled();
                expect(val).toBe('');
                done();
            });
        });
        it('make expected calls if value is null', (done) => {
            const sharedPreferencesStub = TestBed.get(SharedPreferences);

            spyOn(comp, 'init').and.callThrough();
            spyOn(sharedPreferencesStub, 'getString').and.returnValue(Promise.resolve(null));

            comp.init();

            sharedPreferencesStub.getString().then((val) => {
                //                expect(comp.previousLanguage).toEqual(null);
                expect(sharedPreferencesStub.getString).toHaveBeenCalled();
                expect(val).toBe(null);
                done();
            });
        });
        it('makes expected calls in else part if value is present', (done) => {
            const sharedPreferencesStub = TestBed.get(SharedPreferences);
            spyOn(comp, 'init').and.callThrough();
            spyOn(sharedPreferencesStub, 'getString').and.returnValue(Promise.resolve('en'));

            comp.init();

            sharedPreferencesStub.getString().then((val) => {
                expect(comp.previousLanguage).toEqual('en');
                expect(sharedPreferencesStub.getString).toHaveBeenCalled();
                expect(val).toBe('en');
                done();
            });
        });
    });

    describe('ionViewDidLoad', () => {
        it('makes expected calls', () => {
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);
            spyOn(telemetryGeneratorServiceStub, 'generateImpressionTelemetry');
            comp.ionViewDidLoad();
            expect(telemetryGeneratorServiceStub.generateImpressionTelemetry).toHaveBeenCalled();
        });
    });

    describe('onLanguageSelected', () => {
        it('makes expected calls', () => {
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);

            expect(comp.onLanguageSelected).toBeDefined();

            comp.language = true;
            comp.btnColor = '#006DE5';
            comp.isLanguageSelected = true;

            spyOn(translateServiceStub, 'use');

            comp.onLanguageSelected();

            expect(translateServiceStub.use).toHaveBeenCalled();
            expect(comp.btnColor).toEqual('#006DE5');
            expect(comp.language).toEqual(true);
        });
        it('if the languageSelected is false', () => {
            comp.language = false;
            comp.btnColor = '#8FC4FF';

            expect(comp.onLanguageSelected).toBeDefined();

            comp.onLanguageSelected();
            expect(comp.language).toEqual(false);
            expect(comp.btnColor).toEqual('#8FC4FF');
        });
    });

    describe('continue', () => {
        it(' if isLanguage selected is true then makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const eventsStub: Events = fixture.debugElement.injector.get(Events);
            const sharedPreferencesStub: SharedPreferences = fixture.debugElement.injector.get(SharedPreferences);
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);
            const telemetryGeneratorServiceStub: TelemetryGeneratorService = fixture.debugElement.injector.get(TelemetryGeneratorService);

            expect(comp.continue).toBeDefined();

            spyOn<any>(comp, 'generateContinueClickedInteractEvent');
            spyOn(comp, 'generateLanguageSuccessInteractEvent');
            spyOn(comp, 'continue').and.callThrough();
            spyOn(navControllerStub, 'pop');
            spyOn(translateServiceStub, 'use');
            spyOn(sharedPreferencesStub, 'putString');

            comp.previousLanguage = '';
            comp.isFromSettings = true;
            comp.isLanguageSelected = true;
            comp.language = 'en';
            comp.languages = [
                {
                    'code': 'en',
                    'label': 'English',
                    'isApplied': false
                },
                {
                    'label': 'हिंदी',
                    'code': 'hi',
                    'isApplied': false
                },
                {
                    'label': 'తెలుగు',
                    'code': 'te',
                    'isApplied': false
                },
                {
                    'label': 'தமிழ்',
                    'code': 'ta',
                    'isApplied': false
                },
                {
                    'label': 'मराठी',
                    'code': 'mr',
                    'isApplied': false
                }
            ];

            comp.continue();

            expect(comp.continue).toHaveBeenCalled();
            expect(comp.selectedLanguage).toEqual({
                'code': 'en',
                'label': 'English',
                'isApplied': false
            });
            expect(comp.previousLanguage).not.toBeUndefined();
            expect(comp['generateContinueClickedInteractEvent']).toHaveBeenCalled();
            expect(comp.generateLanguageSuccessInteractEvent).toHaveBeenCalled();
            expect(navControllerStub.pop).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalled();
            expect(translateServiceStub.use).toHaveBeenCalled();
            expect(sharedPreferencesStub.putString).toHaveBeenCalled();
        });
        it('should navigate to the onboarding page if DISPLAY_ONBOARDING_PAGE configuration is set to true', () => {
            comp.isLanguageSelected = true;
            comp.isFromSettings = false;
            const appGlobalServiceStub = TestBed.get(AppGlobalService);
            appGlobalServiceStub.DISPLAY_ONBOARDING_PAGE = true;
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);

            spyOn(comp, 'continue').and.callThrough();
            spyOn(navControllerStub, 'push').and.callThrough();

            comp.continue();

            expect(comp.continue).toHaveBeenCalled();
            expect(navControllerStub.push).toHaveBeenCalled();
            expect(comp.continue).toBeDefined();
        });
        it('It is called for else part for from Settings', () => {
            comp.isLanguageSelected = true;
            comp.isFromSettings = false;
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);

            spyOn(comp, 'continue').and.callThrough();
            spyOn(navControllerStub, 'push').and.callThrough();

            comp.continue();

            expect(comp.continue).toHaveBeenCalled();
            expect(navControllerStub.push).toHaveBeenCalled();
            expect(comp.continue).toBeDefined();
        });
        it('It is for else part of isLanguageSelected', () => {
            comp.isLanguageSelected = false;
            comp.btnColor = '#8FC4FF';

            // const toastMockStub: Toast = fixture.debugElement.injector.get(Toast);
            // const toastControllerStub: ToastController = fixture.debugElement.injector.get(ToastController);

            expect(comp.continue).toBeDefined();

            spyOn<any>(comp, 'generateClickInteractEvent');
            spyOn(comp, 'continue').and.callThrough();
            // spyOn(toastMockStub, "dismissAll");
            // spyOn(toastControllerStub, "create");
            // spyOn(toastMockStub, "present");

            comp.continue();

            expect(comp.btnColor).toEqual('#8FC4FF');
            expect(comp['generateContinueClickedInteractEvent']).toHaveBeenCalled();
            // expect(toastControllerStub.config).toHaveBeenCalled();
            // expect(toastMockStub.present).toHaveBeenCalled();
            // expect(toastControllerStub.create).toHaveBeenCalled();
            // expect(toastMockStub.dismissAll).toHaveBeenCalled();
        });

    });


    describe('ionViewWillEnter', () => {
        it('makes expected calls', () => {

            comp.selectedLanguage = {};
            comp.init();

            expect(comp.ionViewWillEnter).toBeDefined();
            spyOn(comp, 'init').and.callThrough();

            comp.ionViewWillEnter();

            expect(comp.selectedLanguage).toEqual({});
            expect(comp.init).toHaveBeenCalled();
        });
    });

    describe('ionViewWillLeave', () => {
        it('if previousLanguage is true', () => {
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);

            comp.isLanguageSelected = true;
            comp.selectedLanguage.code = undefined;
            comp.previousLanguage = 'mr';

            spyOn(translateServiceStub, 'use');

            comp.ionViewWillLeave();

            expect(translateServiceStub.use).toHaveBeenCalled();
        });
        it('if previousLanguage is false', () => {
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);

            comp.isLanguageSelected = true;
            comp.selectedLanguage.code = undefined;
            comp.previousLanguage = undefined;

            spyOn(translateServiceStub, 'use');

            comp.ionViewWillLeave();

            expect(translateServiceStub.use).toHaveBeenCalled();
        });
    });

    describe('translateMessage', () => {
        it('should call translateMessage', fakeAsync(() => {
            const translate = TestBed.get(TranslateService);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            const spy = spyOn(translate, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });

            const translateMessage = commonUtilServiceStub.translateMessage('CANCEL');

            expect(translateMessage).toEqual('Cancel');
            expect(spy.calls.any()).toEqual(true);
        }));
    });
});
