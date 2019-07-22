import {CollectionDetailsEtbPage} from '@app/pages/collection-details-etb/collection-details-etb';
import {
  appGlobalServiceMock,
  buildParamServiceMock,
  commonUtilServiceMock,
  contentServiceMock,
  courseUtilServiceMock,
  eventsMock,
  fileUtilMock,
  navCtrlMock,
  navParamsMock,
  platformMock,
  popoverCtrlMock,
  shareUtilMock,
  socialSharingMock,
  telemetryGeneratorServiceMock,
  translateServiceMock,
  zoneMock,
  comingSoonMessageServiceMock
} from '@app/__tests__/mocks';
import {mockRes} from '@app/pages/collection-details-etb/collection-details-etb.spec.data';
import {ShareUrl} from '@app/app';
import {EnrolledCourseDetailsPage} from '@app/pages/enrolled-course-details';
import {ContentDetailsPage} from '@app/pages/content-details/content-details';
import 'jest';
import { utilityServiceMock,
   viewControllerMock,
   toastControllerMock,
   fileSizePipeMock,
   headerServiceMock,
   contentShareHandlerMock,
   eventBusServiceMock,
   profileServiceMock,
   storageServiceMock} from '../../__tests__/mocks';

describe('CollectionDetailsPage Component', () => {
  let collectionDetailsPage: CollectionDetailsEtbPage;

  beforeEach(() => {
    appGlobalServiceMock.isUserLoggedIn.mockReturnValue(true);
    // buildParamServiceMock.getBuildConfigParam.mockResolvedValue('SOME_URL');

    collectionDetailsPage = new CollectionDetailsEtbPage(
      contentServiceMock as any,
      eventBusServiceMock as any,
      profileServiceMock as any,
      storageServiceMock as any,
      navCtrlMock as any,
      navParamsMock as any,
      zoneMock as any,
      eventsMock as any,
      popoverCtrlMock as any,
      platformMock as any,
      translateServiceMock as any,
      socialSharingMock as any,
      appGlobalServiceMock as any,
      commonUtilServiceMock as any,
      telemetryGeneratorServiceMock as any,
      courseUtilServiceMock as any,
      utilityServiceMock as any,
      viewControllerMock as any,
      toastControllerMock as any,
      fileSizePipeMock as any,
      headerServiceMock as any,
      comingSoonMessageServiceMock as any,
      contentShareHandlerMock as any
      );

    jest.resetAllMocks();
  });

  it('should create a valid instance of CollectionDetailsPage', () => {
    expect(collectionDetailsPage).toBeTruthy();
  });

  it.only('should set content details', () => {
    // arrange
    spyOn(collectionDetailsPage, 'resetVariables').and.stub();
    spyOn(collectionDetailsPage, 'subscribeSdkEvent').and.stub();
    spyOn(collectionDetailsPage, 'setContentDetails').and.stub();

    navParamsMock.get.mockImplementation((p: string) => {
      if (p === 'content') {
        return {
          identifier: 'SOME_IDENTIFIER'
        };
      }
    });

    // act
    collectionDetailsPage.ionViewWillEnter();
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.setContentDetails).toHaveBeenCalledWith('SOME_IDENTIFIER', true);
  });

  it.only('should extract content details api response: when content locally available', (done) => {
    // arrange
    spyOn(collectionDetailsPage, 'importContent').and.stub();
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'setCollectionStructure').and.stub();
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => Promise.resolve()
    });
    contentServiceMock.getContentDetail.mockResolvedValue(JSON.stringify(mockRes.contentDetailsResponse));

    // act
    collectionDetailsPage.setContentDetails('SOME_IDENTIFIER', true);

    // assert
    expect(contentServiceMock.getContentDetail).toBeCalledWith(expect.objectContaining({
      contentId: 'SOME_IDENTIFIER',
      refreshContentDetails: true
    }));

    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
      setTimeout(() => {
        expect(collectionDetailsPage.contentDetail).toBeTruthy();
        done();
      }, 0);
    }, 0);
  });

  it('should extract content details api response: content Locally not available', (done) => {
    // arrange
    spyOn(collectionDetailsPage, 'importContent').and.stub();
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'setCollectionStructure').and.stub();
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => Promise.resolve()
    });

    const data = mockRes.contentDetailsResponse;
    data.result.contentData.gradeLevel = ['Class 1', 'Class 2'];
    data.result.isAvailableLocally = false;
    contentServiceMock.getContentDetail.mockResolvedValue(JSON.stringify(data));

    // act
    collectionDetailsPage.setContentDetails('SOME_IDENTIFIER', true);

    // assert
    expect(contentServiceMock.getContentDetail).toBeCalledWith(expect.objectContaining({
      contentId: 'SOME_IDENTIFIER',
      refreshContentDetails: true
    }));

    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
      setTimeout(() => {
        expect(collectionDetailsPage.contentDetail).toBeTruthy();
        done();
      }, 0);
    }, 0);
  });

  it('should open content rating screen on rate event', () => {
    // arrange
    collectionDetailsPage.guestUser = false;
    collectionDetailsPage.contentDetail = { isAvailableLocally: true };

    const popUp = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };

    popoverCtrlMock.create.mockReturnValue(popUp);

    // act
    collectionDetailsPage.rateContent();

    // assert
    expect(popUp.present).toHaveBeenCalled();
  });

  it('should generate rollup object', () => {
    // arrange
    collectionDetailsPage.cardData = {};
    collectionDetailsPage.cardData.hierarchyInfo = mockRes.hierarchyInfo;

    // act
    collectionDetailsPage.generateRollUp();

    // assert
    expect(collectionDetailsPage.cardData.hierarchyInfo).toBeTruthy();
    expect(collectionDetailsPage.objRollup).toBeTruthy();
  });

  it('should check content download progress', () => {
    // arrange
    collectionDetailsPage.contentDetail = {
      identifier: undefined
    };
    collectionDetailsPage.cardData = { hierarchyInfo: undefined };

    // act
    collectionDetailsPage.subscribeSdkEvent();

    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.importContentDownloadProgressResponse));
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(eventsMock.subscribe).toHaveBeenCalled();
    expect(collectionDetailsPage.downloadProgress).toEqual(
      mockRes.importContentDownloadProgressResponse.data.downloadProgress);
  });

  it('share() should invoke  export ecar API if course is locally available', () => {
    // arrange
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => {
      }
    });
    spyOn(collectionDetailsPage, 'generateShareInteractEvents').and.stub();

    collectionDetailsPage.contentDetail = {
      'contentType': 'Collection',
      'isAvailableLocally': true,
      'identifier': 'SAMPLE_ID'
    };

    // act
    collectionDetailsPage.share();
    shareUtilMock.exportEcar.mock.calls[0][1].call(collectionDetailsPage, 'SOME_PATH');

    // assert
    expect(socialSharingMock.share).toHaveBeenCalledWith('', '', 'file://SOME_PATH',
      collectionDetailsPage.baseUrl + ShareUrl.COLLECTION + collectionDetailsPage.contentDetail.identifier);
  });

  it('should show warning toast if exportEcar gives failure response when share()', () => {
    // arrange
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => {
      }
    });
    spyOn(collectionDetailsPage, 'generateShareInteractEvents').and.stub();

    collectionDetailsPage.contentDetail = {
      'contentType': 'Collection',
      'isAvailableLocally': true,
      'identifier': 'SAMPLE_ID'
    };

    // act
    collectionDetailsPage.share();
    shareUtilMock.exportEcar.mock.calls[0][2].call(collectionDetailsPage, undefined);

    // assert
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SHARE_CONTENT_FAILED');
  });

  it('should share successfully if content is not locally available when share()', () => {
    // arrange
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => {
      }
    });
    spyOn(collectionDetailsPage, 'generateShareInteractEvents').and.stub();

    collectionDetailsPage.contentDetail = {
      'contentType': 'Collection',
      'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID'
    };

    // act
    collectionDetailsPage.share();

    // assert
    expect(socialSharingMock.share).toHaveBeenCalledWith('', '', '', collectionDetailsPage.baseUrl +
      ShareUrl.COLLECTION + collectionDetailsPage.contentDetail.identifier);
  });

  it('should navigate to EnrolledCourseDetails page when navigateToDetailsPage()', () => {
    // arrange
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    const content = { 'contentType': 'Course' };

    // act
    collectionDetailsPage.navigateToDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(EnrolledCourseDetailsPage, expect.objectContaining({
      content: content
    }));
  });

  it('should navigate to CollectionDetails page when navigateToDetailsPage()', () => {
    // arrange
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    const content = { 'mimeType': 'application/vnd.ekstep.content-collection' };

    // act
    collectionDetailsPage.navigateToDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsEtbPage, expect.objectContaining({
      content: content
    }));
  });

  it('should navigate to CollectionDetailsEtb page when navigateToDetailsPage()', () => {
    // arrange
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    const content = { 'mimeType': 'application/vnd.ekstep.content-collection' };

    // act
    collectionDetailsPage.navigateToDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(CollectionDetailsEtbPage, expect.objectContaining({
      content: content
    }));
  });

  it('should navigate to ContentDetails page when navigateToDetailsPage()', () => {
    // arrange
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    const content = { 'contentType': 'Content' };

    // act
    collectionDetailsPage.navigateToDetailsPage(content, 1);
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(navCtrlMock.push).toHaveBeenCalledWith(ContentDetailsPage, expect.objectContaining({
      content: content
    }));
  });

  it('should cancel the download when cancelDownload()', (done) => {
    // arrange
    contentServiceMock.cancelDownload.mockResolvedValue(undefined);

    // act
    collectionDetailsPage.cancelDownload();

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
      expect(collectionDetailsPage.showLoading).toBe(false);
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should handle error scenario from API when cancelDownload()', (done) => {
    // arrange
    contentServiceMock.cancelDownload.mockRejectedValue(undefined);

    // act
    collectionDetailsPage.cancelDownload();

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
      expect(collectionDetailsPage.showLoading).toBe(false);
      expect(navCtrlMock.pop).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should show confirmation alert when download all is clicked if network is available when ' +
    'showDownloadConfirmationAlert()', () => {
      // arrange
      const popOver = {
        present: jest.fn(),
        onDidDismiss: jest.fn()
      };
      commonUtilServiceMock.networkInfo = { isNetworkAvailable: true } as any;
      popoverCtrlMock.create.mockReturnValue(popOver);

      // act
      collectionDetailsPage.showDownloadConfirmationAlert('SOME_EVENT');

      // assert
      expect(popOver.present).toHaveBeenCalledWith(expect.objectContaining({
        ev: 'SOME_EVENT'
      }));
    });

  it('should show error message if network is not available when showDownloadAlert()', () => {
    // arrange
    commonUtilServiceMock.networkInfo = { isNetworkAvailable: false } as any;

    // act
    collectionDetailsPage.showDownloadConfirmationAlert('SOME_EVENT');

    // assert
    expect(commonUtilServiceMock.showToast).toHaveBeenCalled();
  });

  it('should show Overflow menu when showOverflowMenu() ', () => {
    // arrange
    const popOver = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };
    popoverCtrlMock.create.mockReturnValue(popOver);

    // act
    collectionDetailsPage.showOverflowMenu('SOME_EVENT');

    // assert
    expect(popOver.present).toHaveBeenCalledWith(expect.objectContaining({
      ev: 'SOME_EVENT'
    }));
  });

  it('should invoke importContent API when downloadAllContent()', () => {
    // arrange
    contentServiceMock.importContent.mockResolvedValue({});

    // act
    collectionDetailsPage.downloadAllContent();

    // assert
    expect(contentServiceMock.importContent).toHaveBeenCalledWith(expect.objectContaining({
      contentImportMap: expect.objectContaining({}),
      contentStatusArray: expect.arrayContaining([])
    }));
  });

  it('should unsubscribe event when ionViewWillLeave() ', () => {
    // act
    collectionDetailsPage.ionViewWillLeave();

    // assert
    expect(eventsMock.unsubscribe).toHaveBeenCalledWith('genie.event');
  });

  it('should reset all variables when resetVariables()', () => {
    // act
    collectionDetailsPage.resetVariables();

    // assert
    expect(collectionDetailsPage.cardData).toBe('');
    expect(collectionDetailsPage.contentDetail).toBe('');
  });

  it('should return proper file size when getReadableFileSize()', () => {
    expect(collectionDetailsPage.getReadableFileSize(1120.0)).toBe('1.1 KB');
  });

  it('should show warning toast for guest  teacher profiles when rateContent()', () => {
    // arrange
    collectionDetailsPage.guestUser = true;
    collectionDetailsPage.profileType = 'TEACHER';

    // act
    collectionDetailsPage.rateContent();

    // assert
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('SIGNIN_TO_USE_FEATURE');
  });

  it('should show rating popup if collection is locally available when rateContent()', () => {
    // arrange
    collectionDetailsPage.guestUser = false;
    collectionDetailsPage.contentDetail = { isAvailableLocally: true };

    const popUp = {
      present: jest.fn(),
      onDidDismiss: jest.fn()
    };

    popoverCtrlMock.create.mockReturnValue(popUp);

    // act
    collectionDetailsPage.rateContent();

    // assert
    expect(popUp.present).toHaveBeenCalled();
  });

  it('should show warning toast if course is not locally available when rateContent() ', () => {
    // arrange
    collectionDetailsPage.guestUser = false;
    collectionDetailsPage.contentDetail = { isAvailableLocally: false };

    // act
    collectionDetailsPage.rateContent();

    // assert
    expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('TRY_BEFORE_RATING');
  });

  it('should populate profileType as STUDENT when checkCurrentUserType() ', (done) => {
    // arrange
    collectionDetailsPage.guestUser = true;
    appGlobalServiceMock.getGuestUserInfo.mockResolvedValue('STUDENT');

    // act
    collectionDetailsPage.checkCurrentUserType();

    // assert
    setTimeout(() => {
      expect(collectionDetailsPage.profileType === 'STUDENT');
      done();
    }, 0);
  });

  it('should dismiss the children loader when setChildContents() ', (done) => {
    // arrange
    collectionDetailsPage.cardData = {
      'contentType': 'Collection', 'isAvailableLocally': false, 'identifier': 'SAMPLE_ID',
      'hierarchyInfo': 'PARENT_ID/CHILD_ID'
    };
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => Promise.resolve()
    });
    contentServiceMock.getChildContents.mockResolvedValue(JSON.stringify((mockRes.getChildContentAPIResponse)));

    // act
    collectionDetailsPage.setChildContents();

    // assert
    expect(contentServiceMock.getChildContents).toHaveBeenCalledWith(expect.objectContaining({
      contentId: undefined, hierarchyInfo: 'PARENT_ID/CHILD_ID'
    }));

    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

      expect(collectionDetailsPage.showChildrenLoader).toBe(false);

      done();
    }, 0);
  });

  it('should handle error scenario when setChildContents()', (done) => {
    // arrange
    collectionDetailsPage.cardData = {
      'contentType': 'Collection', 'isAvailableLocally': false, 'identifier': 'SAMPLE_ID',
      'hierarchyInfo': 'PARENT_ID/CHILD_ID'
    };
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => Promise.resolve()
    });
    contentServiceMock.getChildContents.mockRejectedValue(undefined);

    // act
    collectionDetailsPage.setChildContents();

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

      expect(collectionDetailsPage.showChildrenLoader).toBe(false);

      done();
    }, 0);
  });

  it('should populate queuedIdentifier for successfull API calls when importContent()', (done) => {
    // arrange
    collectionDetailsPage.cardData = {
      'contentType': 'Collection', 'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
    };
    contentServiceMock.importContent.mockResolvedValue(JSON.stringify((mockRes.enqueuedImportContentResponse)));

    // act
    collectionDetailsPage.isDownloadStarted = true;
    collectionDetailsPage.importContent(['SAMPLE_ID'], false);

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
      expect(collectionDetailsPage.queuedIdentifiers).toEqual(expect.arrayContaining([
        'SAMPLE_ID'
      ]));
      done();
    });
  });

  it('should show error if nothing is added in queuedIdentifiers when importContent() ', (done) => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    collectionDetailsPage.cardData = {
      'contentType': 'Collection', 'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
    };
    contentServiceMock.importContent.mockRejectedValue(JSON.stringify((mockRes.enqueuedOthersImportContentResponse)));

    // act
    collectionDetailsPage.importContent(['SAMPLE_ID'], false);

    // assert
    setTimeout(() => {
      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
      expect(collectionDetailsPage.isDownloadStarted = false);
      expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('UNABLE_TO_FETCH_CONTENT');
      done();
    });
  });

  it('should pulish savedresources event when updateSavedResources()', () => {
    // act
    collectionDetailsPage.updateSavedResources();

    expect(eventsMock.publish).toHaveBeenCalledWith('savedResources:update', expect.objectContaining({
      update: true
    }));
  });

  it('should update the download progress when download progress event ' +
    'comes when subscribeSdkEvent()', () => {
      // arrange
      collectionDetailsPage.cardData = collectionDetailsPage.contentDetail = {
        'contentType': 'Collection',
        'isAvailableLocally': false, 'identifier': 'do_sampele', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
      };

      // act
    collectionDetailsPage.subscribeSdkEvent();
      eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
        JSON.stringify(mockRes.downloadProgressEventSample1));

      zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

      // assert
      expect(collectionDetailsPage.downloadProgress).toBe(10);
    });

  it('should update the progress to 0 if API gives response -1 when subscribeSdkEvent()', () => {
    // arrange
    collectionDetailsPage.cardData = collectionDetailsPage.contentDetail = {
      'contentType': 'Collection',
      'isAvailableLocally': false, 'identifier': 'SAMPLE_ID', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
    };

    // act
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.downloadProgressEventSample2));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.downloadProgress).toBe(0);
  });

  it('subscribeSdkEvent() should  dismiss overlay if download progress is 100', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'updateSavedResources').and.stub();
    collectionDetailsPage.cardData =
      collectionDetailsPage.contentDetail = {
        'contentType': 'Collection', 'isAvailableLocally': false,
        'identifier': 'SAMPLE_ID', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
      };

    // act
    collectionDetailsPage.isDownloadStarted = true;
    collectionDetailsPage.queuedIdentifiers = ['SAMPLE_ID'];
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.importCompleteEventSample));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.showLoading).toBe(false);
    expect(collectionDetailsPage.isDownloadCompleted).toBe(true);
  });

  it('#subscribeSdkEvent should  load all child contents when download is complete', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'updateSavedResources').and.stub();
    collectionDetailsPage.cardData =
      collectionDetailsPage.contentDetail = {
        'contentType': 'Collection', 'isAvailableLocally': false,
        'identifier': 'SAMPLE_ID', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
      };

    // act
    collectionDetailsPage.isDownloadStarted = true;
    collectionDetailsPage.queuedIdentifiers = ['SAMPLE_ID'];
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.importCompleteEventSample));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.showLoading).toBe(false);
    expect(collectionDetailsPage.isDownloadCompleted).toBe(true);
    expect(collectionDetailsPage.updateSavedResources).toHaveBeenCalled();
  });

  it('subscribeSdkEvent() should  update the course if update event is available ', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'updateSavedResources').and.stub();
    spyOn(collectionDetailsPage, 'importContent').and.stub();
    collectionDetailsPage.cardData = {
      'contentType': 'Collection',
      'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID'
    };

    // act
    collectionDetailsPage.queuedIdentifiers = ['SAMPLE_ID'];
    collectionDetailsPage.isDownloadStarted = false;
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    collectionDetailsPage.parentContent = { 'identifier': 'PARENT_ID' };
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.updateEventSample));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
    zoneMock.run.mock.calls[1][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.showLoading).toBe(true);
    expect(collectionDetailsPage.importContent).toHaveBeenCalledWith(['PARENT_ID'], false);
  });

  it('subscribeSdkEvent() should  invoke setContentDetails if  update event is available ', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'updateSavedResources').and.stub();
    spyOn(collectionDetailsPage, 'importContent').and.stub();
    spyOn(collectionDetailsPage, 'setContentDetails').and.stub();
    collectionDetailsPage.cardData = {
      'contentType': 'Collection',
      'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID'
    };

    // act
    collectionDetailsPage.queuedIdentifiers = ['SAMPLE_ID'];
    collectionDetailsPage.isDownloadStarted = false;
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.updateEventSample));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);
    zoneMock.run.mock.calls[1][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.setContentDetails).toHaveBeenCalledWith('SAMPLE_ID', false);
  });

  it('subscribeSdkEvent() should  invoke setContentDetials when import is complete', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'updateSavedResources').and.stub();
    spyOn(collectionDetailsPage, 'importContent').and.stub();
    spyOn(collectionDetailsPage, 'setContentDetails').and.stub();
    collectionDetailsPage.cardData = collectionDetailsPage.contentDetail = {
      'contentType': 'Collection',
      'isAvailableLocally': false,
      'identifier': 'SAMPLE_ID'
    };

    // act
    collectionDetailsPage.isUpdateAvailable = true;
    collectionDetailsPage.queuedIdentifiers = ['SAMPLE_ID'];
    collectionDetailsPage.isDownloadStarted = false;
    collectionDetailsPage.identifier = 'SAMPLE_ID';
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.importCompleteEventSample));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.setContentDetails).toHaveBeenCalledWith('SAMPLE_ID', false);
  });

  it('subscribeSdkEvent() should  set child contents when import is complete', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'updateSavedResources').and.stub();
    spyOn(collectionDetailsPage, 'importContent').and.stub();
    spyOn(collectionDetailsPage, 'setContentDetails').and.stub();
    collectionDetailsPage.cardData = collectionDetailsPage.contentDetail = {
      'contentType': 'Collection', 'isAvailableLocally': false, 'identifier': 'SAMPLE_ID',
      'hierarchyInfo': 'PARENT_ID/CHILD_ID'
    };

    // act
    collectionDetailsPage.queuedIdentifiers = ['SAMPLE_ID'];
    collectionDetailsPage.isDownloadStarted = false;
    collectionDetailsPage.isUpdateAvailable = false;
    collectionDetailsPage.subscribeSdkEvent();
    eventsMock.subscribe.mock.calls[0][1].call(collectionDetailsPage,
      JSON.stringify(mockRes.importCompleteEventSample));

    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.updateSavedResources).toHaveBeenCalledWith();
  });

  it('handleBackButton() should handle nav back button click', () => {
    // arrange
    (collectionDetailsPage.backButtonFunc as any) = jest.fn();

    // act
    collectionDetailsPage.handleBackButton();

    // assert
    expect(navCtrlMock.pop).toHaveBeenCalled();
    expect(collectionDetailsPage.backButtonFunc).toHaveBeenCalled();
  });

  it('#handleNavBackButtonClick should generate qrsession end event if ' +
    'shouldGenerateEndEvents paramater is true', () => {
      // arrange
      collectionDetailsPage.cardData = { identifier: 'SAMPLE_IDENTIFIER' };
      (collectionDetailsPage.backButtonFunc as any) = jest.fn();

      // act
      collectionDetailsPage.shouldGenerateEndTelemetry = true;
      collectionDetailsPage.handleBackButton();

      // assert
      expect(navCtrlMock.pop).toHaveBeenCalled();
      expect(collectionDetailsPage.backButtonFunc).toHaveBeenCalled();
      expect(telemetryGeneratorServiceMock.generateEndTelemetry)
        .toHaveBeenCalledTimes(2);
    });

  it('ionViewWillEnter() should invoke setContentDetails when page is invoked', () => {
    // arrange
    contentServiceMock.getContentDetail.mockResolvedValue({});
    commonUtilServiceMock.getLoader.mockReturnValue({
      present: () => {
      },
      dismiss: () => {
      }
    });

    navParamsMock.get.mockReturnValue((param: string) => {
      switch (param) {
        case 'content':
          return {
            'contentType': 'Collection', 'isAvailableLocally': false,
            'identifier': 'SAMPLE_ID', 'hierarchyInfo': 'PARENT_ID/CHILD_ID'
          };
      }
    });

    // act
    collectionDetailsPage.ionViewWillEnter();
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(contentServiceMock.getContentDetail).toHaveBeenCalledWith(expect.objectContaining({
      contentId: collectionDetailsPage.identifier
    }));
  });

  it('setContentDetails() should show error toast if any error gets thrown from' +
    'getContentDetails', (done) => {
      // arrange
      contentServiceMock.getContentDetail.mockRejectedValue('SAMPLE_ERROR');
      commonUtilServiceMock.getLoader.mockReturnValue({
        present: () => {
        },
        dismiss: () => {
        }
      });

      // act
      collectionDetailsPage.setContentDetails('SAMPLE_IDENTIFIER', true);

      // assert
      setTimeout(() => {
        expect(commonUtilServiceMock.showToast).toHaveBeenCalledWith('ERROR_CONTENT_NOT_AVAILABLE');
        expect(navCtrlMock.pop).toHaveBeenCalled();
        done();
      }, 0);
    });

  it('extractApiResponse()  should  update content if update is available', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'setCollectionStructure').and.stub();
    contentServiceMock.importContent.mockResolvedValue({});

    // act
    collectionDetailsPage.extractApiResponse(mockRes.updateContentDetailsResponse);

    // assert
    expect(collectionDetailsPage.isUpdateAvailable).toBe(true);
    expect(contentServiceMock.importContent).toHaveBeenCalled();
  });

  it('should  download the content of its not locally available when extractApiResponse()', () => {
    // arrange
    spyOn(collectionDetailsPage, 'setChildContents').and.stub();
    spyOn(collectionDetailsPage, 'setCollectionStructure').and.stub();
    contentServiceMock.importContent.mockResolvedValue({});

    // act
    collectionDetailsPage.extractApiResponse(mockRes.locallyNotAvailableContentDetailsResponse);

    // assert
    expect(contentServiceMock.importContent).toHaveBeenCalled();
  });

  it('should show the download button when showDownloadAllBtn()', () => {
    // act
    collectionDetailsPage.showDownloadAllBtn([mockRes.locallyNotAvailableContentDetailsResponse.result]);
    zoneMock.run.mock.calls[0][0].call(collectionDetailsPage, undefined);

    // assert
    expect(collectionDetailsPage.showDownloadBtn).toBe(true);
  });

  it('should open view credits screen when viewCredits()', () => {
    // act
    collectionDetailsPage.viewCredits();

    // assert
    expect(courseUtilServiceMock.showCredits).toHaveBeenCalledWith(collectionDetailsPage.contentDetail,
      'collection-detail', collectionDetailsPage.objRollup, collectionDetailsPage.corRelationList);
  });

  it('should generate telemetry when readLessorReadMore()', () => {
    // arrange/
    collectionDetailsPage.telemetryObject = {
      'id': 'SAMPLE_ID', 'type': 'SAMPLE_TYPE', 'version': 'SAMPLE_VERSION', 'rollup': undefined
    };
    // act
    telemetryGeneratorServiceMock.readLessorReadMore();

    // assert
    //   setTimeout(() => {
    //   expect(telemetryGeneratorServiceMock.readLessorReadMore).toHaveBeenCalledWith(collectionDetailsPage.param,
    //     collectionDetailsPage.objRollup, collectionDetailsPage.corRelationList, expect.objectContaining({
    //       'id': 'SAMPLE_ID', 'rollup': undefined, 'type': 'SAMPLE_TYPE', 'version': 'SAMPLE_VERSION'}));
    //    done();
    // }, 10);
    expect(telemetryGeneratorServiceMock.readLessorReadMore).toHaveBeenCalled();
  });
});
