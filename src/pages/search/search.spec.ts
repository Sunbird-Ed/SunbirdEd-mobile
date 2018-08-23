import { PBHorizontal } from './../../component/pbhorizontal/pb-horizontal';
import { PipesModule } from './../../pipes/pipes.module';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Ionic2RatingModule } from "ionic2-rating";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';
import { SearchPage } from './search';
import { DirectivesModule } from '../../directives/directives.module';
import { AppGlobalService } from '../../service/app-global.service';
import { Observable } from 'rxjs/Observable';


import {
    NavController, Events, IonicModule, NavParams, ToastController, PopoverController,
    LoadingController, Platform
} from 'ionic-angular';

import {
    StorageMock, ToastControllerMock, PopoverControllerMock, LoadingControllerMock,
    NetworkMock
} from 'ionic-mocks';

import {
    FileUtil, AuthService, GenieSDKServiceProvider, SharedPreferences, FrameworkModule, BuildParamService,
    ContentService, TelemetryService, CourseService, ProfileType, ShareUtil
} from "sunbird";

import {
    GenieSDKServiceProviderMock, SharedPreferencesMock, FileUtilMock, 
    SocialSharingMock, NavMock, TranslateLoaderMock, AuthServiceMock, PlatformMock
} from '../../../test-config/mocks-ionic';

import { } from 'jasmine';
import { mockRes } from '../search/search.spec.data';
declare let GenieSDK: any;
export class NavParamsMock {

    static returnParams: any = {};
    static setParams(key: any, value: any): any {
        NavParamsMock.returnParams[key] = value;
    }

    public get(key: any): any {
        if (NavParamsMock.returnParams[key]) {
            return NavParamsMock.returnParams[key];
        }
    }
}
describe('SearchPage Component', () => {
    let component: SearchPage;
    let fixture: ComponentFixture<SearchPage>;
    let translateService: TranslateService;
    let service: AppGlobalService;
    let buildService;
    const authServiceStub = {
        getSessionData: () => ({})
    }


    const buildParamServiceStub = {
        getBuildConfigParam: () => ({})
    }

    const telemetryServiceStub = {
        getTelemetryService: () => ({}),
        impression: () => ({})
    }
    beforeEach(async(() => {
        //NavParamsMock.setParams('dialCode', '6E34E');
        TestBed.configureTestingModule({
            declarations: [SearchPage, PBHorizontal],
            imports: [
                IonicModule.forRoot(SearchPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),
                PipesModule,
                HttpClientModule,
                FrameworkModule,
                DirectivesModule,
                // Ionic2RatingModule
            ],
            providers: [
                ContentService, TelemetryService, CourseService, ShareUtil,
                { provide: AuthService, useValue: authServiceStub },
                { provide: BuildParamService, useValue: buildParamServiceStub },
                { provide: TelemetryService, useValue: telemetryServiceStub },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Network, useFactory: () => NetworkMock.instance('none') },
                { provide: AppGlobalService, useClass: AppGlobalService },
            ]
        })
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchPage);
        component = fixture.componentInstance;
    });

    beforeEach(inject([AppGlobalService, BuildParamService], (appGlobalService: AppGlobalService, buildParamService: BuildParamService) => {
        service = appGlobalService;
        buildService = buildParamService;
    }));

   


    // it('should create component', () => expect(component).toBeDefined());

    // it('should create a valid instance of SearchPage', () => {
    //     expect(component instanceof SearchPage).toBe(true);
    //     expect(component).not.toBeFalsy();
    // });

    it('should invoke getContentDialCode', () => {
        component.dialCode = "saaa"
        const contentService = TestBed.get(ContentService);
        let serarchRequest={};
        spyOn(contentService, 'searchContent').and.callFake(function({}, success, error){
            let data = JSON.stringify(mockRes.searchResultResponse)
            return success(data);
        });
        component.getContentForDialCode();
        spyOn(component, 'getContentForDialCode').and.callThrough();
        // setTimeout(() => {
        //     expect(component.getContentForDialCode).toHaveBeenCalled();
        // }, 0);
       
    });
});



