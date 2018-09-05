/* import { NavParamsMock, ViewControllerMock, PlatformMock } from './../../../test-config/mocks-ionic';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavParams } from "ionic-angular";
import { ViewController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { OnboardingAlert } from "./onboarding-alert";
import { } from 'jasmine';

describe("OnboardingAlert", () => {
    let comp: OnboardingAlert;
    let fixture: ComponentFixture<OnboardingAlert>;

    beforeEach(() => {
        const viewControllerStub = {
            dismiss: () => ({})
        };
        TestBed.configureTestingModule({
            declarations: [OnboardingAlert],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ViewController, useValue: viewControllerStub },
                { provide: Platform, useClass: PlatformMock }
            ]
        });
        const viewControllerMock = TestBed.get(ViewController);
        const platformStub = TestBed.get(Platform);
        spyOn(viewControllerMock, 'dismiss');
        spyOn(platformStub, 'registerBackButtonAction');
        setTimeout(() => {
            OnboardingAlert.prototype.selectedSlide = { options: [] };    
        }, 5);
        
        fixture = TestBed.createComponent(OnboardingAlert);
        comp = fixture.componentInstance;
    });

    it("should load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("should index defaults to: 0", () => {
        expect(comp.index).toEqual(0);
    });

    it("should backButtonFunc defaults to: undefined", () => {
        expect(comp.backButtonFunc).toEqual(undefined);
    });

    it("#onSaveClick should trigger callback save function and close the view", () => {
        const viewControllerStub: ViewController = fixture.debugElement.injector.get(ViewController);
        expect(comp.onSaveClick).toBeDefined();
        spyOn(viewControllerStub, "dismiss").and.callThrough();
        comp['callback'] = {
            save: () => { }
        }
        comp.onSaveClick();
        expect(comp.onSaveClick).toHaveBeenCalled();
        expect(comp['callback'].save).toHaveBeenCalled()
        expect(viewControllerStub.dismiss).toHaveBeenCalled();
    });

    it("#cancel makes expected calls", () => {
        expect(comp.cancel).toBeDefined();
        const viewControllerStub: ViewController = fixture.debugElement.injector.get(ViewController);
        spyOn(viewControllerStub, "dismiss").and.callThrough();
        comp.cancel();
        expect(comp.cancel).toHaveBeenCalled();
        expect(viewControllerStub.dismiss).toHaveBeenCalled();
    });
});
 */