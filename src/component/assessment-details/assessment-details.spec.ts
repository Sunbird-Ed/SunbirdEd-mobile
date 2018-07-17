import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AssessmentDetailsComponent } from "./assessment-details";

describe("AssessmentDetailsComponent", () => {
    let comp: AssessmentDetailsComponent;
    let fixture: ComponentFixture<AssessmentDetailsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ AssessmentDetailsComponent ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });
        fixture = TestBed.createComponent(AssessmentDetailsComponent);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("columns defaults to: []", () => {
        expect(comp.columns).toEqual([]);
    });

    it("rows defaults to: []", () => {
        expect(comp.rows).toEqual([]);
    });

    describe("ngOnInit", () => {
        it("makes expected calls", () => {
            spyOn(comp, "convertTotalTime");
            comp.ngOnInit();
            expect(comp.convertTotalTime).toHaveBeenCalled();
        });
    });

});
