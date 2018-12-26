import 'jest';
import { EnrolledCourseDetailsPage } from './enrolled-course-details';
import { navCtrlMock, navParamsMock, alertCtrlMock, contentServiceMock, zoneMock, fileUtilMock, popoverCtrlMock, profileServiceMock, courseServiceMock, buildParamServiceMock, shareUtilMock, socialSharingMock, sharedPreferencesMock, courseUtilServiceMock, platformMock, appGlobalServiceMock, telemetryGeneratorServiceMock, commonUtilServiceMock, eventsMock } from '../../__tests__/mocks';

describe('EnrolledCourseDetailsPage component', () => {
  let enrolledCourseDetailsPage: EnrolledCourseDetailsPage;

  beforeEach(() => {
    appGlobalServiceMock.getUserId.mockReturnValue('SOME_USER_TOKEN');
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);


    enrolledCourseDetailsPage = new EnrolledCourseDetailsPage(
      navCtrlMock as any,
      navParamsMock as any,
      alertCtrlMock as any,
      contentServiceMock as any,
      zoneMock as any,
      eventsMock as any,
      fileUtilMock as any,
      popoverCtrlMock as any,
      profileServiceMock as any,
      courseServiceMock as any,
      buildParamServiceMock as any,
      shareUtilMock as any,
      socialSharingMock as any,
      sharedPreferencesMock as any,
      courseUtilServiceMock as any,
      platformMock as any,
      appGlobalServiceMock as any,
      telemetryGeneratorServiceMock,
      commonUtilServiceMock as any
    );

    jest.resetAllMocks();

  })

  it('should create a valid instance of EnrolledCourseDetailsPage', () => {
    expect(enrolledCourseDetailsPage).not.toBeFalsy();
  });

})