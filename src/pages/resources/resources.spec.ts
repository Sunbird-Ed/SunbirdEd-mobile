import { Observable } from 'rxjs/Observable';
import { toastControllerMock, headerServiceMock, profileServiceMock, eventBusServiceMock } from './../../__tests__/mocks';
import { ResourcesPage } from './resources';
import {
    appGlobalServiceMock,
    appVersionMock,
    commonUtilServiceMock,
    contentServiceMock,
    eventsMock,
    frameworkServiceMock,
    navCtrlMock,
    networkMock,
    sharedPreferencesMock,
    sunbirdQRScannerMock,
    telemetryGeneratorServiceMock,
    translateServiceMock,
    zoneMock,
    tabsMock,
    menuControllerMock,
    formAndFrameworkUtilServiceMock
} from '../../__tests__/mocks';
import { mockRes } from './resources.spec.data';
import { AudienceFilter, CardSectionName, ContentType, ViewMore, ContentFilterConfig } from '../../app/app.constant';
import { ViewMoreActivityPage } from '../view-more-activity/view-more-activity';
import { SearchPage } from '../search/search';
import { CollectionDetailsEtbPage } from '../collection-details-etb/collection-details-etb';
import { PageId } from '../../service/telemetry-constants';
import { ProfileType } from 'sunbird-sdk';

describe('ResourcesPage test cases', () => {
    let resource: ResourcesPage;

    beforeEach(() => {

        sharedPreferencesMock.getString.mockReturnValue(Observable.of('english'));
        appVersionMock.getAppName.mockResolvedValue('AppName');
        profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));


        resource = new ResourcesPage(
            profileServiceMock as any,
            eventBusServiceMock as any,
            navCtrlMock as any,
            zoneMock as any,
            sunbirdQRScannerMock as any,
            eventsMock as any,
            appGlobalServiceMock as any,
            appVersionMock as any,
            telemetryGeneratorServiceMock as any,
            commonUtilServiceMock as any,
            translateServiceMock as any,
            networkMock as any,
            tabsMock as any,
            formAndFrameworkUtilServiceMock as any,
            contentServiceMock as any,
            sharedPreferencesMock as any,
            toastControllerMock as any,
            menuControllerMock as any,
            headerServiceMock as any,
            formAndFrameworkUtilServiceMock as any
        );

        jest.resetAllMocks();
    });

    it('should create a instance', () => {
        expect(resource).toBeTruthy();
    });

    describe('subscribeUtilityEvents', () => {
        it('should call getActiveSessionProfile once resource page initializes', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            resource.subscribeUtilityEvents();
            expect(profileServiceMock.getActiveSessionProfile).toHaveBeenCalled();
        });
        it('should call subscribe for savedResources:update', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            spyOn(resource, 'loadRecentlyViewedContent').and.stub();

            resource.subscribeUtilityEvents();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('savedResources:update', expect.any(Function));
            eventsMock.subscribe.mock.calls[0][1].call(resource, { update: 'asdasd' });
        });

        it('should call subscribe for event:showScanner', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            spyOn(resource, 'loadRecentlyViewedContent').and.stub();

            resource.subscribeUtilityEvents();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('event:showScanner', expect.any(Function));
            eventsMock.subscribe.mock.calls[1][1].call(resource, { pageName: 'library' });
            expect(sunbirdQRScannerMock.startScanner).toHaveBeenCalled();
        });

        it('should call subscribe for onAfterLanguageChange:update', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            spyOn(resource, 'getPopularContent').and.stub();
            resource.subscribeUtilityEvents();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('onAfterLanguageChange:update', expect.any(Function));
            eventsMock.subscribe.mock.calls[2][1].call(resource, { selectedLanguage: 'library' });
            expect(resource.getPopularContent).toHaveBeenCalled();
        });

        it('should call subscribe for app-global:profile-obj-changed', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            spyOn(resource, 'swipeDownToRefresh').and.stub();
            resource.subscribeUtilityEvents();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('app-global:profile-obj-changed', expect.any(Function));
            eventsMock.subscribe.mock.calls[3][1].call(resource, { selectedLanguage: 'library' });
            expect(resource.swipeDownToRefresh).toHaveBeenCalled();
        });

        it('should call subscribe for aforce_optional_upgrade', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            resource.subscribeUtilityEvents();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('force_optional_upgrade', expect.any(Function));
            eventsMock.subscribe.mock.calls[4][1].call(resource, {});
            expect(appGlobalServiceMock.openPopover).toHaveBeenCalled();
        });

        it('should call subscribe for tab.change', () => {
            profileServiceMock.getActiveSessionProfile.mockReturnValue(Observable.of({}));
            spyOn(resource, 'getPopularContent').calls.all();
            resource.appliedFilter = 'dummy_filter';
            resource.subscribeUtilityEvents();
            expect(eventsMock.subscribe).toHaveBeenCalledWith('tab.change', expect.any(Function));
            eventsMock.subscribe.mock.calls[5][1].call(resource, 'LIBRARY');
            expect(resource.getPopularContent).toHaveBeenCalled();
        });
    });

    describe('ngOnInit', () => {
        it('should be calling 2 methods', () => {
            spyOn(resource, 'getCurrentUser').and.stub();
            resource.ngOnInit();
            expect(resource.getCurrentUser).toHaveBeenCalled();
        });

    });

    describe('generateNetworkType', () => {
        it('should call generateExtraInfoTelemetry', () => {
            resource.generateNetworkType();
            expect(telemetryGeneratorServiceMock.generateExtraInfoTelemetry).toHaveBeenCalled()
        });

    });

    describe('ngAfterViewInit', () => {
        it('should call subscribe for onboarding-card:completed event', () => {
            resource.ngAfterViewInit();
            eventsMock.subscribe.mock.calls[0][1].call(resource, { isOnBoardingCardCompleted: true });
            expect(eventsMock.subscribe).toHaveBeenCalledWith('onboarding-card:completed', expect.any(Function));
            expect(resource.isOnBoardingCardCompleted).toBe(true);
        });
    });

    describe('ionViewWillLeave ', () => {
        it('should unsubscribe genie.event event', () => {
            resource.headerObservable = { subscribe: jest.fn(), unsubscribe: jest.fn() };
            resource.headerObservable.unsubscribe.mockReturnValue();
            resource.ionViewWillLeave();
            expect(eventsMock.unsubscribe).toHaveBeenCalledWith('update_header');
            expect(eventsMock.unsubscribe).toHaveBeenCalledWith('onboarding-card:completed');
        });
    });

    describe('getCurrrentUser', () => {
        it('should  showSigninCard if ProfileType is teacher and config is enabled', () => {
            spyOn(resource, 'loadRecentlyViewedContent').and.stub();
            spyOn(appGlobalServiceMock, 'getGuestUserType').and.returnValue(ProfileType.TEACHER);
            appGlobalServiceMock.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_TEACHER = true;
            resource.getCurrentUser();
            expect(resource.showSignInCard).toBe(true);
            expect(resource.audienceFilter).toBe(AudienceFilter.GUEST_TEACHER);
            expect(appGlobalServiceMock.getCurrentUser).toHaveBeenCalled();
        });

        it('should  showSigninCard if ProfileType is student and config is enabled', () => {
            spyOn(resource, 'loadRecentlyViewedContent').and.stub();
            spyOn(appGlobalServiceMock, 'getGuestUserType').and.returnValue(ProfileType.STUDENT);
            appGlobalServiceMock.DISPLAY_SIGNIN_FOOTER_CARD_IN_LIBRARY_TAB_FOR_STUDENT = true;
            resource.getCurrentUser();
            expect(resource.showSignInCard).toBe(true);
            expect(resource.audienceFilter).toBe(AudienceFilter.GUEST_STUDENT);
            expect(appGlobalServiceMock.getCurrentUser).toHaveBeenCalled();
        });

    });

    describe('navigateToViewMoreContentPage', () => {

        it('should navigate to ViewMoreList page showDownloadOnlyToggle as false', () => {
            resource.profile = mockRes.profile;
            const savedResourcesSection = CardSectionName.SECTION_SAVED_RESOURCES;
            resource.navigateToViewMoreContentsPage(savedResourcesSection);
            const values = new Map();
            values['SectionName'] = savedResourcesSection;
            expect(navCtrlMock.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
                headerTitle: 'SAVED_RESOURCES',
                pageName: 'resource.SavedResources',
                showDownloadOnlyToggle: undefined,
                uid: mockRes.profile.uid,
                audience: []
            });
        });

        it('should navigate to ViewMoreList page showDownloadOnlyToggle as true', () => {
            resource.profile = mockRes.profile;
            const savedResourcesSection = CardSectionName.SECTION_RECENT_RESOURCES;
            resource.navigateToViewMoreContentsPage(savedResourcesSection);
            const values = new Map();
            values['SectionName'] = savedResourcesSection;
            expect(navCtrlMock.push).toHaveBeenCalledWith(ViewMoreActivityPage, {
                headerTitle: 'RECENTLY_VIEWED',
                pageName: ViewMore.PAGE_RESOURCE_RECENTLY_VIEWED,
                showDownloadOnlyToggle: true,
                uid: mockRes.profile.uid,
                audience: []
            });
        });

    });

    describe('loadRecentlyViewedContent', () => {
        it('should set recentlyViewedResources and showLoader', (done) => {
            contentServiceMock.getContents.mockReturnValue(Observable.of(mockRes.getAllLocalContentsResponse));
            resource.loadRecentlyViewedContent();
            setTimeout(() => {
                zoneMock.run.mock.calls[0][0].call();
                expect(resource.recentlyViewedResources).toBe(mockRes.getAllLocalContentsResponse);
                expect(resource.showLoader).toBe(false);
                done();
            }, 0);
        });

        it('should showLoader', (done) => {
            contentServiceMock.getContents.mockReturnValue(Observable.of(true));
            resource.loadRecentlyViewedContent();
            setTimeout(() => {
                zoneMock.run.mock.calls[0][0].call();
                expect(resource.showLoader).toBe(false);
                done();
            }, 0);
        });
    });


    describe('getPopularContent', () => {
        it('#getPopularContent should  apply all profile values in pageassemble criteria while filling up onboarding cards', () => {
            spyOn(resource, 'getGroupByPage').and.stub();
            spyOn(resource, 'applyProfileFilter').and.stub();
            resource.profile = mockRes.sampleProfile;
            resource.currentMedium = 'English';
            resource.currentGrade = {
                name: 'class 4'
            };
            resource.isFilterApplied = false;

            const criteria = {
                name: 'Resource',
                mode: 'soft',
                filter: {
                    board: ['CBSE'],
                    medium: ['English'],
                    gradeLevel: ['KG'],
                    subject: ['English']
                }
            };
            resource.getPopularContent(true, criteria);
            expect(resource.applyProfileFilter).toBeCalledTimes(3);
        });
    });

    describe('swipeDownToRefresh', () => {
        it('should called getCategoryData ', () => {
            spyOn(resource, 'getCategoryData').and.stub();
            spyOn(resource, 'loadRecentlyViewedContent').and.stub();
            spyOn(resource, 'getPopularContent').and.stub();
            resource.swipeDownToRefresh();
            expect(resource.loadRecentlyViewedContent).toBeCalled();
            expect(resource.getPopularContent).toBeCalled();
        });
    });

    describe('scanQRCode', () => {
        it('#scanQRCode should call startScanner', () => {
            resource.scanQRCode();
            expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toBeCalled();
            expect(sunbirdQRScannerMock.startScanner).toBeCalled();
        });
    });

    describe('search', () => {
        xit('should call navigate to SearchPage', (done) => {
            // arrange
            formAndFrameworkUtilServiceMock.getSupportedContentFilterConfig(ContentFilterConfig.NAME_LIBRARY);
            resource.search();
            setTimeout(() => {
                expect(telemetryGeneratorServiceMock.generateInteractTelemetry).toBeCalled();
                expect(navCtrlMock.push).toBeCalledWith(SearchPage,
                    {
                        'contentType': Array [
                                  'Story',
                                  'Worksheet', 
                                  'Game', 
                                  'Resource',
                                   'Collection',
                                  'TextBook',
                                   'LessonPlan'
                             ],
                        'source': 'library'
                    });
            }, 0);
        });
    });

    describe('getCategoryData', () => {
        it('should call getMediumData and getGradeLevelData', () => {
            spyOn(resource, 'getMediumData').and.stub();
            spyOn(resource, 'getGradeLevelData').and.stub();
            const data = {
                syllabus: ['Mathematics']
            };
            appGlobalServiceMock.getCurrentUser.mockReturnValue(data);
            resource.getCategoryData();
            expect(resource.getMediumData).toBeCalled();
            expect(resource.getGradeLevelData).toBeCalled();
        });
    });

    describe('getMediumData', () => {
        xit('#getMediumData should', (done) => {
            const data = {
                terms: []
            };
            spyOn(resource, 'arrangeMediumsByUserData').and.stub();
            translateServiceMock.currentLang as any = 'english';
            frameworkUtilService.getFrameworkCategoryTerms.mockReturnValue(Observable.of(JSON.stringify(data)));
            resource.getMediumData('12213123', {});
            setTimeout(() => {
                expect(resource.arrangeMediumsByUserData).toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    describe('findWithAttr', () => {
        it('should call findWithAttr', () => {
            const data = [
                { prop: 'value' }
            ];
            resource.findWithAttr(data, 'prop', 'value');
        });
    });

    describe('arrangeMediumsByUserData', () => {
        it('should call', () => {
            resource.categoryMediums = ['English'];
            resource.getGroupByPageReq = {
                medium: ['english']
            };
            appGlobalServiceMock.getCurrentUser.mockReturnValue(mockRes.sampleProfile);
            spyOn(resource, 'mediumClick').and.stub();
            spyOn(resource, 'findWithAttr').and.stub();
            resource.arrangeMediumsByUserData(mockRes.categoryMediumsParam);
            expect(resource.mediumClick).toBeCalled();
        });
    });

    describe('getGradeLevelData', () => {
        xit('#getGradeLevelData should succes', (done) => {
            resource.getGroupByPageReq = {
                grade: ['class 4']
            };
            spyOn(resource, 'classClick');
            translateServiceMock.currentLang = 'english';
            frameworkServiceMock.getCategoryData.mockResolvedValue(JSON.stringify(mockRes.categoryGradeParam));
            resource.getGradeLevelData('12213123', {});
            setTimeout(() => {
                expect(resource.classClick).toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    xit('#getGradeLevelData should failure', () => {
        resource.getGroupByPageReq = {
            grade: ['class 4']
        };
        spyOn(resource, 'classClick');
        translateServiceMock.currentLang = 'english';
        frameworkServiceMock.getCategoryData.mockRejectedValue(JSON.stringify(mockRes.categoryGradeParam));
        resource.getGradeLevelData('12213123', {});
        expect(resource.classClick).not.toHaveBeenCalled();
    });

    describe('checkEmptySearchResult', () => {
        xit('#checkEmptySearchResult should call showToast', () => {
            resource.storyAndWorksheets = [
                { contents: [] }
            ];
            resource.checkEmptySearchResult(false);
            expect(commonUtilServiceMock.showToast).toBeCalledWith('NO_CONTENTS_FOUND');
        });

        it('#checkEmptySearchResult should call not showToast', () => {
            resource.storyAndWorksheets = [
                { contents: ['sunbird'] }
            ];
            resource.checkEmptySearchResult(false);
            expect(commonUtilServiceMock.showToast).not.toBeCalledWith('NO_CONTENTS_FOUND');
        });
    });

    xit('#showOfflineNetworkWarning should showWarning to be false', (done) => {
        resource.showWarning = true;
        resource.showOfflineNetworkWarning();
        setTimeout(() => {
            expect(resource.showWarning).toBe(false);
            done();
        }, 3000);
    });

    describe('checkNetworkStatus', () => {
        it('#checkNetworkStatus should call swipeDownToRefresh', () => {
            spyOn(resource, 'swipeDownToRefresh').and.stub();
            commonUtilServiceMock.networkInfo = {
                isNetworkAvailable: true
            };
            resource.checkNetworkStatus(true);
            expect(resource.swipeDownToRefresh).toBeCalled();
        });
    });

    xit('#classClick selected to be true', () => {
        const spyFunc = jest.fn();
        Object.defineProperty(global.document, 'getElementById', { value: spyFunc });
        spyFunc.mockReturnValue({ scrollTo: jest.fn() });
        resource.categoryGradeLevels = mockRes.categoryGradeParam.terms;
        resource.classClick(0);
        expect(resource.categoryGradeLevels[0].selected).toBe('classAnimate');
    });

    describe('mediumClick', () => {
        it('should selected true', () => {
            spyOn(resource, 'getGroupByPage').and.stub();
            resource.categoryMediums = mockRes.categoryMediumsParam;
            resource.mediumClick('english');
            expect(resource.categoryMediums[0].selected).toBe(true);
        });
    });

    describe('navigateToDetailPage', () => {
        it('should ', () => {
            const item = {
                contentId: '123123-123123-12312',
                contentType: 'mode'
            };
            resource.navigateToDetailPage(item, 0, 'name');
            expect(navCtrlMock.push).toBeCalledWith(CollectionDetailsEtbPage, {
                content: item
            });
        });
    });

    xit('#generateExtraInfoTelemetry should call generateExtraInfoTelemetry', () => {
        commonUtilServiceMock.networkInfo = {
            isNetworkAvailable: true
        };
        resource.localResources = [{}];
        resource.generateExtraInfoTelemetry({});
        expect(telemetryGeneratorServiceMock.generateExtraInfoTelemetry).toBeCalled();
    });

    describe('applyProfileFilter', () => {
        it('#applyProfileFilter should ', () => {
            const arr = [];
            spyOn(arr, 'push');
            resource.applyProfileFilter([{}], [{}], 'string');
            expect(appGlobalServiceMock.getNameForCodeInFramework).toBeCalledTimes(1);
        });
    });

    describe('ionViewWillEnter', () => {
        xit('#ionViewWillEnter should call all methods and audienceFilter deifined', () => {
            spyOn(resource, 'getPopularContent').and.stub();
            spyOn(resource, 'subscribeSdkEvent').and.stub();
            spyOn(resource, 'getCategoryData').and.stub();
            appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
            resource.ionViewWillEnter();
            expect(appGlobalServiceMock.getCurrentUser).toBeCalled();
            expect(resource.getPopularContent).toBeCalled();
            expect(resource.subscribeSdkEvent).toBeCalled();
            expect(resource.getCategoryData).toBeCalled();
            expect(resource.audienceFilter).toBe(AudienceFilter.LOGGED_IN_USER);
        });
    
        xit('#ionViewWillEnter should call this.getCurrentUser and other and audienceFilter undeifined', () => {
            spyOn(resource, 'getCurrentUser').and.stub();
            spyOn(resource, 'subscribeSdkEvent').and.stub();
            spyOn(resource, 'getCategoryData').and.stub();
            resource.pageLoadedSuccess = true;
            appGlobalServiceMock.isUserLoggedIn.mockReturnValue(false);
            resource.ionViewWillEnter();
            expect(resource.getCurrentUser).toBeCalled();
            expect(resource.subscribeSdkEvent).toBeCalled();
            expect(resource.getCategoryData).toBeCalled();
        });
    });

    describe('subscribeSdkEvent', () => {
        xit('should ', () => {
            const data = {
                data: {
                    status: 'IMPORT_COMPLETED'
                },
                type: 'contentImport'
            };
            spyOn(resource, 'loadRecentlyViewedContent').and.stub();
            resource.subscribeSdkEvent();
            eventsMock.subscribe.mock.calls[0][1].call(resource, JSON.stringify(data));
            expect(eventsMock.subscribe).toBeCalledWith('genie.event', expect.any(Function));
            expect(resource.loadRecentlyViewedContent).toBeCalled();
        });
    });

    describe('ionViewDidLoad', () =>{
        it('#ionViewDidLoad', () => {
            resource.ionViewDidLoad();
            expect(appGlobalServiceMock.generateConfigInteractEvent).toBeCalled();
        });
    });

});
