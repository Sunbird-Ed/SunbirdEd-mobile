// import { ContentDetailsPage } from './content-details';
// import {
//   navCtrlMock,
//   navParamsMock,
//   contentServiceMock,
//   zoneMock,
//   eventsMock,
//   fileUtilMock,
//   popoverCtrlMock,
//   shareUtilMock,
//   sharedPreferencesMock,
//   socialSharingMock,
//   platformMock,
//   buildParamServiceMock,
//   courseServiceMock,
//   appGlobalServiceMock,
//   alertCtrlMock,
//   ionicAppMock,
//   profileServiceMock,
//   telemetryGeneratorServiceMock,
//   commonUtilServiceMock,
//   courseUtilServiceMock,
//   deviceInfoServiceMock
// } from './../../__tests__/mocks';

// describe('ContentDetailsPage test cases!', () => {
//   let contentDetails: ContentDetailsPage;

//   beforeEach(() => {

//     buildParamServiceMock.getBuildConfigParam.mockResolvedValue(true);
//     appGlobalServiceMock.getGuestUserInfo.mockResolvedValue(true);
//     deviceInfoServiceMock.getDeviceAPILevel.mockResolvedValue(true);
//     deviceInfoServiceMock.checkAppAvailability.mockResolvedValue(true);
//     platformMock.resume = {
//         subscribe: jest.fn()
//     };
//     contentDetails = new ContentDetailsPage(
//       navCtrlMock as any,
//       navParamsMock as any,
//       contentServiceMock as any,
//       zoneMock as any,
//       eventsMock as any,
//       fileUtilMock as any,
//       popoverCtrlMock as any,
//       shareUtilMock as any,
//       sharedPreferencesMock as any,
//       socialSharingMock as any,
//       platformMock as any,
//       buildParamServiceMock as any,
//       courseServiceMock as any,
//       appGlobalServiceMock as any,
//       alertCtrlMock as any,
//       ionicAppMock as any,
//       profileServiceMock as any,
//       telemetryGeneratorServiceMock as any,
//       commonUtilServiceMock as any,
//       courseUtilServiceMock as any,
//       deviceInfoServiceMock as any
//     );

//     jest.resetAllMocks();
//   });

//   it('test instance initiation', () => {
//     expect(contentDetails).toBeTruthy();
//   });

//   it('#ionViewWillEnter', () => {
//       navParamsMock.get.mockReturnValueOnce({ depth: 'test' })
//         .mockReturnValueOnce(false)
//         .mockReturnValue(false);
//         // .mockReturnValueOnce([] as any)
//         // .mockReturnValueOnce(false);
//       spyOn(contentDetails, 'setContentDetails').and.stub();
//       contentDetails.ionViewWillEnter();
//       expect(navParamsMock.get).toBeCalledTimes(9);

//   });

//   it('#ionViewWillLeave', () => {
//     contentDetails.resume = {
//       unsubscribe: jest.fn()
//     };
//     contentDetails.ionViewWillLeave();
//     expect(eventsMock.unsubscribe).toHaveBeenCalled();
//     // expect(resume.unsubscribe).toHaveBeenCalled);
//   });
// });

import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import {
  navCtrlMock,
    navParamsMock,
    contentServiceMock,
    zoneMock,
    eventsMock,
    fileUtilMock,
    popoverCtrlMock,
    shareUtilMock,
    sharedPreferencesMock,
    socialSharingMock,
    platformMock,
    buildParamServiceMock,
    courseServiceMock,
    appGlobalServiceMock,
    alertCtrlMock,
    ionicAppMock,
    profileServiceMock,
    telemetryGeneratorServiceMock,
    commonUtilServiceMock,
    courseUtilServiceMock,
    deviceInfoServiceMock,
    translateServiceMock
} from '@app/__tests__/mocks';
import { mockRes } from '@app/pages/collection-details-etb/collection-details-etb.spec.data';
import { ShareUrl } from '@app/app';
import { EnrolledCourseDetailsPage } from '@app/pages/enrolled-course-details';
import { ContentDetailsPage } from '@app/pages/content-details/content-details';
import 'jest';
import { networkMock } from '../../__tests__/mocks';

describe('CollectionDetailsPage Component', () => {
  let contentDetailsPage: ContentDetailsPage;

  beforeEach(() => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    buildParamServiceMock.getBuildConfigParam.mockResolvedValue('SOME_URL');

    contentDetailsPage = new ContentDetailsPage(navCtrlMock as any, navParamsMock as any,
      contentServiceMock as any, zoneMock as any, eventsMock as any, fileUtilMock as any, popoverCtrlMock as any,
      platformMock as any,  socialSharingMock as any, shareUtilMock as any,
      buildParamServiceMock as any, appGlobalServiceMock as any, commonUtilServiceMock as any,
      telemetryGeneratorServiceMock as any, courseUtilServiceMock as any, deviceInfoServiceMock as any, networkMock as any, 
      translateServiceMock as any);

    jest.resetAllMocks();
  });

  it('test instance initiation', () => {
    expect(contentDetailsPage).toBeTruthy();
  });

  it('#ionViewWillEnter', () => {
      navParamsMock.get.mockReturnValueOnce({ depth: 'test' })
        .mockReturnValueOnce(false)
        .mockReturnValue(false);
        // .mockReturnValueOnce([] as any)
        // .mockReturnValueOnce(false);
      spyOn(contentDetailsPage, 'setContentDetails').and.stub();
      contentDetailsPage.ionViewWillEnter();
      expect(navParamsMock.get).toBeCalledTimes(9);

  });

  it('#ionViewWillLeave', () => {
    contentDetailsPage.resume = {
      unsubscribe: jest.fn()
    };
    contentDetailsPage.ionViewWillLeave();
    expect(eventsMock.unsubscribe).toHaveBeenCalled();
    // expect(resume.unsubscribe).toHaveBeenCalled);
  });
});
