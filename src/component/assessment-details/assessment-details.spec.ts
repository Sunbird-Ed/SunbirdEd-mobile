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
});
