import { ProfileSettingsPage } from './profile-settings';
import { Observable } from 'rxjs/Observable';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppGlobalService } from "../../service/app-global.service";
import { ProfileService, AuthService, TelemetryService, ServiceProvider, BuildParamService, FrameworkService } from "sunbird";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { FormBuilder } from "@angular/forms";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { FormAndFrameworkUtilService } from "../profile/formandframeworkutil.service";
import { CategoryRequest } from "sunbird";
import { SharedPreferences } from "sunbird";
import { LoadingController, PopoverController } from "ionic-angular";
import { Events } from "ionic-angular";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";

import {
    LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, AuthServiceMock, NavMock, NavParamsMock, profileServiceMock,
    SharedPreferencesMock, FormAndFrameworkUtilServiceMock, EventsMock, AppGlobalServiceMock, TelemetryServiceMock, PopoverControllerMock
} from '../../../test-config/mocks-ionic';

describe("ProfileSettingsPage", () => {
    let comp: ProfileSettingsPage;
    let fixture: ComponentFixture<ProfileSettingsPage>;

    beforeEach(() => {
        
        const categoryRequestStub = {
            currentCategory: {}
        };
        
        const telemetryGeneratorServiceStub = {};

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [ ProfileSettingsPage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                FormBuilder, TelemetryGeneratorService, TelemetryService, ServiceProvider, SharedPreferences, BuildParamService,
                FrameworkService,
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: ProfileService, useClass: profileServiceMock },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: FormAndFrameworkUtilService, useClass: FormAndFrameworkUtilServiceMock },
                { provide: CategoryRequest, useValue: categoryRequestStub },
                // { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: Events, useClass: EventsMock },
                // { provide: TelemetryGeneratorService, useValue: telemetryGeneratorServiceStub },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }
            ]
        });
        spyOn(ProfileSettingsPage.prototype, 'initUserForm');
        spyOn(ProfileSettingsPage.prototype, 'getGuestUser');
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        fixture = TestBed.createComponent(ProfileSettingsPage);
        comp = fixture.componentInstance;
    });

    it("can load instance", () => {
        expect(comp).toBeTruthy();
    });

});
