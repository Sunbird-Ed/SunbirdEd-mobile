import { TelemetryGeneratorService } from './../../../service/telemetry-generator.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ReportService, ContentService, ServiceProvider, TelemetryService, ImpressionType, PageId, Environment } from 'sunbird';
import { ReportSummary } from 'sunbird';
import { ReportListPage } from './report-list';
import { mockres } from './reportList.spec.data';
import { } from 'jasmine';
import { TranslateModule } from '@ngx-translate/core';
import { NavControllerMock, LoadingControllerMock, NavParamsMock , NavMock } from '../../../../test-config/mocks-ionic';
describe('ReportListPage', () => {
    let comp: ReportListPage;
    let fixture: ComponentFixture<ReportListPage>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ReportListPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [ContentService, ServiceProvider, ReportService, ReportSummary, TelemetryGeneratorService, TelemetryService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
            ]
        });
        fixture = TestBed.createComponent(ReportListPage);
        comp = fixture.componentInstance;
    });
    it('# should call ionViewDidLoad and resolves promise', (done) => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        const contentService = TestBed.get(ContentService);
        const reportService = TestBed.get(ReportService);
        spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callFake(() => { });
        spyOn(contentService, 'getLocalContents').and.returnValue(Promise.resolve(mockres.contentList));
        spyOn(reportService, 'getListOfReports').and.returnValue(Promise.resolve(mockres.reportListData));
        comp.ionViewDidLoad();
        expect(contentService.getLocalContents).toHaveBeenCalled();
        setTimeout(() => {
        expect(reportService.getListOfReports).toHaveBeenCalled();
        done();
        }, 100);
        expect(telemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(ImpressionType.VIEW, '',
            PageId.REPORTS_ASSESMENT_CONTENT_LIST,
            Environment.USER);

    });
    it('#should call ionViewDidLoad and reject content promise', () => {
        const contentService = TestBed.get(ContentService);
        const reportService = TestBed.get(ReportService);
        spyOn(contentService, 'getLocalContents').and.returnValue(Promise.reject({}));
        comp.ionViewDidLoad();
        expect(contentService.getLocalContents).toHaveBeenCalled();
    });
    it('#should call ionViewDidLoad', (done) => {
        const contentService = TestBed.get(ContentService);
        const reportService = TestBed.get(ReportService);
        spyOn(contentService, 'getLocalContents').and.returnValue(Promise.resolve('requestParams'));
        spyOn(reportService, 'getListOfReports').and.returnValue(Promise.reject({}));
        comp.ionViewDidLoad();
        setTimeout(() => {
        expect(reportService.getListOfReports).toHaveBeenCalled();
        done();
        }, 100);
    });

    it('#formatTime should call format time', () => {
        spyOn(comp, 'formatTime').and.callThrough().and.callFake(() => {
            return {};
        });
        comp.formatTime(1500);
        expect(comp.formatTime).toHaveBeenCalled();

    });

    it('#it should call go to group report list', () => {
        const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
        spyOn(telemetryGeneratorService, 'generateInteractTelemetry');
        const reportList = {
            uid: 'sample_uid',
            contentId: 'sample_content_id',
            name: 'report_name',
            lastUsedTime: 121,
            noOfQuestions: 50,
            correctAnswers: 10,
            totalTimespent: 90,
            hierarchyData: '',
            totalMaxScore: 90,
            totalScore: 0
        };
        comp.goToGroupReportsList(reportList);
        expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalled();
        // expect(comp.goToGroupReportsList).toHaveBeenCalled();

    });
    it('#it should call go to group report list(isFormUsers)', () => {
        const reportList = {
            uid: 'sample_uid',
            contentId: 'sample_content_id',
            name: 'report_name',
            lastUsedTime: 121,
            noOfQuestions: 50,
            correctAnswers: 10,
            totalTimespent: 90,
            hierarchyData: '',
            totalMaxScore: 90,
            totalScore: 0
        };
        const navMock = TestBed.get(NavController);
        spyOn(navMock , 'push');
        comp.isFromUsers = true;
        comp.goToGroupReportsList(reportList);
        expect(navMock.push).toHaveBeenCalled();
        comp.isFromUsers = false;
        comp.isFromGroups = true;
        comp.goToGroupReportsList(reportList);
        expect(navMock.push).toHaveBeenCalled();
    });

});
