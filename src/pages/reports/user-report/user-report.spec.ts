import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
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
import { myMap } from './user-report.spec.data';
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
        const data = {
            'contentId': 'domain_4083',
            'correctAnswers': 2,
            'hierarchyData': '',
            'noOfQuestions': 5,
            'totalMaxScore': 8,
            'totalScore': 5,
            'totalTimespent': 45,
            'uid': '6e033070-8d74-41bc-bbe7-290ab8b6463a',
            'name': 'कुत्ता और रोटी',
            'lastUsedTime': 1539149638412
        };
        const navParams = TestBed.get(NavParams);
        spyOn(navParams, 'get').and.returnValues(data);
        const reportData = TestBed.get(ReportService);
        spyOn(reportData, 'getDetailReport').and.returnValue(Promise.resolve(myMap));
        comp.ionViewWillEnter();
        expect(reportData.getDetailReport).toHaveBeenCalled();
        setTimeout(() => {
        }, 100);
    });
    it('IonViewWillEnter should not make expected calls', () => {
        const reportData = TestBed.get(ReportService);
        spyOn(reportData, 'getDetailReport').and.returnValue(Promise.reject('Error Occured'));
        comp.ionViewWillEnter();
        expect(reportData.getDetailReport).toHaveBeenCalled();
        expect(comp.assessmentData).not.toBeTruthy();
     });
});
