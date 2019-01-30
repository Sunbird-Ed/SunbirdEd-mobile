import { App } from 'ionic-angular';
import {
  Events,
  PopoverController
} from 'ionic-angular';
import {
  TestBed,
  inject
} from '@angular/core/testing';
import { AppGlobalService } from './app-global.service';
import { } from 'jasmine';
import {
  AuthService,
  ProfileService,
  FrameworkService,
  SharedPreferences,
  BuildParamService,
  ServiceProvider, TelemetryService
} from 'sunbird';
import { Config } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { DeepLinker } from 'ionic-angular';
import { DeepLinkerMock } from '../../test-config/mocks-ionic';
import { PopoverControllerMock } from '../../node_modules/ionic-mocks';
import { TelemetryGeneratorService } from './telemetry-generator.service';
import {
  BuildParamaServiceMock
} from '../../test-config/mocks-ionic';

describe('AppGlobalService', () => {
  let service: AppGlobalService;
  let buildService, authService, profileService;

  const authServiceStub = {
    getSessionData: () => ({})
  };

  const ProfileServiceStub = {
    getCurrentUser: () => ({})
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppGlobalService, Events, FrameworkService, ServiceProvider, App, Config, Platform, TelemetryGeneratorService,
        TelemetryService, SharedPreferences,
        // { provide: SharedPreferences, useClass: SharedPreferencesMock },
        { provide: DeepLinker, useValue: DeepLinkerMock },
        { provide: AuthService, useValue: authServiceStub },
        { provide: BuildParamService, useClass: BuildParamaServiceMock },
        { provide: ProfileService, useValue: ProfileServiceStub },
        { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }

      ]
    });
  });

  beforeEach(inject([AppGlobalService, BuildParamService, AuthService, ProfileService],
    (appGlobalService: AppGlobalService, buildParamService: BuildParamService, authServicecb) => {
      service = appGlobalService;
      buildService = buildParamService;
      authService = authServicecb;
      profileService = ProfileService;
    }));

  it('isGuestUser defaults to: false', () => {
    // const service = TestBed.get(AppGlobalService);
    expect(service.isGuestUser).toBe(false);
  });

  it('isUserLoggedIn returns : true', () => {
    expect(service.isUserLoggedIn()).toBe(true);
  });

  it('getGuestUserType toBeUndefined', () => {
    expect(service.getGuestUserType()).toBeUndefined();
  });

  it('getCurrentUser toBeUndefined', () => {
    expect(service.getCurrentUser()).toBeUndefined();
  });

  it('getSessionData toBeUndefined', () => {
    expect(service.getSessionData()).toBeUndefined();
  });

  it('getNameForCodeInFramework to return name', () => {
    spyOn(service, 'getNameForCodeInFramework').and.callThrough();
    expect(service.getNameForCodeInFramework('category', 1)).toBeUndefined();
  });

  it('initValues to make expected calls', () => {
    const session = { session: 'testsession' };
    spyOn(service, 'readConfig');
    spyOn(authService, 'getSessionData').and.callFake((success) => {
      success(JSON.stringify(session));
    });
    // spyOn(authService, 'getSessionData');
    service['initValues']();
    expect(service.readConfig).toHaveBeenCalled();
    expect(authService.getSessionData).toHaveBeenCalled();
    expect(service.guestProfileType).toBeUndefined();
    expect(service.isGuestUser).toBe(false);
    expect(service.session).toEqual(session);
  });

  it('initValues to call getGuestUserInfo', () => {
    spyOn(service, 'readConfig');
    spyOn<any>(service, 'getGuestUserInfo');
    spyOn(authService, 'getSessionData').and.callFake((success) => {
      success(null);
    });
    service['initValues']();
    expect(service.readConfig).toHaveBeenCalled();
    expect(authService.getSessionData).toHaveBeenCalled();
    expect(service['getGuestUserInfo']).toHaveBeenCalled();
  });

  it('DISPLAY_ONBOARDING_CARDS to be true', (done) => {
    spyOn(buildService, 'getBuildConfigParam').and.returnValue(Promise.resolve('true'));
    service.readConfig();
    buildService.getBuildConfigParam().then(() => {
      expect(buildService.getBuildConfigParam).toHaveBeenCalled();
      expect(service.DISPLAY_ONBOARDING_CARDS).toBe(true);
      expect(service.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE).toBe(true);
      expect(service.DISPLAY_ONBOARDING_PAGE).toBe(true);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER).toBe(true);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER).toBe(true);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER).toBe(true);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT).toBe(true);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT).toBe(true);
      done();
    });
  });

  it('DISPLAY_ONBOARDING_CARDS to be true', (done) => {
    spyOn(buildService, 'getBuildConfigParam').and.returnValue(Promise.reject());
    service.readConfig();
    buildService.getBuildConfigParam().catch(() => {
      expect(buildService.getBuildConfigParam).toHaveBeenCalled();
      expect(service.DISPLAY_ONBOARDING_CARDS).toBe(false);
      expect(service.DISPLAY_FRAMEWORK_CATEGORIES_IN_PROFILE).toBe(false);
      expect(service.DISPLAY_ONBOARDING_PAGE).toBe(false);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER).toBe(false);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER).toBe(false);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_TEACHER).toBe(false);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT).toBe(false);
      expect(service.DISPLAY_SIGNIN_FOOTER_CARD_IN_PROFILE_TAB_FOR_STUDENT).toBe(false);
      done();
    });
  });

  it('getCurrentUserProfile to make expected calls', () => {
    spyOn(service['profile'], 'getCurrentUser').and.callFake((success, error) => {
      const data = JSON.stringify({ syllabus: ['response1'] });
      return success(data);
    });
    spyOn<any>(service, 'getFrameworkDetails').and.returnValue(Promise.resolve({}));
    service['getCurrentUserProfile']();
    expect(service['profile'].getCurrentUser).toHaveBeenCalled();
    expect(service.guestUserProfile.syllabus.length).toBeGreaterThan(0);
    expect(service['getFrameworkDetails']).toHaveBeenCalled();
  });

  it('getCurrentUserProfile to return syllabus', () => {
    spyOn(service['profile'], 'getCurrentUser').and.callFake((success, error) => {
      const data = JSON.stringify({ syllabus: [] });
      return success(data);
    });
    service['getCurrentUserProfile']();
    expect(service['profile'].getCurrentUser).toHaveBeenCalled();
    expect(service.guestUserProfile.syllabus.length).toBe(0);
    expect(service['frameworkData'].length).toBe(0);
  });

  it('getCurrentUserProfile to make expected calls', () => {
    spyOn(service['profile'], 'getCurrentUser').and.callFake((success, error) => {
      const data = JSON.stringify({ syllabus: ['response1'] });
      return error(data);
    });
    service['getCurrentUserProfile']();
    expect(service['profile'].getCurrentUser).toHaveBeenCalled();
    expect(service.guestUserProfile).toBeUndefined();
  });

  // xit('should check profile type. ProfileType should be TEACHER', (done) => {
  //   const sharedPreferences = TestBed.get(SharedPreferences);
  //   spyOn(component, 'checkCurrentUserType').and.callThrough();
  //   spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve(ProfileType.TEACHER));
  //   component.checkCurrentUserType();
  //   sharedPreferences.getString().then((val) => {
  //     expect(component.checkCurrentUserType).toBeDefined();
  //     expect(component.checkCurrentUserType).toHaveBeenCalled();
  //     expect(sharedPreferences.getString).toHaveBeenCalled();
  //     expect(component.profileType).toEqual(ProfileType.TEACHER);
  //     expect(component.profileType).not.toBe(ProfileType.STUDENT);
  //     expect(val).toEqual(ProfileType.TEACHER);
  //     done();
  //   });
  // });

  it('getGuestUserInfo to make expected calls', () => {
    const sharedPreferences = TestBed.get(SharedPreferences);
    spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve('TEACHER'));
    service['getGuestUserInfo']();
    sharedPreferences.getString().then((val) => {
      expect(service['preference'].getString).toHaveBeenCalled();
      expect(service.guestProfileType).toBe('TEACHER');
      expect(service.isGuestUser).toBe(true);
    });
  });

  it('getGuestUserInfo to make expected calls', () => {
    const sharedPreferences = TestBed.get(SharedPreferences);
    spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve('TEACHER'));
    service['getGuestUserInfo']();
    service['getGuestUserInfo']();
    sharedPreferences.getString().then((val) => {
      expect(service['preference'].getString).toHaveBeenCalled();
      expect(service.guestProfileType).toBe('TEACHER');
      expect(service.isGuestUser).toBe(true);
    });
  });

  it('getGuestUserInfo to make expected calls', () => {
    const sharedPreferences = TestBed.get(SharedPreferences);
    spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve('STUDENT'));
    service['getGuestUserInfo']();
    service['getGuestUserInfo']();
    sharedPreferences.getString().then((val) => {
      expect(service['preference'].getString).toHaveBeenCalled();
      expect(service.guestProfileType).toBe('STUDENT');
      expect(service.isGuestUser).toBe(true);
    });
  });

  it('getGuestUserInfo to make expected calls', () => {
    const sharedPreferences = TestBed.get(SharedPreferences);
    spyOn(sharedPreferences, 'getString').and.returnValue(Promise.resolve('STUDENT'));
    service['getGuestUserInfo']();
    service['getGuestUserInfo']();
    sharedPreferences.getString().then((val) => {
      expect(service['preference'].getString).toHaveBeenCalled();
      expect(service.guestProfileType).toBe('STUDENT');
      expect(service.isGuestUser).toBe(true);
    });
  });

  it('getFrameworkDetails to make expected calls', () => {
    spyOn<any>(service, 'getFrameworkDetails').and.callThrough();
    spyOn<any>(service['framework'], 'getFrameworkDetails').and.returnValue(Promise.resolve('success'));
    service['getFrameworkDetails']('10');
    expect(service['framework'].getFrameworkDetails).toHaveBeenCalled();
  });

  it('openPopover to make expected calls', () => {
    const popOverCtrl = TestBed.get(PopoverController);
    service['openPopover']({ upgrade: { type: 'force' } });
    expect(popOverCtrl.create).toHaveBeenCalled();
  });

});
