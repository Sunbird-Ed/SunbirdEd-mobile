import { ProfileSettingsPage } from './profile-settings';
import {
  navCtrlMock,
  navParamsMock,
  formBuilderMock,
  formAndFrameworkUtilServiceMock,
  translateServiceMock,
  loadingControllerMock,
  sharedPreferencesMock,
  profileServiceMock,
  telemetryGeneratorServiceMock,
  appGlobalServiceMock,
  eventsMock,
  sunbirdQRScannerMock,
  platformMock,
  commonUtilServiceMock,
  containerServiceMock,
  ionicAppMock,
  appMock
} from '@app/__tests__/mocks';


describe('ProfileSettingsPage', () => {
  let profileSettingsPage: ProfileSettingsPage;

  beforeEach(() => {
    sharedPreferencesMock.getString.mockResolvedValue('SAMPLE_LANGUAGE');
    profileServiceMock.getCurrentUser.mockResolvedValue(JSON.stringify({'lang': 'SAMPLE_LANGUAGE'}));

    profileSettingsPage = new ProfileSettingsPage(navCtrlMock as any, navParamsMock as any, formBuilderMock as any,
    formAndFrameworkUtilServiceMock as any, translateServiceMock as any, loadingControllerMock as any,
    sharedPreferencesMock as any, profileServiceMock as any, telemetryGeneratorServiceMock as any,
    appGlobalServiceMock as any, eventsMock as any, sunbirdQRScannerMock as any, platformMock as any,
    commonUtilServiceMock as any, containerServiceMock as any, ionicAppMock as any, appMock as any);

    jest.resetAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should construct valid profileSettingsPage instance', (done) => {
    // assert
    setTimeout(() => {
      expect(profileSettingsPage).toBeTruthy();
      expect(profileSettingsPage.selectedLanguage = 'SAMPLE_LANGUAGE');
      done();
    }, 0);
  });
});
