import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { AppVersion } from "@ionic-native/app-version";
import { DeviceInfoService } from "sunbird";
import { TranslateModule } from "@ngx-translate/core";
import { BuildParamService } from "sunbird";
import { TelemetryService } from "sunbird";
import { AboutUsPage } from "./about-us";

describe("AboutUsPage", () => {
    let comp: AboutUsPage;
    let fixture: ComponentFixture<AboutUsPage>;
    let buildService;

    beforeEach(() => {
        const navControllerStub = {
            push: () => ({})
        };
        const navParamsStub = {};
        const appVersionStub = {
            getAppName: () => ({
                then: () => ({
                    then: () => ({})
                })
            })
        };
        const deviceInfoServiceStub = {
            getDeviceID: () => ({})
        };
        const buildParamServiceStub = {
            getBuildConfigParam: () => ({})
        };
        const telemetryServiceStub = {
            impression: () => ({})
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [AboutUsPage],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: NavController, useValue: navControllerStub },
                { provide: NavParams, useValue: navParamsStub },
                { provide: AppVersion, useValue: appVersionStub },
                { provide: DeviceInfoService, useValue: deviceInfoServiceStub },
                { provide: BuildParamService, useValue: buildParamServiceStub },
                { provide: TelemetryService, useValue: telemetryServiceStub }
            ]
        });
        fixture = TestBed.createComponent(AboutUsPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

    describe("ionViewDidLoad", () => {
        it("makes expected calls", () => {
            const appVersionStub: AppVersion = TestBed.get(AppVersion);
            const deviceInfoServiceStub: DeviceInfoService = fixture.debugElement.injector.get(DeviceInfoService);
            spyOn(comp, "getVersionName");
            spyOn(deviceInfoServiceStub, "getDeviceID").and.callFake((res, err) => {
                return res("app Name");
            });
            spyOn(appVersionStub, 'getAppName').and.returnValue(Promise.resolve(Promise.resolve({})));
            comp.ionViewDidLoad();
            expect(comp.deviceId).toBe("app Name");
            expect(comp.getVersionName).toBeDefined();
            expect(appVersionStub.getAppName).toHaveBeenCalled();
            expect(deviceInfoServiceStub.getDeviceID).toHaveBeenCalled();
        });
        xit("checks if device id got error or not", () => {
            const deviceInfoServiceStub: DeviceInfoService = fixture.debugElement.injector.get(DeviceInfoService);
            var error: any;
            error = {};
            spyOn(deviceInfoServiceStub, "getDeviceID").and.callFake((res, err) => {
                return err(JSON.stringify(error));
            });
            comp.ionViewDidLoad();
            setTimeout(() => {
                expect(deviceInfoServiceStub.getDeviceID).toEqual({});
            }, 100);
            expect(deviceInfoServiceStub.getDeviceID).toHaveBeenCalled();
        });
    });

    describe("aboutApp", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, "push");
            comp.aboutApp();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe("termsOfService", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, "push");
            comp.termsOfService();
            expect(navControllerStub.push).toHaveBeenCalled();
        });
    });

    describe("privacyPolicy", () => {
        it("makes expected calls", () => {
            const navControllerStub: NavController = fixture.debugElement.injector.get(NavController);
            spyOn(navControllerStub, "push");
            comp.privacyPolicy();
            expect(navControllerStub.push).toHaveBeenCalled();
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

    describe("AppVersionName", () => {
        it("makes expected calls", (done) => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            spyOn(buildParamServiceStub, "getBuildConfigParam").and.returnValue(Promise.resolve('true'));
            spyOn(comp, "getVersionCode");
            comp.getVersionName("AppVersionName");
            buildParamServiceStub.getBuildConfigParam('any').then(() => {
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
                done();
            });
        });
        it("makes expected calls in error callback", fakeAsync(() => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            spyOn(buildParamServiceStub, "getBuildConfigParam").and.returnValue(Promise.resolve('true'));
            comp.getVersionName("AppVersionName");
            buildParamServiceStub.getBuildConfigParam('any').catch(() => {
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
                expect(buildParamServiceStub.getBuildConfigParam).toBe("");
            });
        }));
    });
    describe("AppVersionCode", () => {
        it("makes expected calls", () => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            var res: any;
            spyOn(buildParamServiceStub, 'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
            comp.getVersionCode("AppVersionName", "AppVersionCode");
            buildParamServiceStub.getBuildConfigParam('any').then(() => {
                expect(res).toBeUndefined();
                expect(buildParamServiceStub.getBuildConfigParam).toHaveBeenCalled();
            });
        });
        it("makes expected calls in error callback", fakeAsync(() => {
            const buildParamServiceStub: BuildParamService = fixture.debugElement.injector.get(BuildParamService);
            spyOn(buildParamServiceStub,'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
            comp.getVersionCode("AppVersionName", "AppVersionCode");
            buildParamServiceStub.getBuildConfigParam('any').catch(()=>{
                expect(comp.getVersionCode).toContain("");
            });
        }));
    })
});
