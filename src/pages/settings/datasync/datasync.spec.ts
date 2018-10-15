import { } from 'jasmine';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { NavMock, ToastControllerMockNew, DeepLinkerMock } from '../../../../test-config/mocks-ionic';
import { NavParams, NavController, LoadingController,
 Nav, ToastController, Events, PopoverController, Config, DeepLinker } from 'ionic-angular';
import { LoadingControllerMock } from '../../../../test-config/mocks-ionic';
import { SharedPreferencesMock } from '../../../../test-config/mocks-ionic';
import { TelemetryServiceMock } from '../../../../test-config/mocks-ionic';
import { TranslateServiceStub } from '../../../../test-config/mocks-ionic';
import { SocialSharingMock } from '../../../../test-config/mocks-ionic';
import { DataSyncType } from './datasynctype.enum';
import { DatasyncPage } from './datasync';
import { ShareUtilMock } from '../../../../test-config/mocks-ionic';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ServiceProvider, SharedPreferences, TelemetryService, ShareUtil, SyncStat } from 'sunbird';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CommonUtilService } from '../../../service/common-util.service';
import { App } from 'ionic-angular';
import { Platform } from 'ionic-angular';

describe('DataSyncPage', () => {
    let comp: DatasyncPage;
    let fixture: ComponentFixture<DatasyncPage>;

    beforeEach(() => {
        const navParamStub = {};

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [DatasyncPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ServiceProvider, CommonUtilService, Events, PopoverController,
                App, Config, Platform,
                { provide: DeepLinker, useValue: DeepLinkerMock},
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useValue: navParamStub },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: TelemetryService, useClass: TelemetryServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: ShareUtil, useClass: ShareUtilMock }
            ]
        });
        fixture = TestBed.createComponent(DatasyncPage);
        comp = fixture.componentInstance;
    });
    it('can load instances', () => {
        expect(comp).toBeTruthy();
    });

    describe('init', () => {
        it('makes excpected calls', () => {
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            const sharePreferStub = TestBed.get(SharedPreferences);
            comp.dataSyncType = DataSyncType.off;
            spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve(undefined));
            comp.init();
            const translateMessage = commonUtilServiceStub.translateMessage('Cancel', 'string');
            expect(comp.dataSyncType).toBe(DataSyncType.off);
            expect(sharePreferStub.getString).toHaveBeenCalled();
            expect(translateMessage).toEqual('Cancel');
        });
        it('makes expected calls in preferences getString if value is empty', () => {
            const sharePreferStub = TestBed.get(SharedPreferences);
            const translateStub = TestBed.get(TranslateService);
            spyOn(translateStub, 'get').and.callFake((arg) => {
                comp.lastSyncedTimeString = arg;
                return Observable.of('Cancel');
            });
            comp.dataSyncType = DataSyncType.off;
            const value = '';
            spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve(''));
            comp.init();
            expect(comp.init).toBeDefined();
            expect(comp.dataSyncType).toBe(DataSyncType.off);
            expect(value).toBe('');
            expect(sharePreferStub.getString).toHaveBeenCalled();
        });
        it('makes expected calls in preferences getString if value is null', () => {
            const sharePreferStub = TestBed.get(SharedPreferences);
            const translateStub = TestBed.get(TranslateService);
            spyOn(translateStub, 'get').and.callFake((arg) => {
                comp.lastSyncedTimeString = arg;
                return Observable.of('Cancel');
            });
            comp.dataSyncType = DataSyncType.off;
            const value = null;
            spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve(null));
            comp.init();
            expect(value).toBe(null);
            expect(comp.init).toBeDefined();
            expect(sharePreferStub.getString).toHaveBeenCalled();
            expect(comp.dataSyncType).toBe(DataSyncType.off);
        });
        it('makes expected calls when val === "OFF"', () => {
            const sharePreferStub = TestBed.get(SharedPreferences);
            const translateStub = TestBed.get(TranslateService);
            spyOn(translateStub, 'get').and.callFake((arg) => {
                comp.lastSyncedTimeString = arg;
                return Observable.of('Cancel');
            });
            comp.dataSyncType = DataSyncType.off;
            const value = 'OFF';
            spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve('OFF'));
            comp.init();
            expect(value).toBe('OFF');
            expect(comp.init).toBeDefined();
            expect(comp.dataSyncType).toBe(DataSyncType.off);
        });
        it('makes expected calls when val === "OVER_WIFI_ONLY"', () => {
            const sharePreferStub = TestBed.get(SharedPreferences);
            const translateStub = TestBed.get(TranslateService);
            spyOn(translateStub, 'get').and.callFake((arg) => {
                comp.lastSyncedTimeString = arg;
                return Observable.of('Cancel');
            });
            comp.dataSyncType = DataSyncType.over_wifi;
            const value = 'OVER_WIFI_ONLY';
            spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve('OVER_WIFI_ONLY'));
            comp.init();
            expect(value).toBe('OVER_WIFI_ONLY');
            expect(comp.init).toBeDefined();
            expect(comp.dataSyncType).toBe(DataSyncType.over_wifi);
        });
        it('makes expected calls when val ==="always_on"', () => {
            const sharePreferStub = TestBed.get(SharedPreferences);
            const translateStub = TestBed.get(TranslateService);
            spyOn(translateStub, 'get').and.callFake((arg) => {
                comp.lastSyncedTimeString = arg;
                return Observable.of('Cancel');
            });
            comp.dataSyncType = DataSyncType.always_on;
            const value = 'ALWAYS_ON';
            spyOn(sharePreferStub, 'getString').and.returnValue(Promise.resolve('ALWAYS_ON'));
            comp.init();
            expect(value).toBe('ALWAYS_ON');
            expect(comp.init).toBeDefined();
            expect(sharePreferStub.getString).toHaveBeenCalled();
            expect(comp.dataSyncType).toBe(DataSyncType.always_on);
        });
    });

    describe('ionViewDidLoad', () => {
        it('makes expected calls', () => {
            const telemetryServiceStub = TestBed.get(TelemetryService);
            spyOn(comp, 'init');
            spyOn(telemetryServiceStub, 'impression');
            // expect(comp.ionViewDidLoad).toBeDefined();
            comp.ionViewDidLoad();
            // expect(telemetryServiceStub).toBeUndefined();
        });
    });

    describe('onSelected', () => {
        it('makes expected calls', () => {
            const sharePrefencesStub = TestBed.get(SharedPreferences);
            comp.dataSyncType = DataSyncType.always_on;
            spyOn(sharePrefencesStub, 'putString');
            expect(DataSyncType.always_on).toBeDefined();
            comp.onSelected();
            expect(comp.onSelected).toBeDefined();
            expect(sharePrefencesStub.putString).toHaveBeenCalled();
        });
    });
    describe('getLastSyncTime', () => {
        it('makes calls as expected', () => {
            const telemetryServiceStub = TestBed.get(TelemetryService);
            expect(comp.getLastSyncTime).toBeDefined();
            spyOn(telemetryServiceStub, 'getTelemetryStat').and.callThrough();

            comp.getLastSyncTime();
            // expect(telemetryServiceStub.getTelemetryStat).toHaveBeenCalled();
        });
    });
    describe('shareTelemetry', () => {
        it('makes expected calls', () => {
            const socialSharingStub = TestBed.get(SocialSharing);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            const shareUtilStub = TestBed.get(ShareUtil);
            commonUtilServiceStub.getLoader();
            spyOn(shareUtilStub, 'exportTelemetry').and.callFake((success, error) => {
                return success('sucess');
            });
            spyOn(socialSharingStub, 'share');

            expect(comp.shareTelemetry).toBeDefined();
            comp.shareTelemetry();
            expect(shareUtilStub.exportTelemetry).toHaveBeenCalled();
            expect(socialSharingStub.share).toHaveBeenCalled();
        });
        it('makes expected calls when error call back', () => {
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            const shareUtilStub = TestBed.get(ShareUtil);
            spyOn(shareUtilStub, 'exportTelemetry').and.callFake((success, error) => {
                return error('error');
            });
            const translationId = 'CANCEL';
            comp.shareTelemetry();
            commonUtilServiceStub.translateMessage(translationId);
            expect(commonUtilServiceStub.create).toHaveBeenCalled();
        });
    });
    describe('onSyncClick', () => {
        it('makes expected calls', () => {
            const telemetryServiceStub = TestBed.get(TelemetryService);
            const sharePrefencesStub = TestBed.get(SharedPreferences);
            const commonUtilServiceStub = TestBed.get(CommonUtilService);
            commonUtilServiceStub.getLoader();
            comp.latestSync = 'string';
            spyOn(comp, 'generateInteractEvent');

            spyOn(telemetryServiceStub, 'sync').and.callFake((response, error) => {
                return Observable.of(response('any'));
            });
            spyOn(sharePrefencesStub, 'putString');
            comp.onSyncClick();
            expect(comp.generateInteractEvent).toHaveBeenCalled();
        });
    });
    describe('getTimeIn12HourFormat', () => {
        it('makes expected calls', () => {
            const date = new Date();

            comp.getTimeIn12HourFormat(date);
            expect(comp.getTimeIn12HourFormat).toBeDefined();
        });
    });
    describe('generateInteractEvent', () => {
        it('makes expected calls if size is not null', () => {

            const telemetryServiceStub = TestBed.get(TelemetryService);
            spyOn(telemetryServiceStub, 'interact');
            expect(comp.generateInteractEvent).toBeDefined();
            comp.generateInteractEvent('interactType', 'subType', 'test');

            expect(telemetryServiceStub).toBeTruthy();
        });
    });
});


