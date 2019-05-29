import {CoursesPage} from './courses';
import {Environment, ImpressionType, PageAssembleCriteria, PageAssembleFilter, PageId, ProfileType} from 'sunbird';
import {mockRes as CourseBatchesMock} from '@app/pages/course-batches/course-batches.spec.data';
import {mockRes as CourseMock} from '../courses/courses.spec.data';
import {
  appGlobalServiceMock,
  appVersionMock,
  commonUtilServiceMock,
  contentServiceMock,
  courseServiceMock,
  courseUtilServiceMock,
  eventsMock,
  formAndFrameworkUtilServiceMock,
  navCtrlMock,
  pageAssembleServiceMock,
  popoverCtrlMock,
  sharedPreferencesMock,
  sunbirdQRScannerMock,
  telemetryGeneratorServiceMock,
  zoneMock
} from '@app/__tests__/mocks';
import {ContentType} from '@app/app';
import {SearchPage} from '@app/pages/search';
import {ViewMoreActivityPage} from '@app/pages/view-more-activity';
import {networkMock} from '../../__tests__/mocks';

describe('CoursesPage', () => {
  let coursesPage: CoursesPage;

  beforeEach(() => {
    sharedPreferencesMock.getString.mockResolvedValue('SAMPLE_LANGUAGE');
    appVersionMock.getAppName.mockResolvedValue('SAMPLE_APP_NAME');

    coursesPage = new CoursesPage(
      appVersionMock as any,
      navCtrlMock as any,
      courseServiceMock as any,
      pageAssembleServiceMock as any,
      zoneMock as any,
      sunbirdQRScannerMock as any,
      popoverCtrlMock as any,
      eventsMock as any,
      contentServiceMock as any,
      sharedPreferencesMock as any,
      appGlobalServiceMock as any,
      courseUtilServiceMock as any,
      formAndFrameworkUtilServiceMock as any,
      commonUtilServiceMock as any,
      telemetryGeneratorServiceMock as any,
      networkMock as any
    );

    jest.resetAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();

    spyOn(document, 'getElementById').and.returnValue(document.createElement('div'));
  });

  it('should construct valid CoursePage instance', (done) => {
    // assert
    setTimeout(() => {
      expect(coursesPage).toBeTruthy();
      expect(coursesPage.selectedLanguage = 'SAMPLE_LANGUAGE');
      expect(coursesPage.appLabel = 'SAMPLE_APP_NAME');
      done();
    }, 0);
  });

  it('should should show highLighter on app start for fresh install', (done) => {
    // arrange
    sharedPreferencesMock.getString.mockResolvedValue('true');

    // act
    coursesPage.ionViewDidLoad();

    // assert
    setTimeout(() => {
      expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalledWith(ImpressionType.VIEW, '',
        PageId.COURSES,
        Environment.HOME);
      expect(appGlobalServiceMock.generateConfigInteractEvent).toHaveBeenCalledWith(PageId.COURSES, false);
      expect(sharedPreferencesMock.putString).toHaveBeenCalledWith('show_app_walkthrough_screen', 'false');
      done();
    }, 0);
  });

  it('should show Upgrade popOver when upgrade event is fired', () => {
    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[0][1].call(coursesPage, JSON.parse(CourseMock.upgradeAppResponse));

    // assert
    expect(appGlobalServiceMock.openPopover).toHaveBeenCalledWith(JSON.parse(CourseMock.upgradeAppResponse));
  });

  it('should update onboarding parameter onboarding complete event is fired', () => {
    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[1][1].call(coursesPage, JSON.parse(CourseMock.onboardingCompleteResponse));

    // assert
    expect(coursesPage.isOnBoardingCardCompleted).toBe(true);
  });
  //
  it('should invoke getCourseTabData when profile object is changed', () => {
    // arrange
    spyOn(coursesPage, 'getCourseTabData').and.stub();

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[2][1].call(coursesPage, undefined);

    // assert
    expect(coursesPage.getCourseTabData).toHaveBeenCalled();
  });

  it('should mark isVisible parameter true on ionViewDidEnter()', () => {
    // act
    coursesPage.ionViewDidEnter();

    // assert
    expect(coursesPage.isVisible).toBe(true);
  });

  it('should reinitialize all parameters on ionViewWillLeave()', () => {
    // arrange
    coursesPage.tabBarElement = { style: {} };

    // act
    coursesPage.ionViewWillLeave();
    zoneMock.run.mock.calls[0][0].call(coursesPage);

    // assert
    expect(eventsMock.unsubscribe).toHaveBeenCalledWith('genie.event');
    expect(coursesPage.isVisible).toBe(false);
    expect(coursesPage.showOverlay).toBe(false);
    expect(coursesPage.downloadPercentage).toBe(0);
  });

  it('should invoke getEnrolledCourses when enrollcourse event is fired', () => {
    // arrange
    spyOn(coursesPage, 'getEnrolledCourses').and.stub();
    const data = { batchId: '213123123'};

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[6][1].call(coursesPage, data);

    // assert
    expect(coursesPage.getEnrolledCourses).toHaveBeenCalledWith(false, false);
  });

  it('should update the progress when onboarding progess event comes', () => {
    // arrange
    spyOn(coursesPage, 'getEnrolledCourses').and.stub();

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[4][1].call(coursesPage, JSON.parse(CourseMock.onboardingCardProgress));

    // assert
    expect(coursesPage.onBoardingProgress).toBe(10);
  });

  it('should get resumed content information resume event is fired', () => {
    // arrange
    spyOn(coursesPage, 'getContentDetails').and.stub();

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[5][1].call(coursesPage, JSON.parse(CourseMock.resumeContent));

    // assert
    expect(coursesPage.resumeContentData).toEqual(JSON.parse(CourseMock.resumeContent).content);
    expect(coursesPage.getContentDetails).toHaveBeenCalledWith(JSON.parse(CourseMock.resumeContent).content);
  });


  it('should invoke getEnrolled courses when batch is enrolled', () => {
    // arrange
    spyOn(coursesPage, 'getEnrolledCourses').and.stub();

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[6][1].call(coursesPage, JSON.parse(CourseMock.enrollCourseEvent));

    // assert
    expect(coursesPage.getEnrolledCourses).toHaveBeenCalledWith(false, false);
  });

  it('should invoke getPopular Courses when language is changed', () => {
    // arrange
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.stub();

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[7][1].call(coursesPage, JSON.parse(CourseMock.languageChangeEvent));

    // assert
    expect(coursesPage.getPopularAndLatestCourses).toHaveBeenCalledWith();
  });

  it('should reset the filter when tab is changed', () => {
    // arrange
    coursesPage.appliedFilter = {};
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.stub();

    // act
    coursesPage.subscribeUtilityEvents();
    eventsMock.subscribe.mock.calls[8][1].call(coursesPage, 'COURSES');
    zoneMock.run.mock.calls[0][0].call(coursesPage);

    // assert
    expect(coursesPage.getPopularAndLatestCourses).toHaveBeenCalledWith();
  });

  it('should not invoke getEnrolledCourses API for guest users', (done) => {
    // arrange
    spyOn(coursesPage, 'getEnrolledCourses').and.stub();
    spyOn(coursesPage, 'getCurrentUser').and.stub();
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);

    // act
    coursesPage.getUserId().catch(() => {
      // assert
      expect(appGlobalServiceMock.setEnrolledCourseList).toHaveBeenCalledWith([]);
      expect(coursesPage.getEnrolledCourses).not.toHaveBeenCalled();
      done();
    });
  });

  it('should  invoke getEnrolledCourses for loggedIn users', (done) => {
    // arrange
    spyOn(coursesPage, 'getEnrolledCourses').and.stub();
    appGlobalServiceMock.getSessionData.mockReturnValue(CourseBatchesMock.sessionResponse);
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);

    // act
    coursesPage.getUserId().then(() => {
      // assert
      expect(coursesPage.getEnrolledCourses).toHaveBeenCalled();
      done();
    });
  });

  it('should  dismiss loader while invoking getEnrolledCourses for loggedIn users in case of no internet connection', (done) => {
    // arrange
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    appGlobalServiceMock.getSessionData.mockReturnValue(CourseBatchesMock.sessionResponse);
    courseServiceMock.getEnrolledCourses.mockRejectedValue(new Error('CONNECTION_ERROR'));

    // act
    coursesPage.getUserId().then(() => {
      // assert
      setTimeout(() => {
        zoneMock.run.mock.calls[0][0].call(coursesPage, null);
        zoneMock.run.mock.calls[1][0].call(coursesPage, null);
        expect(coursesPage.showLoader).toBe(false);
        done();
      }, 0);
    });
  });

  it('should invoke getCourseTabData on ngOnInit for signedin users', (done) => {
    // arrange
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    appGlobalServiceMock.getSessionData.mockReturnValue(CourseBatchesMock.sessionResponse);
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.stub();
    spyOn(coursesPage, 'getEnrolledCourses').and.stub();

    // act
    coursesPage.ngOnInit();

    // assert
    setTimeout(() => {
      expect(coursesPage.getPopularAndLatestCourses).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should invoke getCourseTabData on ngOnInit for guest users', (done) => {
    // arrange
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.stub();
    spyOn(coursesPage, 'getCurrentUser').and.stub();

    // act
    coursesPage.ngOnInit();

    // assert
    setTimeout(() => {
      expect(coursesPage.getPopularAndLatestCourses).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should  show error toast on ngOnInit for guest users in no network condition', (done) => {
    // arrange
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    pageAssembleServiceMock.getPageAssemble.mockRejectedValue('CONNECTION_ERROR');
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.callThrough();
    spyOn(coursesPage, 'getCurrentUser').and.stub();

    // act
    coursesPage.ngOnInit();

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(coursesPage);
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
      done();
    }, 0);
  });

  it('should  show error toast on ngOnInit for guest users in case of server error', (done) => {
    // arrange
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
    pageAssembleServiceMock.getPageAssemble.mockRejectedValue('SERVER_ERROR');
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.callThrough();
    spyOn(coursesPage, 'getCurrentUser').and.stub();

    // act
    coursesPage.ngOnInit();

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(coursesPage);
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_FETCHING_DATA');
      done();
    }, 0);
  });

  it('should apply all profile values in pageassemble criteria while filling up onboarding cards', () => {
    // arrange
    pageAssembleServiceMock.getPageAssemble.mockResolvedValue(CourseMock.popularCoursesResponse);

    const criteria = new PageAssembleCriteria();
    criteria.name = 'Course';
    criteria.mode = 'soft';
    criteria.filters = new PageAssembleFilter();
    criteria.filters.board = ['CBSE'];
    criteria.filters.medium = ['English'];
    criteria.filters.gradeLevel = ['KG'];
    criteria.filters.subject = ['English'];

    coursesPage.profile = CourseMock.sampleProfile;
    coursesPage.isFilterApplied = false;

    // act
    coursesPage.getPopularAndLatestCourses(false, criteria);

    // assert
    expect(pageAssembleServiceMock.getPageAssemble).toHaveBeenCalledWith(criteria);
  });

  it('should  apply all profile values in pageassemble criteria after applying filter', () => {
    // arrange
    pageAssembleServiceMock.getPageAssemble.mockResolvedValue(CourseMock.popularCoursesResponse);
    formAndFrameworkUtilServiceMock.getCourseFilterConfig.mockResolvedValue(CourseMock.courseConfigFilter);

    // act
    coursesPage.showFilter();
    coursesPage.pageFilterCallBack.applyFilter(CourseMock.filter, CourseMock.appliedFilter);
    zoneMock.run.mock.calls[0][0].call(coursesPage);

    // assert
    expect(coursesPage.filterIcon).toBe('./assets/imgs/ic_action_filter_applied.png');
  });

  it('should  apply soft filters if profile details is filled through onboarding cards', () => {
    // arrange
    pageAssembleServiceMock.getPageAssemble.mockResolvedValue(CourseMock.popularCoursesResponse);
    formAndFrameworkUtilServiceMock.getCourseFilterConfig.mockResolvedValue(CourseMock.courseConfigFilter);

    // act
    coursesPage.showFilter();
    coursesPage.pageFilterCallBack.applyFilter({}, {});

    // assert
    expect(coursesPage.filterIcon).toBe('./assets/imgs/ic_action_filter.png');
  });

  it('should throw error if getCourseFilterConfig is failed', (done) => {
    // arrange
    formAndFrameworkUtilServiceMock.getCourseFilterConfig.mockRejectedValue('SAMPLE_ERROR');
    spyOn(coursesPage, 'getPopularAndLatestCourses').and.stub();
    spyOn(console, 'error').and.stub();

    // act
    coursesPage.showFilter();

    // assert
    setTimeout(() => {
      expect(console.error).toHaveBeenCalledWith('Error Occurred!');
      done();
    }, 0);
  });

  it('should  show filter page if course filter is available', () => {
    // arrange
    spyOn(coursesPage, 'showFilterPage').and.stub();
    popoverCtrlMock.create.mockReturnValue({ present: jest.fn() });
    pageAssembleServiceMock.getPageAssemble.mockResolvedValue(JSON.stringify(CourseMock.popularCoursesResponse));
    formAndFrameworkUtilServiceMock.getCourseFilterConfig.mockResolvedValue(CourseMock.courseConfigFilter);
    coursesPage.courseFilter = CourseMock.courseConfigFilter;

    // act
    coursesPage.showFilter();
    coursesPage.pageFilterCallBack.applyFilter(CourseMock.filter, CourseMock.appliedFilter);
    coursesPage.applyProfileFilter([], []);

    // assert
    expect(coursesPage.showFilterPage).toHaveBeenCalled();
    expect(formAndFrameworkUtilServiceMock.getCourseFilterConfig).not.toHaveBeenCalled();
  });


  it('should  show Offline warning', () => {
    // arrange
    jest.useFakeTimers();

    // act
    coursesPage.showOfflineWarning();

    // assert
    expect(coursesPage.showWarning).toBe(true);
    jest.advanceTimersByTime(4000);
    expect(coursesPage.showWarning).toBe(false);
  });

  it('should  not call Page API if network is off ', () => {
    // arrange
    (commonUtilServiceMock.networkInfo as any) = { isNetworkAvailable: false };
    spyOn(coursesPage, 'getCourseTabData').and.stub();

    // act
    coursesPage.retryShowingPopularCourses(true);

    // assert
    expect(coursesPage.getCourseTabData).not.toHaveBeenCalled();
  });

  it('should  call Page API if network is available on retryShowingPopularCourses()', () => {
    // arrange
    (commonUtilServiceMock.networkInfo as any) = { isNetworkAvailable: true };
    spyOn(coursesPage, 'getCourseTabData').and.stub();

    // act
    coursesPage.retryShowingPopularCourses(true);

    // assert
    expect(coursesPage.getCourseTabData).toHaveBeenCalled();
  });

  it('should  navigate to ViewMoreActivityPage with gven parameters on navigateToViewMoreContentsPage()', () => {
    // arrange
    coursesPage.userId = 'sample_userId';

    // act
    coursesPage.navigateToViewMoreContentsPage(true);

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
      headerTitle: 'COURSES_IN_PROGRESS',
      userId: coursesPage.userId,
      pageName: 'course.EnrolledCourses'
    });
  });


  it('should  navigate to ViewMoreActivity page with popular courses search query', () => {
    // arrange
    const searchQuery = CourseMock.searchQuery;
    const headerTitle = 'headerTitle';

    // act
    coursesPage.navigateToViewMoreContentsPage(false, searchQuery, headerTitle);

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
      headerTitle: headerTitle,
      requestParams: CourseMock.mergedSearchQuery,
      pageName: 'course.PopularContent'
    });
  });

  it('should  start QRscanner on scanQRCode', () => {
    // act
    coursesPage.scanQRCode();

    // assert
    expect(sunbirdQRScannerMock.startScanner).toHaveBeenCalled();
  });

  it('should  navigate to SearchPage on search()', () => {
    // act
    coursesPage.search();

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(SearchPage, expect.objectContaining({
      contentType: ContentType.FOR_COURSE_TAB,
      source: PageId.COURSES
    }));
  });

  describe('should handle all the scenarios for getContentDetails() method', () => {
    const sampleContent = JSON.parse(CourseMock.sampleContent);

    it('should navigate to EnrollCourseDetails page if content is available', (done) => {
      // arrange
      contentServiceMock.getContentDetail.mockResolvedValue(CourseMock.sampleContentDetailsResponseLocal);
      spyOn(coursesPage, 'navigateToContentDetailsPage').and.stub();

      // act
      coursesPage.getContentDetails(sampleContent);

      // assert
      setTimeout(() => {
        expect(coursesPage.showOverlay).toBe(false);
        expect(coursesPage.navigateToContentDetailsPage).toHaveBeenCalledWith(sampleContent);
        done();
      }, 0);
    });

    it('should download the content if content is not available', (done) => {
      // arrange
      contentServiceMock.getContentDetail.mockResolvedValue(CourseMock.sampleContentDetailsResponseNonLocal);
      spyOn(coursesPage, 'importContent').and.stub();
      spyOn(coursesPage, 'subscribeSdkEvent').and.stub();

      // act
      coursesPage.getContentDetails(sampleContent);

      // assert
      setTimeout(() => {
        expect(coursesPage.showOverlay).toBe(true);
        expect(coursesPage.importContent).toHaveBeenCalledWith(['do_sample'], false);
        expect(coursesPage.subscribeSdkEvent).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('should show error if getContentDetails API throws error', (done) => {
      // arrange
      contentServiceMock.getContentDetail.mockRejectedValue(undefined);

      // act
      coursesPage.getContentDetails(sampleContent);

      // assert
      setTimeout(() => {
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
        done();
      }, 0);
    });
  });


  describe('should handle all the scenarios for importContent() method', () => {
    it('should show error message if content is not available to download', (done) => {
      // arrange
      coursesPage.tabBarElement = { style: {} };
      contentServiceMock.importContent.mockResolvedValue(CourseMock.failureimportResponse);

      // act
      coursesPage.importContent(['do_sample'], false);

      // assert
      setTimeout(() => {
        zoneMock.run.mock.calls[0][0].call(coursesPage);
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('COURSE_NOT_AVAILABLE');
        expect(coursesPage.showOverlay).toBe(false);
        done();
      }, 0);
    });

    it('should show error message  when importContent() throws error', (done) => {
      // arrange
      coursesPage.tabBarElement = { style: {} };
      contentServiceMock.importContent.mockRejectedValue(undefined);

      // act
      coursesPage.importContent(['do_sample'], false);

      // assert
      setTimeout(() => {
        zoneMock.run.mock.calls[0][0].call(coursesPage);
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('COURSE_NOT_AVAILABLE');
        expect(coursesPage.showOverlay).toBe(false);
        done();
      }, 0);
    });
  });


  describe('should handle scenarios for subscribeSdkEvent()', () => {
    it('should update the download progress on download progress', () => {
      // act
      coursesPage.subscribeSdkEvent();
      eventsMock.subscribe.mock.calls[0][1].call(coursesPage, CourseMock.downloadProgressEventSample1);
      zoneMock.run.mock.calls[0][0].call(coursesPage);

      // assert
      expect(eventsMock.subscribe).toHaveBeenCalledWith('genie.event', expect.any(Function));
      expect(coursesPage.downloadPercentage).toBe(10);
    });

    it('should update the download progress to 0 if from event its coming as -1', () => {
      // act
      coursesPage.subscribeSdkEvent();
      eventsMock.subscribe.mock.calls[0][1].call(coursesPage, CourseMock.downloadProgressEventSample2);
      zoneMock.run.mock.calls[0][0].call(coursesPage);

      // assert
      expect(eventsMock.subscribe).toHaveBeenCalledWith('genie.event', expect.any(Function));
      expect(coursesPage.downloadPercentage).toBe(0);
    });

    it('should navigate to EnrolledContentDetails page when download is complete', () => {
      // arrange
      coursesPage.resumeContentData = {
        contentId: 'do_sample',
        identifier: 'do_sample'
      };

      spyOn(coursesPage, 'navigateToContentDetailsPage').and.stub();
      coursesPage.downloadPercentage = 100;

      // act
      coursesPage.subscribeSdkEvent();
      eventsMock.subscribe.mock.calls[0][1].call(coursesPage, CourseMock.importCompleteEvent);
      zoneMock.run.mock.calls[0][0].call(coursesPage);

      // assert
      expect(eventsMock.subscribe).toHaveBeenCalledWith('genie.event', expect.any(Function));
      expect(coursesPage.showOverlay).toBe(false);
      expect(coursesPage.navigateToContentDetailsPage).toHaveBeenCalled();
    });
  });

  describe('should handle scenarios for cancelDownload()', () => {
    it('should cancel the download and make the overlay boolean false on success response', () => {
      // arrange
      coursesPage.resumeContentData = {
        contentId: 'do_sample',
        identifier: 'do_sample'
      };
      contentServiceMock.cancelDownload.mockResolvedValue(undefined);

      // act
      coursesPage.cancelDownload();
      zoneMock.run.mock.calls[0][0].call(coursesPage);

      // assert
      expect(contentServiceMock.cancelDownload).toHaveBeenCalled();
      expect(coursesPage.showOverlay).toBe(false);
    });

    it('should cancel the download and make the overlay boolean false on error response', () => {
      // arrange
      coursesPage.resumeContentData = {
        contentId: 'do_sample',
        identifier: 'do_sample'
      };
      contentServiceMock.cancelDownload.mockRejectedValue(undefined);

      // act
      coursesPage.cancelDownload();
      zoneMock.run.mock.calls[0][0].call(coursesPage);

      // assert
      expect(contentServiceMock.cancelDownload).toHaveBeenCalled();
      expect(coursesPage.showOverlay).toBe(false);
    });
  });

  it('should  invoke events unsubscribe method', () => {
    // act
    coursesPage.ionViewCanLeave();
    zoneMock.run.mock.calls[0][0].call(coursesPage);

    // assert
    expect(eventsMock.unsubscribe).toHaveBeenCalledWith('genie.event');
  });

  it('should  showSigninCard if ProfileType is teacher and config is enabled', () => {
    // arrange
    appGlobalServiceMock.getGuestUserType.mockReturnValue(ProfileType.TEACHER);
    (appGlobalServiceMock.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER as any) = true;

    // act
    coursesPage.getCurrentUser();

    // assert
    expect(coursesPage.showSignInCard).toBe(true);
  });

  it('should  mark on boarding is complete if all profile attributes are available', () => {
    // arrange
    appGlobalServiceMock.getGuestUserType.mockReturnValue(ProfileType.STUDENT);
    (appGlobalServiceMock.DISPLAY_SIGNIN_FOOTER_CARD_IN_COURSE_TAB_FOR_TEACHER as any) = false;

    // act
    coursesPage.getCurrentUser();

    // assert
    expect(coursesPage.showSignInCard).toBe(false);
  });

});
