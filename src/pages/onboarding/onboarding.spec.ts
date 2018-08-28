import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { NavController, Navbar } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { Platform } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Events } from "ionic-angular";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { OAuthService } from "sunbird";
import { ContainerService } from "sunbird";
import { UserProfileService } from "sunbird";
import { ProfileService } from "sunbird";
import { AuthService } from "sunbird";
import { TelemetryService } from "sunbird";
import { SharedPreferences } from "sunbird";
import { AppVersion } from "@ionic-native/app-version";
import { OnboardingPage } from "./onboarding";
import { } from "jasmine";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";

describe("OnboardingPage", () => {
  let comp: OnboardingPage;
  let fixture: ComponentFixture<OnboardingPage>;

  beforeEach(() => {
    const navControllerStub = {
      setRoot: () => ({}),
      push: () => ({})
    };
    const loadingControllerStub = {
      create: () => ({})
    };
    const platformStub = {
      registerBackButtonAction: () => ({})
    };
    const toastControllerStub = {
      create: () => ({})
    };
    const eventsStub = {
      publish: () => ({})
    };
    const translateServiceStub = {
      get: () => ({
        subscribe: () => ({})
      })
    };
    const oAuthServiceStub = {};
    const containerServiceStub = {};
    const userProfileServiceStub = {
      getTenantInfo: () => ({})
    };
    const profileServiceStub = {
      setCurrentProfile: () => ({})
    };
    const authServiceStub = {};
    const telemetryServiceStub = {
      impression: () => ({}),
      interact: () => ({})
    };
    const sharedPreferencesStub = {
      getString: () => ({})
    };
    const appVersionStub = {
      getAppName: () => ({
        then: () => ({})
      })
    };
    const navBarStub = {
      backButtonClick: () => ({})
    };

    TestBed.configureTestingModule({
      declarations: [OnboardingPage],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerStub },
        { provide: LoadingController, useValue: loadingControllerStub },
        { provide: Platform, useValue: platformStub },
        { provide: ToastController, useValue: toastControllerStub },
        { provide: Events, useValue: eventsStub },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: OAuthService, useValue: oAuthServiceStub },
        { provide: ContainerService, useValue: containerServiceStub },
        { provide: UserProfileService, useValue: userProfileServiceStub },
        { provide: ProfileService, useValue: profileServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: TelemetryService, useValue: telemetryServiceStub },
        { provide: SharedPreferences, useValue: sharedPreferencesStub },
        { provide: AppVersion, useValue: appVersionStub },
        { provide: Navbar, useValue: navBarStub },
        { provide: ToastController, useValue: toastControllerStub },

      ]
    });
    fixture = TestBed.createComponent(OnboardingPage);
    comp = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(comp).toBeTruthy();
  });

  it("backButtonFunc defaults to: undefined", () => {
    expect(comp.backButtonFunc).toEqual(undefined);
  });

  xdescribe("ionViewDidLoad", () => {
    it("makes expected calls", () => {
      const navControllerStub: NavController = TestBed.get(NavController);
      const telemetryServiceStub: TelemetryService = TestBed.get(TelemetryService);
      const appVersionStub: AppVersion = TestBed.get(AppVersion);

      comp.navBar = TestBed.get(Navbar);

      expect(comp.ionViewDidLoad).toBeDefined();
      spyOn(comp, 'ionViewDidLoad').and.callThrough();
      spyOn(navControllerStub, "setRoot");
      spyOn(telemetryServiceStub, "impression");
      spyOn(appVersionStub, "getAppName").and.returnValue(Promise.resolve('sunbird'));

      spyOn(comp.navBar, "backButtonClick");
      comp.ionViewDidLoad();

      expect(comp.ionViewDidLoad).toHaveBeenCalled();

      expect(navControllerStub.setRoot).toHaveBeenCalled();
      expect(telemetryServiceStub.impression).toHaveBeenCalled();
      expect(appVersionStub.getAppName).toHaveBeenCalled();
      expect(comp.navBar.backButtonClick).toHaveBeenCalled();
      expect(comp.appName).toEqual('sunbird');
    });
  });

  xdescribe("ionViewWillEnter", () => {
    it("makes expected calls", () => {
      const navControllerStub: NavController = TestBed.get(NavController);
      const platformStub: Platform = TestBed.get(Platform);

      expect(comp.ionViewWillEnter).toBeDefined();
      spyOn(comp, 'ionViewWillEnter').and.callThrough();
      spyOn(navControllerStub, "setRoot");
      spyOn(platformStub, "registerBackButtonAction");

      comp.ionViewWillEnter();

      expect(comp.ionViewWillEnter).toHaveBeenCalled();
      expect(navControllerStub.setRoot).toHaveBeenCalled();
      expect(platformStub.registerBackButtonAction).toHaveBeenCalled();
    });
  });

  describe("ionViewWillLeave", () => {
    it("should be leave", () => {
      expect(comp.backButtonFunc).toEqual(undefined);
    });
  });

  describe("getLoader", () => {
    it("makes expected calls", () => {
      expect(comp.getLoader).toBeDefined();
      const loadingControllerStub: LoadingController = fixture.debugElement.injector.get(LoadingController);
      spyOn(comp, 'getLoader').and.callThrough();
      spyOn(loadingControllerStub, "create");
      comp.getLoader();

      expect(comp.getLoader).toHaveBeenCalled();
      expect(loadingControllerStub.create).toHaveBeenCalled();
    });
  });

  xdescribe("signIn", () => {
    it("makes expected calls", () => {
      const eventsStub: Events = fixture.debugElement.injector.get(Events);
      comp.getLoader = jasmine.createSpy().and.callFake(function () {
        return { present: function () { }, dismiss: function () { } }
      });

      spyOn(comp, "generateLoginInteractTelemetry");
      spyOn(eventsStub, "publish");
      comp.signIn();

      expect(comp.getLoader).toHaveBeenCalled();
      expect(comp.generateLoginInteractTelemetry).toHaveBeenCalled();
      expect(eventsStub.publish).toHaveBeenCalled();

    });
  });


  xdescribe("refreshProfileData", () => {
    it("makes expected calls", () => {
      spyOn(comp, "getToast");
      spyOn(comp, "translateMessage");
      comp.refreshProfileData();
      setTimeout(() => {
        expect(comp.getToast).toHaveBeenCalled();
        expect(comp.translateMessage).toHaveBeenCalled();
      }, 100);
    });
  });

  xdescribe("browseAsGuest", () => {
    it("makes expected calls", () => {
      const navControllerStub: NavController = fixture.debugElement.injector.get(
        NavController
      );
      const eventsStub: Events = fixture.debugElement.injector.get(Events);
      const profileServiceStub: ProfileService = fixture.debugElement.injector.get(
        ProfileService
      );
      const telemetryServiceStub: TelemetryService = fixture.debugElement.injector.get(
        TelemetryService
      );
      const sharedPreferencesStub: SharedPreferences = fixture.debugElement.injector.get(
        SharedPreferences
      );
      spyOn(navControllerStub, "setRoot");
      spyOn(navControllerStub, "push");
      spyOn(eventsStub, "publish");
      spyOn(profileServiceStub, "setCurrentProfile");
      spyOn(telemetryServiceStub, "interact");
      spyOn(sharedPreferencesStub, "getString");
      comp.browseAsGuest();
      setTimeout(() => {
        expect(navControllerStub.setRoot).toHaveBeenCalled();
        expect(navControllerStub.push).toHaveBeenCalled();
        expect(eventsStub.publish).toHaveBeenCalled();
        expect(profileServiceStub.setCurrentProfile).toHaveBeenCalled();
        expect(telemetryServiceStub.interact).toHaveBeenCalled();
        expect(sharedPreferencesStub.getString).toHaveBeenCalled();
      }, 100);
    });
  });

  describe("getToast", () => {
    it("Should not create ToastController if not passed any message for toast", () => {
      const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
      spyOn(toastCtrlStub, "create");
      comp.getToast();
      expect(toastCtrlStub.create).not.toHaveBeenCalled();
    });
    it("Should create ToastController", () => {
      const toastCtrlStub: ToastController = fixture.debugElement.injector.get(ToastController);
      spyOn(toastCtrlStub, "create");
      comp.getToast('Some Message');
      expect(toastCtrlStub.create).toHaveBeenCalled();
      expect(toastCtrlStub.create).toBeTruthy();
    });
  });

  xdescribe("translateMessage", () => {
    it('should resolve test data', () => {
      expect(comp.translateMessage).toBeDefined();
      spyOn(comp, 'translateMessage').and.callThrough();
      let translate = TestBed.get(TranslateService);
      const spy = spyOn(translate, 'get').and.callFake((arg) => {
        return Observable.of('Cancel');
      });
      let translatedMessage = comp.translateMessage('CANCEL');
      fixture.detectChanges();
      expect(translatedMessage).toEqual('Cancel');
      expect(spy.calls.any()).toEqual(true);
    });
  });
});
