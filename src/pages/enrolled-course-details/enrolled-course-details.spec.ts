import {
  alertCtrlMock,
  appGlobalServiceMock,
  buildParamServiceMock,
  commonUtilServiceMock,
  contentServiceMock,
  courseServiceMock,
  courseUtilServiceMock,
  datePipeMock,
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
} from '../../__tests__/mocks';
import {EnrolledCourseDetailsPage} from './enrolled-course-details';
import {mockRes} from './enrolled-course-details.spec.data';
import {Environment, InteractSubtype, InteractType, Mode, PageId, ProfileType} from 'sunbird';
import {CollectionDetailsPage} from '../collection-details/collection-details';
import {ContentDetailsPage} from '../content-details/content-details';
import {CourseBatchesPage} from '../course-batches/course-batches';


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
      commonUtilServiceMock as any,
      datePipeMock as any
    );

    jest.resetAllMocks();
  }));

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
    enrolled.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, mockRes.enrollCourseEvent);
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
    enrolled.rateContent({});
    expect(commonUtilServiceMock.showToast).not.toHaveBeenCalled();
  });

  it('#rateContent should show warning toast for guest  teacher profiles', () => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    enrolled.checkLoggedInOrGuestUser();
    enrolled.profileType = ProfileType.TEACHER;
    enrolled.rateContent({});
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SIGNIN_TO_USE_FEATURE');
  });

  it('#rateContent should show rating popup if course is locally available', () => {
    const popUpMock = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };
    popUpMock.present.mockImplementation(() => { });
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
    enrolled.rateContent({});
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
    popUpMock.onDidDismiss.mock.calls[0][0].call(enrolled, mockRes.popOverOnDismissUnenrollResponse);
    expect(popoverCtrlMock.create).toHaveBeenCalled();
    expect(enrolled.handleUnenrollment).toHaveBeenCalled();
  });

  it('#handleUnenrollment should call unenrolCourse()', () => {
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.batchDetails = mockRes.batchDetailsResponse;
    courseServiceMock.unenrolCourse.mockResolvedValue({});
    enrolled.handleUnenrollment(true);
    expect(courseServiceMock.unenrolCourse).toHaveBeenCalled();
  });

  it('#handleUnenrollment should call showToast() with COURSE_UNENROLLED', (done) => {
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
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
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
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
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('COURSE_NOT_AVAILABLE');
    expect(navCtrlMock.pop).toBeCalled();
    expect(enrolled.setCourseStructure).toBeCalled();
    expect(enrolled.setChildContents).toBeCalled();
  });

  it('#getBatchDetails should call getBatchDetails() of courseService', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    const data = JSON.stringify((mockRes.batchDetailsResponse));
    courseServiceMock.getBatchDetails.mockResolvedValue(data);
    enrolled.getBatchDetails();
    sharedPreferencesMock.getString.mockResolvedValue(true);
    spyOn(enrolled, 'getBatchCreatorName');
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.batchDetails.createdBy).toBe('SAMPLE_UID');
      expect(enrolled.getBatchCreatorName).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#getBatchDetails should not call getBatchCreatorName()', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    courseServiceMock.getBatchDetails.mockRejectedValue(true);
    enrolled.getBatchDetails();
    spyOn(enrolled, 'getBatchCreatorName');
    expect(enrolled.getBatchCreatorName).not.toHaveBeenCalled();
  });

  it('#getBatchCreatorName should populate Creator firsname and last name', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.batchDetails = { 'createdBy': 'SAMPLE_ID' };
    const data = JSON.stringify(mockRes.creatorDetails);
    enrolled.getBatchCreatorName();
    userProfileServiceMock.getUserProfileDetails.mock.calls[0][1].call(enrolled, data);
    expect(enrolled.batchDetails.creatorFirstName).toBe('John');
    expect(enrolled.batchDetails.creatorLastName).toBe('');
  });

  it('#getBatchCreatorName should handle error scenario from API', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.batchDetails = { 'createdBy': 'SAMPLE_ID' };
    enrolled.getBatchCreatorName();
    userProfileServiceMock.getUserProfileDetails.mock.calls[0][2].call();
    expect(enrolled.batchDetails.creatorFirstName).toBeUndefined();
    expect(enrolled.batchDetails.creatorLastName).toBeUndefined();
  });

  it('#setCourseStructure should update contentType count', () => {
    enrolled.course = mockRes.sampleCourse;
    enrolled.courseCardData = mockRes.sampleCourse;
    enrolled.setCourseStructure();
    expect(enrolled.course.contentTypesCount).toBe(1);
  });

  it('#importContent should show error if nothing is added in queuedIdentifiers ', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    spyOn(commonUtilServiceMock, 'showToast');
    spyOn(enrolled, 'generateImpressionEvent');
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockResolvedValue(data);
    enrolled.isDownloadStarted = true;
    enrolled.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.queuedIdentifiers.length).toEqual(0);
      done();
    }, 200);
  });

  it('#importContent should populate queuedIdentifier for successfull API calls', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};

    spyOn(enrolled, 'generateImpressionEvent');
    const data = JSON.stringify((mockRes.enqueuedImportContentResponse));
    contentServiceMock.importContent.mockResolvedValue(data);
    enrolled.isDownloadStarted = true;
    enrolled.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.queuedIdentifiers).toEqual(['SAMPLE_ID']);
      done();
    }, 200);
  });


  it('#importContent should restore the download state for error condition from importContent', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    spyOn(enrolled, 'generateImpressionEvent');
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockRejectedValue(data);
    enrolled.isDownloadStarted = true;
    enrolled.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.isDownloadStarted).toBe(false);
      done();
    }, 200);
  });

  it('#importContent should show error toast if failure response from importContent API', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    spyOn(commonUtilServiceMock, 'showToast');
    spyOn(enrolled, 'generateImpressionEvent');
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockRejectedValue(data);
    enrolled.isDownloadStarted = false;
    enrolled.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.isDownloadStarted).toBe(false);
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
      done();
    }, 200);
  });

  it('#downloadAllContent should invoke importContent API', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockResolvedValue(data);
    enrolled.downloadAllContent();
    expect(contentServiceMock.importContent).toHaveBeenCalled();
  });

  it('#downloadAllContent should show error response if internet is not available', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockResolvedValue(data);
    enrolled.downloadAllContent();
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
  });

  it('#setChildContents should dismiss the children loader', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    const data = JSON.stringify((mockRes.getChildContentAPIResponse));
    contentServiceMock.getChildContents.mockResolvedValue(data);
    courseServiceMock.getContentState.mockResolvedValue(true);
    enrolled.setChildContents();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.showChildrenLoader).toBe(false);
      done();
    }, 200);
  });

  it('#setChildContents should handle error scenario', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    const data = JSON.stringify((mockRes.getChildContentAPIResponse));
    contentServiceMock.getChildContents.mockRejectedValue(true);
    courseServiceMock.getContentState.mockResolvedValue(true);
    enrolled.setChildContents();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.showChildrenLoader).toBe(false);
      done();
    }, 200);
  });

  it('#navigateToChildrenDetailsPage should navigate to EnrolledCourseDetails page', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    enrolled.identifier = 'SAMPLE_ID';
    const content = { 'contentType': 'Course' };
    const contentState = {
      batchId: '1234',
      courseId: 'SAMPLE_ID'
    };
    enrolled.navigateToChildrenDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call();
    expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, {
      content: content,
      depth: 1,
      contentState: contentState
    });
  });

  it('#navigateToChildrenDetailsPage should navigate to CollectionDetails page', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    enrolled.identifier = 'SAMPLE_ID';
    const content = { 'mimeType': 'application/vnd.ekstep.content-collection' };
    const contentState = {
      batchId: '1234',
      courseId: 'SAMPLE_ID'
    };
    enrolled.navigateToChildrenDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call();
    expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsPage, {
      content: content,
      depth: 1,
      contentState: contentState,
      fromCoursesPage: true,
      isAlreadyEnrolled: false,
      isChildClickable: true
    });
  });

  it('#navigateToChildrenDetailsPage should navigate to ContentDetails page', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    enrolled.identifier = 'SAMPLE_ID';
    const content = { 'contentType': 'Content' };
    const contentState = {
      batchId: '1234',
      courseId: 'SAMPLE_ID'
    };
    enrolled.navigateToChildrenDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call();
    expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, {
      content: content,
      depth: 1,
      contentState: contentState,
      isChildContent: true
    });
  });

  it('#cancelDownload should cancel the download', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    const data = JSON.stringify({});
    contentServiceMock.cancelDownload.mockResolvedValue(data);
    enrolled.identifier = 'SAMPLE_ID';
    enrolled.cancelDownload();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.showLoading).toBe(false);
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#cancelDownload should handle error scenario from API', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = {};
    const data = JSON.stringify({});
    contentServiceMock.cancelDownload.mockRejectedValue(data);
    enrolled.identifier = 'SAMPLE_ID';
    enrolled.cancelDownload();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.showLoading).toBe(false);
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 200);
  });

  it('#resumeContent should move to ContentDetails page', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.identifier = 'SAMPLE_ID';
    enrolled.resumeContent('SAMPLE_ID');
    expect(navCtrlMock.push).toHaveBeenCalled();
  });

  it('#ionViewWillEnter should invoke setContentDetails', () => {
    enrolled.batchDetails = { 'createdBy': 'SAMPLE_ID' };
    enrolled.batchId = '1234';
    navParamsMock.get.mockReturnValue(mockRes.enrollCourseEvent);
    spyOn(enrolled, 'setContentDetails');
    enrolled.ionViewWillEnter();
    expect(enrolled.setContentDetails).toHaveBeenCalled();
  });

  it('#subscribeSdkEvent should update the download progress when download progress event comes', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    const data = JSON.stringify(mockRes.downloadProgressEventSample1);
    enrolled.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, data);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.downloadProgress).toBe(10);
      done();
    }, 200);
  });

  it('#subscribeSdkEvent should update the progress to 0 if API gives response -1', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    const data = JSON.stringify(mockRes.downloadProgressEventSample2);
    enrolled.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, data);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.downloadProgress).toBe(0);
      done();
    }, 200);
  });

  it('#subscribeSdkEvent should call getBaatchDetails() if download progress is 100', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    const data = JSON.stringify(mockRes.downloadProgressEventSample3);
    spyOn(enrolled, 'getBatchDetails');
    enrolled.subscribeSdkEvent();
    courseServiceMock.getBatchDetails.mockResolvedValue(true);
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, data);
    zoneMock.run.mock.calls[0][0].call();
    expect(enrolled.getBatchDetails).toBeCalled();
  });

  it('#subscribeSdkEvent should  mark download as complete', (done) => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = { 'isAvailableLocally': true };
    const data = JSON.stringify(mockRes.importCompleteEventSample);
    enrolled.queuedIdentifiers = ['SAMPLE_ID'];
    enrolled.isDownloadStarted = true;
    enrolled.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, data);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(enrolled.showLoading).toBe(false);
      expect(enrolled.isDownloadCompleted).toBe(true);
      done();
    }, 200);
  });

  it('#subscribeSdkEvent should  load all child contents when download is complete', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = { 'isAvailableLocally': true };
    const data = JSON.stringify(mockRes.importCompleteEventSample);
    enrolled.queuedIdentifiers = ['SAMPLE_ID'];
    enrolled.isDownloadStarted = false;
    spyOn(enrolled, 'setChildContents');
    enrolled.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, data);
    zoneMock.run.mock.calls[0][0].call();
    expect(enrolled.setChildContents).toHaveBeenCalled();
  });

  it('#subscribeSdkEvent should  update the course if update event is available ', () => {
    enrolled.courseCardData = mockRes.enrollCourseEvent;
    enrolled.course = { 'isAvailableLocally': true };
    const data = JSON.stringify(mockRes.updateEventSample);
    enrolled.queuedIdentifiers = ['SAMPLE_ID'];
    enrolled.isDownloadStarted = false;
    enrolled.identifier = 'SAMPLE_ID';
    spyOn(enrolled, 'importContent');
    enrolled.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(enrolled, data);
    zoneMock.run.mock.calls[0][0].call();
    zoneMock.run.mock.calls[1][0].call();
    expect(enrolled.showLoading).toBe(true);
    expect(enrolled.importContent).toHaveBeenCalledWith(['SAMPLE_ID'], false);
  });


  it('#ionViewWillLeave should unsubscribe event', () => {
    enrolled.ionViewWillLeave();
    expect(eventsMock.unsubscribe).toHaveBeenCalledWith('genie.event');
  });

  it('#startContent should invoke navigateToChildDetails page', () => {
    enrolled.startData = mockRes.getChildContentAPIResponse.result.children;
    enrolled.childContentsData = {};
    spyOn(enrolled, 'navigateToChildrenDetailsPage');
    enrolled.startContent();
    expect(enrolled.navigateToChildrenDetailsPage).toHaveBeenCalled();
  });

  it('#navigateToBatchListPage should navigate to CourseBatches page if network is available', (done) => {
    enrolled.identifier = 'SAMPLE_ID';
    enrolled.guestUser = false;
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
    const data = JSON.stringify(mockRes.courseBatchesRequest);
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
    courseServiceMock.getCourseBatches.mockResolvedValue(data);
    enrolled.navigateToBatchListPage();
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(navCtrlMock.push).toHaveBeenCalledWith(CourseBatchesPage, expect.anything());
      done();
    }, 200);
  });

  it('#share should invoke  export ecar API if course is locally available', () => {
    enrolled.course = { 'contentType': 'Course', 'isAvailableLocally': true, 'identifier': 'SAMPLE_ID' };
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
    enrolled.share();
    shareUtilMock.exportEcar.mock.calls[0][1].call();
    const values = new Map();
    values['ContentType'] = 'Course';
    expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
      InteractSubtype.SHARE_COURSE_INITIATED,
      Environment.HOME,
      PageId.CONTENT_DETAIL, undefined,
      values,
      undefined,
      undefined
    );
  });

  it('#share should show warning toast if exportEcar gives failure response ', () => {
    enrolled.course = { 'contentType': 'Course', 'isAvailableLocally': true, 'identifier': 'SAMPLE_ID' };
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
    spyOn(commonUtilServiceMock, 'showToast');
    enrolled.share();
    shareUtilMock.exportEcar.mock.calls[0][2].call();
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SHARE_CONTENT_FAILED');
  });

  it('#share should share successfully if content is not locally available ', () => {
    enrolled.course = { 'contentType': 'Course', 'isAvailableLocally': false, 'identifier': 'SAMPLE_ID' };
    const loader = {
      present: jest.fn(),
      dismiss: jest.fn()
    };
    commonUtilServiceMock.getLoader.mockReturnValue(loader);
    // spyOn(social, 'share').and.callThrough();
    enrolled.share();
    expect(socialSharingMock.share).toHaveBeenCalled();
  });

  it('#handleNavBackButton should handle nav back button click', () => {
    spyOn(enrolled, 'generateQRSessionEndEvent');
    enrolled.course = mockRes.sampleCourse;
    enrolled.source = PageId.COURSE_DETAIL;
    enrolled.shouldGenerateEndTelemetry = true;
    enrolled.backButtonFunc = jasmine.createSpy();
    enrolled.handleNavBackButton();
    expect(enrolled.generateQRSessionEndEvent).toHaveBeenCalled();
    expect(navCtrlMock.pop).toHaveBeenCalled();
  });

  it('#viewCredits should open view credits screen', () => {
    enrolled.viewCredits();
    expect(courseUtilServiceMock.showCredits).toHaveBeenCalled();
  });

  it('#generateShareInteractEvents should call generateInteractTelemetry()', () => {
    enrolled.generateShareInteractEvents({}, {}, {});
    expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toBeCalled();
  });

});


