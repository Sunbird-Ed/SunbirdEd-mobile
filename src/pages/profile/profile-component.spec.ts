// import 'rxjs/add/observable/of';
import { Observable } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgZone } from '@angular/core';
import { LoadingController, ToastController, NavController, NavParams, Events, PopoverController } from 'ionic-angular';
import { AuthService, UserProfileService, CourseService, ContentService, TelemetryService, ProfileService, ServiceProvider,
    SharedPreferences, BuildParamService, FrameworkService,
} from 'sunbird';
import { DatePipe } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AppGlobalService } from '../../service/app-global.service';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../component/components.module';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';
import { mockProfileRes } from './profile.data.spec';
import {} from 'jasmine';

import {
    LoadingControllerMock, TranslateServiceStub, ToastControllerMockNew, PopoverControllerMock,
    AuthServiceMock, AppGlobalServiceMock, NavMock, NavParamsMock, profileServiceMock,
    SharedPreferencesMock, FormAndFrameworkUtilServiceMock, EventsMock, TelemetryServiceMock
} from '../../../test-config/mocks-ionic';
import { CommonUtilService } from '../../service/common-util.service';


describe('ProfilePage', () => {
    let comp: ProfilePage;
    let fixture: ComponentFixture<ProfilePage>;

    beforeEach(() => {

        const userProfileServiceStub = {
            endorseOrAddSkill: () => ({}),
            setProfileVisibility: () => ({}),
            getUserProfileDetails : () => ({})
        };

        const courseServiceStub = {};
        const contentServiceStub = {
            searchContent: () => ({})
        };

        const datePipeStub = {
            transform: () => ({})
        };

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot(), ComponentsModule],
            declarations: [ ProfilePage ],
            schemas: [ NO_ERRORS_SCHEMA ],
            providers: [
                ProfileService, ServiceProvider, SharedPreferences, BuildParamService, FrameworkService,
                TelemetryGeneratorService, CommonUtilService,
                { provide: NavController, useClass: NavMock },
                { provide: NavParams, useClass: NavParamsMock },
                { provide: Events, useClass: EventsMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: UserProfileService, useValue: userProfileServiceStub },
                { provide: CourseService, useValue: courseServiceStub },
                { provide: ContentService, useValue: contentServiceStub },
                { provide: TelemetryService, useClass: TelemetryServiceMock },
                { provide: DatePipe, useValue: datePipeStub },
                { provide: TranslateService, useClass: TranslateServiceStub },
                { provide: AppGlobalService, useClass: AppGlobalServiceMock },
                { provide: ToastController, useFactory: () => ToastControllerMockNew.instance() },
                { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
                { provide: PopoverController, useFactory: () => PopoverControllerMock.instance() }
            ]
        });

        fixture = TestBed.createComponent(ProfilePage);
        comp = fixture.componentInstance;
    });

    // it("userId should default to ''", (done) => {
    //     const navParams = TestBed.get(NavParams);
    //     spyOn(navParams, "get").and.callFake(function(data){
    //         console.log('in callfake');
    //         return undefined;
    //     });
    //     let fixture1 = TestBed.createComponent(ProfilePage);
    //     let comp1 = fixture1.componentInstance;
    //     setTimeout(() => {
    //         expect(comp1.userId).toBe('');
    //         done();
    //     },10)
    // });

    const getLoader = () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
    };

    it('can load instance', () => {
        expect(comp).toBeTruthy();
    });

    it('isLoggedInUser defaults to: false', () => {
        expect(comp.isLoggedInUser).toEqual(false);
    });

    // fit("should subscribe to force_optional_upgrade", () => {
    //     const events = TestBed.get(Events);
    //     const appGlobal = TestBed.get(AppGlobalService);
    //     spyOn(appGlobal, "openPopover")
    //     spyOn(events, 'subscribe').and.callFake(function (arg,success) {
    //         if(arg === 'force_optional_upgrade'){
    //             return success("true");
    //         }
    //     });
    //     expect(appGlobal.openPopover).toHaveBeenCalled();
    // });

    it('ionViewDidLoad makes expected calls', () => {
        const telemetryServiceStub = TestBed.get(TelemetryService);
        const events = TestBed.get(Events);
        spyOn(telemetryServiceStub, 'impression');
        spyOn(events, 'subscribe').and.callFake((arg, success) => {
            if (arg === 'profilePicture:update') {
                return success(mockProfileRes.viewLoadEvent);
            }
        });
        spyOn(comp, 'doRefresh');
        comp.ionViewDidLoad();
        expect(telemetryServiceStub.impression).toHaveBeenCalled();
    });

    it('should handle success scenario for doRefresh', (done) => {
        getLoader();
        const events = TestBed.get(Events);
        spyOn(events, 'publish');
        spyOn(comp, 'refreshProfileData').and.returnValue(Promise.resolve('success'));
        comp.doRefresh();
        setTimeout(() => {
            expect(events.publish).toHaveBeenCalled();
            done();
        }, 1000);

    });

    it('should handle success scenarion for refreshProfileData', (done) => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        comp.isLoggedInUser = true;
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        spyOn(userProfileService, 'getUserProfileDetails').and.callFake((req, success, error) => {
            success(mockProfileRes.profileDetailsMock);
        });
        comp.refreshProfileData();
        expect(authService.getSessionData).toHaveBeenCalled();
        setTimeout(() => {
            expect(comp.loggedInUserId).toEqual(mockProfileRes.sessionMock.userToken);
            done();
        }, 10);

    });

    it('should handle success scenarion for refreshProfileData', (done) => {
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        comp.isLoggedInUser = true;
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        spyOn(userProfileService, 'getUserProfileDetails').and.callFake((req, success, error) => {
            error('error');
        });
        comp.refreshProfileData();
        expect(authService.getSessionData).toHaveBeenCalled();
        setTimeout(() => {
            expect(comp.loggedInUserId).toEqual(mockProfileRes.sessionMock.userToken);
            done();
        }, 10);
    });

    it('should handle failure scenario for doRefresh', () => {
        getLoader();
        spyOn(comp, 'refreshProfileData').and.returnValue(Promise.reject('error'));
        comp.doRefresh();
    });

    it('should reset Profile variables', () => {
        comp.subjects = 'sampleSubj';
        comp.resetProfile();
        expect(comp.subjects).toBe('');
    });

    it('arrayToString should convert array to string', () => {
        const data = ['1', '2', '3'].join(', ');
        expect(comp.arrayToString(['1', '2', '3'])).toEqual(data);
        // return stringArray.join(", ");
    });

    it('formatMissingFields should handle all switch cases properly', () => {
        comp.profile.missingFields = ['education'];
        spyOn(comp, 'setMissingProfileDetails');
        // comp.uncompletedDetails = {
        //     title : ''
        // }
        comp.formatMissingFields();
        expect(comp.uncompletedDetails.title).toBe('ADD_EDUCATION');

        comp.profile.missingFields = ['jobProfile'];
        comp.formatMissingFields();
        expect(comp.uncompletedDetails.title).toBe('ADD_EXPERIENCE');

        comp.profile.missingFields = ['avatar'];
        comp.formatMissingFields();

        comp.profile.missingFields = ['address'];
        comp.formatMissingFields();
        expect(comp.uncompletedDetails.title).toBe('ADD_ADDRESS');

        comp.profile.missingFields = ['location'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_LOCATION');

        comp.profile.missingFields = ['phone'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_PHONE_NUMBER');

        comp.profile.missingFields = ['profileSummary'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_PROFILE_DESCRIPTION');

        comp.profile.missingFields = ['subject'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_SUBJECT');

        comp.profile.missingFields = ['dob'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_DATE_OF_BIRTH');

        comp.profile.missingFields = ['grade'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_CLASS');

        comp.profile.missingFields = ['lastName'];
        comp.formatMissingFields();
        expect(comp.setMissingProfileDetails).toHaveBeenCalledWith('ADD_LAST_NAME');

    });

    it('setMissingProfileDetails should set title', () => {
        const title = 'sampleTitile';
        comp.setMissingProfileDetails(title);
        expect(comp.uncompletedDetails.title).toBe(title);
    });

    it('formatJobProfile should make expected calls', () => {
        const data = ['sample1', 'sample2'];
        comp.profile = {
            jobProfile : [{subject : data}]
        };
        comp.formatJobProfile();
        expect(comp.profile.jobProfile[0].subject).toEqual(data.join(', '));
    });

    it('formatLastLoginTime should call datePipe', () => {
        comp.formatLastLoginTime();
    });

    it('formatSkills', () => {
        comp.loggedInUserId = 'sampleUser';
        comp.profile.skills = [
            { endorsersList : [{userId : 'sampleUser'}] }
        ];
        comp.formatSkills();
        expect(comp.profile.skills[0].canEndorse).toBe(false);
    });

    it('formatSocialLinks', () => {
        const data = [
            {type : 'fb', url : 'fbUrl'},
            {type : 'twitter', url : 'twitterUrl'},
            {type : 'in', url : 'inUrl'},
            {url : 'blogUrl'}
        ];
        comp.profile.webPages = data;
        comp.formatSocialLinks();
        expect(comp.fbLink).toBe(data[0].url);
        expect(comp.twitterLink).toBe(data[1].url);
        expect(comp.blogLink).toBe(data[3].url);
    });

    it('formatProfileProgress should assign to formatProfileProgress', () => {
        comp.profile.completeness = true;
        comp.formatProfileProgress();
        expect(comp.profileProgress).toBe('true');
    });

    it('editEduDetails should edit education detaisl', () => {
        const navctrl = TestBed.get(NavController);
        spyOn(navctrl, 'push');
        comp.editEduDetails(false, mockProfileRes.profileDetailsMock, mockProfileRes.eduDetailsMock);
        expect(navctrl.push).toHaveBeenCalled();
    });

    it('editAddress should edit address detaisl', () => {
        const navctrl = TestBed.get(NavController);
        spyOn(navctrl, 'push');
        comp.editAddress(false, mockProfileRes.addressMock);
        expect(navctrl.push).toHaveBeenCalled();
    });

    it('addSkillTags should call nav controller ', () => {
        const navctrl = TestBed.get(NavController);
        spyOn(navctrl, 'push');
        comp.addSkillTags();
        expect(navctrl.push).toHaveBeenCalled();
    });

    it('endorseSkill should handle success scenario', () => {
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        const userProfileService = TestBed.get(UserProfileService);
        const authService = TestBed.get(AuthService);
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        const num = 0;
        spyOn(userProfileService, 'endorseOrAddSkill').and.callFake((req, success, error) => {
            success(mockProfileRes.endorseResMock);
        });
        comp.endorseSkill(num);
        expect(comp.profile.skills[num].canEndorse).toBe(false);
    });

    it('endorseSkill should handle failure scenario', () => {
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        const userProfileService = TestBed.get(UserProfileService);
        const authService = TestBed.get(AuthService);
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        const num = 0;
        spyOn(userProfileService, 'endorseOrAddSkill').and.callFake((req, success, error) => {
            error('{"status":false}');
        });
        comp.endorseSkill(num);
        expect(comp.profile.skills[num].canEndorse).toBe(true);
    });

    it('editPicture should create popover', () => {
        const popoverCtrl = TestBed.get(PopoverController);
        // spyOn()
        comp.editPicture();
        expect(popoverCtrl.create).toHaveBeenCalled();
    });



    it('editExperience should call nav controller ', () => {
        const navctrl = TestBed.get(NavController);
        spyOn(navctrl, 'push');
        comp.editExperience(true, mockProfileRes.addressMock);
        expect(navctrl.push).toHaveBeenCalled();
    });

   it('#toggleLock should set passed field to private', () => {
        const field = 'profileSummary';
        const displayName = 'Profile_Summary';
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        comp.toggleLock(field, displayName, false);
        expect(comp.profile.profileVisibility[field]).toBe('private');

   });

   it('#toggleLock should set passed field to public', () => {
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        const field = 'skillTags';
        const displayName = 'SKILL_TAGS';
        comp.profile.profileVisibility[field] = 'private';
        comp.toggleLock(field, displayName, false);
        expect(comp.profile.profileVisibility[field]).toBe('public');
    });

   it('#setProfileVisibility should handle success scenario', (done) => {
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        spyOn(userProfileService, 'setProfileVisibility').and.callFake((req, success, error) => {
            console.log('req', req);
            success(mockProfileRes.visibilityResMock);
        });
        spyOn(comp, 'refreshProfileData');
        comp.setProfileVisibility('profileSummary');
        setTimeout(() => {
            expect(userProfileService.setProfileVisibility).toHaveBeenCalled();
            // expect(comp.isRefreshProfile).toBe(true);
            expect(comp.refreshProfileData).toHaveBeenCalled();
            done();
        }, 100);
    });

    it('#setProfileVisibility should handle failure scenario', (done) => {
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        const authService = TestBed.get(AuthService);
        const userProfileService = TestBed.get(UserProfileService);
        const translate = TestBed.get(TranslateService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        spyOn(authService, 'getSessionData').and.callFake((success, error) => {
            success(JSON.stringify(mockProfileRes.sessionMock));
        });
        spyOn(userProfileService, 'setProfileVisibility').and.callFake((req, success, error) => {
            console.log('req', req);
            error({status: false});
        });
        spyOn(comp, 'toggleLock');
        comp.setProfileVisibility('profileSummary');
        setTimeout(() => {
            expect(userProfileService.setProfileVisibility).toHaveBeenCalled();
            // expect(comp.isRefreshProfile).toBe(true);
            expect(comp.toggleLock).toHaveBeenCalled();
            done();
        }, 100);
    });


    it('#showMoreItems should set pagination limit', () => {
        comp.profile = JSON.parse(mockProfileRes.profileDetailsMock);
        comp.showMoreItems();
        expect(comp.paginationLimit).toEqual(comp.profile.skills.length);
    });

    it('#showMoreItems should set pagination limit to default', () => {
        comp.showLessItems();
        expect(comp.paginationLimit).toEqual(comp.DEFAULT_PAGINATION_LIMIT);
    });

    it('getLoader makes expected calls', () => {
        const loadingController = TestBed.get(LoadingController);
        comp.getLoader();
        expect(loadingController.create).toHaveBeenCalled();
    });

    /* it('getToast should make expected calls', () => {
        const toasrCtrlStub  = TestBed.get(ToastController);
        let msg = 'testMessage';
        let getToast = comp.getToast(msg);
        expect(comp.options.message).toEqual(msg);
    }); */

    it('translateMessage', () => {
        const translate = TestBed.get(TranslateService);
        const commonUtilServiceStub = TestBed.get(CommonUtilService);
        spyOn(translate, 'get').and.callFake((arg) => {
            return Observable.of('Cancel');
        });
        commonUtilServiceStub.translateMessage('testMessage');
    });



});
