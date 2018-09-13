import { async, TestBed, ComponentFixture, inject } from "@angular/core/testing";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
import {
  IonicModule, NavController, NavParams
} from 'ionic-angular';
import {
  TranslateLoaderMock, NavMock, NavParamsMockNew, SharedPreferencesMock
} from '../../../test-config/mocks-ionic';
import { PipesModule } from "../../pipes/pipes.module";
import { } from 'jasmine';
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { UserTypeSelectionPage } from "./user-type-selection";
import { SharedPreferences, ProfileService, ServiceProvider, TelemetryService, ContainerService, ImpressionType, PageId, Environment, ProfileType, UserSource, TabsPage } from "sunbird";
import { TelemetryGeneratorService } from "../../service/telemetry-generator.service";
import { CommonUtilService } from "../../service/common-util.service";
describe('UserTypeSelectionPage Component', () => {
  let component: UserTypeSelectionPage;
  let fixture: ComponentFixture<UserTypeSelectionPage>;
  let translateService: TranslateService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserTypeSelectionPage],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        IonicModule.forRoot(UserTypeSelectionPage),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        PipesModule,
      ],
      providers: [
        ProfileService, ServiceProvider, TelemetryGeneratorService, TelemetryService,
        ContainerService, CommonUtilService,
        { provide: NavController, useClass: NavMock },
        { provide: NavParams, useClass: NavParamsMockNew },
        { provide: SharedPreferences, useClass: SharedPreferencesMock },

      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTypeSelectionPage);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    inject([TranslateService], (service) => {
      translateService = service;
      translateService.use('en');
    })
  });

  it("#ionViewDidload should generate impression telemetry event", function () {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callThrough().and.callFake(() => { });
    component.ionViewDidLoad();
    expect(telemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(ImpressionType.VIEW, "",
      PageId.USER_TYPE_SELECTION,
      Environment.HOME, "", "", "");
  });

  it("#selectTeacherCard should select teacher card", function () {
    const preference = TestBed.get(SharedPreferences);
    spyOn(preference, 'putString');
    component.selectTeacherCard();
    expect(component.selectedUserType).toBe(ProfileType.TEACHER);
    expect(preference.putString).toHaveBeenCalledWith('selected_user_type', ProfileType.TEACHER);
  });

  it("#selectStudentCard should select student card", function () {
    const preference = TestBed.get(SharedPreferences);
    spyOn(preference, 'putString');
    component.selectStudentCard();
    expect(component.selectedUserType).toBe(ProfileType.STUDENT);
    expect(preference.putString).toHaveBeenCalledWith('selected_user_type', ProfileType.STUDENT);
  });

  it("#continue should navigate to Tabs Page if profile type is same as selected profileType as TEACHER", function () {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push').and.callThrough();
    spyOn(component, 'generateInteractEvent').and.callThrough();
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
    component.profile = { handle: "SAMPLE_NAME", profileType: ProfileType.TEACHER, source: UserSource.LOCAL };
    component.selectedUserType = ProfileType.TEACHER;
    component.continue();
    expect(component.generateInteractEvent).toHaveBeenCalled();
    expect(navController.push).toHaveBeenCalledWith(TabsPage, {
      loginMode: 'guest'
    });
  });

  it("#continue should navigate to Tabs Page if profile type is same as selected profileType as STUDENT", function () {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push').and.callThrough();
    spyOn(component, 'generateInteractEvent').and.callThrough();
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
    component.profile = { handle: "SAMPLE_NAME", profileType: ProfileType.STUDENT, source: UserSource.LOCAL };
    component.selectedUserType = ProfileType.STUDENT;
    component.continue();
    expect(component.generateInteractEvent).toHaveBeenCalled();
    expect(navController.push).toHaveBeenCalledWith(TabsPage, {
      loginMode: 'guest'
    });
  });

  it("#continue should navigate to Tabs Page after updating the profile if profile type is not same as selected profileType", function () {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    const navController = TestBed.get(NavController);
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callThrough().and.callFake((arg, success) => {
      return success();
    });
    spyOn(navController, 'push').and.callThrough();
    spyOn(component, 'generateInteractEvent').and.callThrough();
    spyOn(component, 'updateProfile').and.callThrough();
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
    component.profile = { handle: "SAMPLE_NAME", profileType: ProfileType.STUDENT, source: UserSource.LOCAL };
    component.selectedUserType = ProfileType.TEACHER;
    component.continue();
    expect(component.generateInteractEvent).toHaveBeenCalled();
    expect(component.updateProfile).toHaveBeenCalled();
    expect(navController.push).toHaveBeenCalledWith(TabsPage, {
      loginMode: 'guest'
    });
  });

  it("#continue should handle if error response comes from updateProfile API", function () {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    const navController = TestBed.get(NavController);
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'updateProfile').and.callThrough().and.callFake((arg, success,error) => {
      return error();
    });
    spyOn(navController, 'push').and.callThrough();
    spyOn(component, 'generateInteractEvent').and.callThrough();
    spyOn(component, 'updateProfile').and.callThrough();
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
    component.profile = { handle: "SAMPLE_NAME", profileType: ProfileType.STUDENT, source: UserSource.LOCAL };
    component.selectedUserType = ProfileType.TEACHER;
    component.continue();
    expect(component.generateInteractEvent).toHaveBeenCalled();
    expect(component.updateProfile).toHaveBeenCalled();
    expect(navController.push).not.toHaveBeenCalledWith(TabsPage, {
      loginMode: 'guest'
    });
  });

  it("#continue should create a profile if profile is not available", function () {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    const navController = TestBed.get(NavController);
    const profileService = TestBed.get(ProfileService);
    spyOn(profileService, 'setCurrentProfile').and.callThrough().and.callFake((arg, success,error) => {
      // return success();
    });
    spyOn(navController, 'push').and.callThrough();
    spyOn(component, 'generateInteractEvent').and.callThrough();
    spyOn(component, 'setProfile').and.callThrough();
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callThrough().and.callFake(() => { });
    component.profile = undefined;
    component.continue();
    expect(component.setProfile).toHaveBeenCalled();
    
  });

});
