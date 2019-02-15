import {OnboardingPage} from './onboarding';
import {
  appGlobalServiceMock,
  appVersionMock,
  authServiceMock,
  commonUtilServiceMock,
  containerServiceMock,
  eventsMock,
  formAndFrameworkUtilServiceMock,
  loadingControllerMock,
  navCtrlMock,
  oAuthServiceMock,
  platformMock,
  profileServiceMock,
  sharedPreferencesMock,
  telemetryGeneratorServiceMock,
  userProfileServiceMock
} from '@app/__tests__/mocks';
import {ProfileType, TabsPage} from 'sunbird';
import {LanguageSettingsPage} from '@app/pages/language-settings/language-settings';
import {GUEST_STUDENT_TABS, GUEST_TEACHER_TABS, PreferenceKey} from '@app/app';
import {UserTypeSelectionPage} from '@app/pages/user-type-selection';
import {CategoriesEditPage} from '@app/pages/categories-edit/categories-edit';

describe('OnboardingPage', () => {
  let onboardingPage: OnboardingPage;

  beforeEach(() => {
    onboardingPage = new OnboardingPage(
      navCtrlMock as any,
      oAuthServiceMock as any,
      containerServiceMock as any,
      userProfileServiceMock as any,
      profileServiceMock as any,
      authServiceMock as any,
      loadingControllerMock as any,
      sharedPreferencesMock as any,
      platformMock as any,
      commonUtilServiceMock as any,
      appVersionMock as any,
      eventsMock as any,
      appGlobalServiceMock as any,
      telemetryGeneratorServiceMock as any,
      formAndFrameworkUtilServiceMock as any
    );

    jest.resetAllMocks();
    jest.useRealTimers();
  });

  it('can load instance', () => {
    expect(onboardingPage).toBeTruthy();
  });

  it('backButtonFunc defaults to: undefined', () => {
    expect(onboardingPage.backButtonFunc).toEqual(undefined);
  });

  describe('ionViewDidLoad', () => {
    it('should fetch appName, set navBar back func and genereate Impression Telemetry', (done) => {
      // arrange
      (onboardingPage.navBar as any) = {};
      appVersionMock.getAppName.mockResolvedValue('sunbird');

      // act
      onboardingPage.ionViewDidLoad();

      // assert
      setTimeout(() => {
        expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalled();
        expect(appVersionMock.getAppName).toHaveBeenCalled();
        expect(onboardingPage.appName).toEqual('sunbird');
        done();
      }, 0);
    });

    it('should set navBar backButton func to generateBackClickedTelemetry and set Rooot page to ' +
      'LanguageSettingsPage', (done) => {
      // arrange
      (onboardingPage.navBar as any) = {};
      appVersionMock.getAppName.mockResolvedValue('sunbird');

      // act
      onboardingPage.ionViewDidLoad();
      onboardingPage.navBar.backButtonClick({} as any);

      // assert
      setTimeout(() => {
        expect(onboardingPage.navBar.backButtonClick).toBeDefined();
        expect(navCtrlMock.setRoot).toHaveBeenCalledWith(LanguageSettingsPage);
        expect(telemetryGeneratorServiceMock.generateBackClickedTelemetry).toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('ionViewWillEnter', () => {
    it('makes expected calls', () => {
      // arrange
      platformMock.registerBackButtonAction.mockReturnValue(jest.fn());

      // act
      onboardingPage.ionViewWillEnter();

      // assert
      expect(platformMock.registerBackButtonAction).toHaveBeenCalledWith(expect.anything(), 10);
      expect(commonUtilServiceMock.getAppDirection).toHaveBeenCalled();
    });

    it('should set backButton func to generateBackClickedTelemetry and set Rooot page to ' +
      'LanguageSettingsPage', () => {
      // arrange
      platformMock.registerBackButtonAction.mockReturnValue(jest.fn());

      // act
      onboardingPage.ionViewWillEnter();

      // assert
      platformMock.registerBackButtonAction.mock.calls[0][0].call(onboardingPage);
      expect(telemetryGeneratorServiceMock.generateBackClickedTelemetry).toHaveBeenCalled();
      expect(onboardingPage.backButtonFunc).toHaveBeenCalled();
      expect(navCtrlMock.setRoot).toHaveBeenCalledWith(LanguageSettingsPage);
    });
  });

  describe('ionViewWillLeave', () => {
    it('should call registered backButton', () => {
      // arrange
      onboardingPage.backButtonFunc = jest.fn();

      // act
      onboardingPage.ionViewWillLeave();

      // assert
      expect(onboardingPage.backButtonFunc).toHaveBeenCalled();
    });
  });

  it('should return instance of loader when getLoader()', () => {
    const SOME_LAODER = {};
    loadingControllerMock.create.mockReturnValue(SOME_LAODER);

    // act-assert
    expect(onboardingPage.getLoader()).toBe(SOME_LAODER);
  });

  describe('signIn', () => {
    it('should show loader and generateLoginInteractTelemetry', (done) => {
      // arrange
      const loader = {present: jest.fn()};
      loadingControllerMock.create.mockReturnValue(loader);
      oAuthServiceMock.doOAuthStepOne.mockResolvedValue(undefined);

      // act
      onboardingPage.signIn();

      // assert
      setTimeout(() => {
        expect(loader.present).toHaveBeenCalled();
        expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should dismiss loader when doOAuthStepOne throws error', (done) => {
      // arrange
      const loader = {present: jest.fn(), dismiss: jest.fn()};
      loadingControllerMock.create.mockReturnValue(loader);
      oAuthServiceMock.doOAuthStepOne.mockRejectedValue(undefined);

      // act
      onboardingPage.signIn();

      // assert
      setTimeout(() => {
        expect(loader.dismiss).toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('refreshProfileData()', () => {
    it('should reject if getUserProfileDetails fails', (done) => {
      // arrange
      authServiceMock.getSessionData.mockImplementation((cb: Function) => {
        cb(`{ "userToken": "SOME_SESSION" }`);
      });
      userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb, errCb) => {
        errCb('SAMPLE_ERROR_MESSAGE');
      });
      profileServiceMock.setCurrentProfile.mockResolvedValue('SOME_PROFILE');
      formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
        status: 'SOME_STATUS',
        profile: 'SOME_PROFILE'
      });

      // act
      onboardingPage.refreshProfileData().catch((err) => {
        expect(err).toBe('SAMPLE_ERROR_MESSAGE');
        done();
      });
    });

    it('should reject if setCurrentProfile fails', (done) => {
      // arrange
      authServiceMock.getSessionData.mockImplementation((cb: Function) => {
        cb(`{ "userToken": "SOME_SESSION" }`);
      });
      userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb) => {
        resCb(`{ "id": "SAMPLE_ID", "userId": "SAMPLE_USER_ID", "rootOrg": { "orgName": "SAMPLE_ORG_NAME", "slug": "SAMPLE_ORG_SLUG" } }`);
      });
      profileServiceMock.setCurrentProfile.mockRejectedValue('SAMPLE_ERROR_MESSAGE');
      formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
        status: 'SOME_STATUS',
        profile: 'SOME_PROFILE'
      });

      // act
      onboardingPage.refreshProfileData().catch((err) => {
        expect(err).toBe('SAMPLE_ERROR_MESSAGE');
        done();
      });
    });

    it('should resolve with rootOrg.slug and set orgName when unable to updateLoggedInUser', (done) => {
      // arrange
      authServiceMock.getSessionData.mockImplementation((cb: Function) => {
        cb(`{ "userToken": "SOME_SESSION" }`);
      });
      userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb) => {
        resCb(`{ "id": "SAMPLE_ID", "userId": "SAMPLE_USER_ID", "rootOrg": { "orgName": "SAMPLE_ORG_NAME", "slug": "SAMPLE_ORG_SLUG" } }`);
      });
      profileServiceMock.setCurrentProfile.mockResolvedValue('SOME_PROFILE');
      formAndFrameworkUtilServiceMock.updateLoggedInUser.mockRejectedValue('');

      // act
      onboardingPage.refreshProfileData().then((r) => {
        // assert
        expect(onboardingPage.orgName).toBe('SAMPLE_ORG_NAME');
        expect(r).toBe('SAMPLE_ORG_SLUG');
        done();
      });
    });

    it('should reject and navigate to CategoriesEditPage if !loggedInUser status', (done) => {
      // arrange
      authServiceMock.getSessionData.mockImplementation((cb: Function) => {
        cb(`{ "userToken": "SOME_SESSION" }`);
      });
      userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb) => {
        resCb(`{ "id": "SAMPLE_ID", "userId": "SAMPLE_USER_ID", "rootOrg": { "orgName": "SAMPLE_ORG_NAME", "slug": "SAMPLE_ORG_SLUG" } }`);
      });
      profileServiceMock.setCurrentProfile.mockResolvedValue('SOME_PROFILE');
      formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
        status: '',
        profile: 'SOME_PROFILE'
      });

      // act
      onboardingPage.refreshProfileData().catch(() => {
        // assert
        expect(navCtrlMock.setRoot).toHaveBeenCalledWith(CategoriesEditPage, expect.anything());
        done();
      });
    });

    it('should initTabs with LOGIN_TEACHER_TABS on success', (done) => {
      // arrange
      jest.useFakeTimers();

      commonUtilServiceMock.translateMessage.mockReturnValue('SAMPLE_WELCOME_BACK');
      authServiceMock.getSessionData.mockImplementation((cb: Function) => {
        cb(`{ "userToken": "SOME_SESSION" }`);
      });
      userProfileServiceMock.getUserProfileDetails.mockImplementation((req, resCb) => {
        resCb(`{ "id": "SAMPLE_ID", "userId": "SAMPLE_USER_ID", "rootOrg": { "orgName": "SAMPLE_ORG_NAME", "slug": "SAMPLE_ORG_SLUG" } }`);
      });
      profileServiceMock.setCurrentProfile.mockResolvedValue('SOME_PROFILE');
      formAndFrameworkUtilServiceMock.updateLoggedInUser.mockResolvedValue({
        status: 'SOME_STATUS',
        profile: 'SOME_PROFILE'
      });

      // act
      onboardingPage.refreshProfileData().then((r) => {
        jest.advanceTimersByTime(800);

        // assert
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SAMPLE_WELCOME_BACK');
        expect(containerServiceMock.removeAllTabs).toHaveBeenCalled();
        expect(containerServiceMock.addTab).toHaveBeenCalledTimes(3);
        expect(onboardingPage.orgName).toBe('SAMPLE_ORG_NAME');
        expect(r).toBe('SAMPLE_ORG_SLUG');
        done();
      });
    });
  });

  describe('browseAsGuest', () => {
    it('makes expected calls', (done) => {
      // arrange
      sharedPreferencesMock.getString.mockResolvedValue('');

      // act
      onboardingPage.browseAsGuest();

      // assert
      setTimeout(() => {
        expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalled();
        expect(sharedPreferencesMock.getString).toHaveBeenCalledWith(PreferenceKey.SELECTED_USER_TYPE);
        expect(sharedPreferencesMock.getString).toHaveBeenCalledWith('GUEST_USER_ID_BEFORE_LOGIN');
        done();
      }, 100);
    });

    it('should init Guest-student tabs if user is a student', (done) => {
      // arrange
      sharedPreferencesMock.getString.mockImplementation((str: string) => {
        if (str === PreferenceKey.SELECTED_USER_TYPE) {
          return Promise.resolve(ProfileType.STUDENT);
        } else if (str === 'GUEST_USER_ID_BEFORE_LOGIN') {
          return Promise.resolve('');
        }
      });

      // act
      onboardingPage.browseAsGuest();

      // assert
      setTimeout(() => {
        expect(containerServiceMock.removeAllTabs).toHaveBeenCalled();
        expect(containerServiceMock.addTab.mock.calls).toEqual([
          [GUEST_STUDENT_TABS[0]],
          [GUEST_STUDENT_TABS[1]],
        ]);
        done();
      }, 100);
    });

    it('should init Guest-teacher tabs if user is a teacher', (done) => {
      // arrange
      sharedPreferencesMock.getString.mockImplementation((str: string) => {
        if (str === PreferenceKey.SELECTED_USER_TYPE) {
          return Promise.resolve(ProfileType.TEACHER);
        } else if (str === 'GUEST_USER_ID_BEFORE_LOGIN') {
          return Promise.resolve('');
        }
      });

      // act
      onboardingPage.browseAsGuest();

      // assert
      setTimeout(() => {
        expect(containerServiceMock.removeAllTabs).toHaveBeenCalled();
        expect(containerServiceMock.addTab.mock.calls).toEqual([
          [GUEST_TEACHER_TABS[0]],
          [GUEST_TEACHER_TABS[1]],
          [GUEST_TEACHER_TABS[2]]
        ]);
        done();
      }, 100);
    });

    it('should should push UserTypeSelectionPage if no guest user id exists', (done) => {
      // arrange
      sharedPreferencesMock.getString.mockImplementation((str: string) => {
        if (str === PreferenceKey.SELECTED_USER_TYPE) {
          return Promise.resolve('');
        } else if (str === 'GUEST_USER_ID_BEFORE_LOGIN') {
          return Promise.resolve('');
        }
      });

      // act
      onboardingPage.browseAsGuest();

      // assert
      setTimeout(() => {
        expect(navCtrlMock.push).toHaveBeenCalledWith(UserTypeSelectionPage);
        done();
      }, 100);
    });

    it('should should push UserTypeSelectionPage when unable to set CurrentProfile using guest id',
      (done) => {
        // arrange
        sharedPreferencesMock.getString.mockImplementation((str: string) => {
          if (str === PreferenceKey.SELECTED_USER_TYPE) {
            return Promise.resolve('');
          } else if (str === 'GUEST_USER_ID_BEFORE_LOGIN') {
            return Promise.resolve('SAMPLE_GUEST_USER_ID');
          }
        });

        profileServiceMock.setCurrentProfile.mockRejectedValue('');

        // act
        onboardingPage.browseAsGuest();

        // assert
        setTimeout(() => {
          expect(navCtrlMock.push).toHaveBeenCalledWith(UserTypeSelectionPage);
          done();
        }, 100);
      });

    it('should should push UserTypeSelectionPage when appGlobalService.isProfileSettingsCompleted = false',
      (done) => {
        // arrange
        sharedPreferencesMock.getString.mockImplementation((str: string) => {
          if (str === PreferenceKey.SELECTED_USER_TYPE) {
            return Promise.resolve('');
          } else if (str === 'GUEST_USER_ID_BEFORE_LOGIN') {
            return Promise.resolve('SAMPLE_GUEST_USER_ID');
          }
        });

        (appGlobalServiceMock.isProfileSettingsCompleted as any) = false;
        profileServiceMock.setCurrentProfile.mockResolvedValue('');

        // act
        onboardingPage.browseAsGuest();

        // assert
        setTimeout(() => {
          expect(navCtrlMock.push).toHaveBeenCalledWith(UserTypeSelectionPage);
          done();
        }, 100);
      });

    it('should setRoot to TabsPage on successfully setting currentProfile',
      (done) => {
        // arrange
        sharedPreferencesMock.getString.mockImplementation((str: string) => {
          if (str === PreferenceKey.SELECTED_USER_TYPE) {
            return Promise.resolve('');
          } else if (str === 'GUEST_USER_ID_BEFORE_LOGIN') {
            return Promise.resolve('SAMPLE_GUEST_USER_ID');
          }
        });

        (appGlobalServiceMock.isProfileSettingsCompleted as any) = true;
        profileServiceMock.setCurrentProfile.mockResolvedValue('');

        // act
        onboardingPage.browseAsGuest();

        // assert
        setTimeout(() => {
          expect(navCtrlMock.setRoot).toHaveBeenCalledWith(TabsPage, {loginMode: 'guest'});
          done();
        }, 100);
      });
  });

  describe('refreshTenantData()', () => {
    beforeEach(() => {
      (<any>window).splashscreen = {setContent: jest.fn()};
    });

    it('should setContent on splashcreen on success', (done) => {
      // arrange
      userProfileServiceMock.getTenantInfo.mockImplementation((req, successCB) => {
        successCB('{ "logo": "SAMPLE_LOGOG" }');
      });
      onboardingPage.orgName = 'SAMPLE_ORG_NAME';

      // act
      onboardingPage.refreshTenantData('SAMPLE_SLUG').then(() => {
        // assert
        expect((<any>window).splashscreen.setContent).toHaveBeenCalledWith('SAMPLE_ORG_NAME', 'SAMPLE_LOGOG');
        done();
      });
    });
  });
});
