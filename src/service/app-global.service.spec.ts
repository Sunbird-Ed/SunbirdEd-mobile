import { App, ToastController } from 'ionic-angular';
import { Events, PopoverController } from 'ionic-angular';
import { ComponentFixture, TestBed, inject } from "@angular/core/testing";
import { AppGlobalService } from "./app-global.service";
import {} from 'jasmine';
import { AuthService, ProfileService, FrameworkService, SharedPreferences, BuildParamService, ServiceProvider } from 'sunbird';
import { Config } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { DeepLinker } from 'ionic-angular';
import { DeepLinkerMock } from '../../test-config/mocks-ionic';
import { PopoverControllerMock } from '../../node_modules/ionic-mocks';

describe('AppGlobalService', () => {
  let service : AppGlobalService;
  let buildService, authService, profileService;

  const authServiceStub = {
    getSessionData: () => ({})
  }

  const BuildParamServiceStub = {
    getBuildConfigParam: () => ({})
  }

  const ProfileServiceStub = {
    getCurrentUser: () => ({})
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ 
        AppGlobalService, Events, FrameworkService, SharedPreferences, ServiceProvider, App, Config, Platform,
        {provide: DeepLinker, useValue: DeepLinkerMock},
        {provide: AuthService, useValue: authServiceStub},
        {provide: BuildParamService, useValue: BuildParamServiceStub},
        {provide: ProfileService, useValue: ProfileServiceStub},
        {provide: PopoverController, useFactory: () => PopoverControllerMock.instance()}

      ]
    });
  });

  beforeEach(inject([AppGlobalService, BuildParamService, AuthService, ProfileService], (appGlobalService: AppGlobalService, buildParamService: BuildParamService, authServicecb, ProfileService) => {
    service = appGlobalService;
    buildService = buildParamService;
    authService = authServicecb;
    profileService = ProfileService;
  }));
    
  it('isGuestUser defaults to: false', () => {
    // const service = TestBed.get(AppGlobalService);
    expect(service.isGuestUser).toBe(false);
  });

  it("syllabusList defaults to: []", () => {
    // const service = TestBed.get(AppGlobalService);
    expect(service.syllabusList).toEqual([]);
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

  it("getNameForCodeInFramework to return name", () => {
    spyOn(service, 'getNameForCodeInFramework').and.callThrough();
    expect(service.getNameForCodeInFramework('category', 1)).toBeUndefined();
  });
  
  it("should set  syllabusList to passed array", () => {
    let arr = ['test']
    service.setSyllabusList(arr);
    expect (service.syllabusList).toEqual(arr);
  });

  it("should getCachedSyllabusList", () => {
    expect(service.getCachedSyllabusList()).toBeDefined();
  });

  it("initValues to make expected calls", () => {
    let session = {session : "testsession"};
    spyOn(service, 'readConfig');
    spyOn(authService, 'getSessionData').and.callFake(function(success){
        success(JSON.stringify(session));
    });
    // spyOn(authService, 'getSessionData');
    service["initValues"]();
    expect(service.readConfig).toHaveBeenCalled();
    expect(authService.getSessionData).toHaveBeenCalled();
    expect(service.guestProfileType).toBeUndefined();
    expect(service.isGuestUser).toBe(false);
    expect(service.session).toEqual(session);
  });

  it("initValues to call getGuestUserInfo", () => {
    spyOn(service, 'readConfig');
    spyOn<any>(service, 'getGuestUserInfo');
    spyOn(authService, 'getSessionData').and.callFake(function(success){
        success(null);
    });
    service["initValues"]();
    expect(service.readConfig).toHaveBeenCalled();
    expect(authService.getSessionData).toHaveBeenCalled();
    expect(service["getGuestUserInfo"]).toHaveBeenCalled();
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

  it("getCurrentUserProfile to make expected calls", () => {
    spyOn(service['profile'], 'getCurrentUser').and.callFake(function(success, error){
        let data = JSON.stringify({syllabus : ["response1"]});
        return success(data);
    });
    spyOn<any>(service, "getFrameworkDetails").and.returnValue(Promise.resolve({}));
    service["getCurrentUserProfile"]();
    expect(service["profile"].getCurrentUser).toHaveBeenCalled();
    expect(service.guestUserProfile.syllabus.length).toBeGreaterThan(0);
    expect(service["getFrameworkDetails"]).toHaveBeenCalled();
  });

  it("getCurrentUserProfile to return syllabus", () => {
    spyOn(service['profile'], 'getCurrentUser').and.callFake(function(success, error){
        let data = JSON.stringify({syllabus : []});
        return success(data);
    });
    service["getCurrentUserProfile"]();
    expect(service["profile"].getCurrentUser).toHaveBeenCalled();
    expect(service.guestUserProfile.syllabus.length).toBe(0);
    expect(service["frameworkData"].length).toBe(0);
  });

  it("getCurrentUserProfile to make expected calls", () => {
    spyOn(service['profile'], 'getCurrentUser').and.callFake(function(success, error){
        let data = JSON.stringify({syllabus : ["response1"]});
        return error(data);
    });
    service["getCurrentUserProfile"]();
    expect(service["profile"].getCurrentUser).toHaveBeenCalled();
    expect(service.guestUserProfile).toBeUndefined();
  });
  

  it("getGuestUserInfo to make expected calls", () => {
    spyOn(service['preference'], 'getString').and.callFake(function(opts, success){
        let data = "TEACHER";
        return success(data);
    });
    service["getGuestUserInfo"]();
    expect(service["preference"].getString).toHaveBeenCalled();
    expect(service.guestProfileType).toBe("TEACHER");
    expect(service.isGuestUser).toBe(true);
  });

  it("getGuestUserInfo to make expected calls", () => {
    spyOn(service['preference'], 'getString').and.callFake(function(opts, success){
        let data = "teacher";
        return success(data);
    });
    service["getGuestUserInfo"]();
    expect(service["preference"].getString).toHaveBeenCalled();
    expect(service.guestProfileType).toBe("TEACHER");
    expect(service.isGuestUser).toBe(true);
  });

  it("getGuestUserInfo to make expected calls", () => {
    spyOn(service['preference'], 'getString').and.callFake(function(opts, success){
        let data = "STUDENT";
        return success(data);
    });
    service["getGuestUserInfo"]();
    expect(service["preference"].getString).toHaveBeenCalled();
    expect(service.guestProfileType).toBe("STUDENT");
    expect(service.isGuestUser).toBe(true);
  });

  it("getGuestUserInfo to make expected calls", () => {
    spyOn(service['preference'], 'getString').and.callFake(function(opts, success){
        let data = "student";
        return success(data);
    });
    service["getGuestUserInfo"]();
    expect(service["preference"].getString).toHaveBeenCalled();
    expect(service.guestProfileType).toBe("STUDENT");
    expect(service.isGuestUser).toBe(true);
  });

  it("getFrameworkDetails to make expected calls", () => {
    spyOn<any>(service, 'getFrameworkDetails').and.callThrough();
    spyOn<any>(service["framework"], 'getFrameworkDetails').and.callFake(function(req,success,error){
        success("sucess");
    });
    service["getFrameworkDetails"]("10");
    expect(service["framework"].getFrameworkDetails).toHaveBeenCalled();
  });

  it("openPopover to make expected calls", () => {
    const popOverCtrl = TestBed.get(PopoverController);
    service["openPopover"]({upgrade:{type:"force"}});
    expect(popOverCtrl.create).toHaveBeenCalled();
  });
  

})
