import {
  navCtrlMock,
  navParamsMock,
  contentServiceMock,
  zoneMock,
  eventsMock,
  popoverCtrlMock,
  sharedPreferencesMock,
  socialSharingMock,
  platformMock,
  appGlobalServiceMock,
  ionicAppMock,
  profileServiceMock,
  telemetryGeneratorServiceMock,
  commonUtilServiceMock,
  courseUtilServiceMock,
  translateServiceMock,
  networkMock,
  eventBusServiceMock,
  playerServiceMock,
  fileMock,
  utilityServiceMock,
  containerServiceMock,
  appMock,
  authServiceMock,
  toastControllerMock,
  appHeaderServiceMock,
  canvasPlayerServiceMock,
  appRatingServiceMock,
  fileSizePipeMock,
  buildParamServiceMock,
  alertControllerMock
} from '../../__tests__/mocks';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import { Observable, Subscription } from 'rxjs';
import 'jest';
import { PreferenceKey } from '../../app';

describe('ContentDetailsPage Component', () => {
  let contentDetailsPage: ContentDetailsPage;

  beforeEach(() => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    buildParamServiceMock.getBuildConfigValue.mockResolvedValue('SOME_URL');
    buildParamServiceMock.getDeviceAPILevel.mockResolvedValue('');
    buildParamServiceMock.checkAppAvailability.mockResolvedValue('org.xwalk.core');


    contentDetailsPage = new ContentDetailsPage(
      profileServiceMock as any,
      contentServiceMock as any,
      eventBusServiceMock as any,
      sharedPreferencesMock as any,
      playerServiceMock as any,
      navCtrlMock as any,
      navParamsMock as any,
      zoneMock as any,
      eventsMock as any,
      popoverCtrlMock as any,
      socialSharingMock as any,
      platformMock as any,
      appGlobalServiceMock as any,
      alertControllerMock as any,
      ionicAppMock as any,
      telemetryGeneratorServiceMock as any,
      commonUtilServiceMock as any,
      courseUtilServiceMock as any,
      canvasPlayerServiceMock as any,
      fileMock as any,
      buildParamServiceMock as any,
      containerServiceMock as any,
      appMock as any,
      authServiceMock as any,
      networkMock as any,
      toastControllerMock as any,
      fileSizePipeMock as any,
      translateServiceMock as any,
      appHeaderServiceMock as any,
      appRatingServiceMock as any
    );

    jest.resetAllMocks();
  });

  it('test instance initiation', () => {
    expect(contentDetailsPage).toBeTruthy();
  });
  it('should create valid instance for ContentDetailsPage', () => {
    spyOn(contentDetailsPage, 'subscribePlayEvent').and.stub();
    spyOn(contentDetailsPage, 'checkLoggedInOrGuestUser').and.stub();
    spyOn(contentDetailsPage, 'checkCurrentUserType').and.stub();
    spyOn(contentDetailsPage, 'handlePageResume').and.stub();
    spyOn(contentDetailsPage, 'checkDeviceAPILevel').and.stub();
    spyOn(contentDetailsPage, 'checkappAvailability').and.stub();
  });

  it('#ionViewWillEnter', () => {
    appHeaderServiceMock.headerEventEmitted$ = Observable.from([{ name: 'content' }]) as any;
    navParamsMock.get.mockReturnValueOnce({ depth: 'test' })
      .mockReturnValueOnce(false)
      .mockReturnValue(false);

    spyOn(contentDetailsPage, 'setContentDetails').and.stub();
    spyOn(contentDetailsPage, 'subscribeSdkEvent').and.stub();
    spyOn(contentDetailsPage, 'presentToast').and.stub();
    commonUtilServiceMock.networkAvailability$ = Observable.from([{ name: 'content' }]) as any;
    contentDetailsPage.ionViewWillEnter();
  });

  it('#ionViewWillLeave', () => {
    contentDetailsPage.headerObservable = {
      unsubscribe: jest.fn()
    };
    spyOn(contentDetailsPage.headerObservable, 'unsubscribe');
    contentDetailsPage.ionViewWillLeave();
    expect(contentDetailsPage.headerObservable.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should be called handleNavBackButton()', () => {
    // arrange
    contentDetailsPage.cardData = { identifier: 'SAMPLE_IDENTIFIER' };
    // act
    contentDetailsPage.shouldGenerateEndTelemetry = true;
    contentDetailsPage.handleNavBackButton();
    // assert
    expect(navCtrlMock.pop).toHaveBeenCalled();
    expect(telemetryGeneratorServiceMock.generateEndTelemetry)
      .toHaveBeenCalledTimes(2);
  });

  it('should be called handleDeviceBackButton()', () => {
    // arrange
    ionicAppMock._modalPortal = {
      getActive: jest.fn()
    };
    ionicAppMock._overlayPortal = {
      getActive: jest.fn()
    };
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    contentDetailsPage.cardData = { identifier: 'SAMPLE_IDENTIFIER' };
    contentDetailsPage.shouldGenerateEndTelemetry = true;
    // spyOn(contentDetail).and.stub();

    // act
    contentDetailsPage.handleDeviceBackButton();
    platformMock.registerBackButtonAction.mock.calls[0][0].call(contentDetailsPage);

    // assert
    expect(telemetryGeneratorServiceMock.generateEndTelemetry)
      .toHaveBeenCalledTimes(2);
  });

  it('should be called subscribePlayEvent()', () => {
    // arrange
    buildParamServiceMock.getBuildConfigValue.mockResolvedValue('SOME_URL');
    // act
    contentDetailsPage.subscribePlayEvent();
    // assert
  });

  it('should be called checkLoggedInOrGuestUser()', () => {
    // arrange
    contentDetailsPage.isUserLoggedIn = false;
    const userLoggedIn = !appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    // act
    contentDetailsPage.checkLoggedInOrGuestUser();
    // assert
    expect(contentDetailsPage.isUserLoggedIn).toBe(userLoggedIn);
  });

  it('#calculateAvailableUserCount should set userCount value to 1', (done) => {
    // arrange
    const profileRequest = {
      local: true,
      server: false
    };
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    profileServiceMock.getAllProfiles.mockReturnValue(Observable.of([]));
    contentDetailsPage.userCount = 0;
    // act
    contentDetailsPage.calculateAvailableUserCount();
    // assert
    setTimeout(() => {
      expect(contentDetailsPage.userCount).toBe(1);
      done();
    }, 0);
  });

  it('#calculateAvailableUserCount should sets userCount with profiles.lenght', (done) => {
    // arrange
    const profiles = [
      100,
      200
    ];
    profileServiceMock.getAllProfiles.mockReturnValue(Observable.of(profiles));
    contentDetailsPage.userCount = 0;
    // act
    contentDetailsPage.calculateAvailableUserCount();
    // assert
    setTimeout(() => {
      expect(contentDetailsPage.userCount).toBe(profiles.length);
      done();
    }, 0);
  });

  it('should be called showSwitchUserAlert() if isStreaming is true', () => {
    // arrange
    commonUtilServiceMock.networkInfo = {
      isNetworkAvailable: false
    };
    // act
    contentDetailsPage.showSwitchUserAlert(true);
    // assert
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('INTERNET_CONNECTIVITY_NEEDED');
    expect(contentDetailsPage.showSwitchUserAlert(true)).toEqual(false);
  });

  it('should be called showSwitchUserAlert() if isStreaming is false', () => {
    // arrange
    commonUtilServiceMock.networkInfo = {
      isNetworkAvailable: true
    };
    networkMock.type = '3g';
    spyOn(contentDetailsPage, 'playContent').and.stub();
    // act
    contentDetailsPage.showSwitchUserAlert(false);
    // assert
    expect(networkMock.type).toBe('3g');
  });

  it('multiple users and highspeed network for showSwitchUserAlert()', () => {
    // arrange
    appGlobalServiceMock.isPlayerLaunched = false;
    contentDetailsPage.userCount = 3;
    networkMock.type = '3g';
    spyOn(contentDetailsPage, 'openPlayAsPopup').and.stub();
    // act
    contentDetailsPage.showSwitchUserAlert(false);
    // assert
    expect(contentDetailsPage.openPlayAsPopup).toHaveBeenCalled();
  });

  it('If network is 2g and not playerLaunched for showSwitchUserAlert()', () => {
    // arrange
    networkMock.type = '2g';
    contentDetailsPage.contentDownloadable = {
      sampleContentId: false
    };
    contentDetailsPage.content = {
      identifier: 'sampleContentId'
    };

    const popover = {
      present: jest.fn(),
      onDidDismiss: jest.fn((cb) => {
        cb(true);
      })
    };
    popoverCtrlMock.create.mockReturnValue(popover);
    appGlobalServiceMock.isPlayerLaunched = false;
    contentDetailsPage.userCount = 3;
    spyOn(contentDetailsPage, 'openPlayAsPopup').and.stub();
    // act
    contentDetailsPage.showSwitchUserAlert(false);
    // assert
    expect(contentDetailsPage.openPlayAsPopup).toHaveBeenCalled();
  });

  it('If network is 2g and playerLanched for showSwitchUserAlert()', () => {
    // arrange
    networkMock.type = '2g';
    contentDetailsPage.contentDownloadable = {
      sampleContentId: false
    };
    contentDetailsPage.content = {
      identifier: 'sampleContentId'
    };

    const popover = {
      present: jest.fn(),
      onDidDismiss: jest.fn((cb) => {
        cb(true);
      })
    };
    popoverCtrlMock.create.mockReturnValue(popover);
    appGlobalServiceMock.isPlayerLaunched = true;
    contentDetailsPage.userCount = 1;
    spyOn(contentDetailsPage, 'playContent').and.stub();
    // act
    contentDetailsPage.showSwitchUserAlert(false);
    // assert
    expect(contentDetailsPage.playContent).toHaveBeenCalled();
  });

  it('If network is not available for showSwitchUserAlert()', () => {
    // arrange
    networkMock.type = '';
    contentDetailsPage.contentDownloadable = {
      sampleContentId: false
    };
    contentDetailsPage.content = {
      identifier: 'sampleContentId'
    };
    spyOn(contentDetailsPage, 'playContent').and.stub();
    // act
    contentDetailsPage.showSwitchUserAlert(false);
    // assert
    expect(contentDetailsPage.playContent).toHaveBeenCalled();
  });

  it('#checkCurrentUserType should call getGuestUserInfo and set profileType', (done) => {
    // arrange
    const userType = 'Student';
    contentDetailsPage.isGuestUser = true;
    appGlobalServiceMock.getGuestUserInfo.mockResolvedValue(userType);
    // act
    contentDetailsPage.checkCurrentUserType();
    // assert
    setTimeout(() => {
      expect(appGlobalServiceMock.getGuestUserInfo).toHaveBeenCalled();
      expect(contentDetailsPage.profileType).toBe(userType);
      done();
    }, 0);
  });

  it('#checkCurrentUserType should go to catch and set profileType to blank', () => {
    // arrange
    contentDetailsPage.isGuestUser = true;
    appGlobalServiceMock.getGuestUserInfo.mockReturnValue(Promise.reject());
    // act
    contentDetailsPage.checkCurrentUserType();
    // assert
    expect(appGlobalServiceMock.getGuestUserInfo).toHaveBeenCalled();
    expect(contentDetailsPage.profileType).toBe('');
  });

  it('#checkBookmarkStatus should call showBookmarkMenu method', (done) => {
    // arrange
    sharedPreferencesMock.getString.mockReturnValue(Observable.of(false));
    spyOn(contentDetailsPage, 'showBookmarkMenu');
    // act
    contentDetailsPage.checkBookmarkStatus();
    // assert
    setTimeout(() => {
      expect(contentDetailsPage.showBookmarkMenu).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('#rateContent should call ', (done) => {
    // arrange
    contentDetailsPage.isContentPlayed = true;
    contentDetailsPage.content = {
      contentAccess: [1, 2]
    };
    const popupType = 'automatic' ;
    appRatingServiceMock.checkReadFile.mockReturnValue(false);
    sharedPreferencesMock.getString.mockReturnValue(Observable.of('2019/06/18 19:00'));
    spyOn(contentDetailsPage, 'contentRating').and.stub();
    spyOn(contentDetailsPage, 'validateAndCheckDateDiff');
    // act
    contentDetailsPage.rateContent(popupType);
    // assert
    expect(appRatingServiceMock.checkReadFile).toHaveBeenCalled();
    setTimeout(() => {
      expect(sharedPreferencesMock.getString).toHaveBeenCalled();
      expect(contentDetailsPage.validateAndCheckDateDiff).toReturnWith(Promise.resolve());
      done();
    }, 0);
  });

});

