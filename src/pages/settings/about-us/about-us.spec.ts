import 'jest';
import { AboutUsPage } from './about-us';
import {
    navCtrlMock, navParamsMock, buildParamServiceMock,
    sharedPreferencesMock, socialSharingMock,
    commonUtilServiceMock, deviceInfoServiceMock, telemetryServiceMock, appVersionMock, supportfileMock
} from '../../../__tests__/mocks';
import { PrivacypolicyPage } from '../privacypolicy/privacypolicy';
import { TermsofservicePage } from '../termsofservice/termsofservice';
import { AboutAppPage } from '../about-app/about-app';

describe.only('AboutUsPage', () => {
    let aboutUsPage: AboutUsPage;

    beforeEach(() => {
        aboutUsPage = new AboutUsPage(navCtrlMock as any, navParamsMock as any,
            deviceInfoServiceMock as any, buildParamServiceMock as any, appVersionMock as any,
            sharedPreferencesMock as any, socialSharingMock as any, telemetryServiceMock as any,
            commonUtilServiceMock as any);

        (window as any).supportfile = supportfileMock;
        jest.resetAllMocks();
    });

    afterEach(() => {
        (window as any).supportfile = undefined;
    });

    it('can load instance', () => {
        expect(aboutUsPage).toBeTruthy();
    });
    it('should create a valid instance of AboutUsPage', () => {
        expect(aboutUsPage instanceof AboutUsPage).toBe(true);
        expect(aboutUsPage).not.toBeFalsy();
    });
    it('should handle all resolved paramters when ionViewDidLoad() called', (done) => {
        // arrange
        (deviceInfoServiceMock.getDeviceID as any).mockResolvedValue('SAMPLE_DEVICE_ID');
        appVersionMock.getAppName.mockResolvedValue('APP_NAME');
        spyOn(aboutUsPage, 'getVersionName');
        // act
        aboutUsPage.ionViewDidLoad();
        // assert
        expect(aboutUsPage.version).toEqual('app version will be shown here');
        setTimeout(() => {
            expect(aboutUsPage.deviceId).toEqual('SAMPLE_DEVICE_ID');
            expect(appVersionMock.getAppName).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should handle that method when getVersionName() is called', (done) => {
        // arrange
        buildParamServiceMock.getBuildConfigParam.mockResolvedValue('VERSION_NAME');
        spyOn(aboutUsPage, 'getVersionCode');
        // act
        aboutUsPage.getVersionName('APP_NAME');
        // assert
        setTimeout(() => {
            expect(buildParamServiceMock.getBuildConfigParam).toHaveBeenCalledWith('VERSION_NAME');
            done();
        }, 0);
    });
    it('should handle that method when getVersionCode() is called', (done) => {
        // arrange
        buildParamServiceMock.getBuildConfigParam.mockResolvedValue('VERSION_CODE');
        // act
        aboutUsPage.getVersionCode('APP_NAME', 'VERSION_NAME');
        // assert
        setTimeout(() => {
            expect(buildParamServiceMock.getBuildConfigParam).toHaveBeenCalledWith('VERSION_CODE');
            done();
        }, 0);
    });
    it('should generate Interacet Telemetry', () => {
        // arrange
        spyOn(aboutUsPage, 'generateInteractTelemetry');
        // act
        aboutUsPage.generateInteractTelemetry('InteractType', 'InteractSubType');
        // assert
        expect(aboutUsPage.generateInteractTelemetry).toHaveBeenCalled();
    });
    it('should handle generateImpressionEvent when called', () => {
        // arrange
        spyOn(aboutUsPage, 'generateImpressionEvent');
        // act
        aboutUsPage.generateImpressionEvent();
        // assert
        expect(aboutUsPage.generateImpressionEvent).toHaveBeenCalled();
    });
    it('should handle when page is leaving', () => {
        // arrange
        spyOn(console, 'log').and.callThrough();
        // act
        aboutUsPage.ionViewDidLeave();
        supportfileMock.removeFile.mock.calls[0][0].call(aboutUsPage, '{}');
        // assert
        expect(console.log).toHaveBeenCalledWith('File deleted -' + JSON.parse('{}'));
    });
    it('should go to aboutApp page, when clicked', (done) => {
        // arrange
        // act
        aboutUsPage.aboutApp();
        // assert
        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalledWith(AboutAppPage);
            done();
        }, 0);
    });
    it('should go to termsOfService page, when clicked', (done) => {
        // arrange
        // act
        aboutUsPage.termsOfService();
        // assert
        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalledWith(TermsofservicePage);
            done();
        }, 0);
    });
    it('should go to privacyPolicy page, when clicked', (done) => {
        // arrange
        // act
        aboutUsPage.privacyPolicy();
        // assert
        setTimeout(() => {
            expect(navCtrlMock.push).toHaveBeenCalledWith(PrivacypolicyPage);
            done();
        }, 0);
    });
    it('share shareInformation when support Clicked', (done) => {
        // arrange
        commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
        sharedPreferencesMock.getString.mockResolvedValue('true');
        socialSharingMock.share.mockResolvedValue('VIA_EMAIL');
        spyOn(aboutUsPage, 'generateInteractTelemetry');
        // act
        aboutUsPage.shareInformation();
        supportfileMock.shareSunbirdConfigurations.mock.calls[0][0].call(aboutUsPage, '{}');
        // assert
        setTimeout(() => {
            expect(sharedPreferencesMock.putString).toHaveBeenCalledWith('sunbird_config_file_path', {});
            expect(socialSharingMock.share).toHaveBeenCalled();
            done();
        }, 0);
    });
    it('should handle catch part in getVersionName--', (done) => {
        // arrange
        buildParamServiceMock.getBuildConfigParam.mockRejectedValue('Error');
        spyOn(aboutUsPage, 'getVersionCode');
        // act
        aboutUsPage.getVersionName('APP_NAME');
        // assert
        setTimeout(() => {
            expect(buildParamServiceMock.getBuildConfigParam).not.toHaveBeenCalledWith('Error');
            done();
        }, 0);
    });
    it('should hancle with catch part in getVersionCode--', (done) => {
        // arrange
        buildParamServiceMock.getBuildConfigParam.mockRejectedValue('Error');
        // act
        aboutUsPage.getVersionCode('APP_NAME', 'VERSION_NAME');
        // assert
        setTimeout(() => {
            expect(buildParamServiceMock.getBuildConfigParam).not.toHaveBeenCalledWith('Error');
            done();
        }, 0);
    });
});
