import { CourseBatchStatus, CourseEnrollmentType } from 'sunbird';
import { mockRes } from '../course-batches/course-batches.spec.data';
import { CourseBatchesPage } from './course-batches';
import {
  authServiceMock,
  commonUtilServiceMock,
  courseServiceMock,
  eventsMock, navCtrlMock,
  navParamsMock,
  zoneMock
} from '../../__tests__/mocks';
import 'jest';

describe.only('CourseBatchesPage', () => {
  let courseBatchesPage: CourseBatchesPage;

  beforeAll(() => {
    courseBatchesPage = new CourseBatchesPage(courseServiceMock as any, navCtrlMock as any,
      navParamsMock as any, zoneMock as any, authServiceMock as any, commonUtilServiceMock as any, eventsMock as any);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('can load instance', () => {
    expect(courseBatchesPage).toBeTruthy();
  });

  it('should create a valid instance of CourseBatchesPage', () => {
    expect(courseBatchesPage instanceof CourseBatchesPage).toBe(true);
    expect(courseBatchesPage).not.toBeFalsy();
  });

  it('should invoke getBatchesByCourseId() and initialize upcomingbatches & ongoingbatches list', () => {
    navParamsMock.get.mockImplementation((param: string) => {
      if (param === 'ongoingBatch' || param === 'upcommingBatch') {
        return [];
      }
    });
    // act
    courseBatchesPage.getBatchesByCourseId();
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
    (authServiceMock.getSessionData as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
    (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
    // assert
    setTimeout(() => {
      expect(courseBatchesPage.isGuestUser).toBe(true);
      done();
    }, 0);
  });

  it('should  invoke getBatchesByCourseId for signedIn user', (done) => {
    // act
    courseBatchesPage.ngOnInit();
    (authServiceMock.getSessionData as jest.Mock).mock.calls[0][0].call(courseBatchesPage,
      JSON.stringify(mockRes.sessionResponse));
      // expect
    setTimeout(() => {
      (zoneMock.run as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
      expect(zoneMock.run).toHaveBeenCalled();
      expect(courseBatchesPage.isGuestUser).toBe(false);
      expect(courseBatchesPage.userId).toBe('sample_user_token');
      done();
    }, 0);
  });
});
