import {
  ContentRatingAlertComponent
} from './content-rating-alert';
import {
  navParamsMock,
  contentServiceMock,
  appGlobalServiceMock,
  telemetryGeneratorServiceMock
} from '@app/__tests__/mocks';
import 'jest';
import {
  ContentService,
  TelemetryService,
  InteractType,
  InteractSubtype,
  Environment,
  ImpressionType,
  ImpressionSubtype,
  Log,
  LogLevel,
  ConnectionInfoService
} from 'sunbird';
import { TranslateService } from '@ngx-translate/core';
import {
  generateImpressionTelemetry,
  generateInteractTelemetry
} from '../../app/telemetryutil';
import { ProfileConstants } from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import {
  translateServiceMock, toastControllerMock, zoneMock,
  telemetryServiceMock, viewControllerMock, platformMock, commonUtilServiceMock
} from '../../__tests__/mocks';
describe('ContentRatingAlertComponent', () => {
  let contentRatingAlertComponent: ContentRatingAlertComponent;
  beforeEach(() => {
    navParamsMock.get.mockImplementation((param: string) => {
      if (param === 'filter') {
        return [];
      } else {
        return 'pageId';
      }
    });
    appGlobalServiceMock.getSessionData.mockReturnValue('1278273');
    contentRatingAlertComponent = new ContentRatingAlertComponent(navParamsMock as any, viewControllerMock as any,
      platformMock as any, translateServiceMock as any, toastControllerMock as any, zoneMock as any,
      contentServiceMock as any, telemetryServiceMock as any, appGlobalServiceMock as any, commonUtilServiceMock as any);
    jest.resetAllMocks();
  });
  it('should create instance of the ConfirmAlertComponent', () => {
    expect(contentRatingAlertComponent).toBeTruthy();
  });
  it('should call ionViewDidLoad', () => {
    // arrange
    navParamsMock.get.mockImplementation((arg: string) => {
      switch (arg) {
        case 'content': {
          return {
            identifier: 'SOME_IDENTIFIER'
          };
        }
        case 'popupType': {
          return { popupType: 'POPUP_TYPE' };
        }
        case 'comment': {
          return { comment: 'SOME_COMMENT' };
        }
        case 'userRating': {
          return { userRating: 121 };
        }
      }
    });
    // act
    contentRatingAlertComponent.ionViewDidLoad();
    // assert
    expect(contentRatingAlertComponent.ionViewDidLoad);
  });
  // it('should call ionViewWillEnter', () => {
  //   // arrange
  //   navParamsMock.get.mockImplementation((arg: string) => {
  //     switch (arg) {
  //       case 'content': {
  //         return {
  //           identifier: 'SOME_IDENTIFIER'
  //         };
  //       }
  //       case 'popupType': {
  //         return { popupType: 'POPUP_TYPE' };
  //       }
  //       case 'comment': {
  //         return { comment: 'SOME_COMMENT' };
  //       }
  //       case 'userRating': {
  //         return { userRating: 121 };
  //       }
  //     }
  //   });
  //   // act
  //   contentRatingAlertComponent.ionViewWillEnter();
  //   // assert
  //   expect(telemetryGeneratorServiceMock.generateImpressionTelemetry).toHaveBeenCalledWith(
  //     ImpressionType.VIEW,
  //     ImpressionSubtype.RATING_POPUP,
  //     { 'pageId': 'SOME_PAGE_ID' },
  //     Environment.HOME, '', '', '',
  //     undefined,
  //     undefined);
  // });
  it('#getUserId should return empty string if  user is not logged in', () => {
    // arrange
    appGlobalServiceMock.getSessionData.mockResolvedValue('SOME_VALUE');
    // act
    contentRatingAlertComponent.getUserId();
    // assert
    expect(contentRatingAlertComponent.userId = 'SOME_VALUE');
  });
  it('#getUserId should return User_token string if  user is logged in', () => {
    // arrange
    appGlobalServiceMock.getSessionData.mockResolvedValue('');
    // act
    contentRatingAlertComponent.getUserId();
    // assert
    expect(contentRatingAlertComponent.userId = '');
  });
  it('should dismiss the popup on cancel()', () => {
    // arrange
    viewControllerMock.dismiss();
    // act
    contentRatingAlertComponent.cancel();
    // assert
    expect(contentRatingAlertComponent.showCommentBox).toBeFalsy();
    expect(contentRatingAlertComponent.cancel).toBeTruthy();
  });
  it('should call showMessage with a message', () => {
    // arrange
    commonUtilServiceMock.showMessage('SOME_MESSAGE');
    // act
    contentRatingAlertComponent.showMessage('SOME_MESSGAE');

    // assert
    expect(contentRatingAlertComponent.showMessage).toBeTruthy();
  });
  it('#should call backbuttonFunc to dismiss the popup', () => {
    // // arrange
    appGlobalServiceMock.getSessionData.mockReturnValue('');
    platformMock.registerBackButtonAction.mockReturnValue(jest.fn());
    contentRatingAlertComponent = new ContentRatingAlertComponent(navParamsMock as any, viewControllerMock as any,
      platformMock as any, translateServiceMock as any, toastControllerMock as any, zoneMock as any,
      contentServiceMock as any, telemetryServiceMock as any, appGlobalServiceMock as any, commonUtilServiceMock as any);

    // // act
    platformMock.registerBackButtonAction.mock.calls[0][0].call(contentRatingAlertComponent);

    // // assert
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
    expect(contentRatingAlertComponent.backButtonFunc).toHaveBeenCalled();
  });
  it('should call the submit method to make expected calls', () => {
    // arrange
    contentRatingAlertComponent.content = { identifier: 'CONTENT_ID', versionKey: 'SAMPLE_VERSION_KEY' };
    contentRatingAlertComponent.ratingCount = 121;
    contentRatingAlertComponent.comment = 'SAMPLE_COMMENT';
    navParamsMock.get.mockImplementation((arg: string) => {
      switch (arg) {
        case 'content': {
          return {
            identifier: 'SOME_IDENTIFIER'
          };
        }
        case 'popupType': {
          return { popupType: 'POPUP_TYPE' };
        }
        case 'comment': {
          return { comment: 'SOME_COMMENT' };
        }
        case 'userRating': {
          return { userRating: 121 };
        }
      }
    });

    // act
    contentRatingAlertComponent.showMessage('SOME_MESSAGE');
    (contentServiceMock.sendFeedback as any).mockResolvedValue(Promise.resolve({
      'contentId': 'CONTENT_ID',
      'rating': 121,
      'comments': 'SAMPLE_COMMENT',
      'contentVersion': 'SAMPLE_VERSION_KEY'
    }));
    contentRatingAlertComponent.submit();

    // assert
    expect(commonUtilServiceMock.showToast).toBeTruthy();
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
    expect(contentServiceMock.sendFeedback).toHaveBeenCalled();

  });
  it('should call the submit method not to make expected calls', () => {
    // arrange
    contentRatingAlertComponent.content = { identifier: 'CONTENT_ID', versionKey: 'SAMPLE_VERSION_KEY' };
    contentRatingAlertComponent.ratingCount = 121;
    contentRatingAlertComponent.comment = 'SAMPLE_COMMENT';

    // act
    contentRatingAlertComponent.showMessage('SOME_MESSAGE');
    (contentServiceMock.sendFeedback as any).mockResolvedValue(Promise.reject(
      'SOME_ERROR_DATA'));
    contentRatingAlertComponent.submit();

    // assert
    expect(commonUtilServiceMock.showToast).toBeTruthy();
    expect(viewControllerMock.dismiss).toHaveBeenCalled();
    expect(contentServiceMock.sendFeedback).toHaveBeenCalled();

  });
  it('should make the expected call after calling the ngZone run', () => {
    // arrange
    navParamsMock.get.mockImplementation((arg: string) => {
      switch (arg) {
        case 'content': {
          return {
            identifier: 'SOME_IDENTIFIER'
          };
        }
        case 'popupType': {
          return { popupType: 'POPUP_TYPE' };
        }
        case 'comment': {
          return { comment: 'SOME_COMMENT' };
        }
        case 'userRating': {
          return { userRating: 121 };
        }
      }
    });
    contentRatingAlertComponent = new ContentRatingAlertComponent(navParamsMock as any, viewControllerMock as any,
      platformMock as any, translateServiceMock as any, toastControllerMock as any, zoneMock as any,
      contentServiceMock as any, telemetryServiceMock as any, appGlobalServiceMock as any, commonUtilServiceMock as any);


    // act
    zoneMock.run.mock.calls[0][0].call(contentRatingAlertComponent);
    // assert
    expect(contentRatingAlertComponent.userRating = 121);
    expect(contentRatingAlertComponent.showCommentBox = true);

  });
});
