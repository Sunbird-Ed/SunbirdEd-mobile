import 'jest';
import { SettingsPage } from './settings';
import {
    navCtrlMock, appVersionMock, socialSharingMock,
    deviceInfoServiceMock, sharedPreferencesMock, telemetryServiceMock,
    shareUtilMock, commonUtilServiceMock, appGlobalServiceMock, translateServiceMock, supportfileMock,
} from '../../__tests__/mocks';
import { ImpressionType, PageId, Environment, InteractType, InteractSubtype } from 'sunbird';
import { LanguageSettingsPage } from '../language-settings/language-settings';
import { DatasyncPage } from './datasync/datasync';
import { AboutUsPage } from './about-us/about-us';
describe.only('SettingsPage', () => {
    let settingsPage: SettingsPage;

    beforeEach(() => {
        deviceInfoServiceMock.getDeviceID.mockResolvedValue('DEVICE_ID');
        settingsPage = new SettingsPage(navCtrlMock as any, appVersionMock as any,
            socialSharingMock as any, translateServiceMock as any, deviceInfoServiceMock as any,
            sharedPreferencesMock as any, telemetryServiceMock as any, shareUtilMock as any,
            commonUtilServiceMock as any, appGlobalServiceMock as any
        );
        (window as any).supportfile = supportfileMock;
        jest.resetAllMocks();
    });
    it('can load instance', () => {
        expect(settingsPage).toBeTruthy();
    });
    it('should get the AppName in ionViewWillEnter calls', (done) => {
        // arrange
        appVersionMock.getAppName.mockResolvedValue('SHARE_APP');
        // act
        settingsPage.ionViewWillEnter();
        // assert
        setTimeout(() => {
            expect(settingsPage.shareAppLabel = 'SHARE_APP');
            done();
        }, 0);
    });
    it('should load the impressionEvent in ionViewDidLoad', () => {
        // arrange
        // act
        settingsPage.ionViewDidLoad();
        // assert
        expect(telemetryServiceMock.impression).toHaveBeenCalledWith(
            expect.objectContaining({ type: ImpressionType.VIEW, pageId: PageId.SETTINGS, env: Environment.SETTINGS }));
    });
    it('should handle the current Language when ionViewDidEnter hits', (done) => {
        // arrange
        sharedPreferencesMock.getString.mockResolvedValue('en');
        // act
        settingsPage.ionViewDidEnter();
        // assert
        expect(settingsPage.chosenLanguageString = 'CURRENT_LANGUAGE');
        setTimeout(() => {
            expect(settingsPage.selectedLanguage = 'en');
            done();
        }, 0);
    });
    it('should handle ionViewDidLeave when page leaves', () => {
        // arrange
        // act
        settingsPage.ionViewDidLeave();
        supportfileMock.removeFile.mock.calls[0][0].call(settingsPage, '{}');
        // assert
        expect(supportfileMock.removeFile).toHaveBeenCalled();
    });
    it('should go to languageSettings page', () => {
        // arrange
        spyOn(settingsPage, 'generateInteractTelemetry').and.stub();
        // act
        settingsPage.goToLanguageSetting();
        // assert
        expect(settingsPage.generateInteractTelemetry).toHaveBeenCalledWith('TOUCH', 'language-clicked');
        expect(navCtrlMock.push).toHaveBeenCalledWith(LanguageSettingsPage, {
            isFromSettings: true
        });
    });
    it('should go to dataSync page when clicked', () => {
        // arrange
        spyOn(settingsPage, 'generateInteractTelemetry').and.stub();
        // act
        settingsPage.dataSync();
        expect(settingsPage.generateInteractTelemetry).toHaveBeenCalledWith('TOUCH', 'data-sync-clicked');
        expect(navCtrlMock.push).toHaveBeenCalledWith(DatasyncPage);
    });
    it('should go to aboutUsPage when clicked', () => {
        // arrange
        spyOn(settingsPage, 'generateInteractTelemetry').and.stub();
        // act
        settingsPage.aboutUs();
        // assert
        expect(settingsPage.generateInteractTelemetry).toHaveBeenCalledWith('TOUCH', 'about-app-clicked');
        expect(navCtrlMock.push).toHaveBeenCalledWith(AboutUsPage);
    });
    it('should send message with attachedFile when support clicked', (done) => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        sharedPreferencesMock.getString.mockResolvedValue('true');
        deviceInfoServiceMock.getDeviceID.mockResolvedValue('DEVICE_ID');
        socialSharingMock.shareViaEmail.mockResolvedValue('VIA_EMAIL');
        spyOn(settingsPage, 'generateInteractTelemetry').and.stub();
        // act
        settingsPage.sendMessage();
        supportfileMock.shareSunbirdConfigurations.mock.calls[0][0].call(settingsPage, '{}');
        // assert
        setTimeout(() => {
            expect(settingsPage.deviceId = 'DEVICE_ID');
            expect(settingsPage.generateInteractTelemetry).toHaveBeenCalledWith('TOUCH', 'support-clicked');
            expect(sharedPreferencesMock.putString).toHaveBeenCalledWith('sunbird_config_file_path', {});
            expect(socialSharingMock.shareViaEmail).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should share the app when clicked', (done) => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        spyOn(settingsPage, 'generateInteractTelemetry').and.stub();
        socialSharingMock.share.mockResolvedValue('SHARE');
        // act
        settingsPage.shareApp();
        shareUtilMock.exportApk.mock.calls[0][0].call(settingsPage, 'SOME_PATH');
        // assert
        expect(settingsPage.generateInteractTelemetry).toHaveBeenCalledWith('TOUCH', 'share-app-clicked');
        expect(settingsPage.generateInteractTelemetry).toHaveBeenCalledWith('TOUCH', 'share-app-initiated');
        setTimeout(() => {
            expect(socialSharingMock.share).toHaveBeenCalledWith('', '', 'file://SOME_PATH', '');
            done();
        }, 0);
    });
    it('should generate Interacet Telemetry', () => {
        // arrange
        // act
        settingsPage.generateInteractTelemetry('InteractType', 'InteractSubType');
        // assert
        expect(telemetryServiceMock.interact).toHaveBeenCalledWith(expect.objectContaining({
            env: Environment.SETTINGS, id: PageId.SETTINGS,
             subType: 'InteractSubType', 'type': 'InteractType', 'values': []
        }));
    });
});
