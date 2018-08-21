import { TelemetryGeneratorService } from './telemetry-generator.service';
import { App } from 'ionic-angular';
import { Events, PopoverController } from 'ionic-angular';
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { AppGlobalService } from "./app-global.service";
import {} from 'jasmine';
import { AuthService, ProfileService, FrameworkService, SharedPreferences, BuildParamService, ServiceProvider, TelemetryService } from 'sunbird';
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
        AppGlobalService, Events, ProfileService, FrameworkService, SharedPreferences, PopoverController, TelemetryGeneratorService, TelemetryService, ServiceProvider, App, Config, Platform,
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
  
  it("DISPLAY_ONBOARDING_PAGE to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_ONBOARDING_PAGE).toBe(true);
  });

  it("DISPLAY_ONBOARDING_PAGE to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_ONBOARDING_PAGE).toBe(false);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER).toBe(true);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER).toBe(false);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER).toBe(true);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER).toBe(false);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER).toBe(true);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER).toBe(false);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT).toBe(true);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT).toBe(false);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT to be true", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return success(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT).toBe(true);
  });

  it("DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT to be false", () => {
    spyOn(buildService, 'getBuildConfigParam').and.callFake(function(option, success, error){
      let data = "true";
      return error(data);
    });
    service.readConfig()
    expect(buildService.getBuildConfigParam).toHaveBeenCalled();
    expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT).toBe(false);
  });

})