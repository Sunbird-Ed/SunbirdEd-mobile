import { mockRes } from '../course-batches/course-batches.spec.data';
import { CourseBatchesPage } from './course-batches';
import {
  authServiceMock,
  courseServiceMock,
  navCtrlMock,
  navParamsMock,
  zoneMock,
  commonUtilServiceMock,
  eventsMock,
  telemetryGeneratorServiceMock,
  appHeaderServiceMock
} from '../../__tests__/mocks';
import 'jest';
import { Observable } from 'rxjs';

describe.only('CourseBatchesPage', () => {
  let courseBatchesPage: CourseBatchesPage;

  beforeAll(() => {
    courseBatchesPage = new CourseBatchesPage(
      authServiceMock as any,
      courseServiceMock as any,
      navCtrlMock as any,
      navParamsMock as any,
      zoneMock as any,
      commonUtilServiceMock as any,
      eventsMock as any,
      telemetryGeneratorServiceMock as any,
      appHeaderServiceMock as any);
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
    commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
    (courseServiceMock.enrollCourse as any).mockReturnValue(Observable.of(JSON.stringify(mockRes.enrollBatchResponse)));
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

  fit('should show error toast message while enrolling to a batch in case of no internet connection', (done) => {
    // arrange
    commonUtilServiceMock.getLoader.mockReturnValue({ present: jest.fn(), dismiss: jest.fn() });
    const option = {};
    courseServiceMock.enrollCourse.mockRejectedValue(Observable.of(mockRes.connectionFailureResponse));
    // act
    courseBatchesPage.enrollIntoBatch(option);
    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(courseBatchesPage, undefined);
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
    authServiceMock.getSession.mockReturnValue(Observable.from([{
      access_token: '',
      refresh_token: '',
      userToken: ''
    }]))
    // act
    (authServiceMock as any.getSessionData as jest.Mock).mock.calls[0][0].call(courseBatchesPage, undefined);
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
