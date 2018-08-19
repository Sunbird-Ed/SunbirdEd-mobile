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
  let buildService, authService;

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

  beforeEach(inject([AppGlobalService, BuildParamService, AuthService], (appGlobalService: AppGlobalService, buildParamService: BuildParamService, authServicecb) => {
    service = appGlobalService;
    buildService = buildParamService;
    authService = authServicecb;
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

  it("DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE).toBe(true);
  });

  it("DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE).toBe(false);
  });

  it("isUserLoggedIn returns : true", () => {
    expect(service.isUserLoggedIn()).toBe(true);
  });

  it("getGuestUserType toBeUndefined", () => {
    expect(service.getGuestUserType()).toBeUndefined();
  });

  it("getCurrentUser toBeUndefined", () => {
    expect(service.getCurrentUser()).toBeUndefined();
  });

  it("getSessionData toBeUndefined", () => {
    expect(service.getSessionData()).toBeUndefined();
  });

  // it("getNameForCodeInFramework to return name", () => {
  //   spyOn(service, 'getNameForCodeInFramework').and.callFake(function(){
  //     let data = "true";
  //     return error(data);
  //   });
  //   service.readConfig()
  //   expect(buildService.getBuildConfigParam).toHaveBeenCalled();
  //   expect(service.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE).toBe(false);
  // });
  
  it("should set  syllabusList to passed array", () => {
    let arr = ['test']
    service.setSyllabusList(arr);
    expect (service.syllabusList).toEqual(arr);
  });

  it("should getCachedSyllabusList", () => {
    expect(service.getCachedSyllabusList()).toBeDefined();
  });

  it("initValues to make expected calls", () => {
    spyOn(service, 'readConfig');
    spyOn(authService, 'getSessionData');
    service["initValues"]();
    expect(service.readConfig).toHaveBeenCalled();
    expect(authService.getSessionData).toHaveBeenCalled();
  });

  // it("initValues to make expected calls", () => {
  //   spyOn(service, 'readConfig');
  //   service["initValues"]();
  //   expect(service.readConfig).toHaveBeenCalled();
  // });

})
