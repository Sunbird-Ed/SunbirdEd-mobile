import {
  navCtrlMock,
  navParamsMock,
  contentServiceMock,
  zoneMock,
  translateServiceMock,
  platformMock,
  telemetryGeneratorServiceMock,
  alertControllerMock,
  appGlobalServiceMock,
  formAndFrameworkUtilServiceMock,
  profileServiceMock,
  eventsMock,
  sharedPreferencesMock,
  popoverCtrlMock,
  commonUtilServiceMock,
  frameworkServiceMock,
  fileUtilMock
} from '../../__tests__/mocks';
import {
  Environment,
  InteractSubtype,
  InteractType,
  Mode,
  PageId,
  ProfileType,
  TabsPage,
  MarkerType,
  ContentMarkerRequest,
  SuggestedFrameworkRequest,
  Profile,
  ProfileService,
  ProfileRequest,
} from 'sunbird';
import { mockRes } from './qr-code-result.spec.data';
import { TranslateService } from '@ngx-translate/core';
import { EnrolledCourseDetailsPage } from '../enrolled-course-details';
import { ProfileSettingsPage} from '../profile-settings/profile-settings';
import { CollectionDetailsPage } from '../collection-details/collection-details';
import { ContentDetailsPage } from '../content-details/content-details';
import { CourseBatchesPage } from '../course-batches/course-batches';
import { datePipeMock } from '../../__tests__/mocks';
import { QrCodeResultPage } from './qr-code-result';
import { mockres } from './../reports/report-list/reportList.spec.data';
import { mockAllProfiles } from './../user-and-groups/share-user-and-groups/share-user-and-group.spec.data';

describe('QrCodeResultPage Component', () => {
  let qrCodeResultPage: QrCodeResultPage;
  beforeEach((() => {
    appGlobalServiceMock.getGuestUserInfo.mockResolvedValue(true);
    qrCodeResultPage = new QrCodeResultPage(
      navCtrlMock as any,
      navParamsMock as any,
      contentServiceMock as any,
      zoneMock as any,
      translateServiceMock as any,
      platformMock as any,
      telemetryGeneratorServiceMock as any,
      alertControllerMock as any,
      appGlobalServiceMock as any,
      formAndFrameworkUtilServiceMock as any,
      profileServiceMock as any,
      eventsMock as any,
      sharedPreferencesMock as any,
      popoverCtrlMock as any,
      commonUtilServiceMock as any,
      frameworkServiceMock as any,
      fileUtilMock as any,
    );
    jest.resetAllMocks();
  }));
  it('should ', () => {
    expect(qrCodeResultPage).toBeTruthy();
  });
  it('#ionViewWillEnter should invoke setContentDetails', () => {
    // assert
    platformMock.registerBackButtonAction.mockImplementation((success) => {
      return success();
    });
    navParamsMock.get.mockImplementation((arg: string) => {
      if (arg === 'content') {
        return [];
      } else if (arg === 'corRelation') {
        return qrCodeResultPage.corRelationList;
      } else if (arg === 'shouldGenerateEndTelemetry') {
        return qrCodeResultPage.shouldGenerateEndTelemetry;
      } else if (arg === 'source') {
        return qrCodeResultPage.source;
      } else if (arg === 'isSingleContent') {
        return qrCodeResultPage.isSingleContent;
      } else if (arg === 'parentContent') {
        return qrCodeResultPage.parentContent;
      }
    });
    spyOn(qrCodeResultPage, 'setContentDetails').and.stub();
    spyOn(qrCodeResultPage, 'getChildContents').and.stub();
    // act
    qrCodeResultPage.ionViewWillEnter();
    // arrange
  });
  it('#ionViewDidLoad should invoke ', (done) => {
    // assert
    (qrCodeResultPage.navBar as any) = {};
    spyOn(qrCodeResultPage, 'handleBackButton').and.callThrough();
    (appGlobalServiceMock.isPlayerLaunched as any) = false;
    spyOn(qrCodeResultPage, 'calculateAvailableUserCount').and.stub();
    // act
    qrCodeResultPage.ionViewDidLoad();
    qrCodeResultPage.navBar.backButtonClick({} as any);
    // arrange
    setTimeout(() => {
      // assert
      expect(qrCodeResultPage.navBar.backButtonClick).toBeDefined();
      done();
    }, 10);
  });


  it('#ionViewWillLeave should invoke unregisterd backbutton', () => {
    // assert
    (qrCodeResultPage.unregisterBackButton as any) = jest.fn();
    spyOn(qrCodeResultPage, 'unregisterBackButton').and.callThrough();
    qrCodeResultPage.downloadProgress = 0;
    // act
    qrCodeResultPage.ionViewWillLeave();
    // arrange
    expect(eventsMock.unsubscribe).toHaveBeenCalledWith('genie.event');
  });

  it('should call registerBackButtonAction()', () => {
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());

    qrCodeResultPage.handleBackButton('SOME_SOURCE');
    expect(navCtrlMock.pop).toHaveBeenCalled();

  });

  it('should call registerBackButtonAction() should navigate to tabs page', () => {
    // assert
    (qrCodeResultPage.isSingleContent as any) = true;
    (appGlobalServiceMock.isProfileSettingsCompleted as any) = true;
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    // act
    qrCodeResultPage.handleBackButton('SOME_SOURCE');
    // arrange
    expect(navCtrlMock.setRoot).toHaveBeenCalledWith(TabsPage, { loginMode: 'guest' });
  });
  it('should call registerBackButtonAction() should navigate to ProfileSettingsPage', () => {
    // assert
    (qrCodeResultPage.isSingleContent as any) = true;
    (appGlobalServiceMock.isGuestUser as any) = true;
    (appGlobalServiceMock.isProfileSettingsCompleted as any) = false;
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    // act
    qrCodeResultPage.handleBackButton('SOME_SOURCE');
    // arrange
    expect(navCtrlMock.setRoot).toHaveBeenCalledWith(ProfileSettingsPage, {
      isCreateNavigationStack: false,
      hideBackButton: true
    });
  });
  it('should call registerBackButtonAction() should navigate to previous page', () => {
    // assert
    (qrCodeResultPage.isSingleContent as any) = false;
    (appGlobalServiceMock.isGuestUser as any) = false;
    (appGlobalServiceMock.isProfileSettingsCompleted as any) = true;
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    // act
    qrCodeResultPage.handleBackButton('SOME_SOURCE');
    // arrange
    expect(navCtrlMock.pop).toHaveBeenCalled();
  });
  it('#extractApiResponse should call getChildContents', () => {
    // act
    const data = JSON.stringify((mockRes.getChildContentAPIResponse));
    contentServiceMock.getChildContents.mockResolvedValue(data);
    appGlobalServiceMock.getCurrentUser.mockReturnValue({});
    spyOn(qrCodeResultPage, 'checkProfileData').and.stub();
    // assert
    qrCodeResultPage.getChildContents();
    // arrange
    expect(contentServiceMock.getChildContents).toHaveBeenCalled();
  });

  it('#extractApiResponse should call getChildContents for error scenerio', (done) => {
    // act
    const data = JSON.stringify((mockRes.getChildContentAPIResponse));
    contentServiceMock.getChildContents.mockRejectedValue('Error: while fetching child contents ===>>>');
    appGlobalServiceMock.getCurrentUser.mockReturnValue({});
    spyOn(qrCodeResultPage, 'checkProfileData').and.stub();
    // assert
    qrCodeResultPage.getChildContents();
    // arrange
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(qrCodeResultPage, null);

      expect(qrCodeResultPage.showChildrenLoader).toBe(false);
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 0);
    expect(contentServiceMock.getChildContents).toHaveBeenCalled();
  });
  it('#playOnline should call the online play content', () => {
    // act
    const content = {
      'contentType': 'textbook',
      'identifier': 'do_21252111813225676812977',
      'isAvailableLocally': true,
      'isUpdateAvailable': false,
      contentData: {
        'streamingUrl': true
      }
    };
    // assert
    qrCodeResultPage.playOnline(content);
    // arrange
    // expect(qrCodeResultPage.playContent).toHaveBeenCalled();
  });
  it('#playOnline should call the navigateToDetailsPage', () => {
    // act
    const content = {
      'contentType': 'textbook',
      'identifier': 'do_21252111813225676812977',
      'isAvailableLocally': true,
      'isUpdateAvailable': false,
      contentData: {
        'streamingUrl': false
      }
    };
    // assert
    qrCodeResultPage.playOnline(content);
    // arrange
    // expect(qrCodeResultPage.navigateToDetailsPage).toHaveBeenCalled();
  });
  it('#navigateToDetailsPage should call with content', () => {
    // act
    const content = {
      'contentType': 'textbook',
      'identifier': 'do_21252111813225676812977',
      'isAvailableLocally': true,
      'isUpdateAvailable': false,
      contentData: {
        'streamingUrl': false
      }
    };
    // assert
    qrCodeResultPage.navigateToDetailsPage(content);
    // arrange
    expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, expect.objectContaining({
      content: content
    }));

  });
  it('#navigateTo CollectionDetailsPage should call with content', () => {
    // act
    const content = {
      'contentType': 'textbook',
      'identifier': 'do_21252111813225676812977',
      'isAvailableLocally': true,
      'isUpdateAvailable': false,
      'mimeType': 'application/vnd.ekstep.content-collection',
      contentData: {
          'streamingUrl': false
        }
      };
    // assert
        qrCodeResultPage.navigateToDetailsPage(content);
    // arrange
    expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsPage, {
      content: content
    });
  });
    it('#navigateTo CollectionDetailsPage should call with content', () => {
  // act
  const content = {
    'contentType': 'textbook',
    'identifier': 'do_21252111813225676812977',
    'isAvailableLocally': true,
    'isUpdateAvailable': false,
    'mimeType': ''
    };
  // assert
      qrCodeResultPage.navigateToDetailsPage(content);
  // arrange
  expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, {
    content: content,
    depth: '1',
    isChildContent: true,
    downloadAndPlay: true
  });
  });
  it('#To calculateAvailableUserCount should call with profile service', (done) => {
    // act
    profileServiceMock.getAllUserProfile.mockResolvedValue(JSON.stringify(mockRes.UserList));
    // assert
    qrCodeResultPage.calculateAvailableUserCount();
    // arrange
    setTimeout(() => {
      expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
      done();
    }, 100);
  });
  it('#To calculateAvailableUserCount should call with profile service and increase userCount', (done) => {
    // act
    profileServiceMock.getAllUserProfile.mockResolvedValue(JSON.stringify(mockRes.UserList));
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    // assert
    qrCodeResultPage.calculateAvailableUserCount();
    // arrange
    setTimeout(() => {
      expect(appGlobalServiceMock.isUserLoggedIn).toHaveBeenCalled();
      done();
    }, 100);
  });
  it('#To calculateAvailableUserCount should call with error scenerio', (done) => {
    // act
    profileServiceMock.getAllUserProfile.mockRejectedValue('error');
    // assert
    qrCodeResultPage.calculateAvailableUserCount();
    // arrange
    expect(profileServiceMock.getAllUserProfile).toHaveBeenCalled();
    done();
  }, 1000);

  it('#To call addElipsesInLongText funtion add elipses to the texts', () => {
    const msg = 'This is to check eclipse';
    // act
    commonUtilServiceMock.translateMessage.mockReturnValue(msg.length > 12);

    // assert
    qrCodeResultPage.addElipsesInLongText(msg);
    // arrange
    expect(commonUtilServiceMock.translateMessage).toHaveBeenCalled();
  });

  it('#To call addElipsesInLongText funtion add elipses to the texts for else scenerio', () => {
    const msg = 'This is to check eclipse';
    // act
    commonUtilServiceMock.translateMessage.mockReturnValue(msg.length < 12);

    // assert
    qrCodeResultPage.addElipsesInLongText(msg);
    // arrange
    expect(commonUtilServiceMock.translateMessage).toHaveBeenCalled();
  });
  it('#To call the content player to play the content', (done) => {
    // act
    const extraInfoMap = { hierarchyInfo: [] };
    const content = {
      'contentType': 'textbook',
      'identifier': 'do_21252111813225676812977',
      'isAvailableLocally': true,
      'isUpdateAvailable': false,
      'mimeType': 'application/vnd.ekstep.content-collection',
      contentData: {
        'streamingUrl': false
      }
    };
    const req: ContentMarkerRequest = {
      uid: (appGlobalServiceMock.getCurrentUser as any).mockReturnValue({ uid: 'sampleuid' }),
      contentId: content.identifier,
      data: JSON.stringify(content.contentData),
      marker: MarkerType.PREVIEWED,
      isMarked: true,
      extraInfoMap: extraInfoMap
    };
    (contentServiceMock.setContentMarker as any).mockResolvedValue(Promise.reject(
      req));
    const request: any = {};
    request.streaming = true;
    (appGlobalServiceMock.isPlayerLaunched as any) = true;
    (<any>window).geniecanvas = { play: jest.fn() };
    // assert
    qrCodeResultPage.playContent(content);
    // arrange
    setTimeout(() => {
      expect(contentServiceMock.setContentMarker).toHaveBeenCalled();
      expect((<any>window).geniecanvas.play).toHaveBeenCalled();
      done();
    }, 100);
  });
  it('#To call the edit profile updating current profile', (done) => {
    // act
   qrCodeResultPage.profile = mockRes.profile;
    profileServiceMock.updateProfile.mockResolvedValue(JSON.stringify(mockRes.profile));
    // assert
    qrCodeResultPage.editProfile();
    // arrange
    setTimeout(() => {
       // assert
       expect(eventsMock.publish).toHaveBeenCalledWith('user-profile-changed');
       expect(eventsMock.publish).toHaveBeenCalledWith('refresh:profile');
      done();
    }, 200);
  });

  it('#To call the edit profile updating current profile for error scenario', (done) => {
   // act
    qrCodeResultPage.profile = mockRes.profile;
     profileServiceMock.updateProfile.mockRejectedValue('error');
     // assert
     qrCodeResultPage.editProfile();
     // arrange
     setTimeout(() => {
        // assert
      expect(profileServiceMock.updateProfile).toBeCalled();
       done();
     }, 200);
   });

   it('#To call the set Grade ', () => {
   // act
    qrCodeResultPage.profile = mockRes.profile;
     profileServiceMock.updateProfile.mockRejectedValue('error');
     // assert
     qrCodeResultPage.setGrade('reset', 'grades');
     // arrange
    //  expect(profileServiceMock.updateProfile).toEqual('error');
   });
   it('#To call the findCode ', () => {
    // act
   const categoryList: Array<any> = [];
     qrCodeResultPage.profile = mockRes.profile;
      // assert
      qrCodeResultPage.findCode(categoryList, 'data', 'categoryType');
      // arrange
    });
    it('#To call the setCurrentProfile  Assigning board, medium, grade and subject to profile', () => {
      // act
      const extraInfoMap = { hierarchyInfo: [] };
      qrCodeResultPage.profile = mockRes.profile;
      spyOn(qrCodeResultPage, 'editProfile').and.stub();
      // assert
      qrCodeResultPage.setCurrentProfile(1, 'data');
      // arrange
        expect(qrCodeResultPage.editProfile).toHaveBeenCalled();
    });

    it('#current profile data with qr result data, If not matching then reset current profile data', (done) => {
      // act
      const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
      const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
      const suggestedFrameworkRequest: SuggestedFrameworkRequest = {
       isGuestUser: true,
       selectedLanguage: qrCodeResultPage.translate.currentLang,
       categories: ['SuggestedFrameworkRequest']
      };
      frameworkServiceMock.getSuggestedFrameworkList.mockResolvedValue(mockRes.syllabusDetailsAPIResponse);
    formAndFrameworkUtilServiceMock.getFrameworkDetails.mockResolvedValue(mockRes.categoryResponse);
    spyOn(qrCodeResultPage, 'setCurrentProfile').and.stub();
       spyOn(qrCodeResultPage, 'findCode').and.stub();
    // assert
      qrCodeResultPage.checkProfileData(mockContent, mockProfile);
      // arrange
       setTimeout(() => {
        expect(frameworkServiceMock.getSuggestedFrameworkList).toHaveBeenCalled();
         done();
       }, 100);
    });
    it('##current profile data with qr result data, If not matching then reset current profile data Error scenario ', (done) => {
      // act
      const mockProfile = JSON.parse(JSON.stringify(mockRes.profile));
      const mockContent = JSON.parse(JSON.stringify(mockRes.getChildContentAPIResponse.result.contentData));
      frameworkServiceMock.getSuggestedFrameworkList.mockRejectedValue('error');
    formAndFrameworkUtilServiceMock.getFrameworkDetails.mockRejectedValue('error');
        // assert
        qrCodeResultPage.checkProfileData(mockContent, mockProfile);
        // arrange
        setTimeout(() => {
        done();
      }, 100);
      });

  it('should update the download progress when download progress event ' +
  'comes when subscribeGenieEvent()', () => {
    // arrange
      spyOn(qrCodeResultPage, 'getChildContents').and.stub();
    // act
    qrCodeResultPage.subscribeGenieEvent();
    eventsMock.subscribe.mock.calls[0][1].call(qrCodeResultPage,
      JSON.stringify(mockRes.contentDetailsResponse));
    zoneMock.run.mock.calls[0][0].call(qrCodeResultPage, undefined);

    // assert
    expect(eventsMock.subscribe).toHaveBeenCalled();
  });

  it('#subscribeGenieEvent should  load all child contents when download is complete', () => {
    // arrange
    spyOn(qrCodeResultPage, 'getChildContents').and.stub();
    // act
    qrCodeResultPage.isDownloadStarted = true;
    qrCodeResultPage.subscribeGenieEvent();
    eventsMock.subscribe.mock.calls[0][1].call(qrCodeResultPage,
      JSON.stringify(mockRes.importCompleteEventSample));

    zoneMock.run.mock.calls[0][0].call(qrCodeResultPage, undefined);

    // assert
    expect(qrCodeResultPage.showLoading).toBe(false);
    expect(qrCodeResultPage.isDownloadStarted).toBe(false);
  });

  it('subscribeGenieEvent() should  update the course if update event is available ', () => {
    // arrange
    spyOn(qrCodeResultPage, 'getChildContents').and.stub();
    spyOn(qrCodeResultPage, 'importContent').and.stub();
    qrCodeResultPage.cardData = {
      'contentType': 'Collection',
      'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID'
    };

    // act
    // qrCodeResultPage.queuedIdentifiers = ['SAMPLE_ID'];
    qrCodeResultPage.isDownloadStarted = false;
    qrCodeResultPage.identifier = 'SAMPLE_ID';
    qrCodeResultPage.parentContent = { 'identifier': 'PARENT_ID' };
    qrCodeResultPage.subscribeGenieEvent();
    eventsMock.subscribe.mock.calls[0][1].call(qrCodeResultPage,
      JSON.stringify(mockRes.updateEventSample));

    zoneMock.run.mock.calls[0][0].call(qrCodeResultPage, undefined);
    zoneMock.run.mock.calls[1][0].call(qrCodeResultPage, undefined);

    // assert
    expect(qrCodeResultPage.showLoading).toBe(true);
    // expect(qrCodeResultPage.importContent).toHaveBeenCalledWith(['PARENT_ID'], true);
  });
  it('should extract content details api response: when content locally available', (done) => {
    // arrange
    spyOn(qrCodeResultPage, 'importContent').and.stub();
    contentServiceMock.getContentDetail.mockResolvedValue(JSON.stringify(mockRes.contentDetailsResponse));

    // act
    qrCodeResultPage.setContentDetails('SOME_IDENTIFIER', true);

    // assert
    expect(contentServiceMock.getContentDetail).toBeCalledWith(expect.objectContaining({
      contentId: 'SOME_IDENTIFIER',
      refreshContentDetails: true
    }));
      setTimeout(() => {
        expect(contentServiceMock.getContentDetail).toHaveBeenCalled();
        done();
      }, 0);
  });
  it('should extract content details api response: when content locally not available', (done) => {
    // arrange
    spyOn(qrCodeResultPage, 'importContent').and.stub();
    contentServiceMock.getContentDetail.mockRejectedValue('error');

    // act
    qrCodeResultPage.setContentDetails('SOME_IDENTIFIER', true);

    // assert
    expect(contentServiceMock.getContentDetail).toBeCalledWith(expect.objectContaining({
      contentId: 'SOME_IDENTIFIER',
      refreshContentDetails: true
    }));
      setTimeout(() => {
        expect(contentServiceMock.getContentDetail).toHaveBeenCalled();
        done();
      }, 0);
  });
  it('#importContent should show error if nothing is added in queuedIdentifiers ', (done) => {
    spyOn(commonUtilServiceMock, 'showToast');
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockResolvedValue(data);
    qrCodeResultPage.isDownloadStarted = true;
    qrCodeResultPage.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(qrCodeResultPage.isDownloadStarted).toBe(true);
      done();
    }, 200);
  });

  it('#importContent should show error if nothing is added in queuedIdentifiers ', (done) => {
    spyOn(commonUtilServiceMock, 'showToast');
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockRejectedValue(JSON.stringify('NETWORK_ERROR'));
    qrCodeResultPage.isDownloadStarted = false;
    qrCodeResultPage.showLoading = false;
    qrCodeResultPage.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
      expect(qrCodeResultPage.isDownloadStarted).toBe(false);
      done();
    }, 200);
  });
  it('#importContent should show error if nothing is added in queuedIdentifiers ', (done) => {
    spyOn(commonUtilServiceMock, 'showToast');
    const data = JSON.stringify((mockRes.enqueuedOthersImportContentResponse));
    contentServiceMock.importContent.mockRejectedValue(JSON.stringify('CONNECTION_ERROR'));
    qrCodeResultPage.isDownloadStarted = false;
    qrCodeResultPage.showLoading = false;
    qrCodeResultPage.importContent(['SAMPLE_ID'], false);
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call();
      expect(qrCodeResultPage.isDownloadStarted).toBe(false);
      done();
    }, 200);
  });
  it('should be return navParam getImportContentRequestBody() ', () => {
   // arrange
    const identifiers = [];
    (fileUtilMock.internalStoragePath as any).mockReturnValue('SAMPLE_CODE');
    identifiers.push('SAMPLE_CODE');
    // act
    qrCodeResultPage.getImportContentRequestBody(identifiers, true);
    // assert
});

it('should cancel the download when cancelDownload()', (done) => {
  // arrange
  contentServiceMock.cancelDownload.mockResolvedValue(undefined);

  // act
  qrCodeResultPage.cancelDownload();

  // assert
  setTimeout(() => {
    zoneMock.run.mock.calls[0][0].call(qrCodeResultPage, undefined);
    expect(qrCodeResultPage.showLoading).toBe(false);
    expect(navCtrlMock.pop).toHaveBeenCalled();
    done();
  }, 0);
});

it('should handle error scenario from API when cancelDownload()', (done) => {
  // arrange
  contentServiceMock.cancelDownload.mockRejectedValue(undefined);

  // act
  qrCodeResultPage.cancelDownload();

  // assert
  setTimeout(() => {
    zoneMock.run.mock.calls[0][0].call(qrCodeResultPage, undefined);
    expect(qrCodeResultPage.showLoading).toBe(false);
    expect(navCtrlMock.pop).toHaveBeenCalled();
    done();
  }, 0);
});


it('should handle the skip steps', () => {
  // arrange
  (appGlobalServiceMock.isOnBoardingCompleted as any) = true;
  (appGlobalServiceMock.isProfileSettingsCompleted as any) = true;
  (appGlobalServiceMock.DISPLAY_ONBOARDING_CATEGORY_PAGE as any) = true;

 // act
  qrCodeResultPage.skipSteps();

  // assert
  expect(navCtrlMock.setRoot).toHaveBeenCalledWith(TabsPage, {loginMode: 'guest'});
});
});
