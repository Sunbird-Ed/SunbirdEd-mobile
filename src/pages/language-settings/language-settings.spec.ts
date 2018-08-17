import {} from "jasmine";

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";

import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { Events } from "ionic-angular";
import { ToastController } from "ionic-angular";

import { TranslateService , TranslateModule} from '@ngx-translate/core';
import { Globalization } from "@ionic-native/globalization";
import { SharedPreferences } from "sunbird";
import { TelemetryService } from "sunbird";
import { LanguageSettingsPage } from "./language-settings";
describe("LanguageSettingsPage", () => {
    let comp: LanguageSettingsPage;
    let fixture: ComponentFixture<LanguageSettingsPage>;

class ToastControllerMock {
    create() {}
}
class Toast {
    present() {};
    dismissAll() {};

}
    beforeEach(() => {
        const ngZoneStub = {
            run: () => ({})
        };
        const navControllerStub = {
            pop: () => ({}),
            push: () => ({})
        };
        const navParamsStub = {
            get: () => ({})
        };
        const eventsStub = {
            publish: () => ({})
        };
        const toastControllerStub = {
            create: () => ({
                dismissAll: () => ({}),
                present: () => ({})
            })
        };
        const translateServiceStub = {
            use: () => ({})
        };
        const translateModuleStub = {
            use: () => ({})  
        };
        const globalizationStub = {};
        const sharedPreferencesStub = {
            getString: () => ({}),
            putString: () => ({})
        };
        const telemetryServiceStub = {
            impression: () => ({}),
            interact: () => ({})
        };
        TestBed.configureTestingModule({
            imports:[TranslateModule.forRoot()],
            declarations: [ LanguageSettingsPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
              
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: Events, useValue: eventsStub },
                { provide: ToastController, useValue: toastControllerStub },
                { provide: TranslateService, useValue: translateServiceStub },
                { provide: TranslateModule, useValue: translateModuleStub},  
                { provide: Globalization, useValue: globalizationStub },
                { provide: SharedPreferences, useValue: sharedPreferencesStub },
                { provide: TelemetryService, useValue: telemetryServiceStub }
            ]
        });
        fixture = TestBed.createComponent(LanguageSettingsPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("languages defaults to: []", () => {
        expect(comp.languages).toEqual([]);
    });

    it("isLanguageSelected defaults to: false", () => {
        expect(comp.isLanguageSelected).toEqual(false);
    });

    it("isFromSettings defaults to: false", () => {
        expect(comp.isFromSettings).toEqual(false);
    });

    it("btnColor defaults to: #55acee", () => {
        expect(comp.btnColor).toEqual("#55acee");
    });

    describe("init", () => {
        it("makes expected calls", () => {
            
            const navParamsStub: NavParams = fixture.debugElement.injector.get(NavParams);
            const sharedPreferencesStub: SharedPreferences = fixture.debugElement.injector.get(SharedPreferences);
            spyOn(comp, "generateImpressionEvent");
            
            spyOn(navParamsStub, "get");
            spyOn(sharedPreferencesStub, "getString");
            comp.init();
            expect(comp.generateImpressionEvent).toHaveBeenCalled();
           
            expect(navParamsStub.get).toHaveBeenCalled();
            expect(sharedPreferencesStub.getString).toHaveBeenCalled();
        });
    });
    
    describe("ionViewDidLoad", () => {
        it("makes expected calls", () => {
            const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(TelemetryService);
            spyOn(telemetryServiceStub, "impression");
            comp.ionViewDidLoad();
            expect(telemetryServiceStub.impression).toHaveBeenCalled();
        });
    });

    describe("onLanguageSelected", () => {
        xit("makes expected calls", () => {
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);
            spyOn(translateServiceStub, "use");
            comp.onLanguageSelected();
            expect(translateServiceStub.use).toHaveBeenCalled();
        });
    });

    describe("continue", () => {
        xit("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            const eventsStub: Events = fixture.debugElement.injector.get(Events);
            //const toastControllerStub: ToastController = fixture.debugElement.injector.get(ToastController);
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);
            const sharedPreferencesStub: SharedPreferences = fixture.debugElement.injector.get(SharedPreferences);
            spyOn(comp, "generateInteractEvent");
            spyOn(navControllerStub, "pop");
            spyOn(navControllerStub, "push");
            spyOn(eventsStub, "publish");
            //spyOn(toastControllerStub, "create");
            spyOn(translateServiceStub, "use");
            spyOn(sharedPreferencesStub, "putString");
            comp.continue();
            expect(comp.generateInteractEvent).toHaveBeenCalled();
            expect(navControllerStub.pop).toHaveBeenCalled();
            expect(navControllerStub.push).toHaveBeenCalled();
            expect(eventsStub.publish).toHaveBeenCalled();
            //expect(toastControllerStub.create).toHaveBeenCalled();
            expect(translateServiceStub.use).toHaveBeenCalled();
            expect(sharedPreferencesStub.putString).toHaveBeenCalled();
        });
    });

    describe("generateImpressionEvent", () => {
        it("makes expected calls", () => {
            const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(TelemetryService);
            spyOn(telemetryServiceStub, "impression");
            comp.generateImpressionEvent();
            expect(telemetryServiceStub.impression).toHaveBeenCalled();
        });
    });

    describe("ionViewWillEnter", () => {
        it("makes expected calls", () => {
            spyOn(comp, "init");
            comp.ionViewWillEnter();
            expect(comp.init).toHaveBeenCalled();
        });
    });

    describe("ionViewWillLeave", () => {
        xit("makes expected calls", () => {
            const translateServiceStub: TranslateService = fixture.debugElement.injector.get(TranslateService);
            spyOn(translateServiceStub, "use");
            comp.ionViewWillLeave();
            expect(translateServiceStub.use).toHaveBeenCalled();
        });
    });

});
