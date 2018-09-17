
import { ComponentFixture, TestBed, fakeAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TranslateService, TranslateModule, TranslateLoader } from "@ngx-translate/core";
//import { NgZone, } from "@angular/core";
import { NavController, Alert } from "ionic-angular";
import { NavParams, IonicModule } from "ionic-angular";
import { LoadingController } from "ionic-angular";
import { PopoverController } from "ionic-angular";
import { AlertController, Content } from "ionic-angular";
import { GroupService, ProfileType, UserSource, ServiceProvider, BuildParamService, FrameworkService, TelemetryService } from "sunbird";
import { ProfileService } from "sunbird";
import { OAuthService } from "sunbird";
import { ContainerService } from "sunbird";
import { SharedPreferences } from "sunbird";
import { AuthService } from "sunbird";
import { Events } from "ionic-angular";
import { AppGlobalService } from "../../../service/app-global.service";
import { App } from "ionic-angular";
import { ToastController } from "ionic-angular";
import { Network } from "@ionic-native/network";
import { TelemetryGeneratorService } from "../../../service/telemetry-generator.service";
import { GroupDetailsPage } from "./group-details";
import { } from "jasmine";
import { mockAllProfiles, userList, selectedUser } from '../group-details/group-detail.data.spec';
import { Observable } from "rxjs";
//import { AlertControllerMock, AlertMock } from 'ionic-mocks'
import {
    NavMock, NavParamsMock, ToastControllerMock, TelemetryServiceMock, TranslateLoaderMock, TranslateServiceStub, NavControllerMock, LoadingControllerMock, PopoverControllerMock, AlertControllerMock, AlertMock, profileServiceMock, ContainerServiceMock, AuthServiceMock, SharedPreferencesMock, EventsMock, AppGlobalServiceMock, appMock, AppMock, groupServiceMock, oAuthServiceMock, networkMock
} from '../../../../test-config/mocks-ionic';

describe("GroupDetailsPage", () => {
    let comp: GroupDetailsPage;
    let fixture: ComponentFixture<GroupDetailsPage>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [GroupDetailsPage],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                IonicModule.forRoot(GroupDetailsPage),
                TranslateModule.forRoot({
                    loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
                }),

            ],
            providers: [
                ServiceProvider, BuildParamService, FrameworkService, ProfileService,TelemetryGeneratorService,TelemetryService,
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: NavController, useClass: NavControllerMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: LoadingController, useClass: LoadingControllerMock },
                { provide: PopoverController, useClass: PopoverControllerMock },
                { provide: AlertController, useClass: AlertControllerMock },
                { provide: GroupService, useClass: groupServiceMock },
                { provide: OAuthService, useClass: oAuthServiceMock },
                { provide: ContainerService, useClass: ContainerServiceMock },
                { provide: SharedPreferences, useClass: SharedPreferencesMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: Events, useClass: EventsMock },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: App, useClass: AppMock },
                { provide: ToastController, useClass: ToastControllerMock },
                { provide: Network, useClass: networkMock },
            ]
        });

        // GroupDetailsPage.prototype.group = {
        //     name: 'group_name'
        // };
        // GroupDetailsPage.prototype.group.gid = 'sample_group_id';
        // GroupDetailsPage.prototype.currentGroupId = 'sample_group_id';

        // const navParamsStub = TestBed.get(NavParams);
        // navParamsStub.data = {
        //     name: 'sample_group_name',
        //     gid: 'sample_group_id'
        // }

        fixture = TestBed.createComponent(GroupDetailsPage);
        comp = fixture.componentInstance;

    });
    let getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    }


    it("#constructor can load instance", () => {
        expect(comp).toBeTruthy();
    });

    it("#constructor  userList defaults to: []", () => {
        expect(comp.userList).toEqual([]);
    });

    it("#constructor  userUids defaults to: []", () => {
        expect(comp.userUids).toEqual([]);
    });

    it("#constructor isNoUsers defaults to: false", () => {
        expect(comp.isNoUsers).toEqual(false);
    });

    it("#constructor isCurrentGroupActive defaults to: true", () => {
        expect(comp.isCurrentGroupActive).toEqual(false);
    });

    it('#ionViewWillEnter should call getAllProfile', () => {
        expect(comp.ionViewWillEnter).toBeDefined();
        spyOn(comp, 'ionViewWillEnter').and.callThrough();
        spyOn(comp, 'getAllProfile');
        comp.ionViewWillEnter();
        expect(comp.ionViewWillEnter).toHaveBeenCalled();
        expect(comp.getAllProfile).toHaveBeenCalled();
    });

    it('#resizeContent should call', () => {
        expect(comp.resizeContent).toBeDefined();
        spyOn(comp.content, 'resize');
        spyOn(comp, 'resizeContent').and.callThrough();
        comp.resizeContent();
        expect(comp.resizeContent).toHaveBeenCalled();
        expect(comp.content.resize).toHaveBeenCalled();
    })
    it('#getAllProfile should fetch all profile details', (done) => {
        const profileServiceStub = TestBed.get(ProfileService);

        expect(comp.getAllProfile).toBeDefined();
        spyOn(comp, 'getAllProfile').and.callThrough();
        spyOn(comp, 'getLoader').and.returnValue({ present: () => { } });
        spyOn(profileServiceStub, 'getAllUserProfile').and.returnValue(Promise.resolve(JSON.stringify(mockAllProfiles)));
        comp.getAllProfile();

        setTimeout(() => {
            expect(comp.getAllProfile).toHaveBeenCalled();
            expect(comp.getLoader).toHaveBeenCalled();
            done();
        }, 10);
    });

    it('#selectUser should call', () => {
       expect(comp.selectUser).toBeDefined();
        spyOn(comp, 'selectUser').and.callThrough();
        comp.selectUser(23232, '242423');
        expect(comp.selectUser).toHaveBeenCalled();
    })
    it('#switchAccountConfirmBox should call', () => {
        let uid = '1234';

        const TelemetryGeneratorServiceStub = TestBed.get(TelemetryGeneratorService);
        //const  telemetryObject = TestBed.get(TelemetryObject)
        expect(comp.switchAccountConfirmBox).toBeDefined();
        spyOn(TelemetryGeneratorServiceStub, 'generateInteractTelemetry').and.callFake(()=>{ });
        //spyOn(comp, 'switchAccountConfirmBox');
        spyOn(comp, 'switchAccountConfirmBox').and.callThrough();
        comp.switchAccountConfirmBox();
        expect(TelemetryGeneratorServiceStub.generateInteractTelemetry).toHaveBeenCalled();
        expect(comp.switchAccountConfirmBox).toHaveBeenCalled();
        expect(comp.switchAccountConfirmBox).toHaveBeenCalled();
    })

    it('#play should call', () => {
        expect(comp.play).toBeDefined();
        const groupServiceStub = TestBed.get(GroupService);
        spyOn(groupServiceStub, 'setCurrentGroup').and.returnValue(Promise.resolve({}));
        spyOn(comp, 'play').and.callThrough();
        comp.play();

        expect(comp.play).toHaveBeenCalled();
    })

    it('#play should call', () => {
        expect(comp.play).toBeDefined();
        const AppGlobalServiceStub= TestBed.get(AppGlobalService);
        AppGlobalServiceMock.isGuestUser = true;
        spyOn(comp, 'play').and.callThrough();
        comp.play();
        expect(comp.play).toHaveBeenCalled();
    })
    it('# Logout call', () => {
        const authService = TestBed.get(AuthService);
        expect(comp.play).toBeDefined();
       // spyOn(authService,'endSession');
        spyOn(comp, 'logOut');
        comp.logOut(selectedUser,false);
        expect(comp.logOut).toHaveBeenCalled();
    })
    it('# Logout call', () => {
        const authService = TestBed.get(AuthService);
        window['splashscreen'] = {
            clearPrefs: () => ({})
          }
          spyOn(window['splashscreen'], 'clearPrefs').and.callFake(() => {
          });

        expect(comp.logOut).toBeDefined();
       spyOn(authService,'endSession');
        spyOn(comp, 'logOut').and.callThrough();
        comp.logOut(selectedUser, true);
        expect(comp.logOut).toHaveBeenCalled();
    })

    it('# Logout call', () => {
        const authService = TestBed.get(AuthService);
        expect(comp.play).toBeDefined();
       // spyOn(authService,'endSession');
        spyOn(comp, 'logOut').and.callThrough();
        comp.logOut(selectedUser,false);
        expect(comp.logOut).toHaveBeenCalled();
    });
});
