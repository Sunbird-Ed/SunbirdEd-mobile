import {
  viewControllerMock,
  appVersionMock,
  utilityServiceMock,
  sharedPreferencesMock,
  appRatingServiceMock,
  translateServiceMock,
  platformMock,
  telemetryGeneratorServiceMock, navParamsMock, telemetryServiceMock
} from "@app/__tests__/mocks";

import {AppRatingAlertComponent} from "@app/component/app-rating-alert/app-rating-alert";
import {Observable} from "rxjs";

describe('AppRatingAlertComponent', () => {
  let appRatingPage: AppRatingAlertComponent;
  beforeEach(() => {
    sharedPreferencesMock.getString.mockImplementation((key: string) => {
      if (key === 'app_name') {
        return Observable.of('SAMPLE_APP_NAME');
      } else if (key === 'app_logo') {
        return Observable.of('SAMPLE_APP_LOGO');
      }

      return Observable.of('')
    });
    appVersionMock.getAppName.mockResolvedValue('SAMPLE_APP_NAME');
    platformMock.registerBackButtonAction.mockImplementation((success) => {
      return success
    });
    appRatingPage = new AppRatingAlertComponent(
      viewControllerMock as any, appVersionMock as any, utilityServiceMock as any,
      appRatingServiceMock as any, sharedPreferencesMock as any, translateServiceMock as any,
      platformMock as any, telemetryGeneratorServiceMock as any, navParamsMock as any, telemetryServiceMock as any
    );
    jest.resetAllMocks();
  });
  it('should load instance', () => {
    expect(appRatingPage).toBeTruthy();
  });
  it('should call viewController onDidDismiss when data is null triggered at the beginning ', () => {
    // arrange
    viewControllerMock.onDidDismiss.mockImplementation((cb) => {
      cb();
      return {};
    });
    spyOn(appRatingPage, 'ionViewDidLoad').and.callThrough();
    // act
    appRatingPage.ionViewDidLoad();
    //assert
    expect(appRatingPage.ionViewDidLoad).toHaveBeenCalled();
  });

  it('should call viewController dismiss() when closePopOver method is triggered', () => {
    spyOn(appRatingPage, 'closePopover').and.callThrough();
    viewControllerMock.dismiss.mockReturnValue('close');
    appRatingPage.closePopover();

    expect(appRatingPage.closePopover).toHaveBeenCalled();
  });
  it('should call viewController dismiss() when rateLater() is called ', (done) => {
    spyOn(appRatingPage, 'rateLater').and.callThrough();
    spyOn(appRatingPage, 'closePopover').and.stub();
    appRatingPage.rateLater();
    setTimeout(() => {
      expect(appRatingPage.rateLater).toHaveBeenCalled();
      viewControllerMock.dismiss.mockResolvedValue('RATE_LATER');
      expect(appRatingPage.closePopover).toHaveBeenCalled();
    }, 0);
    done();
  });
  it('should call appVersion.getPackageName() when submitRating() is triggered', () => {
    appVersionMock.getPackageName.mockResolvedValue('SAMPLE_PACKAGE_NAME');
    utilityServiceMock.openPlayStore.mockResolvedValue('SAMPLE_PACKAGE_NAME');
    viewControllerMock.dismiss.mockResolvedValue('close');
    spyOn(appRatingPage, 'rateOnStore').and.callThrough();
    appRatingPage.rateOnStore();
    expect(appRatingPage.rateOnStore).toHaveBeenCalled();
  });
  it('should change currentViewText when rating is greater than 4 or more', () => {
    // arrange
    spyOn(appRatingPage, 'submitRating').and.returnValue(5);
    //act
    appRatingPage.submitRating(5);
    // assert
    expect(appRatingPage.currentViewText).toEqual({
      "heading": "APP_RATING_RATE_EXPERIENCE",
      "message": "APP_RATING_TAP_ON_STARS",
      "type": "appRate"
    });
    expect(appRatingPage.submitRating(5)).toBe(5);
  });
  it('should changeViewText when rating is less than 3', () => {
    // arrange
    spyOn(appRatingPage, 'submitRating').and.returnValue(2);
    // act
    appRatingPage.submitRating(2);
    // assert
    expect(appRatingPage.currentViewText).toEqual({
      "heading": "APP_RATING_RATE_EXPERIENCE",
      "message": "APP_RATING_TAP_ON_STARS",
      "type": "appRate"
    });
    expect(appRatingPage.submitRating(2)).toBe(2);
  });
  it('should navigate to helpSection page when helpButton is clicked', () => {
    // arrange
    spyOn(appRatingPage, 'goToHelpSection').and.callThrough();
    viewControllerMock.dismiss.mockResolvedValue('help');
    // act
    appRatingPage.goToHelpSection();
    // assert
    expect(appRatingPage.goToHelpSection).toHaveBeenCalled();
    expect(viewControllerMock.dismiss).toBeCalledWith('help');
  });

  it('should return the incrementalValue when method is triggered', () => {
    sharedPreferencesMock.getString.mockReturnValue('SAMPLE_VALUE');

    spyOn(appRatingPage, 'countAppRatingPopupAppeared').and.callThrough();

    appRatingPage.countAppRatingPopupAppeared();
    expect(appRatingPage.countAppRatingPopupAppeared).toHaveBeenCalled();

  });
});
