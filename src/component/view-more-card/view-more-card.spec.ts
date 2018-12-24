// import { PBHorizontal } from './../../component/pbhorizontal/pb-horizontal';
// import { PipesModule } from './../../pipes/pipes.module';
// import {
//     async,
//     TestBed,
//     ComponentFixture,
//     inject
// } from '@angular/core/testing';
// import {
//     TranslateModule,
//     TranslateLoader,
//     TranslateService
// } from '@ngx-translate/core';
// import { HttpClientModule } from '@angular/common/http';
// import { Ionic2RatingModule } from 'ionic2-rating';
// import { SocialSharing } from '@ionic-native/social-sharing';
// import { Network } from '@ionic-native/network';
// import { DirectivesModule } from '../../directives/directives.module';
// import { AppGlobalService } from '../../service/app-global.service';
// import {
//     NavController, Events, IonicModule, NavParams, ToastController, PopoverController,
//     LoadingController
// } from 'ionic-angular';
// import {
//     ToastControllerMock, PopoverControllerMock, LoadingControllerMock,
//     NetworkMock
// } from 'ionic-mocks';
// import {
//     FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule,
//     ContentService, TelemetryService, CourseService, ShareUtil
// } from 'sunbird';
// import {
//     GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, NavParamsMock,
//     SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock
// } from '../../../test-config/mocks-ionic';
// import { CourseUtilService } from '../../service/course-util.service';
// import { ViewMoreCardComponent } from './view-more-card';
// import { mockRes } from './view-more-card.spec.data';

// describe('ViewMoreActivityCardComponent Component', () => {
//     let component: ViewMoreCardComponent;
//     let fixture: ComponentFixture<ViewMoreCardComponent>;
//     let translateService: TranslateService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [ViewMoreCardComponent, PBHorizontal],
//             imports: [
//                 IonicModule.forRoot(ViewMoreCardComponent),
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
//                 ContentService, TelemetryService, CourseService, ShareUtil, CourseUtilService,
//                 { provide: FileUtil, useClass: FileUtilMock },
//                 { provide: NavController, useClass: NavMock },
//                 { provide: Events, useClass: Events },
//                 { provide: NavParams, useClass: NavParamsMock },
//                 { provide: SocialSharing, useClass: SocialSharingMock },
//                 { provide: Network, useFactory: () => NetworkMock.instance('none') },
//                 { provide: AppGlobalService, useClass: AppGlobalService },
//                 { provide: AuthService, useClass: AuthServiceMock },
//                 { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
//                 { provide: SharedPreferences, useClass: SharedPreferencesMock },
//                 { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
//                 { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
//                 { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
//             ]
//         });
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(ViewMoreCardComponent);
//         component = fixture.componentInstance;
//     });

//     beforeEach(() => {
//         inject([TranslateService], (service) => {
//             translateService = service;
//             translateService.use('en');
//         });
//     });

//     it('should create a valid instance of ViewMoreActivityListComponent', () => {
//         expect(component instanceof ViewMoreCardComponent).toBe(true);
//         expect(component).not.toBeFalsy();
//     });

//     it('should redirect to enrolled course details page', () => {
//         component.content = {};
//         const mockData = mockRes.contentCardDetails;
//         const navCtrl = TestBed.get(NavController);
//         spyOn(component, 'navigateToDetailsPage').and.callThrough();
//         spyOn(navCtrl, 'push').and.callThrough();
//         component.navigateToDetailsPage(mockData, 'enrolledCourse');
//         fixture.detectChanges();
//         expect(component).not.toBeFalsy();
//         expect(component.navigateToDetailsPage).toBeDefined();
//         expect(component.navigateToDetailsPage).toHaveBeenCalledWith(mockData, 'enrolledCourse');
//         expect(navCtrl.push).toHaveBeenCalled();
//     });

//     it('should redirect to collection details page', () => {
//         component.content = {};
//         const mockData = mockRes.collectionDetails;
//         const navCtrl = TestBed.get(NavController);
//         spyOn(component, 'navigateToDetailsPage').and.callThrough();
//         spyOn(navCtrl, 'push').and.callThrough();
//         component.navigateToDetailsPage(mockData, undefined);
//         fixture.detectChanges();
//         expect(component).not.toBeFalsy();
//         expect(component.navigateToDetailsPage).toBeDefined();
//         expect(component.navigateToDetailsPage).toHaveBeenCalledWith(mockData, undefined);
//         expect(navCtrl.push).toHaveBeenCalled();
//     });

//     it('should redirect to content details page', () => {
//         component.content = {};
//         const mockData = mockRes.contentDetails;
//         const navCtrl = TestBed.get(NavController);
//         spyOn(component, 'navigateToDetailsPage').and.callThrough();
//         spyOn(navCtrl, 'push').and.callThrough();
//         component.navigateToDetailsPage(mockData, undefined);
//         fixture.detectChanges();
//         expect(component).not.toBeFalsy();
//         expect(component.navigateToDetailsPage).toBeDefined();
//         expect(component.navigateToDetailsPage).toHaveBeenCalledWith(mockData, undefined);
//         expect(navCtrl.push).toHaveBeenCalled();
//     });

//     it('should resume course', () => {
//         component.content = {};
//         const mockData = mockRes.resumeCourse;
//         const navCtrl = TestBed.get(NavController);
//         const event = TestBed.get(Events);
//         spyOn(event, 'publish').and.callThrough();
//         spyOn(component, 'resumeCourse').and.callThrough();
//         spyOn(navCtrl, 'push').and.callThrough();
//         component.resumeCourse(mockData);
//         fixture.detectChanges();
//         expect(component).not.toBeFalsy();
//         expect(component.resumeCourse).toBeDefined();
//         expect(component.resumeCourse).toHaveBeenCalledWith(mockData);
//     });

//     it('should redirect to enrolled course details page', () => {
//         component.content = {};
//         const mockData = mockRes.contentCardDetails;
//         const navCtrl = TestBed.get(NavController);
//         spyOn(component, 'resumeCourse').and.callThrough();
//         spyOn(navCtrl, 'push').and.callThrough();
//         component.resumeCourse(mockData);
//         fixture.detectChanges();
//         expect(component).not.toBeFalsy();
//         expect(component.resumeCourse).toBeDefined();
//         expect(component.resumeCourse).toHaveBeenCalledWith(mockData);
//         expect(navCtrl.push).toHaveBeenCalled();
//     });

//     it('should get course progress', () => {
//         component.type = 'enrolledCourse';
//         component.content = {};
//         component.content.leafNodesCount = 6;
//         component.content.progress = 7;
//         const courseUtilService = TestBed.get(CourseUtilService);
//         spyOn(component, 'ngOnInit').and.callThrough();
//         spyOn(courseUtilService, 'getCourseProgress').and.callThrough();
//         fixture.detectChanges();
//         expect(component).not.toBeFalsy();
//         expect(component.ngOnInit).toBeDefined();
//         expect(courseUtilService.getCourseProgress).toHaveBeenCalled();
//     });
// });
