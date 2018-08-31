import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { TermsofservicePage } from "./termsofservice";
import { TranslateModule } from "@ngx-translate/core";

describe("TermsofservicePage", () => {
    let comp: TermsofservicePage;
    let fixture: ComponentFixture<TermsofservicePage>;

    beforeEach(() => {
        const navControllerStub = {};
        const navParamsStub = {};
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [TermsofservicePage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub }
            ]
        });
        fixture = TestBed.createComponent(TermsofservicePage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

});