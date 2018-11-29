import {CourseBatchStatus, CourseEnrollmentType} from 'sunbird';
import {mockRes} from '../course-batches/course-batches.spec.data';
import {CourseBatchesPage} from './course-batches';
import {
  authServiceMock,
  commonUtilServiceMock,
  courseServiceMock,
  eventsMock, navCtrlMock,
  navParamsMock,
  zoneMock
} from "../../__tests__/mocks";

describe('CourseBatchesPage', () => {
  let courseBatchesPage: CourseBatchesPage;

  beforeAll(() => {
    courseBatchesPage = new CourseBatchesPage(courseServiceMock as any, navCtrlMock as any,
      navParamsMock as any, zoneMock as any, authServiceMock as any, commonUtilServiceMock as any, eventsMock as any);
  });

  beforeEach(() => {
    jest.resetAllMocks()
  });

  it('can load instance', () => {
    expect(courseBatchesPage).toBeTruthy();
  });

  it('should create a valid instance of CourseBatchesPage', () => {
    expect(courseBatchesPage instanceof CourseBatchesPage).toBe(true);
    expect(courseBatchesPage).not.toBeFalsy();
  });

  it('should invoke getBatchesByCourseId() and populate ongoingbatches list', (done) => {
    // arrange
    courseServiceMock.getCourseBatches.mockReturnValue(Promise.
    resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
    // act
    courseBatchesPage.getBatchesByCourseId(CourseBatchStatus.COMPLETED);
    // assert
    expect(courseServiceMock.getCourseBatches).toHaveBeenCalledWith(expect.objectContaining({
      enrollmentType: CourseEnrollmentType.OPEN,
      status: CourseBatchStatus.COMPLETED
    }));
    setTimeout(() => {
      expect(courseBatchesPage.ongoingBatches.length).toBe(0);
      expect(courseBatchesPage.upcommingBatches.length).toBe(0);
      done();
    }, 0);
  });

  it('should invoke getBatchesByCourseId() and populate upcomingbatches list', (done) => {
    // arrange
    (courseServiceMock.getCourseBatches as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.getUpcomingBatchesResponse)));
    // act
    courseBatchesPage.getBatchesByCourseId(CourseBatchStatus.COMPLETED);
    // assert
    expect(courseServiceMock.getCourseBatches).toHaveBeenCalledWith(expect.objectContaining({
      enrollmentType: CourseEnrollmentType.OPEN,
      status: CourseBatchStatus.COMPLETED
    }));
    setTimeout(() => {
      expect(courseBatchesPage.ongoingBatches.length).toBe(0);
      expect(courseBatchesPage.upcommingBatches.length).toBe(0);
      done();
    }, 0);
  });

  it('should show error message in case of no internet connection', (done) => {
    // arrange
    (courseServiceMock.getCourseBatches as any).mockReturnValue(Promise.reject('CONNECTION_ERROR'));
    // act
    courseBatchesPage.getBatchesByCourseId();
    // assert
    expect(navParamsMock.get).toHaveBeenCalledWith('identifier');
    expect(courseServiceMock.getCourseBatches).toHaveBeenCalled();
    setTimeout(() => {
      (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
      expect(zoneMock.run).toHaveBeenCalled();
      expect(courseBatchesPage.showLoader).toBe(false);
      done();
    }, 0);
  });

  it('should show toast message after successfully enrolling to a batch', (done) => {
    // arrange
    (courseServiceMock.enrollCourse as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.enrollBatchResponse)));
    // act
    courseBatchesPage.enrollIntoBatch({});
    // assert
    setTimeout(() => {
      (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
      expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('COURSE_ENROLLED');
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should show error message in case of no internet connection', () => {
    // arrange
    (courseServiceMock.getCourseBatches as any).mockReturnValue(Promise.reject('USER_ALREADY_ENROLLED_COURSE'));
    // act
    courseBatchesPage.getBatchesByCourseId();
    // assert
    expect(courseBatchesPage.ongoingBatches.length).toBe(0);
    expect(courseBatchesPage.upcommingBatches.length).toBe(0);
  });

  it('should show error toast message while enrolling to a batch in case of no internet connection', (done) => {
    // arrange
    const option = {};
    (courseServiceMock.enrollCourse as any).mockReturnValue(Promise.reject(JSON.stringify(mockRes.connectionFailureResponse)));
    // act
    courseBatchesPage.enrollIntoBatch(option);
    // assert
    setTimeout(() => {
      (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
      expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
      done();
    }, 0);
  });

  it('should show error toast message while enrolling to a batch which is already enrolled', (done) => {
    // arrange
    const option = {};
    (courseServiceMock.enrollCourse as any).mockReturnValue(Promise.reject(JSON.stringify(mockRes.alreadyRegisterredFailureResponse)));
    // act
    courseBatchesPage.enrollIntoBatch(option);
    // assert
    setTimeout(() => {
      // (commonUtilServiceMock.showToast as any).and.callThrough();
      (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
      expect(commonUtilServiceMock.translateMessage).toHaveBeenCalledWith('ALREADY_ENROLLED_COURSE');
      done();
    }, 0);
  });

  it('should not invoke getBatchesByCourseId for guestUser', (done) => {
    // arrange
    courseBatchesPage.ngOnInit();
    // act
    (authServiceMock.getSessionData  as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
    (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
    // assert
    setTimeout(() => {
      expect(courseBatchesPage.isGuestUser).toBe(true);
      done();
    }, 0);
  });

  it('should  invoke getBatchesByCourseId for signedIn user', (done) => {
    // arrange
    (courseServiceMock.getCourseBatches as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
    courseBatchesPage.getBatchesByCourseId(CourseBatchStatus.COMPLETED);
    expect(courseServiceMock.getCourseBatches).toHaveBeenCalledWith(expect.objectContaining({
      enrollmentType: CourseEnrollmentType.OPEN,
      status: CourseBatchStatus.COMPLETED
    }));
    courseBatchesPage.ngOnInit();
    (authServiceMock.getSessionData  as jest.Mock).mock.calls[0][0].call(courseBatchesPage,
      JSON.stringify(mockRes.sessionResponse));
    setTimeout(() => {
      (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
      expect(zoneMock.run).toHaveBeenCalled();
      expect(courseBatchesPage.isGuestUser).toBe(false);
      expect(courseBatchesPage.userId).toBe('sample_user_token');
      done();
    }, 0);
  });

  it('should  update filter for ongoing', (done) => {
    // arrange
    (courseServiceMock.getCourseBatches as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
    // act
    courseBatchesPage.changeFilter('ONGOING');
    // assert
    expect(courseServiceMock.getCourseBatches).toHaveBeenCalledWith(expect.objectContaining({
      status: CourseBatchStatus.IN_PROGRESS
    }));
    expect(courseBatchesPage.selectedFilter).toBe(courseBatchesPage.filterList.ONGOING);
    done();
  });

  it('should update filter for upcoming', (done) => {
    // arrange
    (courseServiceMock.getCourseBatches as any).mockReturnValue(Promise.resolve(JSON.stringify(mockRes.getOngoingBatchesResponse)));
    // act
    courseBatchesPage.changeFilter('UPCOMING');
    // assert
    setTimeout(() => {
      expect(courseServiceMock.getCourseBatches).toHaveBeenCalledWith(expect.objectContaining({
        status: CourseBatchStatus.NOT_STARTED
      }));
      expect(courseBatchesPage.selectedFilter).toBe(courseBatchesPage.filterList.UPCOMING);
      done();
    }, 0);
  });
});
