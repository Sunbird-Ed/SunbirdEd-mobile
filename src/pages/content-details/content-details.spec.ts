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
  alertControllerMock,
  storageServiceMock,
  profileSwitchHandlerMock,
  appVersionMock,
  ratingHandlerMock,
  contentShareHandlerMock
} from '../../__tests__/mocks';
import { Observable, Subscription } from 'rxjs';
import 'jest';
import { PreferenceKey } from '../../app';
import { ContentDetailsPage } from './content-details';

describe('ContentDetailsPage Component', () => {
  let contentDetailsPage: ContentDetailsPage;

  beforeEach(() => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    buildParamServiceMock.getBuildConfigValue.mockResolvedValue('SOME_URL');
    buildParamServiceMock.getDeviceAPILevel.mockResolvedValue('');
    buildParamServiceMock.checkAppAvailability.mockResolvedValue('org.xwalk.core');
    utilityServiceMock.getDeviceAPILevel.mockResolvedValue('');
    utilityServiceMock.checkAppAvailability.mockResolvedValue('');

    contentDetailsPage = new ContentDetailsPage(
      profileServiceMock as any,
      contentServiceMock as any,
      eventBusServiceMock as any,
      sharedPreferencesMock as any,
      playerServiceMock as any,
      storageServiceMock as any,
      navCtrlMock as any,
      navParamsMock as any,
      zoneMock as any,
      eventsMock as any,
      popoverCtrlMock as any,
      platformMock as any,
      appGlobalServiceMock as any,
      ionicAppMock as any,
      telemetryGeneratorServiceMock as any,
      commonUtilServiceMock as any,
      courseUtilServiceMock as any,
      canvasPlayerServiceMock as any,
      fileMock as any,
      utilityServiceMock as any,
      networkMock as any,
      toastControllerMock as any,
      fileSizePipeMock as any,
      translateServiceMock as any,
      appHeaderServiceMock as any,
      contentShareHandlerMock as any,
      appVersionMock as any,
      profileSwitchHandlerMock as any,
      ratingHandlerMock as any
    );

    jest.resetAllMocks();
  });

  it('test instance initiation', () => {
    expect(contentDetailsPage).toBeTruthy();
  });

  it('should create valid instance for ContentDetailsPage', () => {
    spyOn(contentDetailsPage, 'subscribePlayEvent').and.stub();
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
      { handle: 'SAMPLE_HANDLE' },
      { handle: undefined }
    ];
    profileServiceMock.getAllProfiles.mockReturnValue(Observable.of(profiles));
    contentDetailsPage.userCount = 0;
    // act
    contentDetailsPage.calculateAvailableUserCount();
    // assert
    setTimeout(() => {
      expect(contentDetailsPage.userCount).toBe(1);
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

});

