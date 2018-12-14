import { ReportAlert } from './report-alert';
import {
    navCtrlMock,
    navParamsMock,
    viewControllerMock,
    ionicAppMock,
    platformMock
} from '../../../__tests__/mocks';

describe.only('CourseBatchesPage', () => {
    let reportAlertPage: ReportAlert;

    beforeEach(() => {
        navParamsMock.get.mockReturnValue({ 'row': () => {} } as any);
        reportAlertPage = new ReportAlert(
            navParamsMock as any,
            viewControllerMock as any,
            navCtrlMock as any,
            platformMock as any,
            ionicAppMock as any
        );

        jest.resetAllMocks();
    });

    it('instance created', () => {
        expect(reportAlertPage).toBeTruthy();
    });

    it('dismiss called', () => {
        reportAlertPage.cancel();
        expect(viewControllerMock.dismiss).toBeCalled();
    });

    it('should call registerBackButtonAction() when ionViewWillEnter()', () => {
        platformMock.registerBackButtonAction.mockReturnValue(() => {});
        spyOn(reportAlertPage, 'dismissPopup');
        reportAlertPage.ionViewWillEnter();
        reportAlertPage.unregisterBackButton = platformMock.registerBackButtonAction.mock.calls[0][0].call();
        expect(reportAlertPage.dismissPopup).toBeCalled();
    });

    it('should call unregisterBackButton() when ionViewWillLeave() ', () => {
        reportAlertPage.unregisterBackButton = jest.fn();
        reportAlertPage.ionViewWillLeave();
        expect(reportAlertPage.unregisterBackButton).toBeCalled();
    });

    it(' should call dismissPopup() when activePortal is not null when dismissPopup()', () => {
        const obj = { dismiss: jest.fn() };
        (ionicAppMock._modalPortal as any) = { getActive: jest.fn(() => obj) };
        reportAlertPage.dismissPopup();
        expect(ionicAppMock._modalPortal.getActive().dismiss).toBeCalled();
    });

    it(' should call pop() when activePortal is null when dismissPopup()', () => {
        // const obj = { dismiss: jest.fn() };
        (ionicAppMock._modalPortal as any) = { getActive: jest.fn(() => null) };
        (ionicAppMock._overlayPortal as any) = { getActive: jest.fn(() => null) };
        reportAlertPage.dismissPopup();
        expect(navCtrlMock.pop).toBeCalled();
    });
});
