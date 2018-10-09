import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
    TranslateService,
    TranslateModule
} from '@ngx-translate/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { OAuthService } from 'sunbird';
import { ContainerService } from 'sunbird';
import { UserProfileService } from 'sunbird';
import { ProfileService } from 'sunbird';
import { AuthService } from 'sunbird';
import { TelemetryService } from 'sunbird';
import { SharedPreferences } from 'sunbird';
import { Network } from '@ionic-native/network';
import {
    ServiceProvider,
    FrameworkService
} from 'sunbird';
import { SignInCardComponent } from './sign-in-card';
import {
    TranslateServiceStub, NavControllerMock, LoadingControllerMock,
    OAuthServiceMock,
    ContainerServiceMock,
    AuthServiceMock,
    TelemetryServiceMock,
    SharedPreferencesMock,
} from '../../../test-config/mocks-ionic';

describe('SignInCardComponent', () => {
    let comp: SignInCardComponent;
    let fixture: ComponentFixture<SignInCardComponent>;

    const NetworkStub = {
        type: '',
        onConnect: () => ({
            subscribe: () => { }
        }),
        onDisconnect: () => ({
            subscribe: () => { }
        })
    };

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [SignInCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                UserProfileService, ProfileService, Network, ServiceProvider, AppVersion,
                FrameworkService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NavController, useClass: NavControllerMock },
                { provide: LoadingController, useClass: LoadingControllerMock },
                // { provide: AppVersion, useValue: AppVersionMock },
                { provide: OAuthService, useClass: OAuthServiceMock },
                { provide: ContainerService, useClass: ContainerServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: TelemetryService, useClass: TelemetryServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: Network, useValue: NetworkStub },

            ]
        });
        const appVersion = TestBed.get(AppVersion);
        spyOn(appVersion, 'getAppName').and.returnValue(Promise.resolve('Sunbird'));
        spyOn(SignInCardComponent.prototype, 'initText');
        fixture = TestBed.createComponent(SignInCardComponent);
        comp = fixture.componentInstance;

    });
    const getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    };

    xit('can load instance', () => {
        expect(comp).toBeTruthy();
    });
    xit('constructor', () => {
        expect(SignInCardComponent.prototype.initText).toHaveBeenCalled();
    });

    xit('initText', () => {
        expect(comp.initText).toBeDefined();
        const translateServiceStub = TestBed.get(TranslateService);

        spyOn(comp, 'initText').and.callThrough();
        comp.initText();
        expect(translateServiceStub.get).toHaveBeenCalled();
        expect(comp.initText).toHaveBeenCalled();
    });


    xit('singIn expected calls', () => {
        const telemetryServiceMock = TestBed.get(TelemetryService);
        // spyOn(comp, "generateLoginInteractTelemetry");
        expect(comp.singIn).toBeDefined();
        // spyOn(comp, "getLoader");
        // spyOn(telemetryServiceMock, "interact");
        // comp.singIn();
        // expect(comp.generateLoginInteractTelemetry).toHaveBeenCalled();
        // expect(comp.getLoader).toHaveBeenCalled();
        // expect(telemetryServiceMock.interact).toHaveBeenCalled();
        // expect(comp.singIn).toHaveBeenCalled();
    });

    xit('getLoader', () => {

    });
});
