import { TelemetryGeneratorService } from './../../../service/telemetry-generator.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavController, Events, PopoverController, Config, DeepLinker } from 'ionic-angular';
import { NavParams, App, LoadingController } from 'ionic-angular';
import {
    ReportService, ServiceProvider, ContentService,
    TelemetryService, AuthService, ProfileService, SharedPreferences, BuildParamService, FrameworkService
} from 'sunbird';
import { ReportSummary, PageId, Environment, InteractType, InteractSubtype } from 'sunbird';
import { GroupReportListPage } from './group-report-list';
import { mockres } from './reportList.spec.data';
import { } from 'jasmine';
import { TranslateModule } from '@ngx-translate/core';
import {
    LoadingControllerMock, NavParamsMock, NavMock, AppMock,
    DeepLinkerMock, AuthServiceMock
} from '../../../../test-config/mocks-ionic';
import { AppGlobalService } from '../../../service/app-global.service';
import { UserReportPage } from '../user-report/user-report';
describe('GroupReportListPage', () => {
    let comp: GroupReportListPage;
    let fixture: ComponentFixture<GroupReportListPage>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [GroupReportListPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [AppGlobalService, ReportService, TelemetryGeneratorService, ReportSummary, PageId, Environment,
                InteractType, InteractSubtype,
                Events, PopoverController, ServiceProvider, ContentService,
                TelemetryService, ProfileService, SharedPreferences, Config, BuildParamService,
                FrameworkService,
                { provide: App, useClass: AppMock },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: DeepLinker, useClass: DeepLinkerMock },
                { provide: AuthService, useClass: AuthServiceMock },
            ]
        });
        fixture = TestBed.createComponent(GroupReportListPage);
        comp = fixture.componentInstance;
    });

    it('#ionViewWillEnter should call fetchAssessment with static args ', () => {
        spyOn(comp, 'fetchAssessment').and.returnValue(true);
        // comp.fetchAssessment('users',false);
        comp.ionViewWillEnter();
        expect(comp.fetchAssessment).toHaveBeenCalledWith('users', false);
    });


    describe('fetchAssessment should be executed,', () => {

        it('#when called with users event and false args with fromUserAssessment object undefined, if block should be invoked', (done) => {
            // TODO call fetchAssessment check if statement to be truthy block invoked
            const reportService = TestBed.get(ReportService);

            spyOn(comp, 'fetchAssessment').and.callThrough();
            spyOn(reportService, 'getReportsByUser').and.callFake(({ }, success, error) => {
                const data = JSON.stringify((mockres.getReportsByUser));
                return success(data);
            });
            comp.fetchAssessment('users', false);
            expect(comp.fetchAssessment).toHaveBeenCalled();


            setTimeout(() => {
                expect(reportService.getReportsByUser).toHaveBeenCalled();
                done();
            }, 100);

            expect(comp.fromUserAssessment).toBeTruthy();

        });
        it('#fromUserAssessment should remain undefined', (done) => {

            const reportService = TestBed.get(ReportService);

            spyOn(comp, 'fetchAssessment').and.callThrough();
            spyOn(reportService, 'getReportsByUser').and.callFake(({ }, success, error) => {
                const data = JSON.stringify({ error: 'error for testing ' });
                return error(data);
            });
            comp.fetchAssessment('users', false);
            expect(comp.fetchAssessment).toHaveBeenCalled();


            setTimeout(() => {
                expect(reportService.getReportsByUser).toHaveBeenCalled();
                done();
            }, 100);

            expect(comp.fromUserAssessment).not.toBeTruthy();

        });
        it('#when called with questions event and false args, else block should be invoked', (done) => {
            // TODO call fetchAssessment check if block invoked
            const reportService = TestBed.get(ReportService);

            spyOn(comp, 'fetchAssessment').and.callThrough();
            spyOn(reportService, 'getReportsByQuestion').and.callFake(({ }, success, error) => {
                const data = JSON.stringify((mockres.getReportsByQuestion));
                return success(data);
            });
            comp.fetchAssessment('questions', false);
            expect(comp.fetchAssessment).toHaveBeenCalled();


            setTimeout(() => {
                expect(reportService.getReportsByQuestion).toHaveBeenCalled();
                done();
            }, 100);

            expect(comp.fromQuestionAssessment).toBeTruthy();

        });

        it('#when called with questions event property getReportsByQuestion should remain undefined', (done) => {
            // TODO call fetchAssessment check if block invoked
            const reportService = TestBed.get(ReportService);

            spyOn(comp, 'fetchAssessment').and.callThrough();
            spyOn(reportService, 'getReportsByQuestion').and.callFake(({ }, success, error) => {
                const data = JSON.stringify({ error: 'error for testing ' });
                return error(data);
            });
            comp.fetchAssessment('questions', false);
            expect(comp.fetchAssessment).toHaveBeenCalled();


            setTimeout(() => {
                expect(reportService.getReportsByQuestion).toHaveBeenCalled();
                done();
            }, 100);

            expect(comp.fromQuestionAssessment).not.toBeTruthy();

        });

    });



    it('#formatTime should give time in desired format', () => {
        // TODO call with number argument and get time in proper format
        const test = comp.formatTime(61);
        expect(test).toBe('01:01');
    });

    it('#showQuestionFromUser should invoke fetchAssessment', () => {
        // TODO mock call to  showQuestionFromUser should invoke fetchAssessment
        spyOn(comp, 'fetchAssessment');
        comp.showQuestionFromUser();
        expect(comp.fetchAssessment).toHaveBeenCalled();
    });

    it('#translateMessage should translate to desired lang', () => {
        // TODO call to  translateMessage should do desired translation
    });


    it('#goToReportList should push UserReportPage', () => {
        // TODO call to  goToReportList mock navpush to UserReportPage
        const data = {
            'contentId': 'domain_4083',
            'correctAnswers': 4,
            'hierarchyData': '',
            'noOfQuestions': 5,
            'totalMaxScore': 8,
            'totalScore': 4,
            'totalTimespent': 24,
            'uid': 'ed0a5346-6d68-4860-a2d3-566642fb7438',
            'name': 'कुत्ता और रोटी',
            'lastUsedTime': 1539153195484
        };
        const navController = TestBed.get(NavController);
        const navParams = TestBed.get(NavParams);
        spyOn(navParams, 'get').and.returnValue(data);

        spyOn(navController, 'push');
        comp.goToReportList();
        expect(navController.push).toHaveBeenCalledWith(UserReportPage, { 'report': data });
    });

});
