import { GroupReportAlert } from './group-report-alert';

import {
    navParamsMock,
    viewControllerMock,
    navCtrlMock,
    loadingControllerMock,
    platformMock,
    ionicAppMock,
    reportServiceMock,
    translateServiceMock
} from '../../../__tests__/mocks';

describe.only('GroupReportAlertPage Component', () => {
    let groupReportAlert: GroupReportAlert;

    beforeEach(() => {
    translateServiceMock.get.mockReturnValue( { subscribe: jest.fn() } );
    navParamsMock.get.mockReturnValue({ 'row': () => {} } as any);
      // appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
      // buildParamServiceMock.getBuildConfigParam.mockResolvedValue('SOME_URL');
      groupReportAlert = new GroupReportAlert(navParamsMock as any, viewControllerMock as any,
        navCtrlMock as any, loadingControllerMock as any, platformMock as any, ionicAppMock as any,
        reportServiceMock as any, translateServiceMock as any);

      jest.resetAllMocks();
    });

    it('can load instance the instance of userReportPage', () => {
        expect(groupReportAlert).toBeTruthy();
      });

      it('getAssessmentByUser can make expected call', (done) => {
        groupReportAlert.assessment = {
            uids: [],
            content_id: 'sample_string',
            qid: 'sample_question_id',
            users: {
                get: () => {
                    return 'sample_assessment_uid';
                }
            }
        };
        const responseObj = [{
            result: 50,
            maxScore: 100,
            time: 1000
        }];
      reportServiceMock.getDetailsPerQuestion.mockResolvedValue(JSON.stringify(responseObj));
        groupReportAlert.getAssessmentByUser('users');
        setTimeout(() => {
            expect(reportServiceMock.getDetailsPerQuestion).toHaveBeenCalled();
            expect(groupReportAlert.fromUserAssessment).toBeTruthy();
            done();
        }, 10);
      });
   it('getAssessmentByUser can not make expected call', (done) => {
        groupReportAlert.assessment = {
            uids: [],
            content_id: 'sample_string',
            qid: 'sample_question_id',
            users: {
                get: () => {
                    return 'sample_assessment_uid';
                }
            }
        };
        const errorObj = [{
            error : 'testing error'
        }];
        const loadingMock = { dismiss: jest.fn() };
        loadingControllerMock.create.mockReturnValue( loadingMock );
        reportServiceMock.getDetailsPerQuestion.mockRejectedValue(JSON.stringify(errorObj)) ;
        groupReportAlert.getAssessmentByUser('users');

        setTimeout(() => {
        expect(loadingMock.dismiss).toHaveBeenCalled();
        done();
        }, 0 );
      });

      it('should call registerBackButtonAction() when ionViewWillEnter()', () => {
        platformMock.registerBackButtonAction.mockReturnValue(() => {});
        spyOn(groupReportAlert, 'dismissPopup');
        groupReportAlert.ionViewWillEnter();
        groupReportAlert.unregisterBackButton = platformMock.registerBackButtonAction.mock.calls[0][0].call();
        expect(groupReportAlert.dismissPopup).toBeCalled();
    });

    it('should call unregisterBackButton() when ionViewWillLeave() ', () => {
        groupReportAlert.unregisterBackButton = jest.fn();
        groupReportAlert.ionViewWillLeave();
        expect(groupReportAlert.unregisterBackButton).toBeCalled();
    });

      it(' should call dismissPopup() when activePortal is not null when dismissPopup()', () => {
        const obj = { dismiss: jest.fn() };
        (ionicAppMock._modalPortal as any) = { getActive: jest.fn(() => obj) };
        groupReportAlert.dismissPopup();
        expect(ionicAppMock._modalPortal.getActive().dismiss).toBeCalled();
    });

      it('convertTotalTime should give desired formatted output', () => {
          expect(groupReportAlert.convertTotalTime(1543918834812)).toEqual('25731980580:12');
      });

      it('translateMessage should give desired desired translated message', (done) => {
        translateServiceMock.get.mockReturnValue( { subscribe: jest.fn() } );
        groupReportAlert.translateMessage('TIME', 'en');
        setTimeout( () => {
            expect(translateServiceMock.get).toHaveBeenCalledWith('TIME', { '%s': 'en' });
            done();
        }, 0 );
    });
});
