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
    PlatformMock, NetworkMock } from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule, BuildParamService,
    ContentService } from "sunbird";

import {
    GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, NavParamsMock,
    SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock
} from '../../../test-config/mocks-ionic';

declare let GenieSDK: any;

describe('ContentDetailsPage Component', () => {
    let component: ContentDetailsPage;
    let fixture: ComponentFixture<ContentDetailsPage>;
    let translateService: TranslateService;
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
                ContentService,
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
        const platformSer = TestBed.get(Platform);
        // spyOn(platformSer, 'registerBackButtonAction').and.callThrough();
        // spyOn(platformSer, 'resume').and.callFake(() => Observable.of({}));
        expect(component instanceof ContentDetailsPage).toBe(true);
        expect(component).not.toBeFalsy();
    });

    it('should display toast message', () => {
        spyOn(component, 'showMessage').and.callThrough();
        component.showMessage('Test', false);
        fixture.detectChanges();
        expect(component.showMessage).toHaveBeenCalled();
        expect(component.toastCtrl.create).toHaveBeenCalled();
    });

    it('should start content downloading', () => {
        component.isNetworkAvailable = true;
        component.identifier = 'do_123';
        component.isChildContent = true;
        spyOn(component, 'downloadContent').and.callThrough();
        spyOn(component, 'importContent').and.callThrough();
        component.downloadContent();
        fixture.detectChanges();
        expect(component.downloadContent).toHaveBeenCalled();
        expect(component.downloadProgress).toEqual('0');
        expect(component.importContent).toHaveBeenCalledWith([component.identifier], component.isChildContent);
    });


    it('should not start content downloading', () => {
        component.isNetworkAvailable = false;
        spyOn(component, 'downloadContent').and.callThrough();
        spyOn(component, 'translateAndDisplayMessage').and.callThrough();
        component.downloadContent();
        fixture.detectChanges();
        expect(component.downloadContent).toHaveBeenCalled();
        expect(component.translateAndDisplayMessage).toHaveBeenCalledWith('ERROR_NO_INTERNET_MESSAGE');
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
        const contentService = TestBed.get(ContentService);
        spyOn(component, 'setContentDetails').and.callThrough();
        spyOn(contentService, 'getContentDetail').and.returnValue(mockRes.contentDetailsResponse);
        component.setContentDetails('do_123', true, false);
    });

    it('should call ionViewWillEnter function', () => {
        let cardData = { identifier: 'do_123' };
        component.cardData = {};
        const navParams = TestBed.get(NavParams);
        navParams.data['content'] = cardData;
        navParams.data['isResumedCourse'] = false;
        spyOn(component, 'ionViewWillEnter').and.callThrough();
        spyOn(navParams, 'get').and.callThrough();
        component.ionViewWillEnter();
        expect(component.cardData).toEqual(cardData);
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
});
