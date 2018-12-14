import { mockRes } from './../../courses/courses.spec.data';
import {UserReportPage} from '../user-report/user-report';

import {
    navCtrlMock,
    navParamsMock,
    reportServiceMock,
    transferMock,
    translateServiceMock,
    fileMock,
    datePipeMock,
    loadingMock,
    zoneMock,
    appGlobalServiceMock,
    appVersionMock,
    deviceInfoServiceMock,
    socialSharingMock,
    telemetryGeneratorServiceMock,
    commonUtilServiceMock
} from '../../../__tests__/mocks';
import myMap, {csvdata} from './user-report.spec.data';
import 'jest';

describe.only('UserReportPage Component', () => {
  let userReportPage: UserReportPage;

  beforeEach(() => {
    translateServiceMock.get.mockReturnValue( { subscribe: jest.fn() } );
    deviceInfoServiceMock.getDownloadDirectoryPath.mockResolvedValue('default');

    // appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    // buildParamServiceMock.getBuildConfigParam.mockResolvedValue('SOME_URL');

    userReportPage = new UserReportPage(navCtrlMock as any, navParamsMock as any,
        reportServiceMock as any, transferMock as any, translateServiceMock as any, fileMock as any,
         datePipeMock as any, loadingMock as any, zoneMock as any, appGlobalServiceMock as any, appVersionMock as any,
         deviceInfoServiceMock as any, socialSharingMock as any, telemetryGeneratorServiceMock as any,
         commonUtilServiceMock as any);

    jest.resetAllMocks();
  });
  it('can load instance the instance of userReportPage', () => {
    expect(userReportPage).toBeTruthy();
  });

  it('IonViewDidLoad should make expected calls', () => {
    deviceInfoServiceMock.getDeviceID.mockResolvedValue('1111');
    appVersionMock.getAppName.mockResolvedValue('test');
    userReportPage.ionViewDidLoad();
    expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalled();
    expect(deviceInfoServiceMock.getDeviceID).toHaveBeenCalled();
  });

  it('ionViewWillEnter should make expected calls', (done) => {
    const data = {
      'contentId': 'domain_4083',
      'correctAnswers': 2,
      'hierarchyData': '',
      'noOfQuestions': 5,
      'totalMaxScore': 8,
      'totalScore': 5,
      'totalTimespent': 45,
      'uid': '6e033070-8d74-41bc-bbe7-290ab8b6463a',
      'name': 'कुत्ता और रोटी',
      'lastUsedTime': 1539149638412
  };
    navParamsMock.get.mockReturnValue(data);
    reportServiceMock.getDetailReport.mockResolvedValue(myMap);
    loadingMock.create.mockReturnValue( { present: jest.fn() } );
    loadingMock.create.mockReturnValue({
      present: () => {
      },
      dismiss: () => Promise.resolve()
    });
    userReportPage.ionViewWillEnter();

    expect(reportServiceMock.getDetailReport).toHaveBeenCalled();

    setTimeout(() => {
           zoneMock.run.mock.calls[0][0].call(userReportPage, undefined);
        expect(userReportPage.assessmentData).toBeTruthy();
        done();
      // expect(userReportPage.assessmentData).toBeTruthy();
    }, 0);
  });

  it('importcsv should make expected calls', () => {
    userReportPage.response = [{uid : '30c6de21-d184-446a-b9d8-edfedff910ef', contentId: 'domain_4083'}];
    userReportPage.deviceId = '96360f6fb9f309691ce1ea41dcfa12ab40b61af3';
    const body = {};
    fileMock.writeFile.mockResolvedValue('test val');
    spyOn(userReportPage, 'convertToCSV').and.returnValue(csvdata);
    userReportPage.importcsv(body);
    expect(userReportPage.convertToCSV).toHaveBeenCalled();
  });
  it('convertToCSV should give csv', () => {
    userReportPage.profile = [{uid : '30c6de21-d184-446a-b9d8-edfedff910ef', handle: 'domain_4083'}];
    userReportPage.reportSummary = {uid: '30c6de21-d184-446a-b9d8-edfedff910ef',
      contentId: 'test',
      name: 'test',
      lastUsedTime: 10,
      noOfQuestions: 20,
      correctAnswers: 4,
      totalTimespent: 5,
      hierarchyData: 'test',
      totalMaxScore: 5,
      totalScore: 4};
    userReportPage.response = csvdata;
    const csv = userReportPage.convertToCSV(csvdata);
    datePipeMock.transform.mockReturnValue('');
    console.log(csv);
    expect(csv).toBeTruthy();
  });
});
