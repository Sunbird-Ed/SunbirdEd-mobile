import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController, LoadingController, ToastController, Config, Platform } from 'ionic-angular';
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';
import { SharedPreferences, InteractType, InteractSubtype, ShareUtil, ServiceProvider } from 'sunbird';
import { Impression, ImpressionType, Environment, PageId, TelemetryService } from 'sunbird';
import { generateInteractTelemetry, generateImpressionTelemetry } from '../../app/telemetryutil';
import { PreferenceKey } from '../../app/app.constant';
import { Observable } from 'rxjs/Observable';
import {
    NavMock, AppVersionMock, SocialSharingMock, LoadingControllerMock, TranslateServiceStub,
    SharedPreferencesMock, TelemetryServiceMock, ShareUtilMock
} from '../../../test-config/mocks-ionic';
import { SettingsPage } from './settings';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonUtilService } from '../../service/common-util.service';
import { App } from 'ionic-angular';

describe('SettingsPage', () => {
    let comp: SettingsPage;
    let fixture: ComponentFixture<SettingsPage>;

    // const getLoader = () => {
    //     const loadingController = TestBed.get(LoadingController);
    //     comp.getLoader();
    // };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [SettingsPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ServiceProvider, CommonUtilService, ToastController, App, Config, Platform,
                { provide: NavController, useClass: NavMock },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: AppVersion, useClass: AppVersionMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: TelemetryService, useClass: TelemetryServiceMock },
                { provide: ShareUtil, useClass: ShareUtilMock }
            ]
        });
        fixture = TestBed.createComponent(SettingsPage);
        comp = fixture.componentInstance;
    });
    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    describe('IonViewWillEnter', () => {
        it('makes expected calls', () => {
            const transStub = TestBed.get(TranslateService);
            const appStub = TestBed.get(AppVersion);
            comp.shareAppLabel = 'appName';
            spyOn(transStub, 'get').and.callFake((arg) => {
                return Observable.of('Cancel');
            });
            spyOn(appStub, 'getAppName').and.returnValue(Promise.resolve('true'));
            comp.ionViewWillEnter();
            expect(comp.shareAppLabel).toBe('appName');
        });
    });

    describe('IonViewDidLoad', () => {
        it('makes expected calls', () => {
            const telemeStub = TestBed.get(TelemetryService);
            spyOn(telemeStub, 'impression');
            comp.ionViewDidLoad();
            expect(telemeStub.impression).toHaveBeenCalled();
        });
    });

    describe('IonViewDidEnter', () => {
        it('makes expected calls', () => {
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            const preferStub = TestBed.get(SharedPreferences);

            expect(comp.ionViewDidLoad).toBeDefined();
            spyOn(commonUtilServiceStub, 'translateMessage');
            spyOn(preferStub, 'getString').and.returnValue(Promise.resolve('true'));
            comp.ionViewDidEnter();

            expect(commonUtilServiceStub.translateMessage).toHaveBeenCalled();
            expect(preferStub.getString).toHaveBeenCalled();
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
    describe('language settings', () => {
        it('makes expected calls', () => {
            const navCtrl = TestBed.get(NavController);
            const isFromSettings = true;
            expect(comp.goToLanguageSetting).toBeDefined();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(navCtrl, 'push').and.callThrough();
            comp.goToLanguageSetting();
            expect(comp.generateInteractTelemetry).toHaveBeenCalled();
            expect(isFromSettings).toBe(true);

        });
    });
    describe('dataSync', () => {
        it('makes expected calls', () => {
            const navCtrl = TestBed.get(NavController);
            expect(comp.dataSync).toBeDefined();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(navCtrl, 'push');
            comp.dataSync();

            expect(navCtrl.push).toHaveBeenCalled();
        });
    });

    describe('about us', () => {
        it('makes expected calls', () => {
            const navCtrl = TestBed.get(NavController);
            expect(comp.aboutUs).toBeDefined();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(navCtrl, 'push').and.callThrough();

            comp.aboutUs();

            expect(navCtrl.push).toHaveBeenCalled();
        });
    });
    describe('send Message', () => {
        it('makes expected calls', () => {
            const preferStub = TestBed.get(SharedPreferences);
            const CommonUtilServiceStub = TestBed.get(CommonUtilService);
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(preferStub, 'getString').and.returnValue(Promise.resolve(undefined));
            window['supportfile'] = {
                shareSunbirdConfigurations: () => ({})
            };
            spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
                return result(JSON.stringify({}));
            });
            CommonUtilServiceStub.getLoader();
            comp.sendMessage();
            expect(comp.generateInteractTelemetry).toHaveBeenCalled();
            expect(preferStub.getString).toHaveBeenCalled();
        });
        it('makes expected calls and checks when val is ""', () => {
            const preferStub = TestBed.get(SharedPreferences);
            const CommonUtilServiceStub = TestBed.get(CommonUtilService);
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(preferStub, 'getString').and.returnValue(Promise.resolve(''));
            window['supportfile'] = {
                shareSunbirdConfigurations: () => ({})
            };
            spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
                return result(JSON.stringify({}));
            });
            CommonUtilServiceStub.getLoader();
            comp.sendMessage();
            expect(preferStub.getString).toHaveBeenCalled();
            expect(comp.generateInteractTelemetry).toHaveBeenCalled();

        });
        it('makes expected calls and checks when val is null', () => {
            const preferStub = TestBed.get(SharedPreferences);
            const CommonUtilServiceStub = TestBed.get(CommonUtilService);
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(preferStub, 'getString').and.returnValue(Promise.resolve(null));
            window['supportfile'] = {
                shareSunbirdConfigurations: () => ({})
            };
            spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
                return result(JSON.stringify({}));
            });
            CommonUtilServiceStub.getLoader();
            comp.sendMessage();
            expect(comp.generateInteractTelemetry).toHaveBeenCalled();
            expect(preferStub.getString).toHaveBeenCalled();
        });
        it('makes expected calls in else part when is value is present', () => {
            const preferStub = TestBed.get(SharedPreferences);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            const SocialSharingStub = TestBed.get(SocialSharing);
            comp.fileUrl = 'string';
            window['supportfile'] = {
                shareSunbirdConfigurations: () => ({})
            };
            spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
                return result(JSON.stringify({}));
            });
            commonUtilServiceStub.getLoader();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(preferStub, 'getString').and.returnValue(Promise.resolve('string'));
            spyOn(SocialSharingStub, 'shareViaEmail').and.returnValue(Promise.resolve(''));
            comp.sendMessage();
            expect(comp.generateInteractTelemetry).toHaveBeenCalled();
            expect(preferStub.getString).toHaveBeenCalled();
        });
        it('makes expected calls in social sharing catch part', () => {
            const preferStub = TestBed.get(SharedPreferences);
            const SocialSharingStub = TestBed.get(SocialSharing);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            comp.fileUrl = 'string';
            commonUtilServiceStub.getLoader();
            window['supportfile'] = {
                shareSunbirdConfigurations: () => ({})
            };
            spyOn(window['supportfile'], 'shareSunbirdConfigurations').and.callFake((result, error) => {
                return result(JSON.stringify({}));
            });
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(preferStub, 'getString').and.returnValue(Promise.resolve('string'));
            spyOn(SocialSharingStub, 'shareViaEmail').and.returnValue(Promise.reject());
            comp.sendMessage();
            expect(comp.generateInteractTelemetry).toHaveBeenCalled();
            expect(preferStub.getString).toHaveBeenCalled();
        });
    });
    describe('shareApp', () => {
        it('makes expected calls', () => {
            const shareUtilStub = TestBed.get(ShareUtil);
            const SocialSharingStub = TestBed.get(SocialSharing);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            commonUtilServiceStub.getLoader();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(shareUtilStub, 'exportApk').and.callFake((success, error) => {
                return success('Cancel');
            });
            spyOn(SocialSharingStub, 'share');
            comp.shareApp();
            expect(comp.shareApp).toBeDefined();
            expect(shareUtilStub.success).toBe(undefined);
            expect(shareUtilStub.exportApk).toHaveBeenCalled();
            expect(SocialSharingStub.share).toHaveBeenCalled();
        });
        it('makes expected calls in error part ', () => {
            const shareUtilStub = TestBed.get(ShareUtil);
            const SocialSharingStub = TestBed.get(SocialSharing);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            commonUtilServiceStub.getLoader();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(shareUtilStub, 'exportApk').and.callFake((success, error) => {
                return error('error');
            });
            spyOn(SocialSharingStub, 'share');
            comp.shareApp();
            expect(comp.shareApp).toBeDefined();
            expect(shareUtilStub.error).toBe(undefined);
            expect(shareUtilStub.exportApk).toHaveBeenCalled();
            // expect(SocialSharingStub.share).toHaveBeenCalled();
        });
    });
    describe('generateInteractTelemetry', () => {
        it('makes expected calls', () => {
            const telemeStub = TestBed.get(TelemetryService);
            spyOn(telemeStub, 'interact');

            comp.generateInteractTelemetry('InteractType', 'InteractSubType');
            expect(telemeStub.interact).toHaveBeenCalled();

        });
    });
});

