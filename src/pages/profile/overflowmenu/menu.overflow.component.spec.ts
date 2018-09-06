import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavParams, Events, PopoverController, Platform } from "ionic-angular";
import { ViewController } from "ionic-angular";
import { App } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { OAuthService, ServiceProvider, AuthService, BuildParamService, FrameworkService } from "sunbird";
import { SharedPreferences } from "sunbird";
import { ContainerService } from "sunbird";
import { TelemetryService } from "sunbird";
import { ProfileService } from "sunbird";
import { Network } from "@ionic-native/network";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { AppGlobalService } from "../../../service/app-global.service";
import { OverflowMenuComponent } from "./menu.overflow.component";
import {
    NavParamsMock, PopoverControllerMock,
    ViewControllerMock, ToastControllerMockNew,
    SharedPreferencesMock,
    ContainerServiceMock,
    TelemetryServiceMock,
    profileServiceMock,
    TranslateServiceStub,
    AppGlobalServiceMock,
    AuthServiceMock,
    BuildParamaServiceMock,
    appMock,
    AppMock
} from "../../../../test-config/mocks-ionic";
import { Observable } from "rxjs";
import { Config } from "ionic-angular";

describe("OverflowMenuComponent", () => {
    let comp: OverflowMenuComponent;
    let fixture: ComponentFixture<OverflowMenuComponent>;

    beforeEach(() => {
        const TelemetryGeneratorServiceStub = {
            generateInteractTelemetry: () => ({})
        };
        const OAuthServiceStub = {
            doLogOut(): Promise<any> {
                return new Promise((resolve) => {
                    resolve('value');
                });
            }
        };
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [OverflowMenuComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                Network, ServiceProvider, Events, FrameworkService, Config, Platform,
                { provide: BuildParamService, useClass: BuildParamaServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ViewController, useClass: ViewControllerMock },
                { provide: App, useClass: AppMock },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: ContainerService, useClass: ContainerServiceMock },
                { provide: TelemetryService, useClass: TelemetryServiceMock },
                { provide: ProfileService, useClass: profileServiceMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: TelemetryGeneratorService, useValue: TelemetryGeneratorServiceStub },
                { provide: OAuthService, useValue: OAuthServiceStub }
            ]
        });
        fixture = TestBed.createComponent(OverflowMenuComponent);
        comp = fixture.componentInstance;
    });
    it('can load instance', () => {
        expect(comp).toBeTruthy()
    });

    it('show toast method makes expected calls', () => {
        const toastStub = TestBed.get(ToastController);
        const navStub = TestBed.get(NavParams);
        comp.items = ['list'];
        spyOn(navStub, 'get');
        comp.showToast(toastStub, "i");
        expect(navStub.get).toHaveBeenCalled();
    });
    describe('close function makes expected calls', () => {
        it('makes expected calls ', () => {
            const viewStub = TestBed.get(ViewController);

            spyOn(viewStub, 'dismiss').and.returnValue(Promise.resolve(JSON.stringify({})));
            comp.close(event, 1);
            expect(viewStub.dismiss).toHaveBeenCalled();
        });
    });
    describe('navigate page', () => {
        it('makes expected calls', () => {

            const appGlobalStub = TestBed.get(AppGlobalService);
            appGlobalStub.DISPLAY_ONBOARDING_PAGE = true;
            const appStub = TestBed.get(App);
            spyOn(appStub, 'getRootNav').and.callThrough();
            
            comp.navigateToAptPage();
            expect(appStub.getRootNav).toHaveBeenCalled();
        });

    });
    it('translate Message to have been called', () => {
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        comp.translateMessage('any');
        expect(translate.get).toHaveBeenCalled();
    });

    it('generateLogoutInteractTelemetry', () => {
        const telemetrySub = TestBed.get(TelemetryService);
        spyOn(telemetrySub, 'interact');
        comp.generateLogoutInteractTelemetry('type', 'subType', 'uid');

        expect(telemetrySub.interact).toHaveBeenCalled();
    });
});
