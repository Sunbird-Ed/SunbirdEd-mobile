import {
  alertCtrlMock,
  appGlobalServiceMock,
  buildParamServiceMock,
  commonUtilServiceMock,
  contentServiceMock,
  courseServiceMock,
  courseUtilServiceMock,
  eventsMock,
  fileUtilMock,
  navCtrlMock,
  navParamsMock,
  platformMock,
  popoverCtrlMock,
  sharedPreferencesMock,
  shareUtilMock,
  socialSharingMock,
  telemetryGeneratorServiceMock,
  userProfileServiceMock,
  zoneMock
} from '@app/__tests__/mocks';
import {EnrolledCourseDetailsPage} from './enrolled-course-details';
import {mockRes} from '@app/pages/enrolled-course-details/enrolled-course-details.spec.data';
import {Environment, Mode, PageId, ProfileType} from 'sunbird';



describe('EnrolledCourseDetailsPage Component', () => {
  let enrolled: EnrolledCourseDetailsPage;
  beforeEach((() => {
    appGlobalServiceMock.getGuestUserInfo.mockResolvedValue(true);
    enrolled = new EnrolledCourseDetailsPage(
      navCtrlMock as any,
      navParamsMock as any,
      alertCtrlMock as any,
      contentServiceMock as any,
      zoneMock as any,
      eventsMock as any,
      fileUtilMock as any,
      popoverCtrlMock as any,
      userProfileServiceMock as any,
      courseServiceMock as any,
      buildParamServiceMock as any,
      shareUtilMock as any,
      socialSharingMock as any,
      sharedPreferencesMock as any,
      courseUtilServiceMock as any,
      platformMock as any,
      appGlobalServiceMock as any,
      telemetryGeneratorServiceMock as any,
      commonUtilServiceMock as any
    );

    jest.resetAllMocks();
  }));

  beforeEach(() => {
    // TBD new declarations
    // spyObj = spyOn(prefernce, 'getString');
    // spyObj.and.returnValue(Promise.resolve(ProfileType.TEACHER));
    // fixture = TestBed.createComponent(EnrolledCourseDetailsPage);
    // component = fixture.componentInstance;
  });



  // beforeEach(() => {
  //   inject([TranslateService], (service) => {
  //     translateService = service;
  //     translateService.use('en');
  //   });
  // });

  it('should ', () => {
    expect(enrolled).toBeTruthy();
  });

  it('#subscribeUtilityEvents should return the base url', (done) => {
    buildParamServiceMock.getBuildConfigParam.mockResolvedValue(Promise.resolve('SAMPLE_BASE_URL'));
    enrolled.subscribeUtilityEvents();
    setTimeout(() => {
      expect(enrolled.baseUrl).toBe('SAMPLE_BASE_URL');
      done();
    }, 100);
  });

  it('#subscribeUtilityEvents should handle error condition', (done) => {
    buildParamServiceMock.getBuildConfigParam.mockRejectedValue(true);
    enrolled.subscribeUtilityEvents();
    setTimeout(() => {
      expect(enrolled.baseUrl).toBe('');
      done();
    }, 100);
  });

  it('#subscribeUtilityEvents should receive the enroll success event', () => {
    buildParamServiceMock.getBuildConfigParam.mockRejectedValue(true);
    eventsMock.subscribe.mockImplementation((arg, success) => {
      return success(mockRes.enrollCourseEvent);
    });
    enrolled.subscribeUtilityEvents();
    expect(enrolled.batchId).toBe('1234');
  });

  it('#subscribeUtilityEvents should handle device Back button', () => {
    buildParamServiceMock.getBuildConfigParam.mockRejectedValue(true);
    platformMock.registerBackButtonAction.mockImplementation((success) => {
      return success();
    });
    spyOn(enrolled, 'generateEndEvent').and.callThrough().and.callFake(() => { });
    enrolled.objId = 'SAMPLE_ID';
    enrolled.objType = 'SAMPLE_TYPE';
    enrolled.objVer = 'SAMPLE_VERSION';
    (enrolled.backButtonFunc as any) = jest.fn();
    enrolled.subscribeUtilityEvents();
    expect(enrolled.generateEndEvent).toHaveBeenCalledWith('SAMPLE_ID', 'SAMPLE_TYPE', 'SAMPLE_VERSION');
    expect(enrolled.backButtonFunc).toBeUndefined();
  });

  it('#subscribeUtilityEvents should generate QRscan session End event', () => {
    buildParamServiceMock.getBuildConfigParam.mockResolvedValue(true);
    platformMock.registerBackButtonAction.mockImplementation((success) => {
      return success();
    });
    spyOn(enrolled, 'generateEndEvent').and.callThrough();
    spyOn(enrolled, 'generateQRSessionEndEvent').and.callThrough().and.callFake(() => { });
    enrolled.objId = 'SAMPLE_ID';
    enrolled.objType = 'SAMPLE_TYPE';
    enrolled.objVer = 'SAMPLE_VERSION';
    (enrolled.backButtonFunc as any) = jest.fn();
    enrolled.shouldGenerateEndTelemetry = true;
    enrolled.course = mockRes.sampleCourse;
    enrolled.source = PageId.COURSES;
    enrolled.subscribeUtilityEvents();
    expect(enrolled.generateEndEvent).toHaveBeenCalledWith('SAMPLE_ID', 'SAMPLE_TYPE', 'SAMPLE_VERSION');
    const telemetryObject: any = {};
    telemetryObject.id = 'SAMPLE_ID';
    telemetryObject.type = 'SAMPLE_TYPE';
    telemetryObject.version = 'SAMPLE_VERSION';
    expect(telemetryGeneratorServiceMock.generateEndTelemetry).toHaveBeenCalledWith('SAMPLE_TYPE',
      Mode.PLAY,
      PageId.COURSE_DETAIL,
      Environment.HOME,
      telemetryObject,
      undefined,
      undefined);
    expect(enrolled.generateQRSessionEndEvent).toHaveBeenCalledWith(PageId.COURSES, 'SAMPLE_ID');
    expect(enrolled.backButtonFunc).toBeUndefined();
  });

  it('#checkLoggedInOrGuestUser should populate guestUser status', () => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    enrolled.checkLoggedInOrGuestUser();
    expect(enrolled.guestUser).toBe(true);
  });

  it('#checkCurrentUserType should populate profileType as STUDENT', (done) => {
    appGlobalServiceMock.getGuestUserInfo.mockResolvedValue(Promise.resolve(ProfileType.STUDENT));
    enrolled.checkCurrentUserType();
    setTimeout(() => {
      expect(enrolled.profileType).toBe(ProfileType.STUDENT);
      done();
    }, 500);
  });

  it('#rateContent shouldnot show warning toast for guest  student profiles', () => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    appGlobalServiceMock.getGuestUserInfo.mockResolvedValue(Promise.resolve(ProfileType.STUDENT));
    enrolled.checkLoggedInOrGuestUser();
    enrolled.profileType = ProfileType.STUDENT;
    enrolled.rateContent();
    expect(commonUtilServiceMock.showToast).not.toHaveBeenCalled();
  });

  it('#rateContent should show warning toast for guest  teacher profiles', () => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    enrolled.checkLoggedInOrGuestUser();
    enrolled.profileType = ProfileType.TEACHER;
    enrolled.rateContent();
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SIGNIN_TO_USE_FEATURE');
  });

  it('#rateContent should show rating popup if course is locally available', () => {
    const popUpMock = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };
    popUpMock.present.mockImplementation(() => {});
    enrolled.guestUser = false;
    enrolled.course = mockRes.sampleCourse;
    popoverCtrlMock.create.mockReturnValue(popUpMock);
    enrolled.rateContent({});
    expect(popoverCtrlMock.create).toHaveBeenCalled();
    popUpMock.onDidDismiss.mock.calls[0][0].call(enrolled, mockRes.popOverOnDismissResponse);
    expect(enrolled.userRating).toBe(3.0);
    expect(enrolled.ratingComment).toBe('Nice App');
  });

  it('#rateContent should show warning toast if course is not locally available', () => {
    enrolled.guestUser = false;
    enrolled.course = mockRes.sampleCourseNoLocal;
    enrolled.rateContent();
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('TRY_BEFORE_RATING');
  });

  it('#showOverflowMenu should show Overflow menu', () => {
    const popUpMock = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    popoverCtrlMock.create.mockReturnValue(popUpMock);
    enrolled.showOverflowMenu({});
    expect(popoverCtrlMock.create).toHaveBeenCalled();
    expect(popUpMock.present).toHaveBeenCalled();
  });

  it('#showOverflowMenu should call handleUnenrollment()', () => {
    const popUpMock = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    popoverCtrlMock.create.mockReturnValue(popUpMock);
    spyOn(enrolled, 'handleUnenrollment');
    enrolled.showOverflowMenu({});
    popUpMock.onDidDismiss.mock.calls[0][0].call(enrolled, mockRes.popOverOnDismissResponseMenu);
    expect(popoverCtrlMock.create).toHaveBeenCalled();
    expect(enrolled.handleUnenrollment).toHaveBeenCalled();
  });

  it('#handleUnenrollment should call unenrolCourse()', () => {
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.batchDetails = mockRes.batchDetailsResponse;
    courseServiceMock.unenrolCourse.mockResolvedValue({});
    enrolled.handleUnenrollment(true);
    expect(courseServiceMock.unenrolCourse).toHaveBeenCalled();
  });

  it('#handleUnenrollment should call showToast() with COURSE_UNENROLLED', (done) => {
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.batchDetails = mockRes.batchDetailsResponse;
    courseServiceMock.unenrolCourse.mockResolvedValue({});
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0]();
      expect(commonUtilServiceMock.translateMessage('COURSE_UNENROLLED'));
      expect(commonUtilServiceMock.showToast).toHaveBeenCalled();
      done();
    }, 200);
    enrolled.handleUnenrollment(true);
  });

  it('#handleUnenrollment should call showToast() with ERROR_NO_INTERNET_MESSAGE', (done) => {
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.batchDetails = mockRes.batchDetailsResponse;
    courseServiceMock.unenrolCourse.mockRejectedValue(JSON.stringify(mockRes.connectionErrorcontentDetialResponse));
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
      expect(commonUtilServiceMock.showToast).toHaveBeenCalled();
      done();
    }, 200);
    enrolled.handleUnenrollment(true);
  });

  it('#setContentDetails should extract successsfully if getContentDetails API gives success response', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    spyOn(enrolled, 'extractApiResponse');
    const data = JSON.stringify((mockRes.contentDetailsResponse));
    contentServiceMock.getContentDetail.mockResolvedValue(data);
    enrolled.setContentDetails('SAMPLE_ID');
    expect(contentServiceMock.getContentDetail).toHaveBeenCalled();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.extractApiResponse).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#setContentDetails should show error toast if getContentDetails API gives CONNECTION_ERROR response', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    spyOn(enrolled, 'extractApiResponse');
    const data = JSON.stringify((mockRes.connectionErrorcontentDetialResponse));
    contentServiceMock.getContentDetail.mockRejectedValue(data);
    enrolled.setContentDetails('SAMPLE_ID');
    expect(contentServiceMock.getContentDetail).toHaveBeenCalled();
    setTimeout(() => {
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#setContentDetails should show error toast if getContentDetails API gives SERVER_ERROR response', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    spyOn(enrolled, 'extractApiResponse');
    const data = JSON.stringify((mockRes.serverErrorcontentDetialResponse));
    contentServiceMock.getContentDetail.mockRejectedValue(data);
    enrolled.setContentDetails('SAMPLE_ID');
    expect(contentServiceMock.getContentDetail).toHaveBeenCalled();
    setTimeout(() => {
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_FETCHING_DATA');
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#extractApiResponse should call all methods', () => {
    enrolled.course = mockRes.sampleCourse;
    const response = mockRes.contentDetailsResponse;
    response.result.contentData.status = '0';
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    spyOn(enrolled, 'generateImpressionEvent');
    spyOn(enrolled, 'generateStartEvent');
    spyOn(enrolled, 'setCourseStructure');
    spyOn(enrolled, 'setChildContents');
    courseServiceMock.getBatchDetails.mockResolvedValue(true);
    contentServiceMock.getChildContents.mockResolvedValue(true);
    enrolled.extractApiResponse(response);
    expect(enrolled.generateImpressionEvent).toBeCalled();
    expect(enrolled.generateStartEvent).toBeCalled();
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
    expect(navCtrlMock.pop).toBeCalled();
    expect(enrolled.setCourseStructure).toBeCalled();
    expect(enrolled.setChildContents).toBeCalled();
  });

  it('#getBatchDetails should call getBatchDetails() of courseService', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    const data = JSON.stringify((mockRes.contentDetailsResponse));
    courseServiceMock.getBatchDetails.mockResolvedValue(data);
    enrolled.getBatchDetails();
    sharedPreferencesMock.getString.mockResolvedValue(true);
    expect(courseServiceMock.getBatchDetails).toBeCalled();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.batchDetails).toBeDefined();
      done();
    }, 200);
  });

});
