import {
  Events, IonicApp, IonicModule, LoadingController, NavController, NavParams, Platform,
  PopoverController, ToastController
} from 'ionic-angular';
import { LoadingControllerMock, NetworkMock, StorageMock } from 'ionic-mocks';
import { Ionic2RatingModule } from 'ionic2-rating';
import { } from 'jasmine';
import {
  AuthService, BuildParamService, ContentService, CourseService, FileUtil, FrameworkModule,
  GenieSDKServiceProvider, ProfileType, SharedPreferences, ShareUtil, TelemetryService, PageId,
   TelemetryObject, Environment, ImpressionType, Mode, UserProfileService, InteractType, InteractSubtype
} from 'sunbird';

import { HttpClientModule } from '@angular/common/http';
import { ElementRef, Renderer } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  AuthServiceMock, FileUtilMock, GenieSDKServiceProviderMock, MockElementRef, NavMock,
  NavParamsMock, PlatformMock, PopoverControllerMock, SharedPreferencesMock, SocialSharingMock,
  ToastControllerMock, TranslateLoaderMock, PopoverMock, NavbarMock
} from '../../../test-config/mocks-ionic';
import { PBHorizontal } from '../../component/pbhorizontal/pb-horizontal';
import { DirectivesModule } from '../../directives/directives.module';
import { PipesModule } from '../../pipes/pipes.module';
import { AppGlobalService } from '../../service/app-global.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { mockRes } from './enrolled-course-details.spec.data';
import { EnrolledCourseDetailsPage } from './enrolled-course-details';
import { CourseUtilService } from '../../service/course-util.service';
import { CommonUtilService } from '../../service/common-util.service';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseBatchesPage } from '../course-batches/course-batches';
import { Navbar } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
declare let GenieSDK: any;

describe('EnrolledCourseDetailsPage Component', () => {
  let component: EnrolledCourseDetailsPage;
  let fixture: ComponentFixture<EnrolledCourseDetailsPage>;
  let translateService: TranslateService;
  let spyObj;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnrolledCourseDetailsPage, PBHorizontal],
      imports: [
        IonicModule.forRoot(EnrolledCourseDetailsPage),
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
        PipesModule,
        HttpClientModule,
        FrameworkModule,
        DirectivesModule,
        Ionic2RatingModule
      ],
      providers: [
        ContentService, TelemetryService, CourseService, ShareUtil, IonicApp, Renderer, TelemetryGeneratorService,
        CourseUtilService, CommonUtilService, Navbar,
        { provide: Platform, useClass: PlatformMock },
        { provide: ElementRef, useClass: MockElementRef },
        { provide: FileUtil, useClass: FileUtilMock },
        { provide: NavController, useClass: NavMock },
        // { provide: Navbar, useClass: NavbarMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: SocialSharing, useClass: SocialSharingMock },
        { provide: Network, useFactory: () => NetworkMock.instance('none') },
        { provide: AppGlobalService, useClass: AppGlobalService },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        SharedPreferences
      ]
    });
  }));

  beforeEach(() => {
    const prefernce = TestBed.get(SharedPreferences);
    spyObj = spyOn(prefernce, 'getString');
    spyObj.and.returnValue(Promise.resolve(ProfileType.TEACHER));
    fixture = TestBed.createComponent(EnrolledCourseDetailsPage);
    component = fixture.componentInstance;
  });



  beforeEach(() => {
    inject([TranslateService], (service) => {
      translateService = service;
      translateService.use('en');
    });
  });

  it('#subscribeUtilityEvents should return the base url', (done) => {
    const buildParamService = TestBed.get(BuildParamService);
    spyOn(buildParamService, 'getBuildConfigParam').and.returnValue(Promise.resolve('SAMPLE_BASE_URL'));
    component.backButtonFunc = jasmine.createSpy();
    component.subscribeUtilityEvents();
    setTimeout(() => {
      expect(component.baseUrl).toBe('SAMPLE_BASE_URL');
      done();
    }, 100);
  });

  it('#subscribeUtilityEvents should handle error condition', (done) => {
    const buildParamService = TestBed.get(BuildParamService);
    spyOn(buildParamService, 'getBuildConfigParam').and.returnValue(Promise.reject('SAMPLE_BASE_URL'));
    component.backButtonFunc = jasmine.createSpy();
    component.subscribeUtilityEvents();
    setTimeout( () => {
      expect(component.baseUrl).toBe('');
      done();
    }, 100);
  });

  it('#subscribeUtilityEvents should receive the enroll success event', () => {
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake( (arg, success) => {
      return success(mockRes.enrollCourseEvent);
    });
    component.backButtonFunc = jasmine.createSpy();
    component.subscribeUtilityEvents();
    expect(component.batchId).toBe('1234');
  });

  it('#subscribeUtilityEvents should handle device Back button',  () => {
    const platform = TestBed.get(Platform);
    spyOn(platform, 'registerBackButtonAction').and.callFake((success) => {
      return success();
    });
    spyOn(component, 'generateEndEvent').and.callThrough().and.callFake( () => { });
    component.objId = 'SAMPLE_ID';
    component.objType = 'SAMPLE_TYPE';
    component.objVer = 'SAMPLE_VERSION';
    component.backButtonFunc = jasmine.createSpy();
    component.subscribeUtilityEvents();
    expect(component.generateEndEvent).toHaveBeenCalledWith('SAMPLE_ID', 'SAMPLE_TYPE', 'SAMPLE_VERSION');
    expect(component.backButtonFunc).toBeUndefined();
  });

  it('#subscribeUtilityEvents should generate QRscan session End event', () => {
    const platform = TestBed.get(Platform);
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateEndTelemetry');
    spyOn(platform, 'registerBackButtonAction').and.callFake( (success) => {
      return success();
    });
    spyOn(component, 'generateEndEvent').and.callThrough();
    spyOn(component, 'generateQRSessionEndEvent').and.callThrough().and.callFake( () => { });
    component.objId = 'SAMPLE_ID';
    component.objType = 'SAMPLE_TYPE';
    component.objVer = 'SAMPLE_VERSION';
    component.backButtonFunc = jasmine.createSpy();
    component.shouldGenerateEndTelemetry = true;
    component.course = mockRes.sampleCourse;
    component.source = PageId.COURSES;
    component.subscribeUtilityEvents();
    expect(component.generateEndEvent).toHaveBeenCalledWith('SAMPLE_ID', 'SAMPLE_TYPE', 'SAMPLE_VERSION');
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = 'SAMPLE_ID';
    telemetryObject.type = 'SAMPLE_TYPE';
    telemetryObject.version = 'SAMPLE_VERSION';
    expect(telemetryGeneratorService.generateEndTelemetry).toHaveBeenCalledWith('SAMPLE_TYPE',
      Mode.PLAY,
      PageId.COURSE_DETAIL,
      Environment.HOME,
      telemetryObject,
      undefined,
      undefined);
    expect(component.generateQRSessionEndEvent).toHaveBeenCalledWith(PageId.COURSES, 'SAMPLE_ID');
    expect(component.backButtonFunc).toBeUndefined();
  });

  it('#getUserId should populate userId',  () => {
    const appGlobal = TestBed.get(AppGlobalService);
    spyOn(appGlobal, 'getSessionData').and.returnValue(mockRes.sampleSession);
    component.getUserId();
    expect(component.userId).toBe('SAMPLE_ID');
  });

  it('#checkLoggedInOrGuestUser should populate guestUser status', () => {
    const appGlobal = TestBed.get(AppGlobalService);
    spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
    component.checkLoggedInOrGuestUser();
    expect(component.guestUser).toBe(true);
  });

  it('#checkCurrentUserType should populate profileType as STUDENT', (done) => {
    spyObj.and.returnValue(Promise.resolve(ProfileType.STUDENT));
    component.checkCurrentUserType();
    setTimeout(() => {
      expect(component.profileType).toBe(ProfileType.STUDENT);
      done();
    }, 500);

  });

  it('#rateContent shouldnot show warning toast for guest  student profiles',  () => {
    const appGlobal = TestBed.get(AppGlobalService);
    const comonUtilService = TestBed.get(CommonUtilService);
    spyOn(comonUtilService, 'showToast').and.callThrough();
    spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
    spyObj.and.returnValue(Promise.resolve(ProfileType.STUDENT));
    component.checkLoggedInOrGuestUser();
    component.profileType = ProfileType.STUDENT;
    component.rateContent();
    expect(comonUtilService.showToast).not.toHaveBeenCalled();

  });

  it('#rateContent should show warning toast for guest  teacher profiles', () => {
    const appGlobal = TestBed.get(AppGlobalService);
    const comonUtilService = TestBed.get(CommonUtilService);
    spyOn(comonUtilService, 'showToast').and.callThrough();
    spyOn(appGlobal, 'isUserLoggedIn').and.returnValue(false);
    component.checkLoggedInOrGuestUser();
    component.profileType = ProfileType.TEACHER;
    component.rateContent();
    expect(comonUtilService.showToast).toHaveBeenCalledWith('SIGNIN_TO_USE_FEATURE');
  });

  it('#rateContent should show rating popup if course is locally available', () => {
    component.course = mockRes.sampleCourse;
   const popOverController = TestBed.get(PopoverController);
    PopoverMock.setOnDissMissResponse(mockRes.popOverOnDismissResponse);
    component.rateContent();
    expect(popOverController.create).toHaveBeenCalled();
    expect(component.userRating).toBe(3.0);
    expect(component.ratingComment).toBe('Nice App');
  });

  it('#rateContent should show warning toast if course is not locally available', () => {
    component.course = mockRes.sampleCourseNoLocal;
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast').and.callThrough();
    component.rateContent();
    expect(commonUtilService.showToast).toHaveBeenCalledWith('TRY_BEFORE_RATING');
  });

  it('#showOverflowMenu should show Overflow menu', () => {
    component.course = mockRes.sampleCourse;
    component.courseCardData = mockRes.enrollCourseEvent;
    const popOverController = TestBed.get(PopoverController);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop').and.callThrough();
    PopoverMock.setOnDissMissResponse(mockRes.popOverOnDismissResponseMenu);
    component.showOverflowMenu({});
    expect(popOverController.create).toHaveBeenCalled();
    expect(navController.pop).toHaveBeenCalled();
  });

  it('#setContentDetails should extract successsfully if getContentDetails API gives success response', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    const contentService = TestBed.get(ContentService);
    const telemetryService = TestBed.get(TelemetryService);
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(contentService, 'getContentDetail').and.callFake( ({ }, success, error) => {
      const data = JSON.stringify((mockRes.contentDetailsResponse));
      return success(data);
    });
    spyOn(component, 'extractApiResponse').and.callThrough();
    spyOn(component, 'getBatchDetails').and.callThrough().and.callFake(() => { });
    spyOn(component, 'setChildContents').and.callThrough().and.callFake(() => { });
    spyOn(component, 'generateStartEvent').and.callThrough();
    spyOn(component, 'generateImpressionEvent').and.callThrough();
    spyOn(telemetryGeneratorService, 'generateStartTelemetry').and.callThrough();
    spyOn(telemetryService, 'start').and.callThrough().and.callFake(() => { });
    spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callThrough();
    spyOn(telemetryService, 'impression').and.callThrough().and.callFake(() => { });
    const option = {
      contentId: 'SAMPLE_ID',
      refreshContentDetails: true
    };
    component.setContentDetails('SAMPLE_ID');
    expect(component.extractApiResponse).toHaveBeenCalled();
    expect(contentService.getContentDetail).toHaveBeenCalledWith(option, jasmine.any(Function), jasmine.any(Function));
    const telemetryObject: TelemetryObject = new TelemetryObject();
    telemetryObject.id = 'SAMPLE_ID';
    telemetryObject.type = 'Resource';
    telemetryObject.version = '1.0';
    expect(telemetryGeneratorService.generateStartTelemetry).toHaveBeenCalledWith(PageId.COURSE_DETAIL,
      telemetryObject,
      undefined,
      undefined);

    expect(telemetryGeneratorService.generateImpressionTelemetry).toHaveBeenCalledWith(ImpressionType.DETAIL,
      PageId.COURSE_DETAIL, '',
      Environment.HOME,
      'SAMPLE_ID',
      'Resource',
      '1.0',
      undefined,
      undefined);
  });


  it('#setContentDetails should show error toast if getContentDetails API gives CONNECTION_ERROR response', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop');
    spyOn(commonUtilService, 'showToast').and.callThrough();
    spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
     const data = JSON.stringify((mockRes.connectionErrorcontentDetialResponse));
      return error(data);
    });

    spyOn(component, 'extractApiResponse').and.callThrough();
    component.setContentDetails('SAMPLE_ID');
    expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
    expect(component.extractApiResponse).not.toHaveBeenCalled();
    expect(navController.pop).toHaveBeenCalled();
  });

  it('#setContentDetails should show error toast if getContentDetails API gives SERVER_ERROR response', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop');
    spyOn(commonUtilService, 'showToast').and.callThrough();
    spyOn(contentService, 'getContentDetail').and.callFake( ({ }, success, error) => {
     const data = JSON.stringify((mockRes.serverErrorcontentDetialResponse));
      return error(data);
    });
    spyOn(component, 'extractApiResponse').and.callThrough();
    component.setContentDetails('SAMPLE_ID');
    expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_FETCHING_DATA');
    expect(component.extractApiResponse).not.toHaveBeenCalled();
    expect(navController.pop).toHaveBeenCalled();
  });


  it('#setContentDetails should pop  from the page for draft contents', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop');
    spyOn(commonUtilService, 'showToast').and.callThrough();
    spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
      const data = JSON.stringify((mockRes.draftContentDetailsResponse));
      return success(data);
    });
    spyOn(component, 'getBatchDetails').and.callThrough().and.callFake(() => { });
    spyOn(component, 'setChildContents').and.callThrough().and.callFake(() => { });
    spyOn(component, 'extractApiResponse').and.callThrough();
    spyOn(component, 'generateStartEvent').and.callThrough().and.callFake(() => { });
    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    component.setContentDetails('SAMPLE_ID');
    expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
    expect(component.extractApiResponse).toHaveBeenCalled();
    expect(navController.pop).toHaveBeenCalled();
  });

  it('#setContentDetails should pop  from the page for empty contentData response',  () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop');
    spyOn(commonUtilService, 'showToast').and.callThrough();
    spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
      const data = JSON.stringify((mockRes.emptyContentDetailsResponse));
      return success(data);
    });
    spyOn(component, 'getBatchDetails').and.callThrough().and.callFake(() => { });
    spyOn(component, 'setChildContents').and.callThrough().and.callFake(() => { });
    spyOn(component, 'extractApiResponse').and.callThrough();
    spyOn(component, 'generateStartEvent').and.callThrough().and.callFake(() => { });
    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    component.setContentDetails('SAMPLE_ID');
    expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
    expect(component.extractApiResponse).toHaveBeenCalled();
    expect(navController.pop).toHaveBeenCalled();
  });

  it('#setContentDetails should dismiss the overlay if downloaded  content is not available', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
     const data = JSON.stringify((mockRes.locallyNotAvailableContentDetailsResponse));
      return success(data);
    });
    spyOn(component, 'getBatchDetails').and.callThrough().and.callFake(() => { });
    spyOn(component, 'setChildContents').and.callThrough().and.callFake(() => { });
    spyOn(component, 'extractApiResponse').and.callThrough();
    spyOn(component, 'generateStartEvent').and.callThrough().and.callFake(() => { });
    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
      const data = JSON.stringify((mockRes.noContentFoundImportContentResponse));
      return success(data);
    });
    component.setContentDetails('SAMPLE_ID');
    expect(component.extractApiResponse).toHaveBeenCalled();
    expect(contentService.importContent).toHaveBeenCalled();
    expect(component.showLoading).toBe(false);

  });

  it('#importContent should populate queuedIdentifier for successfull API calls', (done) => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);

    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
      const data = JSON.stringify((mockRes.enqueuedImportContentResponse));
      return success(data);
    });
    component.isDownloadStarted = true;
    component.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      expect(component.queuedIdentifiers).toEqual(['SAMPLE_ID']);
      done();
    });

  });

  it('#importContent should show error if nothing is added in queuedIdentifiers ', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast');
    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    spyOn(contentService, 'importContent').and.callFake( ({ }, success, error) => {
     const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
      return success(data);
    });
    component.isDownloadStarted = true;
    component.importContent(['SAMPLE_ID'], false);
    expect(component.queuedIdentifiers.length).toEqual(0);
    // expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_FETCHING_DATA');
  });

  it('#importContent should restore the download state for error condition from importContent', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
     const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
      return error(data);
    });
    component.isDownloadStarted = true;
    component.importContent(['SAMPLE_ID'], false);
    expect(component.isDownloadStarted).toBe(false);
  });

  it('#importContent should show error toast if failure response from importContent API', () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast');
    spyOn(component, 'generateImpressionEvent').and.callThrough().and.callFake(() => { });
    spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
     const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
      return error(data);
    });
    component.isDownloadStarted = false;
    component.importContent(['SAMPLE_ID'], false);
    expect(component.isDownloadStarted).toBe(false);
    expect(commonUtilService.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
  });

  it('#downloadAllContent should invoke importContent API', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'importContent').and.callFake( ({ }, success, error) => {
     const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
      return success(data);
    });
    component.isNetworkAvailable = true;
    component.downloadAllContent();
    expect(contentService.importContent).toHaveBeenCalled();
  });

  it('#downloadAllContent should show error response if internet is not available', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast');
    spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
      const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
      return success(data);
    });
    component.isNetworkAvailable = false;
    component.downloadAllContent();
    expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
  });

  it('#setChildContents should dismiss the children loader', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'getChildContents').and.callFake(({ }, success, error) => {
      const data = JSON.stringify((mockRes.getChildContentAPIResponse));
      return success(data);
    });
    component.setChildContents();
    expect(component.showChildrenLoader).toBe(false);
  });

  it('#setChildContents should handle error scenario', () => {
    component.courseCardData = {};
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'getChildContents').and.callFake(({ }, success, error) => {
      return error();
    });
    component.setChildContents();
    expect(component.showChildrenLoader).toBe(false);
  });

  it('#navigateToChildrenDetailsPage should navigate to EnrolledCourseDetails page', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push');
    component.identifier = 'SAMPLE_ID';
    const content = { 'contentType': 'Course' };
    const contentState = {
      batchId: '1234',
      courseId: 'SAMPLE_ID'
    };
    component.navigateToChildrenDetailsPage(content, 1);
    expect(navController.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, {
      content: content,
      depth: 1,
      contentState: contentState
    });
  });

  it('#navigateToChildrenDetailsPage should navigate to CollectionDetails page', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push');
    component.identifier = 'SAMPLE_ID';
    const content = { 'mimeType': 'application/vnd.ekstep.content-collection' };
    const contentState = {
      batchId: '1234',
      courseId: 'SAMPLE_ID'
    };
    component.navigateToChildrenDetailsPage(content, 1);
    expect(navController.push).toHaveBeenCalledWith(CollectionDetailsPage, {
      content: content,
      depth: 1,
      contentState: contentState
    });
  });

  it('#navigateToChildrenDetailsPage should navigate to ContentDetails page', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push');
    component.identifier = 'SAMPLE_ID';
    const content = { 'contentType': 'Content' };
    const contentState = {
      batchId: '1234',
      courseId: 'SAMPLE_ID'
    };
    component.navigateToChildrenDetailsPage(content, 1);
    expect(navController.push).toHaveBeenCalledWith(ContentDetailsPage, {
      content: content,
      depth: 1,
      contentState: contentState,
      isChildContent: true
    });
  });

  it('#cancelDownload should cancel the download', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'cancelDownload').and.callFake( ({ }, success, error) => {
     const data = JSON.stringify({});
      return success(data);
    });
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop');
    component.identifier = 'SAMPLE_ID';
    component.cancelDownload();
    expect(component.showLoading).toBe(false);
    expect(navController.pop).toHaveBeenCalled();
  });

  it('#cancelDownload should handle error scenario from API', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'cancelDownload').and.callFake(({ }, success, error) => {
      const data = JSON.stringify({});
      return error(data);
    });
    const navController = TestBed.get(NavController);
    spyOn(navController, 'pop');
    component.identifier = 'SAMPLE_ID';
    component.cancelDownload();
    expect(component.showLoading).toBe(false);
    expect(navController.pop).toHaveBeenCalled();
  });

  it('#getBatchDetails should populate batch details',  () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const courseService = TestBed.get(CourseService);
    spyOn(courseService, 'getBatchDetails').and.callFake(({ }, success, error) => {
      const data = JSON.stringify(mockRes.batchDetailsResponse);
      return success(data);
    });
    spyOn(component, 'getBatchCreatorName');
    component.getBatchDetails();
    expect(component.batchDetails.createdBy).toBe('SAMPLE_UID');
    expect(component.getBatchCreatorName).toHaveBeenCalled();
  });

  it('#getBatchDetails should handle error scenario from API', () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = {};
    const courseService = TestBed.get(CourseService);
    spyOn(courseService, 'getBatchDetails').and.callFake(({ }, success, error) => {
      return error();
    });
    spyOn(component, 'getBatchCreatorName');
    component.getBatchDetails();
    expect(component.getBatchCreatorName).not.toHaveBeenCalled();
  });

  it('#getBatchCreatorName should populate Creator firsname and last name', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.batchDetails = { 'createdBy': 'SAMPLE_ID' };
    const profileService = TestBed.get(UserProfileService);
    spyOn(profileService, 'getUserProfileDetails').and.callFake(({ }, success, error) => {
     const data = JSON.stringify(mockRes.creatorDetails);
      return success(data);
    });
    component.getBatchCreatorName();
    expect(component.batchDetails.creatorFirstName).toBe('John');
    expect(component.batchDetails.creatorLastName).toBe('');
  });

  it('#getBatchCreatorName should handle error scenario from API', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.batchDetails = { 'createdBy': 'SAMPLE_ID' };
    const profileService = TestBed.get(UserProfileService);
    spyOn(profileService, 'getUserProfileDetails').and.callFake(({ }, success, error) => {
      return error();
    });
    component.getBatchCreatorName();
    expect(component.batchDetails.creatorFirstName).toBeUndefined();
    expect(component.batchDetails.creatorLastName).toBeUndefined();
  });

  it('#ionViewWillEnter should invoke setContentDetails', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.batchDetails = { 'createdBy': 'SAMPLE_ID' };
    component.batchId = '1234';
    const contentService = TestBed.get(ContentService);
    spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
      return error();
    });
    spyOn(component, 'setContentDetails');
    component.ionViewWillEnter();
    expect(component.setContentDetails).toHaveBeenCalled();
  });

  it('#subscribeGenieEvent should update the download progress when download progress event comes', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
      return success(JSON.stringify(mockRes.downloadProgressEventSample1));
    });
    component.subscribeGenieEvent();
    expect(component.downloadProgress).toBe(10);
  });

  it('#subscribeGenieEvent should update the progress to 0 if API gives response -1', () => {
    component.courseCardData = mockRes.enrollCourseEvent;
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
      return success(JSON.stringify(mockRes.downloadProgressEventSample2));
    });
    component.subscribeGenieEvent();
    expect(component.downloadProgress).toBe(0);
  });

  it('#subscribeGenieEvent should  dismiss overlay if download progress is 100',  () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
      return success(JSON.stringify(mockRes.downloadProgressEventSample3));
    });
    component.subscribeGenieEvent();
    expect(component.showLoading).toBe(false);
  });

  it('#subscribeGenieEvent should  mark download as complete',  () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = { 'isAvailableLocally': true };
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
      return success(JSON.stringify(mockRes.importCompleteEventSample));
    });
    component.queuedIdentifiers = ['SAMPLE_ID'];
    component.isDownloadStarted = true;
    component.subscribeGenieEvent();
    expect(component.showLoading).toBe(false);
    expect(component.isDownlaodCompleted).toBe(true);
  });

  it('#subscribeGenieEvent should  load all child contents when download is complete',  () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = { 'isAvailableLocally': true };
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
      return success(JSON.stringify(mockRes.importCompleteEventSample));
    });
    component.queuedIdentifiers = ['SAMPLE_ID'];
    component.isDownloadStarted = false;
    spyOn(component, 'setChildContents');
    component.subscribeGenieEvent();
    expect(component.setChildContents).toHaveBeenCalled();
  });

  it('#subscribeGenieEvent should  update the course if update event is available ',  () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.course = { 'isAvailableLocally': true };
    component.queuedIdentifiers = ['SAMPLE_ID'];
    component.isDownloadStarted = false;
    component.identifier = 'SAMPLE_ID';
    const events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.callFake(({ }, success, error) => {
      return success(JSON.stringify(mockRes.updateEventSample));
    });

    spyOn(component, 'importContent').and.callThrough().and.callFake(() => { });
    component.subscribeGenieEvent();
    expect(component.showLoading).toBe(true);
    expect(component.importContent).toHaveBeenCalledWith(['SAMPLE_ID'], false);
  });

  it('#ionViewWillLeave should unsubscribe event',  () =>  {
    const events = TestBed.get(Events);
    spyOn(events, 'unsubscribe');
    component.ionViewWillLeave();
    expect(events.unsubscribe).toHaveBeenCalledWith('genie.event');
  });

  it('#resumeContent should move to ContentDetails page',  () =>  {
    component.courseCardData = mockRes.enrollCourseEvent;
    component.identifier = 'SAMPLE_ID';
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push');
    component.resumeContent('SAMPLE_ID');
    expect(navController.push).toHaveBeenCalled();
  });

  it('#navigateToBatchListPage should navigate to CourseBatches page if network is available',  () =>  {
    component.identifier = 'SAMPLE_ID';
    const navController = TestBed.get(NavController);
    spyOn(navController, 'push');
    component.isNetworkAvailable = true;
    component.navigateToBatchListPage();
    expect(navController.push).toHaveBeenCalledWith(CourseBatchesPage, { identifier: 'SAMPLE_ID' });
  });

  it('#navigateToBatchListPage should show error message if network is not available',  () =>  {
    component.identifier = 'SAMPLE_ID';
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast');
    component.isNetworkAvailable = false;
    component.navigateToBatchListPage();
    expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
  });

  it('#startContent should invoke navigateToChildDetails page',  () =>  {
    component.startData = mockRes.getChildContentAPIResponse.result.children;
    spyOn(component, 'navigateToChildrenDetailsPage');
    component.startContent();
    expect(component.navigateToChildrenDetailsPage).toHaveBeenCalled();
  });

  it('#share should invoke  export ecar API if course is locally available',  () =>  {
    component.course = { 'contentType': 'Course', 'isAvailableLocally': true, 'identifier': 'SAMPLE_ID' };
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry');
    spyOn(component, 'generateShareInteractEvents').and.callThrough();
    const shareUtil = TestBed.get(ShareUtil);
    spyOn(shareUtil, 'exportEcar').and.callThrough().and.callFake((identifier, success) => {
      return success('SAMPLE_PATH');
    });
    component.share();
    const values = new Map();
    values['ContentType'] = 'Course';
    expect(telemetryGeneratorService.generateInteractTelemetry).toHaveBeenCalledWith(InteractType.TOUCH,
      InteractSubtype.SHARE_COURSE_INITIATED,
      Environment.HOME,
      PageId.CONTENT_DETAIL, undefined,
      values,
      undefined,
      undefined);

  });

  it('#share should show warning toast if exportEcar gives failure response ',  () =>  {
    component.course = { 'contentType': 'Course', 'isAvailableLocally': true, 'identifier': 'SAMPLE_ID' };
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
    const shareUtil = TestBed.get(ShareUtil);
    spyOn(shareUtil, 'exportEcar').and.callThrough().and.callFake((identifier, success, error) => {
      return error('SAMPLE_PATH');
    });
    const commonUtilService = TestBed.get(CommonUtilService);
    spyOn(commonUtilService, 'showToast');
    component.share();
    expect(commonUtilService.showToast).toHaveBeenCalledWith('SHARE_CONTENT_FAILED');
  });

  it('#share should share successfully if content is not locally available ',  () =>  {
    component.course = { 'contentType': 'Course', 'isAvailableLocally': false, 'identifier': 'SAMPLE_ID' };
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
    const shareUtil = TestBed.get(ShareUtil);
    spyOn(shareUtil, 'exportEcar').and.callThrough().and.callFake((identifier, success, error) => {
      return error('SAMPLE_PATH');
    });
    const social = TestBed.get(SocialSharing);
    spyOn(social, 'share').and.callThrough();

    component.share();
    expect(social.share).toHaveBeenCalled();
  });

  it('#ionViewDidLoad should handle device back button click',  () =>  {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateInteractTelemetry').and.callFake(() => { });
    // const navBar = TestBed.get(Navbar)
    // spyOn(navBar, 'backButtonClick').and.callFake((success) => {
    //   return jasmine.any(Function);
    // });
    spyOn(component, 'subscribeUtilityEvents').and.callFake(() => {});
    component.backButtonFunc = jasmine.createSpy();
    component.ionViewDidLoad();
  });

  it('#handleNavBackButton should handle nav back button click',  () =>  {
    const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
    spyOn(telemetryGeneratorService, 'generateEndTelemetry').and.callFake(() => { });
    const navCtrl = TestBed.get(NavController);
    spyOn(navCtrl, 'pop');
    spyOn(component, 'generateQRSessionEndEvent').and.callThrough();
    component.course = mockRes.sampleCourse;
    component.source = PageId.COURSE_DETAIL;
    component.shouldGenerateEndTelemetry = true;
    component.backButtonFunc = jasmine.createSpy();
    component.handleNavBackButton();
    expect(component.generateQRSessionEndEvent).toHaveBeenCalled();
    expect(navCtrl.pop).toHaveBeenCalled();
  });

  it('#setCourseStructure should update contentType count',  () =>  {
    component.course = mockRes.sampleCourse;
    component.setCourseStructure();
    expect(component.course.contentTypesCount).toBe(1);
    component.courseCardData = mockRes.sampleCourse;
    component.setCourseStructure();
    expect(component.course.contentTypesCount).toBe(1);
  });
});
