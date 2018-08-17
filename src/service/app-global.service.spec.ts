import { App } from 'ionic-angular';
import { Events, PopoverController } from 'ionic-angular';
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { AppGlobalService } from "./app-global.service";
import {} from 'jasmine';
import { AuthService, ProfileService, FrameworkService, SharedPreferences, BuildParamService, ServiceProvider } from 'sunbird';
import { Config } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { DeepLinker } from 'ionic-angular';
import { DeepLinkerMock } from '../../test-config/mocks-ionic';

describe('AppGlobalService', () => {
  let service : AppGlobalService;
  let buildService;
  const authServiceStub = {
    getSessionData: () => ({})
  }

  
  const BuildParamServiceStub = {
    getBuildConfigParam: () => ({})
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ 
        AppGlobalService, Events, ProfileService, FrameworkService, SharedPreferences, PopoverController, ServiceProvider, App, Config, Platform, BuildParamService,
        {provide: DeepLinker, useValue: DeepLinkerMock},
        {provide: AuthService, useValue: authServiceStub},
        {provide: BuildParamService, useValue: BuildParamServiceStub}
      ]
    });
  });

  beforeEach(inject([AppGlobalService,BuildParamService], (appGlobalService: AppGlobalService, buildParamService: BuildParamService) => {
    service = appGlobalService;
    buildService = buildParamService;
  }));
    
  it('isGuestUser defaults to: false', () => {
    const service = TestBed.get(AppGlobalService);
    expect(service.isGuestUser).toBe(false);
  });

  it("syllabusList defaults to: []", () => {
    const service = TestBed.get(AppGlobalService);
    expect(service.syllabusList).toEqual([]);
  });
  
  it("DISPLAY_ONBOARDING_CARDS to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_ONBOARDING_CARDS).toBe(true);
  });

  it("DISPLAY_ONBOARDING_CARDS to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_ONBOARDING_CARDS).toBe(false);
  });

  it("isUserLoggedIn returns : true", () => {
    expect(service.isUserLoggedIn()).toBe(true);
  });

})
