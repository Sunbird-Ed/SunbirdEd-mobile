import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController, LoadingController } from "ionic-angular";
import { DatasyncPage } from './datasync/datasync';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { AboutUsPage } from './about-us/about-us';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppVersion } from "@ionic-native/app-version";
import { SharedPreferences, InteractType, InteractSubtype, ShareUtil, ServiceProvider } from "sunbird";
import { Impression, ImpressionType, Environment, PageId, TelemetryService } from 'sunbird';
import { generateInteractTelemetry, generateImpressionTelemetry } from '../../app/telemetryutil';
import { PreferenceKey } from '../../app/app.constant';
import { Observable } from 'rxjs/Observable';
import { NavMock, AppVersionMock, SocialSharingMock, LoadingControllerMock, TranslateServiceStub, SharedPreferencesMock, TelemetryServiceMock, ShareUtilMock } from '../../../test-config/mocks-ionic'
import { SettingsPage } from './settings';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('SettingsPage', () => {
    let comp: SettingsPage;
    let fixture: ComponentFixture<SettingsPage>;

    let getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [SettingsPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ServiceProvider,
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
    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    describe("IonViewWillEnter", () => {

    });

    describe("IonViewDidLoad", () => {

    });

    describe("IonViewDidEnter", () => {

    });
    describe("goBack", () => {
        it('makes expected calls ', () => {
            const navStub = TestBed.get(NavController);

            expect(comp.goBack).toBeDefined();
            spyOn(navStub, "pop");

            comp.goBack();
            expect(navStub.pop).toHaveBeenCalled();
        });
    });
    describe("language settings", () => {
        it('makes expected calls', () => {
            const navCtrl = TestBed.get(NavController);
            let isFromSettings = true;
            expect(comp.languageSetting).toBeDefined();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(navCtrl, 'push').and.callThrough();
            comp.languageSetting();

            expect(isFromSettings).toBe(true);

        });
    });
    describe("dataSync", () => {
        it('makes expected calls', () => {
            const navCtrl = TestBed.get(NavController);
            expect(comp.dataSync).toBeDefined();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(navCtrl, 'push');
            comp.dataSync();

            expect(navCtrl.push).toHaveBeenCalled();
        });
    });

    describe("about us", () => {
        it('makes expected calls', () => {
            const navCtrl = TestBed.get(NavController);
            expect(comp.aboutUs).toBeDefined();
            spyOn(comp, 'generateInteractTelemetry');
            spyOn(navCtrl, 'push').and.callThrough();

            comp.aboutUs();

            expect(navCtrl.push).toHaveBeenCalled();
        });
    });
    describe("send Message", () => {

    });
    describe("shareApp", () => {

    });
    describe("getLoader", () => {
        it('makes expected calls', () => {
            const loadControllerStub = TestBed.get(LoadingController);
            expect(comp.getLoader).toBeDefined();

            comp.getLoader();

            expect(loadControllerStub.create).toHaveBeenCalled();
        });
    });
    xdescribe("generateInteractTelemetry", () => {
        xit('makes expected calls', () => {
            const telemeStub = TestBed.get(TelemetryService);
            spyOn(telemeStub, 'interact').and.callThrough();
            expect(comp.generateInteractTelemetry).toBeDefined();

            comp.generateInteractTelemetry('InteractType', 'InteractSubType');
            expect(telemeStub.interact).toHaveBeenCalled();

        });
    });
});

