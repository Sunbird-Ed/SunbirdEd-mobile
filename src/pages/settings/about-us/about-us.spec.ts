import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { DeviceInfoService, SharedPreferences, ServiceProvider } from 'sunbird';
import { TranslateModule } from '@ngx-translate/core';
import { BuildParamService } from 'sunbird';
import { TelemetryService } from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import {
    NavMock, AppVersionMock, LoadingControllerMock,
    SharedPreferencesMock, TelemetryServiceMock, SocialSharingMock
} from '../../../../test-config/mocks-ionic';
import { } from 'jasmine';
import { AboutUsPage } from './about-us';

describe('AboutUsPage', () => {
    let comp: AboutUsPage;
    let fixture: ComponentFixture<AboutUsPage>;

    const getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    };

    beforeEach(() => {
        const navControllerStub = {
            push: () => ({})
        };
        const navParamsStub = {};
        const appVersionStub = {
            getAppName: () => ({
                then: () => ({
                    then: () => ({})
                })
            })
        };
        const deviceInfoServiceStub = {
            getDeviceID: () => ({})
        };
        const buildParamServiceStub = {
            getBuildConfigParam: () => ({})
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AboutUsPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ServiceProvider,
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: AppVersion, useValue: appVersionStub },
                { provide: DeviceInfoService, useValue: deviceInfoServiceStub },
                { provide: BuildParamService, useValue: buildParamServiceStub },
                { provide: TelemetryService, useClass: TelemetryServiceMock }
            ]
        });
        fixture = TestBed.createComponent(AboutUsPage);
        comp = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('ionViewDidLoad', () => {
        it('makes expected calls', () => {
            const appVersionStub: AppVersion = TestBed.get(AppVersion);
            const deviceInfoServiceStub: DeviceInfoService = fixture.debugElement.injector.get(DeviceInfoService);
            spyOn(comp, 'getVersionName');
            spyOn(deviceInfoServiceStub, 'getDeviceID').and.callFake((res, err) => {
                return res('app Name');
            });
            spyOn(appVersionStub, 'getAppName').and.returnValue(Promise.resolve(Promise.resolve({})));
            comp.ionViewDidLoad();
            expect(comp.deviceId).toBe('app Name');
            expect(comp.getVersionName).toBeDefined();
            expect(appVersionStub.getAppName).toHaveBeenCalled();
            expect(deviceInfoServiceStub.getDeviceID).toHaveBeenCalled();
        });
        it('checks if device id got error or not', (done) => {
            const deviceInfoServiceStub: DeviceInfoService = fixture.debugElement.injector.get(DeviceInfoService);
            let error: any;
            error = {};
            spyOn(deviceInfoServiceStub, 'getDeviceID').and.callFake((res, err) => {
                return err(JSON.stringify(error));
            });
            comp.ionViewDidLoad();
            setTimeout(() => {
                expect(deviceInfoServiceStub.getDeviceID).toHaveBeenCalled();
                done();
            }, 10);
        });
    });
    it('#IonViewDidLeave makes expected calls in success part', () => {
        window['supportfile'] = {
            removeFile: () => ({})
        };
        spyOn(window['supportfile'], 'removeFile').and.callFake((result, error) => {
            return result(JSON.stringify({}));
        });
        comp.ionViewDidLeave();
    });
    it('#IonViewDidLoad makes expected calls in error part', () => {
        window['supportfile'] = {
            removeFile: () => ({})
        };
        spyOn(window['supportfile'], 'removeFile').and.callFake((result, error) => {
            return error(JSON.stringify({}));
        });
        comp.ionViewDidLeave();
    });
    it('#shareInformationMethod makes expected calls if value is undefined', () => {
        const preferStub = TestBed.get(SharedPreferences);
        const loadControllerStub = TestBed.get(LoadingController);
        spyOn(comp, 'generateInteractTelemetry');
        spyOn(preferStub, 'getString').and.returnValue(Promise.resolve(undefined));
        window['supportfile'] = {
            shareSunbirdConfigurations: () => ({})
        };
        spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
            return result(JSON.stringify({}));
        });
        getLoader();
        comp.shareInformation();
        expect(loadControllerStub.create).toHaveBeenCalled();
        expect(comp.generateInteractTelemetry).toHaveBeenCalled();
        expect(preferStub.getString).toHaveBeenCalled();
    });
    it('makes expected calls and checks when val is ""', () => {
        const preferStub = TestBed.get(SharedPreferences);
        const loadControllerStub = TestBed.get(LoadingController);
        getLoader();
        spyOn(comp, 'generateInteractTelemetry');
        spyOn(preferStub, 'getString').and.returnValue(Promise.resolve(''));
        window['supportfile'] = {
            shareSunbirdConfigurations: () => ({})
        };
        spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
            return result(JSON.stringify({}));
        });
        getLoader();
        comp.shareInformation();
        expect(preferStub.getString).toHaveBeenCalled();
        expect(loadControllerStub.create).toHaveBeenCalled();
        expect(comp.generateInteractTelemetry).toHaveBeenCalled();

    });
    it('makes expected calls and checks when val is null', () => {
        const preferStub = TestBed.get(SharedPreferences);
        const loadControllerStub = TestBed.get(LoadingController);
        getLoader();
        spyOn(comp, 'generateInteractTelemetry');
        spyOn(preferStub, 'getString').and.returnValue(Promise.resolve(null));
        window['supportfile'] = {
            shareSunbirdConfigurations: () => ({})
        };
        spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
            return result(JSON.stringify({}));
        });
        getLoader();
        comp.shareInformation();
        expect(loadControllerStub.create).toHaveBeenCalled();
        expect(comp.generateInteractTelemetry).toHaveBeenCalled();
        expect(preferStub.getString).toHaveBeenCalled();
    });
    it('makes expected calls in else part when is value is present', () => {
        const preferStub = TestBed.get(SharedPreferences);
        const loadControllerStub = TestBed.get(LoadingController);
        const SocialSharingStub = TestBed.get(SocialSharing);
        comp.fileUrl = 'string';
        getLoader();
        window['supportfile'] = {
            shareSunbirdConfigurations: () => ({})
        };
        spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
            return result(JSON.stringify({}));
        });
        getLoader();
        spyOn(comp, 'generateInteractTelemetry');
        spyOn(preferStub, 'getString').and.returnValue(Promise.resolve('string'));
        spyOn(SocialSharingStub, 'shareViaEmail').and.returnValue(Promise.resolve(''));
        comp.shareInformation();
        expect(loadControllerStub.create).toHaveBeenCalled();
        expect(comp.generateInteractTelemetry).toHaveBeenCalled();
        expect(preferStub.getString).toHaveBeenCalled();
    });
    it('makes expected calls in social sharing catch part', () => {
        const preferStub = TestBed.get(SharedPreferences);
        const loadControllerStub = TestBed.get(LoadingController);
        const SocialSharingStub = TestBed.get(SocialSharing);
        comp.fileUrl = 'string';
        getLoader();
        window['supportfile'] = {
            shareSunbirdConfigurations: () => ({})
        };
        spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
            return result(JSON.stringify({}));
        });
        getLoader();
        spyOn(comp, 'generateInteractTelemetry');
        spyOn(preferStub, 'getString').and.returnValue(Promise.resolve('string'));
        spyOn(SocialSharingStub, 'shareViaEmail').and.returnValue(Promise.reject());
        comp.shareInformation();
        expect(loadControllerStub.create).toHaveBeenCalled();
        expect(comp.generateInteractTelemetry).toHaveBeenCalled();
        expect(preferStub.getString).toHaveBeenCalled();
    });
    it('#generateInteractTelemetry makes expected calls', () => {
        const telemeStub = TestBed.get(TelemetryService);
        spyOn(telemeStub, 'interact');

        comp.generateInteractTelemetry('InteractType', 'InteractSubType');
        expect(telemeStub.interact).toHaveBeenCalled();

    });
    describe('aboutApp', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, 'push');
            comp.aboutApp();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe('termsOfService', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, 'push');
            comp.termsOfService();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe('privacyPolicy', () => {
        it('makes expected calls', () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, 'push');
            comp.privacyPolicy();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });
    it('ShareInformation Button makes expected calls', () => {
    });
    describe('generateImpressionEvent', () => {
        it('makes expected calls', () => {
            const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(TelemetryService);
            spyOn(telemetryServiceStub, 'impression');
            comp.generateImpressionEvent();
            expect(telemetryServiceStub.impression).toHaveBeenCalled();
        });
    });

    describe('AppVersionName', () => {
        it('makes expected calls', (done) => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            spyOn(buildParamServiceStub, 'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
            spyOn(comp, 'getVersionCode');
            comp.getVersionName('AppVersionName');
            buildParamServiceStub.getBuildConfigParam('any').then(() => {
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
                done();
            });
        });
        it('makes expected calls in error callback', fakeAsync(() => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            spyOn(buildParamServiceStub, 'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
            comp.getVersionName('AppVersionName');
            buildParamServiceStub.getBuildConfigParam('any').catch(() => {
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
                expect(buildParamServiceStub.getBuildConfigParam).toBe('');
            });
        }));
    });
    describe('AppVersionCode', () => {
        it('makes expected calls', () => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            const res: any;
            spyOn(buildParamServiceStub, 'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
            comp.getVersionCode('AppVersionName', 'AppVersionCode');
            buildParamServiceStub.getBuildConfigParam('any').then(() => {
                expect(res).toBeUndefined();
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
            });
        });
        it('makes expected calls in error callback', fakeAsync(() => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            spyOn(buildParamServiceStub, 'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
            comp.getVersionCode('AppVersionName', 'AppVersionCode');
            buildParamServiceStub.getBuildConfigParam('any').catch(() => {
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
            });
        }));
    });
});
