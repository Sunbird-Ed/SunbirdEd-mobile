import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { AboutAppPage } from "./about-app";

describe("AboutAppPage", () => {
    let comp: AboutAppPage;
    let fixture: ComponentFixture<AboutAppPage>;

    beforeEach(() => {
        const navControllerStub = {};
        const navParamsStub = {};
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AboutAppPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub }
            ]
        });
        fixture = TestBed.createComponent(AboutAppPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

});
