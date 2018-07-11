import { PBHorizontal } from './../../component/pbhorizontal/pb-horizontal';
import { PipesModule } from './../../pipes/pipes.module';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Ionic2RatingModule } from "ionic2-rating";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { mockRes } from './content-details.spec.data';
import { ContentDetailsPage } from './content-details';
import { DirectivesModule } from '../../directives/directives.module';
import { AppGlobalService } from '../../service/app-global.service';
import { Observable } from 'rxjs/Observable';


import { NavController, Events, IonicModule, NavParams, ToastController, PopoverController, 
    LoadingController, Platform } from 'ionic-angular';

import { StorageMock, ToastControllerMock, PopoverControllerMock, LoadingControllerMock,
    NetworkMock } from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule, BuildParamService,
    ContentService, TelemetryService, CourseService, ProfileType, ShareUtil } from "sunbird";

import {
    GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, NavParamsMock,
    SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock, PlatformMock
} from '../../../test-config/mocks-ionic';

declare let GenieSDK: any;

describe('ContentDetailsPage Component', () => {
    let component: ContentDetailsPage;
    let fixture: ComponentFixture<ContentDetailsPage>;
    let translateService: TranslateService;
    let identifier = 'do_212516141114736640146589';
    //const mockNgZone = jasmine.createSpyObj('mockNgZone', ['run', 'runOutsideAngular']);
    //mockNgZone.run.and.callFake(fn => fn());

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContentDetailsPage, PBHorizontal],
            imports: [
                IonicModule.forRoot(ContentDetailsPage),
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
                ContentService, TelemetryService, CourseService, ShareUtil,
                // { provide: Platform, useClass: PlatformMock },
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalService },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: Storage, useFactory: () => StorageMock.instance() },
                { provide: ToastController, useFactory: () => ToastControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() }
                // { provide: Platform, useFactory: () => PlatformMock.instance() }
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentDetailsPage);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        inject([TranslateService], (service) => {
            translateService = service;
            translateService.use('en');
        })
    });

    // it('should create component', () => expect(component).toBeDefined());

    it('should create a valid instance of ContentDetailsPage', () => {
        expect(component instanceof ContentDetailsPage).toBe(true);
        expect(component).not.toBeFalsy();
    });

    it('should display toast message', () => {
        component.isDownloadStarted = true;
        spyOn(component, 'showMessage').and.callThrough();
        component.showMessage('Test', false);
        fixture.detectChanges();
        expect(component.showMessage).toHaveBeenCalled();
        expect(component.toastCtrl.create).toHaveBeenCalled();
    });

    it('should start content downloading', () => {
        const contentService = TestBed.get(ContentService);
        component.isNetworkAvailable = true;
        component.identifier = identifier;
        component.isChildContent = true;
        spyOn(component, 'downloadContent').and.callThrough();
        spyOn(component, 'importContent').and.callThrough();
        spyOn(contentService, 'importContent').and.callFake(function({}, success, error){
            let data = JSON.stringify((mockRes.importContentResponse))
            return success(data);
        });
        component.downloadContent();
        fixture.detectChanges();
        expect(component.downloadContent).toHaveBeenCalled();
        expect(component.downloadProgress).toEqual('0');
        expect(component.importContent).toHaveBeenCalledWith([component.identifier], component.isChildContent);
    });

    it('should return error while importing content', () => {
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'importContent').and.callThrough();
        spyOn(component, 'showMessage').and.callThrough();
        spyOn(contentService, 'importContent').and.callFake(function({}, success, error){
            let data = JSON.stringify((mockRes.importContentResponse))
            return error(data);
        });

        component.importContent([identifier], false);
        fixture.detectChanges();
        expect(component.importContent).toBeDefined()
        expect(component.importContent).toHaveBeenCalledWith([identifier], false);
        expect(component.showMessage).toHaveBeenCalled();
    });

    it('should show no inetrnet message when user click on download button', () => {
        component.isNetworkAvailable = false;
        spyOn(component, 'downloadContent').and.callThrough();
        spyOn(component, 'translateAndDisplayMessage').and.callThrough();
        component.downloadContent();
        fixture.detectChanges();
        expect(component.downloadContent).toHaveBeenCalled();
        expect(component.translateAndDisplayMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
    });

    it('should cancel content downloading ', () => {
        component.content = {};
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'cancelDownload').and.callThrough();
        spyOn(contentService, 'cancelDownload').and.callFake(function(identifier, success, error){
            return success({});
        });
        component.cancelDownload();
        fixture.detectChanges();
        expect(component.cancelDownload).toBeDefined();
        expect(component.cancelDownload).toHaveBeenCalled();
        expect(component.content.downloadable).toBe(false);
    });

    it('should return error while canceling content downloading ', () => {
        component.content = {};
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'cancelDownload').and.callThrough();
        spyOn(contentService, 'cancelDownload').and.callFake(function(identifier, success, error){
            return error({status: false});
        });
        component.cancelDownload();
        fixture.detectChanges();
        expect(component.cancelDownload).toBeDefined();
        expect(component.cancelDownload).toHaveBeenCalled();
    });

    it('should open content rating screen', () => {
        component.content = {};
        component.content.downloadable = true;
        component.content.contentAccess = ['true'];
        component.guestUser = false;
        spyOn(component, 'rateContent').and.callThrough();
        component.rateContent('automatic');
        fixture.detectChanges();
        expect(component.rateContent).toHaveBeenCalled();
    });

    it('should extract content details api response: content isAvailableLocally', () => {
        component.cardData = {};
        component.cardData.contentData = '';
        component.cardData.pkgVersion = '';
        const navParams = TestBed.get(NavParams);
        navParams.data['isResumedCourse'] = true;
        spyOn(component, 'extractApiResponse').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        component.extractApiResponse(mockRes.contentDetailsResponse);
        fixture.detectChanges();
        expect(component.content).not.toBeUndefined();
        expect(navParams.get).toHaveBeenCalled();
    });

    it('should extract content details api response: content Locally not available', () => {
        let data = mockRes.contentDetailsResponse;
        data.result.isAvailableLocally = false;
        spyOn(component, 'extractApiResponse').and.callThrough();
        component.extractApiResponse(data);
        fixture.detectChanges();
        expect(component.extractApiResponse).toBeDefined();
        expect(component.extractApiResponse).toHaveBeenCalled()
        expect(component.content).not.toBeUndefined();
        expect(component.content.downloadable).toBe(false);
    });

    it('should set content details', () => {
        component.content = {};
        component.userRating = 0;
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setContentDetails').and.callThrough();
        spyOn(component, 'extractApiResponse').and.callThrough();
        spyOn(contentService, 'getContentDetail').and.callFake(function(option, success, error){
            let data = JSON.stringify((mockRes.contentDetailsResponse))
            return success(data);
        });
        component.setContentDetails(identifier, true, false);
        expect(component.setContentDetails).toBeDefined();
        expect(component.setContentDetails).toHaveBeenCalledWith(identifier, true, false);
        expect(component.extractApiResponse).toBeDefined();
        expect(component.extractApiResponse).toHaveBeenCalled();
    });

    it('should call ionViewWillEnter function', (done) => {
        component.content = {};
        component.cardData = {};
        const navParams = TestBed.get(NavParams);
        let cardData = { identifier: identifier };
        navParams.data['content'] = cardData;
        navParams.data['isResumedCourse'] = false;
        spyOn(component, 'ionViewWillEnter').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        spyOn(component, 'setContentDetails').and.callThrough();
        const contentService = TestBed.get(ContentService);
        spyOn(contentService, 'getContentDetail').and.callFake(function(option, success, error){
            let data = JSON.stringify((mockRes.contentDetailsResponse))
            return success(data);
        })
        component.ionViewWillEnter();
        expect(component.cardData).toEqual(cardData);
        expect(component.setContentDetails).toHaveBeenCalledWith(identifier, true, false);
        expect(navParams.get).toHaveBeenCalled()
        done();
    });

    it('should genearte rollup object', () => {
        component.cardData = {};
        component.cardData.hierarchyInfo = mockRes.hierarchyInfo;
        spyOn(component, 'generateRollUp').and.callThrough();
        component.generateRollUp();
        expect(component.cardData.hierarchyInfo).not.toBeNull();
        expect(component.generateRollUp).toBeDefined();
        expect(component.generateRollUp).toHaveBeenCalled();
        expect(component.objRollup).not.toBeUndefined();
    });

    it('should update content progress', () => {
        component.content = {};
        component.userId = 'ut12dcndcc';
        const navParams = TestBed.get(NavParams);
        let stateData = { batchId: 'do_123', courseId: 'do_123' };
        const courseService = TestBed.get(CourseService);
        navParams.data['contentState'] = stateData;
        spyOn(component, 'updateContentProgress').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        spyOn(courseService, 'updateContentState').and.callFake(function({}, success, error){
            return success({});
        });
        component.updateContentProgress();
        fixture.detectChanges();
        expect(component.updateContentProgress).toBeDefined();
        expect(component.updateContentProgress).toHaveBeenCalled();
        expect(navParams.get).toHaveBeenCalledWith('contentState');
    });

    it('should translate language const', () => {
        const noInternetMsg = mockRes.languageConstant.ERROR_NO_INTERNET_MESSAGE;
        const languageService = TestBed.get(TranslateService);
        spyOn(component, 'translateMessage').and.callThrough();
        spyOn(languageService, 'get').and.callFake(() => Observable.of(noInternetMsg));
        const message = component.translateMessage('ERROR_NO_INTERNET_MESSAGE');
        expect(component.translateMessage).toBeDefined();
        expect(component.translateMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
        expect(message).toEqual(noInternetMsg);
    });

    it('should check content download progress', () => {
        let mockData = mockRes.importContentDownloadProgressResponse
        spyOn(component, 'subscribeGenieEvent').and.callThrough();
        const event = TestBed.get(Events);
        spyOn(event, 'subscribe').and.callFake(function({}, success){
            return success(JSON.stringify(mockData));
        });
        component.subscribeGenieEvent();
        expect(component.subscribeGenieEvent).toBeDefined();
        expect(component.subscribeGenieEvent).toHaveBeenCalled();
        expect(event.subscribe).toHaveBeenCalled();
        expect(component.downloadProgress).toEqual(mockData.data.downloadProgress);
    });

    it('should check content imported successfully', () => {
        component.content = {};
        component.isDownloadStarted = true;
        component.identifier = identifier;
        let mockData = mockRes.importCompleteResponse;
        const event = TestBed.get(Events);
        spyOn(component, 'subscribeGenieEvent').and.callThrough();
        spyOn(component, 'setContentDetails').and.callThrough();
        // To update saved resources
        spyOn(event, 'publish').and.callThrough();
        spyOn(event, 'subscribe').and.callFake(function({}, success){
            return success(JSON.stringify(mockData));
        });
        // Call component function
        component.subscribeGenieEvent();
        expect(component.subscribeGenieEvent).toBeDefined();
        expect(component.subscribeGenieEvent).toHaveBeenCalled();
        // Event bus 
        expect(event.subscribe).toHaveBeenCalled();
        // To show content delete menu
        expect(component.content.downloadable).toBe(true);
        // Make api call 
        expect(component.setContentDetails).toHaveBeenCalledWith(identifier, true, false);
        // Reset download progress
        expect(component.downloadProgress).toEqual('');
        // Download successful then update saved resources
        expect(event.publish).toHaveBeenCalled();
    });

    it('should check profile type. ProfileType should be TEACHER', () => {
        const sharedPreferences = TestBed.get(SharedPreferences);
        spyOn(component, 'checkCurrentUserType').and.callThrough();
        spyOn(sharedPreferences, 'getString').and.callFake(function({}, success){
            return success(ProfileType.TEACHER);
        });
        component.checkCurrentUserType();
        expect(component.checkCurrentUserType).toBeDefined();
        expect(component.checkCurrentUserType).toHaveBeenCalled();
        expect(sharedPreferences.getString).toHaveBeenCalled();
        expect(component.profileType).toEqual(ProfileType.TEACHER);
        expect(component.profileType).not.toBe(ProfileType.STUDENT);
    }); 

    it('should check profile type. ProfileType should be STUDENT', () => {
        const sharedPreferences = TestBed.get(SharedPreferences);
        spyOn(component, 'checkCurrentUserType').and.callThrough();
        spyOn(sharedPreferences, 'getString').and.callFake(function({}, success){
            return success(ProfileType.STUDENT);
        });
        component.checkCurrentUserType();
        expect(component.checkCurrentUserType).toBeDefined();
        expect(component.checkCurrentUserType).toHaveBeenCalled();
        expect(sharedPreferences.getString).toHaveBeenCalled();
        expect(component.profileType).toEqual(ProfileType.STUDENT);
        expect(component.profileType).not.toBe(ProfileType.TEACHER);
    });

    it('should share content details: content is locally available and Ecar should get exported successfully', () => {
        const webUrl = 'https://staging.open-sunbird.org/play/content/do_212516141114736640146589';
        const devicePath = '/storage/emulated/0/Ecars/tmp/Untitled Content-v1.0.ecar';
        component.content = {};
        component.content.contentType = 'Resource';
        component.content.downloadable = true
        const shareUtil = TestBed.get(ShareUtil);
        const socialShare = TestBed.get(SocialSharing);

        spyOn(socialShare, 'share').and.returnValues({})
        spyOn(component, 'share').and.callThrough();
        spyOn(shareUtil, 'exportEcar').and.callFake(function(identifier, success){
            return success(devicePath);
        })
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
        expect(socialShare.share).toHaveBeenCalled();
    })

    it('it should share content details - content is locally available but exportEcar should return error', () => {
        const webUrl = 'https://staging.open-sunbird.org/play/content/do_212516141114736640146589';
        const devicePath = '/storage/emulated/0/Ecars/tmp/Untitled Content-v1.0.ecar';
        component.content = {};
        component.content.contentType = 'Resource';
        component.content.downloadable = true
        const shareUtil = TestBed.get(ShareUtil);
        const socialShare = TestBed.get(SocialSharing);

        spyOn(socialShare, 'share').and.returnValues({})
        spyOn(component, 'share').and.callThrough();
        spyOn(shareUtil, 'exportEcar').and.callFake(function(identifier, success, error){
            return error();
        })
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
    })

    it('it should share content details without locally available', () => {
        const webUrl = 'https://staging.open-sunbird.org/play/content/do_212516141114736640146589';
        component.content = {};
        component.content.contentType = 'Resource';
        const shareUtil = TestBed.get(ShareUtil);
        const socialShare = TestBed.get(SocialSharing);

        spyOn(socialShare, 'share').and.returnValues({})
        spyOn(component, 'share').and.callThrough();
        component.share();
        expect(component.share).toBeDefined();
        expect(component.share).toHaveBeenCalled();
        expect(socialShare.share).toHaveBeenCalled();
    })
});
