import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { } from 'jasmine';
import { LoadingController } from 'ionic-angular';
import { ReportService, ServiceProvider, ContentService, TelemetryService, ReportDetailPerUser, ReportDetail } from 'sunbird';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TelemetryGeneratorService } from '../../../service/telemetry-generator.service';
import { UserReportPage } from './user-report';
import { NavMock, NavParamsMock, LoadingControllerMock, TranslateServiceStub } from '../../../../test-config/mocks-ionic';
import { Observable } from 'rxjs';

describe('UserReportPage', () => {
    let comp: UserReportPage;
    let fixture: ComponentFixture<UserReportPage>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [UserReportPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                ReportService, TelemetryGeneratorService, ReportDetailPerUser, ReportDetail,
                ServiceProvider, ContentService, TelemetryService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: TranslateService, useClass: TranslateServiceStub },
            ]
        });
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(UserReportPage);
        comp = fixture.componentInstance;
    });
    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });
    it('IonViewDidLoad should make expected calls', () => {
        const telemeGeneratorStub = TestBed.get(TelemetryGeneratorService);
        spyOn(telemeGeneratorStub, 'generateImpressionTelemetry');
        comp.ionViewDidLoad();

        expect(telemeGeneratorStub.generateImpressionTelemetry).toHaveBeenCalled();
    });
    it('makes expected calls', () => {
        spyOn(Math, 'floor');
        comp.formatTime(1);

        expect(comp.formatTime(1)).toBeDefined();
    });
    it('goBack should make expected calls', () => {
        const navStub = TestBed.get(NavController);
        spyOn(navStub, 'pop');
        comp.goBack();

        expect(navStub.pop).toHaveBeenCalled();
    });
    it('IonViewWillEnter should makes expected calls', () => {
        const reportStub = TestBed.get(ReportService);
        // const reportDetailPerUserStub = TestBed.get(ReportDetailPerUser);
        spyOn(reportStub, 'getDetailReport').and.returnValue(Promise.resolve({}));
        // spyOnProperty(reportDetailPerUserStub, 'reportDetailsList', 'set').and.callThrough();

        comp.ionViewWillEnter();
        expect(reportStub.getDetailReport).toHaveBeenCalled();
        // expect(reportDetailPerUserStub.reportDetailsList).toHaveBeenCalled();
    });
});
