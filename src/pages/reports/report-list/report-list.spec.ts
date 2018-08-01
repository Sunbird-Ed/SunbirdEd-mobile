import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { ReportService } from "sunbird";
import { ReportSummary } from "sunbird";
import { ReportListPage } from "./report-list";
import {} from 'jasmine';
import {TranslateModule} from '@ngx-translate/core';

describe("ReportListPage", () => {
    let comp: ReportListPage;
    let fixture: ComponentFixture<ReportListPage>;

    beforeEach(() => {
        const navControllerStub = {
            push: () => ({})
        };
        const navParamsStub = {
            get: (key) => ({})
        };
        const loadingControllerStub = {
            create: () => ({
                present: () => ({}),
                dismiss: () => ({})
            })
        };
        const reportServiceStub = {
            getListOfReports: () => ({
                then: () => ({
                    catch: () => ({})
                })
            })
        };
        const reportSummaryStub = {};
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ ReportListPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: LoadingController, useValue: loadingControllerStub },
                { provide: ReportService, useValue: reportServiceStub },
                { provide: ReportSummary, useValue: reportSummaryStub }
            ]
        });
        fixture = TestBed.createComponent(ReportListPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("listOfReports defaults to: []", () => {
        expect(comp.listOfReports).toEqual([]);
    });

    describe("goToGroupReportsList", () => {
        it("calling function to redirect to group list when isFromUsers is true", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
            const reportSummaryStub: ReportSummary = fixture.debugElement.injector.get(ReportSummary);
            comp.isFromUsers = true;
            comp.isFromGroups = false;
            spyOn(navControllerStub, "push");
            comp.goToGroupReportsList(reportSummaryStub);
            expect(navControllerStub.push).toHaveBeenCalled();
        });
        it("calling function to redirect to group list when isFromGroups is true", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
            const reportSummaryStub: ReportSummary = fixture.debugElement.injector.get(ReportSummary);
            comp.isFromUsers = false;
            comp.isFromGroups = true;
            spyOn(navControllerStub, "push");
            spyOn(navParamsStub, "get");
            comp.goToGroupReportsList(reportSummaryStub);
            expect(navControllerStub.push).toHaveBeenCalled();
            expect(navParamsStub.get).toHaveBeenCalled();
        });
    });

    describe("ionViewWillEnter", () => {
        it("makes api call to fetch getListOfReports when response is success", (callback) => {
            const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
            const loadingControllerStub: LoadingController = fixture.debugElement.injector.get(LoadingController);
            const reportServiceStub: ReportService = fixture.debugElement.injector.get(ReportService);
            let response = [{
            }];
            spyOn(navParamsStub, "get");
            spyOn(loadingControllerStub, "create");
            spyOn(reportServiceStub, "getListOfReports").and.returnValue(Promise.resolve(response));
            comp['loading'].create = jasmine.createSpy().and.callFake(function() {
                return {present: function() {}, dismiss: function() {}}
            })
            comp.ionViewWillEnter();
            setTimeout(function() {
                expect(comp.listOfReports.length).toEqual(response.length);
                expect(navParamsStub.get).toHaveBeenCalled();
                expect(loadingControllerStub.create).toHaveBeenCalled();
                expect(reportServiceStub.getListOfReports).toHaveBeenCalled();
                callback()
            }, 100)
        });
    });

    it ('Convert time(second) to mm:ss format', () => {
        let time = 10
        let timeTaken = comp.formatTime(time);
        expect(timeTaken).toBeDefined();
    })

});
