import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ViewController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { UpgradePopover } from "./upgrade-popover";
import { } from "jasmine";



describe("UpgradePopover", () => {
    let comp: UpgradePopover;
    let fixture: ComponentFixture<UpgradePopover>;

    beforeEach(() => {
        const viewControllerStub = {
            dismiss: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [UpgradePopover],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: ViewController, useValue: viewControllerStub },
                { provide: NavParams, useValue: navParamsStub }
            ]
        });
        fixture = TestBed.createComponent(UpgradePopover);
        comp = fixture.componentInstance;

        window["genieSdkUtil"] = {
            openPlayStore: (appId) => {}
        }
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("isMandatoryUpgrade defaults to: false", () => {
        expect(comp.isMandatoryUpgrade).toEqual(false);
    });

    it("isMandatoryUpgrade value set to true", () => {
        const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
        spyOn(navParamsStub, "get").and.callFake(() => {
            return { "optional": "forceful" };
        })

        comp.init();

        expect(comp.isMandatoryUpgrade).toEqual(true);
    });

    describe("cancel", () => {
        it("makes expected calls", () => {
            const viewControllerStub: ViewController = fixture.debugElement.injector.get(ViewController);
            spyOn(viewControllerStub, "dismiss")
            comp.cancel();
            expect(viewControllerStub.dismiss).toHaveBeenCalled();
        });
    });

    describe("upgrade", () => {
        it("makes expected upgrade", () => {
            const viewControllerStub: ViewController = fixture.debugElement.injector.get(ViewController);
            spyOn(viewControllerStub, "dismiss");
            spyOn(window["genieSdkUtil"], "openPlayStore");
            comp.upgrade("https://play.google.com/store/apps/details?id=in.gov.diksha.app");
            expect(window["genieSdkUtil"].openPlayStore).toHaveBeenCalled();
            expect(viewControllerStub.dismiss).toHaveBeenCalled();
        });

        it("split the appId from url", () => {
            spyOn(window["genieSdkUtil"], "openPlayStore");
            comp.upgrade("https://play.google.com/store/apps/details?id=in.gov.diksha.app");
            expect(window["genieSdkUtil"].openPlayStore).toHaveBeenCalledWith("in.gov.diksha.app");
        });
    });

});
