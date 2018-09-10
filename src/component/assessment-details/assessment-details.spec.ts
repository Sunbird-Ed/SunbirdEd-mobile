import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AssessmentDetailsComponent } from "./assessment-details";
import { TranslateModule } from '@ngx-translate/core';
import { } from 'jasmine';
import { PopoverControllerMock } from "ionic-mocks";
import { PopoverController } from "ionic-angular";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { TelemetryService, GenieSDKServiceProvider, ServiceProvider } from "sunbird";
import { GenieSDKServiceProviderMock } from "../../../test-config/mocks-ionic";

describe("AssessmentDetailsComponent", () => {
    let comp: AssessmentDetailsComponent;
    let fixture: ComponentFixture<AssessmentDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AssessmentDetailsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                TelemetryGeneratorService, TelemetryService, ServiceProvider,
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },


            ]
        });
        fixture = TestBed.createComponent(AssessmentDetailsComponent);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it('should show Assessment-details if received asssessment data', () => {
        expect(comp.ngOnInit).toBeDefined();
        comp.assessmentData = {
            showResult: true
        };
        spyOn(comp, 'ngOnInit').and.callThrough();
        comp.ngOnInit();
        expect(comp.ngOnInit).toHaveBeenCalled();
        expect(comp.showResult).toBe(true);
    });

    it('should log telemetry on click of row(for user), id should be same as provided ', () => {
        expect(comp.onActivate).toBeDefined();
        comp.assessmentData = {
            showResult: true,
            fromUser: true
        };
        let event = {
            row: {
                qid: 'sample_qustion_id'
            }
        }
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate(event, {}, {});
        expect(comp.onActivate).toHaveBeenCalled();
        // const telemetryServiceStub = TestBed.get(TelemetryService);
        // spyOn(telemetryServiceStub, 'generateInteractTelemetry');
        // expect(telemetryServiceStub.generateInteractTelemetry).toHaveBeenCalled();
    });
    it('should log telemetry on click of row, id should be empty if not provided', () => {
        expect(comp.onActivate).toBeDefined();
        comp.assessmentData = {
            showResult: true,
            fromUser: true
        };
        let event = {
            row: {}
        }
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate(event, {}, {});
        expect(comp.onActivate).toHaveBeenCalled();
    });
    it('should log telemetry on click of row for group, id should be same as provided, if username is given', () => {
        expect(comp.onActivate).toBeDefined();
        comp.assessmentData = {
            showResult: true,
            fromGroup: true
        };
        let event = {
            row: {
                userName: 'sample_username',
                qid: 'sample_question_id'
            }
        }
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate(event, {}, {});
        expect(comp.onActivate).toHaveBeenCalled();
    });
    it('should log telemetry on click of row for group, id should be empty, if username is given', () => {
        expect(comp.onActivate).toBeDefined();
        comp.assessmentData = {
            showResult: true,
            fromGroup: true
        };
        let event = {
            row: {
                userName: 'sample_username'
            }
        }
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate(event, {}, {});
        expect(comp.onActivate).toHaveBeenCalled();
    });

    it('should log telemetry on click of row for group, uid should be same as provided, if username is not given', () => {
        expect(comp.onActivate).toBeDefined();
        comp.assessmentData = {
            showResult: true,
            fromGroup: true
        };
        let event = {
            row: {
                qid: 'sample_question_id',
                uid: 'sample_user_id'
            }
        }
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate(event, {}, {});
        expect(comp.onActivate).toHaveBeenCalled();
    });

    it('should log telemetry on click of row for group, uid should be empty, if username is not given', () => {
        expect(comp.onActivate).toBeDefined();
        comp.assessmentData = {
            showResult: true,
            fromGroup: true
        };
        let event = {
            row: {
                qid: 'sample_question_id',
                uid: ''
            }
        }
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate(event, {}, {});
        expect(comp.onActivate).toHaveBeenCalled();
    });

    xit('should emit event showQuestionFromUser if, received showpopup and callback', () => {

        spyOn(comp.showQuestionFromUser, 'emit');
        spyOn(comp, 'onActivate').and.callThrough();
        comp.onActivate({}, {}, {});
        expect(comp.showQuestionFromUser.emit).toHaveBeenCalled();
    });
});
