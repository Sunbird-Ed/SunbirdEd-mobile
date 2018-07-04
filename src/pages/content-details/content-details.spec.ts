import { PBHorizontal } from './../../component/pbhorizontal/pb-horizontal';
import { PipesModule } from './../../pipes/pipes.module';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { NavController, Events, IonicModule, NavParams } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from "@angular/common/http";
import { Ionic2RatingModule } from "ionic2-rating";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Network } from '@ionic-native/network';

import {
    FileUtil,
    AuthService,
    GenieSDKServiceProvider,
    SharedPreferences,
    FrameworkModule
} from "sunbird";
import { ContentDetailsPage } from './content-details';
import { DirectivesModule } from '../../directives/directives.module';
import { AppGlobalService } from '../../service/app-global.service';
import {
    GenieSDKServiceProviderMock,
    SharedPreferencesMock,
    FileUtilMock,
    NavParamsMock,
    SocialSharingMock,
    NavMock,
    TranslateLoaderMock,
    AuthServiceMock
} from '../../../test-config/mocks-ionic';

declare let GenieSDK: any;
describe('ContentDetailsPage Component', () => {
    let component;
    let fixture;
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
                { provide: FileUtil, useClass: FileUtilMock },
                { provide: NavController, useClass: NavMock },
                { provide: Events, useClass: Events },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: SocialSharing, useClass: SocialSharingMock },
                { provide: Network, useClass: Network },
                { provide: AppGlobalService, useClass: AppGlobalService },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GenieSDKServiceProvider, useClass: GenieSDKServiceProviderMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock }
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

    it('should create a valid instance of ContentDetailsPage', () => {
        expect(component instanceof ContentDetailsPage).toBe(true);
    });
});
