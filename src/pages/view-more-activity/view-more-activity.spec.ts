// import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
// import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import {
//     NavController, Events, IonicModule, NavParams, LoadingController
// } from 'ionic-angular';

// import {
//     NetworkMock
// } from 'ionic-mocks';

// import {
//     SharedPreferences, FrameworkModule, ContentService, TelemetryService, CourseService, ShareUtil
// } from 'sunbird';

// import {
//     SharedPreferencesMock, NavParamsMock,
//     NavMock, TranslateLoaderMock, AppGlobalServiceMock, LoadingControllerMock, NavParamsMockNew
// } from '../../../test-config/mocks-ionic';
// import { PBHorizontal } from '../../component/pbhorizontal/pb-horizontal';
// import { OnboardingCardComponent } from '../../component/onboarding-card/onboarding-card';
// import { CourseCard } from '../../component/card/course/course-card';
// import { SignInCardComponent } from '../../component/sign-in-card/sign-in-card';
// import { Network } from '@ionic-native/network';
// import { AppGlobalService } from '../../service/app-global.service';
// import { PipesModule } from '../../pipes/pipes.module';
// import { HttpClientModule } from '@angular/common/http';
// import { DirectivesModule } from '../../directives/directives.module';
// import { Ionic2RatingModule } from 'ionic2-rating';
// import { } from 'jasmine';
// import { SunbirdQRScanner } from '../qrscanner/sunbirdqrscanner.service';
// import { AppVersion } from '@ionic-native/app-version';
// import { CommonUtilService } from '../../service/common-util.service';
// import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
// import { ViewMoreActivityPage } from './view-more-activity';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { CourseUtilService } from '../../service/course-util.service';
// import { mockRes } from '../view-more-activity/view-more-activity.spec.data';
// import { ContentDetailsPage } from '../content-details/content-details';
// describe('ViewMoreActivityPage Component', () => {
//     let component: ViewMoreActivityPage;
//     let fixture: ComponentFixture<ViewMoreActivityPage>;
//     let translateService: TranslateService;
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ViewMoreActivityPage, PBHorizontal,
//                 OnboardingCardComponent,
//                 CourseCard,
//                 SignInCardComponent],
//             schemas: [NO_ERRORS_SCHEMA],
//             imports: [
//                 IonicModule.forRoot(ViewMoreActivityPage),
//                 TranslateModule.forRoot({
//                     loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
//                 }),
//                 PipesModule,
//                 HttpClientModule,
//                 FrameworkModule,
//                 DirectivesModule,
//                 Ionic2RatingModule
//             ],
//             providers: [
//                 ContentService, TelemetryService, CourseService, ShareUtil, SunbirdQRScanner,
//                 Network, CommonUtilService, TelemetryGeneratorService,
//                 CourseUtilService, AppVersion,
//                 { provide: NavController, useClass: NavMock },
//                 { provide: Events, useClass: Events },
//                 { provide: NavParams, useClass: NavParamsMockNew },
//                 { provide: Network, useFactory: () => NetworkMock.instance('none') },
//                 { provide: AppGlobalService, useClass: AppGlobalServiceMock },
//                 { provide: SharedPreferences, useClass: SharedPreferencesMock },
//                 { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },

//             ]
//         });
//     }));

//     beforeEach(() => {
//         const appVersion = TestBed.get(AppVersion);
//         spyOn(appVersion, 'getAppName').and.returnValue(Promise.resolve('Sunbird'));
//         fixture = TestBed.createComponent(ViewMoreActivityPage);
//         component = fixture.componentInstance;
//         component.tabBarElement = {};
//         component.tabBarElement.style = {};
//         component.resumeContentData = { lastReadContentId: 'SAMPLE_LAST_READ_ID', batchId: 'SAMPLE_BATCH_ID', contentId: 'SAMPLE_ID' };

//     });

//     beforeEach(() => {
//         inject([TranslateService], (service) => {
//             translateService = service;
//             translateService.use('en');
//         });
//     });

//     it('#ionViewCanLeave should unsubscribe genie events', () => {
//         const events = TestBed.get(Events);
//         spyOn(events, 'unsubscribe');
//         component.pageType = 'enrolledCourse';
//         component.ionViewCanLeave();
//         expect(component.isLoadMore).toBe(false);
//         expect(component.pageType).toBe('enrolledCourse');
//         expect(component.showOverlay).toBe(false);
//     });

//     it('#ionViewCanLeave should unsubscribe genie events', () => {
//         component.ngOnInit();
//         expect(component.tabBarElement.style.display).toBe('none');
//     });

//     it('#subscribeSdkEvent should update the download progress when download progress event comes', () => {
//         const events = TestBed.get(Events);
//         spyOn(events, 'subscribe').and.callFake(({ }, success) => {
//             return success(mockRes.downloadProgressEventSample1);
//         });
//         component.subscribeSdkEvent();
//         expect(component.downloadPercentage).toBe(10);
//     });

//     it('#subscribeSdkEvent should update the progress to 0 if API gives response -1', () => {
//         const events = TestBed.get(Events);
//         spyOn(events, 'subscribe').and.callFake(({ }, success) => {
//             return success(mockRes.downloadProgressEventSample2);
//         });
//         component.subscribeSdkEvent();
//         expect(component.downloadPercentage).toBe(0);
//     });

//     it('#subscribeSdkEvent should  mark download as complete and navigate to content details page', () => {
//         const events = TestBed.get(Events);
//         const navController = TestBed.get(NavController);
//         spyOn(navController, 'push');
//         spyOn(events, 'subscribe').and.callFake(({ }, success) => {
//             return success(mockRes.importCompleteEvent);
//         });

//         component.downloadPercentage = 100;
//         component.subscribeSdkEvent();
//         expect(component.showOverlay).toBe(false);
//         expect(navController.push).toHaveBeenCalledWith(ContentDetailsPage, {
//             content: { identifier: 'SAMPLE_LAST_READ_ID' },
//             depth: '1',
//             contentState: {
//                 batchId: 'SAMPLE_BATCH_ID',
//                 courseId: 'SAMPLE_ID'
//             },
//             isResumedCourse: true,
//             isChildContent: true,
//             resumedCourseCardData: component.resumeContentData
//         }
//         );
//     });

//     it('#importContent should populate queuedIdentifier for successfull API calls', (done) => {
//         const contentService = TestBed.get(ContentService);
//         const courseUtilService = TestBed.get(CourseUtilService);
//         spyOn(courseUtilService, 'getImportContentRequestBody').and.returnValue('');
//         spyOn(contentService, 'importContent').and.callFake(({ }, success) => {
//             const data = JSON.stringify((mockRes.enqueuedImportContentResponse));
//             return success(data);
//         });
//         component.importContent(['SAMPLE_ID'], false);
//         setTimeout(() => {
//             expect(component.queuedIdentifiers).toEqual(['SAMPLE_ID']);
//             done();
//         });

//     });

//     it('#importContent should show error if nothing is added in queuedIdentifiers ', () => {
//         const contentService = TestBed.get(ContentService);
//         const commonUtilService = TestBed.get(CommonUtilService);
//         const courseUtilService = TestBed.get(CourseUtilService);
//         spyOn(courseUtilService, 'getImportContentRequestBody').and.returnValue('');
//         spyOn(commonUtilService, 'showToast');
//         spyOn(contentService, 'importContent').and.callFake(({ }, success) => {
//             const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
//             return success(data);
//         });
//         component.importContent(['SAMPLE_ID'], false);
//         expect(component.queuedIdentifiers.length).toEqual(0);
//         expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
//     });

//     it('#importContent should show error toast if failure response from importContent API', () => {
//         const contentService = TestBed.get(ContentService);
//         const commonUtilService = TestBed.get(CommonUtilService);
//         const courseUtilService = TestBed.get(CourseUtilService);
//         spyOn(courseUtilService, 'getImportContentRequestBody').and.returnValue('');
//         spyOn(commonUtilService, 'showToast');
//         spyOn(contentService, 'importContent').and.callFake(({ }, success, error) => {
//             const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
//             return error(data);
//         });
//         component.importContent(['SAMPLE_ID'], false);
//         expect(component.showOverlay).toBe(false);
//         expect(commonUtilService.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
//     });

//     it('#getContentDetails should navigate to content details page if content is locally available', () => {
//         const contentService = TestBed.get(ContentService);
//         const navController = TestBed.get(NavController);
//         spyOn(navController, 'push');
//         spyOn(contentService, 'getContentDetail').and.callFake(({ }, success) => {
//             const data = JSON.stringify((mockRes.contentDetailsResponse));
//             return success(data);
//         });
//         component.getContentDetails(component.resumeContentData);
//         expect(navController.push).toHaveBeenCalledWith(ContentDetailsPage, {
//             content: { identifier: 'SAMPLE_LAST_READ_ID' },
//             depth: '1',
//             contentState: {
//                 batchId: 'SAMPLE_BATCH_ID',
//                 courseId: 'SAMPLE_ID'
//             },
//             isResumedCourse: true,
//             isChildContent: true,
//             resumedCourseCardData: component.resumeContentData
//         }
//         );
//     });

//     it('#getContentDetails should download the content if content is locally not available', () => {
//         const contentService = TestBed.get(ContentService);
//         const navController = TestBed.get(NavController);
//         spyOn(navController, 'push');
//         spyOn(component, 'subscribeSdkEvent');
//         spyOn(component, 'importContent').and.callFake(() => { });
//         spyOn(contentService, 'getContentDetail').and.callFake(({ }, success) => {
//             const data = JSON.stringify((mockRes.locallyNotAvailableContentDetailsResponse));
//             return success(data);
//         });
//         component.getContentDetails(component.resumeContentData);
//         expect(component.subscribeSdkEvent).toHaveBeenCalled();
//         expect(component.importContent).toHaveBeenCalledWith(['SAMPLE_ID'], false);
//     });


//     it('#getContentDetails should handle error response from getContentDetails API', () => {
//         const contentService = TestBed.get(ContentService);
//         const navController = TestBed.get(NavController);
//         spyOn(navController, 'push');
//         spyOn(component, 'subscribeSdkEvent');
//         spyOn(component, 'importContent').and.callFake(() => { });
//         spyOn(contentService, 'getContentDetail').and.callFake(({ }, success, error) => {
//             return error();
//         });
//         component.getContentDetails(component.resumeContentData);
//         expect(component.subscribeSdkEvent).not.toHaveBeenCalled();
//         expect(component.importContent).not.toHaveBeenCalledWith(['SAMPLE_ID'], false);
//     });

//     it('#getLocalContents should call getAllLocalContents API() successfully', (done) => {
//         const contentService = TestBed.get(ContentService);
//         spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.resolve(mockRes.getAllLocalContentsResponse));
//         component.getLocalContents();
//         setTimeout(() => {
//             expect(component.searchList.length).toEqual(1);
//             expect(component.loadMoreBtn).toBe(false);
//             done();
//         }, 5);
//     });

//     it('#getLocalContents should handle error response from getAllLocalContents API', (done) => {
//         const contentService = TestBed.get(ContentService);
//         spyOn(contentService, 'getAllLocalContents').and.returnValues(Promise.reject());
//         component.getLocalContents();
//         setTimeout(() => {
//             expect(component.searchList).toBeUndefined();
//             done();
//         }, 5);
//     });

//     it('#getEnrolledCourse should invoke getEnrolled courses API successfully', () => {
//         const courseService = TestBed.get(CourseService);
//         spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success) => {
//             const data = JSON.stringify(mockRes.getEnrolledCourses);
//             return success(data);
//         });
//         component.getEnrolledCourse();
//         expect(component.searchList.length).toEqual(1);
//         expect(component.loadMoreBtn).toBe(false);
//     });

//     it('#getEnrolledCourse should handle error response from getEnrolled courses API ', () => {
//         const courseService = TestBed.get(CourseService);
//         spyOn(courseService, 'getEnrolledCourses').and.callFake((option, success, error) => {
//             return error();
//         });
//         component.getEnrolledCourse();
//         expect(component.searchList).toBeUndefined();
//     });

//     it('#cancelDownload should cancel the download successfully ', () => {
//         const contentService = TestBed.get(ContentService);
//         spyOn(contentService, 'cancelDownload').and.callFake((option, success) => {
//             return success();
//         });
//         component.cancelDownload();
//         expect(component.showOverlay).toBe(false);
//     });

//     it('#cancelDownload should handle the error scenarios returned from cancelDownload API', () => {
//         const contentService = TestBed.get(ContentService);
//         spyOn(contentService, 'cancelDownload').and.callFake((option, success, error) => {
//             return error();
//         });
//         component.cancelDownload();
//         expect(component.showOverlay).toBe(false);
//     });

//     it('#search should invoke search API successfully', () => {
//         const contentService = TestBed.get(ContentService);
//         const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
//         spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callFake(() => {});
//         spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => {});
//         spyOn(contentService, 'getSearchCriteriaFromRequest').and.callFake((option, success) => {
//             return success(JSON.stringify(mockRes.searchCriteriaResponse));
//         });

//         spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
//             return success(JSON.stringify(mockRes.searchResponse));
//         });
//         component.search();
//         expect(component.searchList.length).toBe(2);
//     });

//     it('#search should populate search list if loadMore parameter is true', () => {
//         const contentService = TestBed.get(ContentService);
//         const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
//         spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callFake(() => {});
//         spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => {});
//         spyOn(contentService, 'getSearchCriteriaFromRequest').and.callFake((option, success) => {
//             return success(JSON.stringify(mockRes.searchCriteriaResponse));
//         });

//         spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
//             return success(JSON.stringify(mockRes.searchResponse));
//         });
//         component.isLoadMore = true;
//         component.searchList = [];
//         component.search();
//         expect(component.searchList.length).toBe(2);
//     });

//     it('#search should dismiss loader if search API didnt provide any result', () => {
//         const contentService = TestBed.get(ContentService);
//         const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
//         spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callFake(() => {});
//         spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => {});
//         spyOn(contentService, 'getSearchCriteriaFromRequest').and.callFake((option, success) => {
//             return success(JSON.stringify(mockRes.searchCriteriaResponse));
//         });

//         spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
//             return success(JSON.stringify({}));
//         });
//         component.search();
//         expect(component.loadMoreBtn).toBe(false);
//     });

//     it('#search should not invoke search API if getSearchCriteriaFromRequest API gives error response', () => {
//         const contentService = TestBed.get(ContentService);
//         spyOn(contentService, 'getSearchCriteriaFromRequest').and.callFake((option, success, error) => {
//             return error();
//         });

//         spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
//             return success(JSON.stringify({}));
//         });
//         component.search();
//         expect(contentService.searchContent).not.toHaveBeenCalled();
//     });

//     it('#search should handle error reponse from serach API', () => {
//         const contentService = TestBed.get(ContentService);
//         const telemetryGeneratorService = TestBed.get(TelemetryGeneratorService);
//         spyOn(telemetryGeneratorService, 'generateImpressionTelemetry').and.callFake(() => {});
//         spyOn(telemetryGeneratorService, 'generateLogEvent').and.callFake(() => {});
//         spyOn(contentService, 'getSearchCriteriaFromRequest').and.callFake((option, success) => {
//             return success(JSON.stringify(mockRes.searchCriteriaResponse));
//         });

//         spyOn(contentService, 'searchContent').and.callFake((reqBody, boolean1, boolean2, boolean3, success, error) => {
//             return error();
//         });
//         component.search();
//         expect(telemetryGeneratorService.generateImpressionTelemetry).not.toHaveBeenCalled();
//         expect(telemetryGeneratorService.generateLogEvent).not.toHaveBeenCalled();
//     });


//     it('#ionViewWillEnter should invoke getEnrolleDCourses when pageName is \'course.EnrolledCourses\'', () => {
//         NavParamsMockNew.setParams('pageName', 'course.EnrolledCourses');
//         spyOn(component, 'getEnrolledCourse').and.callThrough().and.callFake(() => {});
//         component.headerTitle = 'sampleTitle';
//         component.ionViewWillEnter();
//         expect(component.getEnrolledCourse).toHaveBeenCalled();
//         expect(component.pageType).toBe('enrolledCourse');
//     });

//     it('#ionViewWillEnter should invoke search API\'', () => {
//         NavParamsMockNew.setParams('pageName', 'course.PopularContent');
//         spyOn(component, 'search').and.callThrough().and.callFake(() => {});
//         component.headerTitle = 'sampleTitle';
//         component.ionViewWillEnter();
//         expect(component.search).toHaveBeenCalled();
//         expect(component.pageType).toBe('popularCourses');
//     });

//     it('#ionViewWillEnter should invoke getLocalContents when pageName is \'resource.SavedResources\'', () => {
//         NavParamsMockNew.setParams('pageName', 'resource.SavedResources');
//         spyOn(component, 'getLocalContents').and.callThrough().and.callFake(() => {});
//         component.headerTitle = 'sampleTitle';
//         component.ionViewWillEnter();
//         expect(component.getLocalContents).toHaveBeenCalled();
//     });

//     it('#ionViewWillEnter should invoke search API\'', () => {
//         NavParamsMockNew.setParams('pageName', 'resource.SavedResources1');
//         spyOn(component, 'search').and.callThrough().and.callFake(() => {});
//         component.headerTitle = 'sampleTitle';
//         component.ionViewWillEnter();
//         expect(component.search).toHaveBeenCalled();
//     });

//     it('#subscribeUtilityEvent should invoke getLoalContents API when event is fired', () => {
//         NavParamsMockNew.setParams('pageName', 'resource.SavedResources');
//         const events = TestBed.get(Events);
//         spyOn(events, 'subscribe').and.callFake((arg, success) => {
//             if (arg === 'savedResources:update') {
//                 return success({update: 'update'});
//             }

//         });
//         spyOn(component, 'getLocalContents').and.callThrough().and.callFake(() => {});
//         component.subscribeUtilityEvents();
//         expect(component.getLocalContents).toHaveBeenCalled();
//     });

//     it('#subscribeUtilityEvent should invoke getContentDetails API when event is fired', () => {
//         const events = TestBed.get(Events);
//         spyOn(events, 'subscribe').and.callFake((arg, success) => {
//             if (arg === 'viewMore:Courseresume') {
//                 return success({content: {}});
//             }

//         });
//         spyOn(component, 'getContentDetails').and.callThrough().and.callFake(() => {});
//         component.subscribeUtilityEvents();
//         expect(component.getContentDetails).toHaveBeenCalled();
//     });

//     it('#loadMore should invoke mapper method', () => {
//         spyOn(component, 'mapper').and.callThrough().and.callFake(() => {});
//         component.loadMore();
//         expect(component.mapper).toHaveBeenCalled();
//     });

// });
