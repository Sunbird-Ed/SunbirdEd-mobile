import { domSanitizerMock,
         telemetryGeneratorServiceMock,
         sharedPreferencesMock,
         profileServiceMock,
         contentServiceMock,
         appVersionMock,
         socialSharingMock,
         deviceInfoServiceMock,
         appGlobalServiceMock,
         formAndFrameworkUtilServiceMock,
         headerServiceMock,
         telemetryServiceMock} from './../../__tests__/mocks';
import { FaqPage } from './faq';
import { mockRes } from '../course-batches/course-batches.spec.data';
import {
    authServiceMock,
    commonUtilServiceMock,
    courseServiceMock,
    eventsMock, navCtrlMock,
    navParamsMock,
    zoneMock,
    loadingControllerMock
} from '../../__tests__/mocks';
import 'jest';
import { Observable } from 'rxjs';
import { Environment, PageId, InteractType } from '../../service/telemetry-constants';

declare const supportfile;

describe.only('FaqPage', () => {
    let faqPage: FaqPage;

    beforeAll(() => {
        faqPage = new FaqPage (loadingControllerMock as any,
            domSanitizerMock as any,
            telemetryGeneratorServiceMock as any,
            sharedPreferencesMock as any,
            profileServiceMock as any,
            contentServiceMock as any,
            appVersionMock as any,
            socialSharingMock as any,
            deviceInfoServiceMock as any,
            commonUtilServiceMock as any,
            appGlobalServiceMock as any,
            headerServiceMock as any,
            formAndFrameworkUtilServiceMock as any);
});


it('can load instance', () => {
    expect(faqPage).toBeTruthy();
});

it('should send message with attachedFile when initiate email clicked', (done) => {
    // arrange
    commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
    sharedPreferencesMock.getString.mockResolvedValue('true');
    deviceInfoServiceMock.getDeviceID.mockResolvedValue('DEVICE_ID');
    socialSharingMock.shareViaEmail.mockResolvedValue('VIA_EMAIL');
    profileServiceMock.getAllProfiles.mockReturnValue(Observable.of('test'));
    contentServiceMock.getContents.mockReturnValue(Observable.of('test'));
    sharedPreferencesMock.putString.mockReturnValue(Observable.of('test'));
    sharedPreferencesMock.getString.mockReturnValue(Observable.of('test'));

    spyOn(faqPage, 'generateInteractTelemetry').and.stub();
    // act
    faqPage.sendMessage('Mail Body');

    spyOn(supportfile, 'shareSunbirdConfigurations').and.callFake((arg1, arg2, cb) => cb());
    // assert
    setTimeout(() => {
        expect(faqPage.deviceId = 'DEVICE_ID');
        expect(sharedPreferencesMock.putString).toHaveBeenCalled();
        expect(socialSharingMock.shareViaEmail).toHaveBeenCalled();
        done();
    }, 0);
});
it('should generate Interact Telemetry', () => {
    // arrange
    // act
    faqPage.generateInteractTelemetry('InteractSubType', []);
    // assert
    expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalled();
});
describe('ionViewWillEnter()', () => {
    const loading = {
      present: jest.fn(),
      dismissAll: jest.fn()
    };
    beforeEach(() => {
        jest.resetAllMocks();
        loadingControllerMock.create.mockReturnValue(loading);
    });
    headerServiceMock.showHeaderWithBackButton.mockReturnValue('');
it('should show loadingSpinner on page load', async () => {
    // arrange
    appVersionMock.getAppName.mockResolvedValue('appName');
    sharedPreferencesMock.getString.mockReturnValue(Observable.of('English'));
    // act
    await faqPage.ionViewWillEnter();

    // assert
    expect(loadingControllerMock.create).toHaveBeenCalled();
    expect(loading.present).toHaveBeenCalled();
  });
});
it('receiveMessage should call generateInteractTelemetry on event listening', () => {
    // arrange
    spyOn(faqPage, 'generateInteractTelemetry').and.stub();
    // act
    faqPage.receiveMessage( {data: {action: 'test',
                                    initiateEmailBody: ''
                                   }
                            });
    // assert
    expect(faqPage.generateInteractTelemetry).toHaveBeenCalled();
});
it('receiveMessage should call sendMessage on event initiate-email-clicked', () => {
    // arrange
    appGlobalServiceMock.getCurrentUser.mockReturnValue({
        profileType : 'Teacher',
        board : ['Tamil'],
        medium : ['English'],
        grade: ['10']
    });
    appGlobalServiceMock.getSelectedBoardMediumGrade.mockReturnValue('Tamil, English, 10');
    spyOn(faqPage, 'generateInteractTelemetry').and.stub();
    spyOn(faqPage, 'sendMessage' ).and.stub();
    // act
    faqPage.receiveMessage( {data: {action: 'initiate-email-clicked',
                                    initiateEmailBody: 'Test Body'
                                  }
                           });
// assert
    expect(faqPage.generateInteractTelemetry).toHaveBeenCalled();
    expect(faqPage.sendMessage).
    toHaveBeenCalledWith('From: Teacher, Tamil, English, 10.<br> <br> <b>Ticket summary</b> <br> <br>Test Body');
});
it('on error should set the local Url', () => {
    const localurl = 'file:///android_asset/www/assets/faq/consumption-faqs.html?selectedlang=en&randomid=';
    faqPage.onError();
    expect(faqPage.faq.url).toContain(localurl);
});

});
